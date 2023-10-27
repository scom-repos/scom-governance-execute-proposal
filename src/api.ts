import { BigNumber, Utils, Wallet } from "@ijstech/eth-wallet";
import { Contracts } from "@scom/oswap-openswap-contract";
import { tokenStore } from "@scom/scom-token-list";
import { IExecuteParam, IVotingParams, IVotingResult } from "./interface";
import { State } from "./store/index";

function govTokenDecimals(state: State) {
    const chainId = state.getChainId();
    return state.getGovToken(chainId).decimals || 18
}

function parseVotingExecuteParam(params: IVotingParams) {
    let executeParam: IExecuteParam;
    let _executeParam = params.executeParam;
    if (_executeParam && Array.isArray(_executeParam) && _executeParam.length) {
        let cmd = Utils.bytes32ToString(_executeParam[0]).replace(/\x00/gi, "");
        switch (cmd) {
            case "addOldOracleToNewPair":
                executeParam = {
                    "cmd": cmd,
                    "token0": _executeParam[1].substring(0, 42),
                    "token1": _executeParam[2].substring(0, 42),
                    "oracle": _executeParam[3].substring(0, 42)
                }
                break;
            case "setOracle":
                executeParam = {
                    "cmd": cmd,
                    "token0": _executeParam[1].substring(0, 42),
                    "token1": _executeParam[2].substring(0, 42),
                    "oracle": _executeParam[3].substring(0, 42)
                }
                break;
        }
    }
    return executeParam;
}

function getVotingTitle(state: State, result: any) {
    let title: string;
    if (!result.executeParam) return title;
    const token0 = result.executeParam.token0;
    const token1 = result.executeParam.token1;
    const chainId = state.getChainId();
    let tokenMap = tokenStore.getTokenMapByChainId(chainId) || {};
    let symbol0 = token0 ? tokenMap[token0.toLowerCase()]?.symbol ?? '' : '';
    let symbol1 = token1 ? tokenMap[token1.toLowerCase()]?.symbol ?? '' : '';
    switch (result.executeParam.cmd) {
        case "addOldOracleToNewPair":
          title = "Add Price Oracle for Pair " + symbol0 + "/" + symbol1;
          break;
        case "setOracle":
          title = "Add New / Change Price Oracle for Pair " + symbol0 + "/" + symbol1;
          break;
    }
    return title;
}

function parseVotingParams(state: State, params: IVotingParams) {
    let result: IVotingResult = {
        executor: params.executor,
        address: '',
        id: params.id,
        name: Utils.bytes32ToString(params.name).replace(/\x00/gi, ""),
        options: {},
        quorum: Utils.fromDecimals(params.quorum[0]).toFixed(),
        voteStartTime: new Date(params.voteStartTime.times(1000).toNumber()),
        endTime: new Date(params.voteEndTime.times(1000).toNumber()),
        executeDelay: params.executeDelay,
        executed: params.status[0],
        vetoed: params.status[1],
        totalWeight: Utils.fromDecimals(params.quorum[2]).toFixed(),
        threshold: Utils.fromDecimals(params.quorum[1]).toFixed(),
        remain: 0,
        quorumRemain: '0'
    };
    let voteEndTime = params.voteEndTime.toNumber();
    let now = Math.ceil(Date.now() / 1000);
    let diff = Number(voteEndTime) - now;
    result.remain = diff > 0 ? diff : 0;
    let quorumRemain = new BigNumber(result.quorum);
    let govDecimals = govTokenDecimals(state);
    for (let i = 0; i < params.options.length; i++) {
        let weight = Utils.fromDecimals(params.optionsWeight[i], govDecimals);
        let key = Utils.bytes32ToString(params.options[i]).replace(/\x00/gi, "");
        result.options[key] = weight;
        quorumRemain = quorumRemain.minus(weight);
    }
    result.quorumRemain = quorumRemain.lt(0) ? '0' : quorumRemain.toFixed();

    if (params.executeParam && Array.isArray(params.executeParam) && params.executeParam.length) {
        let executeDelay = Number(params.executeDelay);
        diff = (voteEndTime + executeDelay) - now;
        if (result.vetoed)
            result.veto = true;
        else if (params.executed)
            result.executed = true;
        else
            result.executiveDelay = diff > 0 ? diff : 0

        result.majorityPassed = new BigNumber(params.optionsWeight[0]).gt(params.optionsWeight[1]);
        result.thresholdPassed = new BigNumber(params.optionsWeight[0]).div(new BigNumber(params.optionsWeight[0]).plus(params.optionsWeight[1])).gt(result.threshold);

        if (result.vetoed) {
            result.status = "vetoed";
        } else if (result.remain > 0) {
            result.status = "in_progress";
        } else if (!result.majorityPassed || !result.thresholdPassed || Number(result.quorumRemain) > 0) {
            result.status = "not_passed";
        } else if (result.executiveDelay > 0) {
            result.status = "waiting_execution_delay";
        } else if (result.executed) {
            result.status = "executed";
        } else {
            result.status = "waiting_execution";
        }
        result.executeParam = parseVotingExecuteParam(params);
    }
    let title = getVotingTitle(state, result);
    if (title) result.title = title;

    return result;
}

export async function getVotingResult(state: State, votingAddress: string) {
    if (!votingAddress) return;
    let result;
    try {
        const wallet = state.getRpcWallet();
        const votingContract = new Contracts.OAXDEX_VotingContract(wallet, votingAddress);
        const getParams = await votingContract.getParams();
        result = parseVotingParams(state, getParams);
        result.address = votingAddress;
    } catch (err) {}
    return result;
}

export async function execute(votingAddress: string) {
    const wallet = Wallet.getClientInstance();
    const votingContract = new Contracts.OAXDEX_VotingContract(wallet, votingAddress);
    let receipt = await votingContract.execute();
    return receipt;
}