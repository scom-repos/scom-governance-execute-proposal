var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-governance-execute-proposal/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-governance-execute-proposal/store/core.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.coreAddress = void 0;
    exports.coreAddress = {
        56: {
            OAXDEX_Governance: "0x510a179AA399672e26e54Ed8Ce0e822cc9D0a98D",
            OAXDEX_VotingRegistry: "0x845308010C3B699150Cdd54dCf0E7C4b8653e6B2",
            GOV_TOKEN: "0xb32aC3C79A94aC1eb258f3C830bBDbc676483c93",
        },
        97: {
            OAXDEX_Governance: "0xDfC070E2dbDAdcf892aE2ed2E2C426aDa835c528",
            OAXDEX_VotingRegistry: "0x28a5bB54A53831Db40e00a6d416FfB2dBe0Fef68",
            GOV_TOKEN: "0x45eee762aaeA4e5ce317471BDa8782724972Ee19",
        },
        137: {
            OAXDEX_Governance: "0x5580B68478e714C02850251353Cc58B85D4033C3",
            OAXDEX_VotingRegistry: "0x64062158A5Cc2aA3740B1035785F29153eA64677",
            GOV_TOKEN: "0x29E65d6f3e7a609E0138a1331D42D23159124B8E",
        },
        80001: {
            OAXDEX_Governance: "0x198b150E554F46aee505a7fb574F5D7895889772",
            OAXDEX_VotingRegistry: "0xC2F105d6413aCE38B9FcB6F43Edc76191a295aC5",
            GOV_TOKEN: "0xb0AF504638BDe5e53D6EaE1119dEd13411c35cF2",
        },
        43113: {
            OAXDEX_Governance: "0xC025b30e6D4cBe4B6978a1A71a86e6eCB9F87F92",
            OAXDEX_VotingRegistry: "0x05E425dD88dd7D4f725aC429D0C8C022B2004cBB",
            GOV_TOKEN: "0x27eF998b96c9A66937DBAc38c405Adcd7fa5e7DB",
        },
        43114: {
            OAXDEX_Governance: "0x845308010c3b699150cdd54dcf0e7c4b8653e6b2",
            OAXDEX_VotingRegistry: "0x0625468f8F56995Ff1C27EB6FD44ac90E96C5D22",
            GOV_TOKEN: "0x29E65d6f3e7a609E0138a1331D42D23159124B8E",
        },
        42161: {
            OAXDEX_Governance: "0x5580B68478e714C02850251353Cc58B85D4033C3",
            OAXDEX_VotingRegistry: "0x64062158A5Cc2aA3740B1035785F29153eA64677",
            GOV_TOKEN: "0x29E65d6f3e7a609E0138a1331D42D23159124B8E",
        },
        421613: {
            OAXDEX_Governance: "0x6f460B0Bf633E22503Efa460429B0Ab32d655B9D",
            OAXDEX_VotingRegistry: "0x3Eb8e7B7EbdcA63031504fe4C94b8e393D530Ec9",
            GOV_TOKEN: "0x5580B68478e714C02850251353Cc58B85D4033C3",
        }
    };
});
define("@scom/scom-governance-execute-proposal/store/utils.ts", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-network-list", "@scom/scom-token-list", "@scom/scom-governance-execute-proposal/store/core.ts"], function (require, exports, components_1, eth_wallet_1, scom_network_list_1, scom_token_list_1, core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getWETH = exports.isClientWalletConnected = exports.State = void 0;
    class State {
        constructor(options) {
            this.infuraId = '';
            this.networkMap = {};
            this.rpcWalletId = '';
            this.networkMap = (0, scom_network_list_1.default)();
            this.initData(options);
        }
        initData(options) {
            if (options.infuraId) {
                this.infuraId = options.infuraId;
            }
            if (options.networks) {
                this.setNetworkList(options.networks, options.infuraId);
            }
        }
        initRpcWallet(defaultChainId) {
            if (this.rpcWalletId) {
                return this.rpcWalletId;
            }
            const clientWallet = eth_wallet_1.Wallet.getClientInstance();
            const networkList = Object.values(components_1.application.store?.networkMap || []);
            const instanceId = clientWallet.initRpcWallet({
                networks: networkList,
                defaultChainId,
                infuraId: components_1.application.store?.infuraId,
                multicalls: components_1.application.store?.multicalls
            });
            this.rpcWalletId = instanceId;
            if (clientWallet.address) {
                const rpcWallet = eth_wallet_1.Wallet.getRpcWalletInstance(instanceId);
                rpcWallet.address = clientWallet.address;
            }
            return instanceId;
        }
        getRpcWallet() {
            return this.rpcWalletId ? eth_wallet_1.Wallet.getRpcWalletInstance(this.rpcWalletId) : null;
        }
        isRpcWalletConnected() {
            const wallet = this.getRpcWallet();
            return wallet?.isConnected;
        }
        getChainId() {
            const rpcWallet = this.getRpcWallet();
            return rpcWallet?.chainId;
        }
        setNetworkList(networkList, infuraId) {
            const wallet = eth_wallet_1.Wallet.getClientInstance();
            this.networkMap = {};
            const defaultNetworkList = (0, scom_network_list_1.default)();
            const defaultNetworkMap = defaultNetworkList.reduce((acc, cur) => {
                acc[cur.chainId] = cur;
                return acc;
            }, {});
            for (let network of networkList) {
                const networkInfo = defaultNetworkMap[network.chainId];
                if (!networkInfo)
                    continue;
                if (infuraId && network.rpcUrls && network.rpcUrls.length > 0) {
                    for (let i = 0; i < network.rpcUrls.length; i++) {
                        network.rpcUrls[i] = network.rpcUrls[i].replace(/{InfuraId}/g, infuraId);
                    }
                }
                this.networkMap[network.chainId] = {
                    ...networkInfo,
                    ...network
                };
                wallet.setNetworkInfo(this.networkMap[network.chainId]);
            }
        }
        async setApprovalModelAction(options) {
            const approvalOptions = {
                ...options,
                spenderAddress: ''
            };
            let wallet = this.getRpcWallet();
            this.approvalModel = new eth_wallet_1.ERC20ApprovalModel(wallet, approvalOptions);
            let approvalModelAction = this.approvalModel.getAction();
            return approvalModelAction;
        }
        getAddresses(chainId) {
            return core_1.coreAddress[chainId || this.getChainId()];
        }
        getGovToken(chainId) {
            let govToken;
            let address = this.getAddresses(chainId)?.GOV_TOKEN;
            if (chainId == 43113 || chainId == 43114 || chainId == 42161 || chainId == 421613 || chainId == 80001 || chainId == 137) {
                govToken = { address: address, decimals: 18, symbol: "veOSWAP", name: 'Vote-escrowed OSWAP', chainId };
            }
            else {
                govToken = { address: address, decimals: 18, symbol: "OSWAP", name: 'OpenSwap', chainId };
            }
            return govToken;
        }
    }
    exports.State = State;
    function isClientWalletConnected() {
        const wallet = eth_wallet_1.Wallet.getClientInstance();
        return wallet.isConnected;
    }
    exports.isClientWalletConnected = isClientWalletConnected;
    const getWETH = (chainId) => {
        let wrappedToken = scom_token_list_1.WETHByChainId[chainId];
        return wrappedToken;
    };
    exports.getWETH = getWETH;
});
define("@scom/scom-governance-execute-proposal/store/index.ts", ["require", "exports", "@scom/scom-governance-execute-proposal/store/utils.ts"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-governance-execute-proposal/store/index.ts'/> 
    __exportStar(utils_1, exports);
});
define("@scom/scom-governance-execute-proposal/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let moduleDir = components_2.application.currentModuleDir;
    function fullPath(path) {
        if (path.indexOf('://') > 0)
            return path;
        return `${moduleDir}/${path}`;
    }
    exports.default = {
        fullPath
    };
});
define("@scom/scom-governance-execute-proposal/data.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-governance-execute-proposal/data.json.ts'/> 
    exports.default = {
        "infuraId": "adc596bf88b648e2a8902bc9093930c5",
        "networks": [
            {
                "chainId": 97,
                "explorerTxUrl": "https://testnet.bscscan.com/tx/",
                "explorerAddressUrl": "https://testnet.bscscan.com/address/"
            },
            {
                "chainId": 43113,
                "explorerTxUrl": "https://testnet.snowtrace.io/tx/",
                "explorerAddressUrl": "https://testnet.snowtrace.io/address/"
            }
        ],
        "defaultBuilderData": {
            "defaultChainId": 43113,
            "networks": [
                {
                    "chainId": 43113
                },
                {
                    "chainId": 97
                },
                {
                    "chainId": 56
                },
                {
                    "chainId": 43114
                },
                {
                    "chainId": 42161
                },
                {
                    "chainId": 421613
                }
            ],
            "wallets": [
                {
                    "name": "metamask"
                }
            ],
            "showHeader": true,
            "showFooter": true
        }
    };
});
///<amd-module name='@scom/scom-governance-execute-proposal/formSchema.ts'/> 
define("@scom/scom-governance-execute-proposal/formSchema.ts", ["require", "exports", "@scom/scom-network-picker"], function (require, exports, scom_network_picker_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getFormSchema = void 0;
    function getFormSchema() {
        return {
            dataSchema: {
                type: 'object',
                properties: {
                    chainId: {
                        type: 'number'
                    },
                    votingAddress: {
                        type: 'string',
                        format: 'wallet-address'
                    }
                }
            },
            uiSchema: {
                type: 'VerticalLayout',
                elements: [
                    {
                        type: 'Control',
                        scope: '#/properties/chainId'
                    },
                    {
                        type: 'Control',
                        scope: '#/properties/votingAddress'
                    }
                ]
            },
            customControls() {
                return {
                    "#/properties/chainId": {
                        render: () => {
                            let networkPicker = new scom_network_picker_1.default(undefined, {
                                type: 'combobox',
                                networks: [1, 56, 137, 250, 97, 80001, 43113, 43114, 42161, 421613].map(v => { return { chainId: v }; })
                            });
                            return networkPicker;
                        },
                        getData: (control) => {
                            return control.selectedNetwork?.chainId;
                        },
                        setData: (control, value) => {
                            control.setNetworkByChainId(value);
                        }
                    }
                };
            }
        };
    }
    exports.getFormSchema = getFormSchema;
});
define("@scom/scom-governance-execute-proposal/api.ts", ["require", "exports", "@ijstech/eth-wallet", "@scom/oswap-openswap-contract", "@scom/scom-token-list"], function (require, exports, eth_wallet_2, oswap_openswap_contract_1, scom_token_list_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.execute = exports.getVotingResult = void 0;
    function govTokenDecimals(state) {
        const chainId = state.getChainId();
        return state.getGovToken(chainId).decimals || 18;
    }
    function parseVotingExecuteParam(params) {
        let executeParam;
        let _executeParam = params.executeParam;
        if (_executeParam && Array.isArray(_executeParam) && _executeParam.length) {
            let cmd = eth_wallet_2.Utils.bytes32ToString(_executeParam[0]).replace(/\x00/gi, "");
            switch (cmd) {
                case "addOldOracleToNewPair":
                    executeParam = {
                        "cmd": cmd,
                        "token0": _executeParam[1].substring(0, 42),
                        "token1": _executeParam[2].substring(0, 42),
                        "oracle": _executeParam[3].substring(0, 42)
                    };
                    break;
                case "setOracle":
                    executeParam = {
                        "cmd": cmd,
                        "token0": _executeParam[1].substring(0, 42),
                        "token1": _executeParam[2].substring(0, 42),
                        "oracle": _executeParam[3].substring(0, 42)
                    };
                    break;
            }
        }
        return executeParam;
    }
    function getVotingTitle(state, result) {
        let title;
        if (!result.executeParam)
            return title;
        const token0 = result.executeParam.token0;
        const token1 = result.executeParam.token1;
        const chainId = state.getChainId();
        let tokenMap = scom_token_list_2.tokenStore.getTokenMapByChainId(chainId) || {};
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
    function parseVotingParams(state, params) {
        let result = {
            executor: params.executor,
            address: '',
            id: params.id,
            name: eth_wallet_2.Utils.bytes32ToString(params.name).replace(/\x00/gi, ""),
            options: {},
            quorum: eth_wallet_2.Utils.fromDecimals(params.quorum[0]).toFixed(),
            voteStartTime: new Date(params.voteStartTime.times(1000).toNumber()),
            endTime: new Date(params.voteEndTime.times(1000).toNumber()),
            executeDelay: params.executeDelay,
            executed: params.status[0],
            vetoed: params.status[1],
            totalWeight: eth_wallet_2.Utils.fromDecimals(params.quorum[2]).toFixed(),
            threshold: eth_wallet_2.Utils.fromDecimals(params.quorum[1]).toFixed(),
            remain: 0,
            quorumRemain: '0'
        };
        let voteEndTime = params.voteEndTime.toNumber();
        let now = Math.ceil(Date.now() / 1000);
        let diff = Number(voteEndTime) - now;
        result.remain = diff > 0 ? diff : 0;
        let quorumRemain = new eth_wallet_2.BigNumber(result.quorum);
        let govDecimals = govTokenDecimals(state);
        for (let i = 0; i < params.options.length; i++) {
            let weight = eth_wallet_2.Utils.fromDecimals(params.optionsWeight[i], govDecimals);
            let key = eth_wallet_2.Utils.bytes32ToString(params.options[i]).replace(/\x00/gi, "");
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
                result.executiveDelay = diff > 0 ? diff : 0;
            result.majorityPassed = new eth_wallet_2.BigNumber(params.optionsWeight[0]).gt(params.optionsWeight[1]);
            result.thresholdPassed = new eth_wallet_2.BigNumber(params.optionsWeight[0]).div(new eth_wallet_2.BigNumber(params.optionsWeight[0]).plus(params.optionsWeight[1])).gt(result.threshold);
            if (result.vetoed) {
                result.status = "vetoed";
            }
            else if (result.remain > 0) {
                result.status = "in_progress";
            }
            else if (!result.majorityPassed || !result.thresholdPassed || Number(result.quorumRemain) > 0) {
                result.status = "not_passed";
            }
            else if (result.executiveDelay > 0) {
                result.status = "waiting_execution_delay";
            }
            else if (result.executed) {
                result.status = "executed";
            }
            else {
                result.status = "waiting_execution";
            }
            result.executeParam = parseVotingExecuteParam(params);
        }
        let title = getVotingTitle(state, result);
        if (title)
            result.title = title;
        return result;
    }
    async function getVotingResult(state, votingAddress) {
        if (!votingAddress)
            return;
        let result;
        try {
            const wallet = state.getRpcWallet();
            const votingContract = new oswap_openswap_contract_1.Contracts.OAXDEX_VotingContract(wallet, votingAddress);
            const getParams = await votingContract.getParams();
            result = parseVotingParams(state, getParams);
            result.address = votingAddress;
        }
        catch (err) { }
        return result;
    }
    exports.getVotingResult = getVotingResult;
    async function execute(votingAddress) {
        const wallet = eth_wallet_2.Wallet.getClientInstance();
        const votingContract = new oswap_openswap_contract_1.Contracts.OAXDEX_VotingContract(wallet, votingAddress);
        let receipt = await votingContract.execute();
        return receipt;
    }
    exports.execute = execute;
});
define("@scom/scom-governance-execute-proposal/flow/initialSetup.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-governance-execute-proposal/store/index.ts", "@ijstech/eth-wallet"], function (require, exports, components_3, index_1, eth_wallet_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_3.Styles.Theme.ThemeVars;
    let ScomGovernanceExecuteProposalFlowInitialSetup = class ScomGovernanceExecuteProposalFlowInitialSetup extends components_3.Module {
        constructor() {
            super(...arguments);
            this.walletEvents = [];
        }
        get state() {
            return this._state;
        }
        set state(value) {
            this._state = value;
        }
        get rpcWallet() {
            return this.state.getRpcWallet();
        }
        get chainId() {
            return this.executionProperties.chainId || this.executionProperties.defaultChainId;
        }
        async resetRpcWallet() {
            await this.state.initRpcWallet(this.chainId);
        }
        async setData(value) {
            this.executionProperties = value.executionProperties;
            this.tokenRequirements = value.tokenRequirements;
            await this.resetRpcWallet();
            await this.initializeWidgetConfig();
        }
        async initWallet() {
            try {
                const rpcWallet = this.rpcWallet;
                await rpcWallet.init();
            }
            catch (err) {
                console.log(err);
            }
        }
        async initializeWidgetConfig() {
            const connected = (0, index_1.isClientWalletConnected)();
            this.updateConnectStatus(connected);
            await this.initWallet();
        }
        async connectWallet() {
            if (!(0, index_1.isClientWalletConnected)()) {
                if (this.mdWallet) {
                    await components_3.application.loadPackage('@scom/scom-wallet-modal', '*');
                    this.mdWallet.networks = this.executionProperties.networks;
                    this.mdWallet.wallets = this.executionProperties.wallets;
                    this.mdWallet.showModal();
                }
            }
        }
        updateConnectStatus(connected) {
            if (connected) {
                this.lblConnectedStatus.caption = 'Connected with ' + eth_wallet_3.Wallet.getClientInstance().address;
                this.btnConnectWallet.visible = false;
            }
            else {
                this.lblConnectedStatus.caption = 'Please connect your wallet first';
                this.btnConnectWallet.visible = true;
            }
        }
        registerEvents() {
            let clientWallets = eth_wallet_3.Wallet.getClientInstance();
            this.walletEvents.push(clientWallets.registerWalletEvent(this, eth_wallet_3.Constants.ClientWalletEvent.AccountsChanged, async (payload) => {
                const { account } = payload;
                let connected = !!account;
                this.updateConnectStatus(connected);
            }));
        }
        onHide() {
            let clientWallet = eth_wallet_3.Wallet.getClientInstance();
            for (let event of this.walletEvents) {
                clientWallet.unregisterWalletEvent(event);
            }
            this.walletEvents = [];
        }
        init() {
            super.init();
            this.registerEvents();
        }
        async handleClickStart() {
            this.executionProperties.votingAddress = this.edtVotingAddress.value || "";
            if (this.state.handleUpdateStepStatus)
                this.state.handleUpdateStepStatus({
                    status: "Completed",
                    color: Theme.colors.success.main
                });
            if (this.state.handleNextFlowStep)
                this.state.handleNextFlowStep({
                    isInitialSetup: true,
                    tokenRequirements: this.tokenRequirements,
                    executionProperties: this.executionProperties
                });
        }
        render() {
            return (this.$render("i-vstack", { gap: "1rem", padding: { top: 10, bottom: 10, left: 20, right: 20 } },
                this.$render("i-label", { caption: "Get Ready to Vote" }),
                this.$render("i-vstack", { gap: '1rem' },
                    this.$render("i-label", { id: "lblConnectedStatus" }),
                    this.$render("i-hstack", null,
                        this.$render("i-button", { id: "btnConnectWallet", caption: 'Connect Wallet', font: { color: Theme.colors.primary.contrastText }, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.75rem', right: '0.75rem' }, onClick: this.connectWallet }))),
                this.$render("i-label", { caption: "Enter voting address" }),
                this.$render("i-hstack", { width: "50%", verticalAlignment: "center" },
                    this.$render("i-input", { id: "edtVotingAddress", height: 32, width: "100%", border: { radius: 6 }, font: { size: '1rem' } })),
                this.$render("i-hstack", { horizontalAlignment: 'center' },
                    this.$render("i-button", { id: "btnStart", caption: "Start", padding: { top: '0.25rem', bottom: '0.25rem', left: '0.75rem', right: '0.75rem' }, font: { color: Theme.colors.primary.contrastText, size: '1.5rem' }, onClick: this.handleClickStart })),
                this.$render("i-scom-wallet-modal", { id: "mdWallet", wallets: [] })));
        }
        async handleFlowStage(target, stage, options) {
            let widget = this;
            if (!options.isWidgetConnected) {
                let properties = options.properties;
                let tokenRequirements = options.tokenRequirements;
                this.state.handleNextFlowStep = options.onNextStep;
                this.state.handleAddTransactions = options.onAddTransactions;
                this.state.handleJumpToStep = options.onJumpToStep;
                this.state.handleUpdateStepStatus = options.onUpdateStepStatus;
                await this.setData({
                    executionProperties: properties,
                    tokenRequirements
                });
            }
            return { widget };
        }
    };
    ScomGovernanceExecuteProposalFlowInitialSetup = __decorate([
        (0, components_3.customElements)('i-scom-governance-execute-proposal-flow-initial-setup')
    ], ScomGovernanceExecuteProposalFlowInitialSetup);
    exports.default = ScomGovernanceExecuteProposalFlowInitialSetup;
});
define("@scom/scom-governance-execute-proposal", ["require", "exports", "@ijstech/components", "@scom/scom-governance-execute-proposal/store/index.ts", "@scom/scom-governance-execute-proposal/assets.ts", "@scom/scom-governance-execute-proposal/data.json.ts", "@ijstech/eth-wallet", "@scom/scom-governance-execute-proposal/formSchema.ts", "@scom/scom-governance-execute-proposal/api.ts", "@scom/scom-token-list", "@scom/scom-governance-execute-proposal/flow/initialSetup.tsx"], function (require, exports, components_4, index_2, assets_1, data_json_1, eth_wallet_4, formSchema_1, api_1, scom_token_list_3, initialSetup_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_4.Styles.Theme.ThemeVars;
    let ScomGovernanceExecuteProposal = class ScomGovernanceExecuteProposal extends components_4.Module {
        get chainId() {
            return this.state.getChainId();
        }
        get defaultChainId() {
            return this._data.defaultChainId;
        }
        set defaultChainId(value) {
            this._data.defaultChainId = value;
        }
        get wallets() {
            return this._data.wallets ?? [];
        }
        set wallets(value) {
            this._data.wallets = value;
        }
        get networks() {
            return this._data.networks ?? [];
        }
        set networks(value) {
            this._data.networks = value;
        }
        get showHeader() {
            return this._data.showHeader ?? true;
        }
        set showHeader(value) {
            this._data.showHeader = value;
        }
        get votingAddress() {
            return this._data.votingAddress || "";
        }
        constructor(parent, options) {
            super(parent, options);
            this._data = {
                chainId: 0,
                votingAddress: '',
                wallets: [],
                networks: []
            };
            this.tag = {};
            this.initWallet = async () => {
                try {
                    await eth_wallet_4.Wallet.getClientInstance().init();
                    const rpcWallet = this.state.getRpcWallet();
                    await rpcWallet.init();
                }
                catch (err) {
                    console.log(err);
                }
            };
            this.initializeWidgetConfig = async () => {
                setTimeout(async () => {
                    const chainId = this.chainId;
                    scom_token_list_3.tokenStore.updateTokenMapData(chainId);
                    await this.initWallet();
                    await this.updateUI();
                });
            };
            this.showResultMessage = (status, content) => {
                if (!this.txStatusModal)
                    return;
                let params = { status };
                if (status === 'success') {
                    params.txtHash = content;
                }
                else {
                    params.content = content;
                }
                this.txStatusModal.message = { ...params };
                this.txStatusModal.showModal();
            };
            this.connectWallet = async () => {
                if (!(0, index_2.isClientWalletConnected)()) {
                    if (this.mdWallet) {
                        await components_4.application.loadPackage('@scom/scom-wallet-modal', '*');
                        this.mdWallet.networks = this.networks;
                        this.mdWallet.wallets = this.wallets;
                        this.mdWallet.showModal();
                    }
                    return;
                }
                if (!this.state.isRpcWalletConnected()) {
                    const clientWallet = eth_wallet_4.Wallet.getClientInstance();
                    await clientWallet.switchNetwork(this.chainId);
                }
            };
            this.state = new index_2.State(data_json_1.default);
        }
        removeRpcWalletEvents() {
            const rpcWallet = this.state.getRpcWallet();
            if (rpcWallet)
                rpcWallet.unregisterAllWalletEvents();
        }
        onHide() {
            this.dappContainer.onHide();
            this.removeRpcWalletEvents();
        }
        isEmptyData(value) {
            return !value || !value.networks || value.networks.length === 0;
        }
        async init() {
            this.isReadyCallbackQueued = true;
            super.init();
            const lazyLoad = this.getAttribute('lazyLoad', true, false);
            if (!lazyLoad) {
                const defaultChainId = this.getAttribute('defaultChainId', true);
                const chainId = this.getAttribute('chainId', true, defaultChainId || 0);
                const votingAddress = this.getAttribute('votingAddress', true, '');
                const networks = this.getAttribute('networks', true);
                const wallets = this.getAttribute('wallets', true);
                const showHeader = this.getAttribute('showHeader', true);
                const data = {
                    chainId,
                    votingAddress,
                    networks,
                    wallets,
                    defaultChainId,
                    showHeader
                };
                if (!this.isEmptyData(data)) {
                    await this.setData(data);
                }
            }
            this.loadingElm.visible = false;
            this.isReadyCallbackQueued = false;
            this.executeReadyCallback();
        }
        _getActions(category) {
            const formSchema = (0, formSchema_1.getFormSchema)();
            const rpcWallet = this.state.getRpcWallet();
            const actions = [];
            if (category && category !== 'offers') {
                actions.push({
                    name: 'Edit',
                    icon: 'edit',
                    command: (builder, userInputData) => {
                        let oldData = {
                            chainId: 0,
                            votingAddress: '',
                            wallets: [],
                            networks: []
                        };
                        let oldTag = {};
                        return {
                            execute: () => {
                                oldData = JSON.parse(JSON.stringify(this._data));
                                const { chainId, votingAddress } = userInputData;
                                const themeSettings = {};
                                this._data.chainId = this._data.defaultChainId = chainId;
                                this._data.votingAddress = votingAddress;
                                this.resetRpcWallet();
                                this.refreshUI();
                                if (builder?.setData)
                                    builder.setData(this._data);
                                oldTag = JSON.parse(JSON.stringify(this.tag));
                                if (builder?.setTag)
                                    builder.setTag(themeSettings);
                                else
                                    this.setTag(themeSettings);
                                if (this.dappContainer)
                                    this.dappContainer.setTag(themeSettings);
                            },
                            undo: () => {
                                this._data = JSON.parse(JSON.stringify(oldData));
                                this.refreshUI();
                                if (builder?.setData)
                                    builder.setData(this._data);
                                this.tag = JSON.parse(JSON.stringify(oldTag));
                                if (builder?.setTag)
                                    builder.setTag(this.tag);
                                else
                                    this.setTag(this.tag);
                                if (this.dappContainer)
                                    this.dappContainer.setTag(this.tag);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: formSchema.dataSchema,
                    userInputUISchema: formSchema.uiSchema,
                    customControls: formSchema.customControls()
                });
            }
            return actions;
        }
        getProjectOwnerActions() {
            const formSchema = (0, formSchema_1.getFormSchema)();
            const rpcWallet = this.state.getRpcWallet();
            const actions = [
                {
                    name: 'Settings',
                    userInputDataSchema: formSchema.dataSchema,
                    userInputUISchema: formSchema.uiSchema,
                    customControls: formSchema.customControls()
                }
            ];
            return actions;
        }
        getConfigurators() {
            return [
                {
                    name: 'Project Owner Configurator',
                    target: 'Project Owners',
                    getProxySelectors: async (chainId) => {
                        return [];
                    },
                    getActions: () => {
                        return this.getProjectOwnerActions();
                    },
                    getData: this.getData.bind(this),
                    setData: async (data) => {
                        await this.setData(data);
                    },
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                },
                {
                    name: 'Builder Configurator',
                    target: 'Builders',
                    getActions: this._getActions.bind(this),
                    getData: this.getData.bind(this),
                    setData: async (data) => {
                        const defaultData = data_json_1.default.defaultBuilderData;
                        await this.setData({ ...defaultData, ...data });
                    },
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                },
                {
                    name: 'Embedder Configurator',
                    target: 'Embedders',
                    getData: async () => {
                        return { ...this._data };
                    },
                    setData: async (properties, linkParams) => {
                        let resultingData = {
                            ...properties
                        };
                        if (!properties.defaultChainId && properties.networks?.length) {
                            resultingData.defaultChainId = properties.networks[0].chainId;
                        }
                        await this.setData(resultingData);
                    },
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                }
            ];
        }
        getData() {
            return this._data;
        }
        async setData(data) {
            this._data = data;
            this.resetRpcWallet();
            await this.refreshUI();
        }
        async getTag() {
            return this.tag;
        }
        updateTag(type, value) {
            this.tag[type] = this.tag[type] ?? {};
            for (let prop in value) {
                if (value.hasOwnProperty(prop))
                    this.tag[type][prop] = value[prop];
            }
        }
        setTag(value) {
            const newValue = value || {};
            for (let prop in newValue) {
                if (newValue.hasOwnProperty(prop)) {
                    if (prop === 'light' || prop === 'dark')
                        this.updateTag(prop, newValue[prop]);
                    else
                        this.tag[prop] = newValue[prop];
                }
            }
            if (this.dappContainer)
                this.dappContainer.setTag(this.tag);
        }
        resetRpcWallet() {
            this.removeRpcWalletEvents();
            const rpcWalletId = this.state.initRpcWallet(this.defaultChainId);
            const rpcWallet = this.state.getRpcWallet();
            const chainChangedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_4.Constants.RpcWalletEvent.ChainChanged, async (chainId) => {
                if (this.executeTimeout)
                    clearTimeout(this.executeTimeout);
                this.refreshUI();
            });
            const connectedEvent = rpcWallet.registerWalletEvent(this, eth_wallet_4.Constants.RpcWalletEvent.Connected, async (connected) => {
                this.refreshUI();
            });
            const data = {
                defaultChainId: this.defaultChainId,
                wallets: this.wallets,
                networks: this.networks,
                showHeader: this.showHeader,
                rpcWalletId: rpcWallet.instanceId
            };
            if (this.dappContainer?.setData)
                this.dappContainer.setData(data);
        }
        async refreshUI() {
            await this.initializeWidgetConfig();
        }
        getStepStatusTextAndColor(votingResultStatus) {
            let status = "";
            let color;
            switch (votingResultStatus) {
                case "vetoed":
                    status = "Vetoed";
                    color = Theme.colors.error.main;
                    break;
                case "in_progress":
                    status = "Waiting to vote";
                    color = Theme.colors.warning.main;
                    break;
                case "not_passed":
                    status = "Not Passed";
                    color = Theme.colors.error.main;
                    break;
                case "waiting_execution_delay":
                case "waiting_execution":
                    status = "Pending for execution";
                    color = Theme.colors.warning.main;
                    break;
                case "executed":
                    status = "Completed";
                    color = Theme.colors.success.main;
                    break;
            }
            return { status, color };
        }
        formatDate(value) {
            if (!value)
                return '';
            return (0, components_4.moment)(value).format('MMM. DD, YYYY') + ' at ' + (0, components_4.moment)(value).format('HH:mm');
        }
        async updateUI() {
            this.lblAddress.caption = this.votingAddress;
            const votingResult = await (0, api_1.getVotingResult)(this.state, this.votingAddress);
            let isCanExecute = false;
            if (votingResult) {
                const proposalType = votingResult.hasOwnProperty('executeParam') ? 'Executive' : 'Poll';
                const executeDelaySeconds = votingResult.executeDelay.toNumber();
                const executeDelayDatetime = (0, components_4.moment)(votingResult.endTime)
                    .add(executeDelaySeconds, 'seconds')
                    .toDate();
                this.lblTitle.caption = proposalType == 'Executive' ? votingResult.title : votingResult.name;
                this.lblVoteStartTime.caption = this.formatDate(votingResult.voteStartTime);
                this.lblVoteEndTime.caption = this.formatDate(votingResult.endTime);
                this.lblExecuteDeplay.caption = this.formatDate(executeDelayDatetime);
                let diff = executeDelayDatetime.getTime() - Date.now();
                if (diff > 0 && diff < 86400000) {
                    if (this.executeTimeout)
                        clearTimeout(this.executeTimeout);
                    this.executeTimeout = setTimeout(() => {
                        this.updateUI();
                    }, diff);
                }
                const { status, color } = this.getStepStatusTextAndColor(votingResult?.status);
                this.lblStatus.caption = status;
                this.lblStatus.font = { size: '0.875rem', bold: true, color };
                isCanExecute = votingResult.status == "waiting_execution";
            }
            else {
                this.lblVoteStartTime.caption = "";
                this.lblVoteEndTime.caption = "";
                this.lblExecuteDeplay.caption = "";
                this.lblStatus.caption = "";
            }
            const connected = (0, index_2.isClientWalletConnected)();
            if (!connected || !this.state.isRpcWalletConnected()) {
                this.btnExecute.caption = connected ? "Switch Network" : "Connect Wallet";
                this.btnExecute.enabled = true;
            }
            else {
                this.btnExecute.caption = "Execute";
                this.btnExecute.enabled = isCanExecute;
            }
        }
        async onExecuteProposal() {
            if (!(0, index_2.isClientWalletConnected)() || !this.state.isRpcWalletConnected()) {
                this.connectWallet();
                return;
            }
            try {
                this.btnExecute.rightIcon.spin = true;
                this.btnExecute.rightIcon.visible = true;
                const votingAddress = this.votingAddress;
                const chainId = this.chainId;
                this.showResultMessage('warning', 'Executing proposal');
                const receipt = await (0, api_1.execute)(votingAddress);
                if (receipt) {
                    if (this.state.handleUpdateStepStatus) {
                        this.state.handleUpdateStepStatus({
                            status: "Completed",
                            color: Theme.colors.success.main
                        });
                    }
                    if (this.state.handleAddTransactions && receipt) {
                        const timestamp = await this.state.getRpcWallet().getBlockTimestamp(receipt.blockNumber.toString());
                        const transactionsInfoArr = [
                            {
                                desc: 'Execute proposal',
                                chainId: chainId,
                                fromToken: null,
                                toToken: null,
                                fromTokenAmount: '',
                                toTokenAmount: '-',
                                hash: receipt.transactionHash,
                                timestamp,
                                value: votingAddress
                            }
                        ];
                        this.state.handleAddTransactions({
                            list: transactionsInfoArr
                        });
                    }
                    if (this.state.handleJumpToStep) {
                        this.state.handleJumpToStep({
                            widgetName: 'scom-group-queue-pair',
                            executionProperties: {
                                fromToken: this._data.fromToken || '',
                                toToken: this._data.toToken || '',
                                isFlow: true
                            }
                        });
                    }
                }
            }
            catch (err) {
                this.showResultMessage('error', err);
            }
            this.btnExecute.rightIcon.spin = false;
            this.btnExecute.rightIcon.visible = false;
        }
        render() {
            return (this.$render("i-scom-dapp-container", { id: "dappContainer" },
                this.$render("i-panel", { background: { color: Theme.background.main } },
                    this.$render("i-panel", null,
                        this.$render("i-vstack", { id: "loadingElm", class: "i-loading-overlay" },
                            this.$render("i-vstack", { class: "i-loading-spinner", horizontalAlignment: "center", verticalAlignment: "center" },
                                this.$render("i-icon", { class: "i-loading-spinner_icon", image: { url: assets_1.default.fullPath('img/loading.svg'), width: 36, height: 36 } }),
                                this.$render("i-label", { caption: "Loading...", font: { color: '#FD4A4C', size: '1.5em' }, class: "i-loading-spinner_text" }))),
                        this.$render("i-vstack", { width: "100%", height: "100%", maxWidth: 800, padding: { top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }, margin: { left: "auto", right: "auto" }, gap: "1rem" },
                            this.$render("i-hstack", { width: "100%", horizontalAlignment: "center", margin: { top: "1rem", bottom: "1rem" } },
                                this.$render("i-label", { caption: "Execute Proposal", font: { size: '1.25rem', weight: 700, color: Theme.colors.primary.main }, margin: { bottom: '2rem' } })),
                            this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "space-between", gap: "0.5rem" },
                                this.$render("i-label", { caption: "Title: ", font: { size: '0.875rem' } }),
                                this.$render("i-label", { id: "lblTitle", font: { size: '0.875rem', bold: true } })),
                            this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "space-between", gap: "0.5rem" },
                                this.$render("i-label", { caption: "Address: ", font: { size: '0.875rem' } }),
                                this.$render("i-label", { id: "lblAddress", font: { size: '0.875rem', bold: true } })),
                            this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "space-between", gap: "0.5rem" },
                                this.$render("i-label", { caption: "Date Created: ", font: { size: '0.875rem' } }),
                                this.$render("i-label", { id: "lblVoteStartTime", font: { size: '0.875rem', bold: true } })),
                            this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "space-between", gap: "0.5rem" },
                                this.$render("i-label", { caption: "Vote Ends: ", font: { size: '0.875rem' } }),
                                this.$render("i-label", { id: "lblVoteEndTime", font: { size: '0.875rem', bold: true } })),
                            this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "space-between", gap: "0.5rem" },
                                this.$render("i-label", { caption: "Execute Delay: ", font: { size: '0.875rem' } }),
                                this.$render("i-label", { id: "lblExecuteDeplay", font: { size: '0.875rem', bold: true } })),
                            this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "space-between", gap: "0.5rem" },
                                this.$render("i-label", { caption: "Status: ", font: { size: '0.875rem' } }),
                                this.$render("i-label", { id: "lblStatus", font: { size: '0.875rem', bold: true } })),
                            this.$render("i-hstack", { horizontalAlignment: "center", verticalAlignment: "center", margin: { top: "1rem" } },
                                this.$render("i-button", { id: "btnExecute", width: 150, caption: "Execute", font: { size: '1rem', weight: 600, color: '#ffff' }, lineHeight: 1.5, background: { color: Theme.background.gradient }, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, border: { radius: '0.65rem' }, enabled: false, onClick: this.onExecuteProposal.bind(this) })))),
                    this.$render("i-scom-tx-status-modal", { id: "txStatusModal" }),
                    this.$render("i-scom-wallet-modal", { id: "mdWallet", wallets: [] }))));
        }
        async handleFlowStage(target, stage, options) {
            let widget;
            if (stage === 'initialSetup') {
                widget = new initialSetup_1.default();
                target.appendChild(widget);
                await widget.ready();
                widget.state = this.state;
                await widget.handleFlowStage(target, stage, options);
            }
            else {
                widget = this;
                if (!options.isWidgetConnected) {
                    target.appendChild(widget);
                    await widget.ready();
                }
                let properties = options.properties;
                let tag = options.tag;
                this.state.handleNextFlowStep = options.onNextStep;
                this.state.handleAddTransactions = options.onAddTransactions;
                this.state.handleJumpToStep = options.onJumpToStep;
                this.state.handleUpdateStepStatus = options.onUpdateStepStatus;
                await this.setData(properties);
                if (tag) {
                    this.setTag(tag);
                }
            }
            return { widget };
        }
    };
    ScomGovernanceExecuteProposal = __decorate([
        (0, components_4.customElements)('i-scom-governance-execute-proposal')
    ], ScomGovernanceExecuteProposal);
    exports.default = ScomGovernanceExecuteProposal;
});
