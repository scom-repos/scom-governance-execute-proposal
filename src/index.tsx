import {
    application,
    Button,
    Container,
    Control,
    ControlElement,
    customElements,
    FormatUtils,
    HStack,
    Input,
    Label,
    Modal,
    Module,
    moment,
    Panel,
    Styles
} from "@ijstech/components";
import ScomDappContainer from "@scom/scom-dapp-container";
import { INetworkConfig } from "@scom/scom-network-picker";
import ScomWalletModal, { IWalletPlugin } from "@scom/scom-wallet-modal";
import ScomTxStatusModal from '@scom/scom-tx-status-modal';
import { IGovernanceExecuteProposal } from "./interface";
import { isClientWalletConnected, State } from "./store/index";
import Assets from './assets';
import configData from './data.json';
import { Constants, Wallet } from "@ijstech/eth-wallet";
import { getFormSchema } from "./formSchema";
import { execute, getVotingResult } from "./api";
import { tokenStore } from "@scom/scom-token-list";

const Theme = Styles.Theme.ThemeVars;

interface ScomGovernanceExecuteProposalElement extends ControlElement {
    lazyLoad?: boolean;
    chainId: number;
    votingAddress: string;
    networks: INetworkConfig[];
    wallets: IWalletPlugin[];
    defaultChainId?: number;
    showHeader?: boolean;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-governance-execute-proposal']: ScomGovernanceExecuteProposalElement;
        }
    }
}

@customElements('i-scom-governance-execute-proposal')
export default class ScomGovernanceExecuteProposal extends Module {
    private dappContainer: ScomDappContainer;
    private loadingElm: Panel;
    private lblTitle: Label;
    private lblAddress: Label;
    private lblVoteStartTime: Label;
    private lblVoteEndTime: Label;
    private lblExecuteDeplay: Label;
    private lblStatus: Label;
    private btnExecute: Button;
    private txStatusModal: ScomTxStatusModal;
    private mdWallet: ScomWalletModal;

    private state: State;
    private _data: IGovernanceExecuteProposal = {
        chainId: 0,
        votingAddress: '',
        wallets: [],
        networks: []
    };
    tag: any = {};
    private isCanExecute: boolean = false;

    private get chainId() {
        return this.state.getChainId();
    }

    get defaultChainId() {
        return this._data.defaultChainId;
    }

    set defaultChainId(value: number) {
        this._data.defaultChainId = value;
    }

    get wallets() {
        return this._data.wallets ?? [];
    }
    set wallets(value: IWalletPlugin[]) {
        this._data.wallets = value;
    }

    get networks() {
        return this._data.networks ?? [];
    }
    set networks(value: INetworkConfig[]) {
        this._data.networks = value;
    }

    get showHeader() {
        return this._data.showHeader ?? true;
    }
    set showHeader(value: boolean) {
        this._data.showHeader = value;
    }

    get votingAddress() {
        return this._data.votingAddress || "";
    }

    constructor(parent?: Container, options?: any) {
        super(parent, options);
        this.state = new State(configData);
    }

    removeRpcWalletEvents() {
        const rpcWallet = this.state.getRpcWallet();
        if (rpcWallet) rpcWallet.unregisterAllWalletEvents();
    }

    onHide() {
        this.dappContainer.onHide();
        this.removeRpcWalletEvents();
    }

    isEmptyData(value: IGovernanceExecuteProposal) {
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
            const data: IGovernanceExecuteProposal = {
                chainId,
                votingAddress,
                networks,
                wallets,
                defaultChainId,
                showHeader
            }
            if (!this.isEmptyData(data)) {
                await this.setData(data);
            }
        }
        this.loadingElm.visible = false;
        this.isReadyCallbackQueued = false;
        this.executeReadyCallback();
    }

    private _getActions(category?: string) {
        const formSchema: any = getFormSchema();
        const rpcWallet = this.state.getRpcWallet();
        const actions: any[] = [];
        if (category && category !== 'offers') {
            actions.push({
                name: 'Edit',
                icon: 'edit',
                command: (builder: any, userInputData: any) => {
                    let oldData: IGovernanceExecuteProposal = {
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
                    }
                },
                userInputDataSchema: formSchema.dataSchema,
                userInputUISchema: formSchema.uiSchema,
                customControls: formSchema.customControls()
            });
        }
        return actions;
    }

    private getProjectOwnerActions() {
        const formSchema: any = getFormSchema();
        const rpcWallet = this.state.getRpcWallet();
        const actions: any[] = [
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
                getProxySelectors: async (chainId: number) => {
                    return [];
                },
                getActions: () => {
                    return this.getProjectOwnerActions();
                },
                getData: this.getData.bind(this),
                setData: async (data: any) => {
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
                setData: async (data: any) => {
                    const defaultData = configData.defaultBuilderData;
                    await this.setData({ ...defaultData, ...data });
                },
                getTag: this.getTag.bind(this),
                setTag: this.setTag.bind(this)
            },
            {
                name: 'Embedder Configurator',
                target: 'Embedders',
                getData: async () => {
                    return { ...this._data }
                },
                setData: async (properties: IGovernanceExecuteProposal, linkParams?: Record<string, any>) => {
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

    private getData() {
        return this._data;
    }

    private async setData(data: IGovernanceExecuteProposal) {
        this._data = data;
        this.resetRpcWallet();
        await this.refreshUI();
    }

    async getTag() {
        return this.tag;
    }

    private updateTag(type: 'light' | 'dark', value: any) {
        this.tag[type] = this.tag[type] ?? {};
        for (let prop in value) {
            if (value.hasOwnProperty(prop))
                this.tag[type][prop] = value[prop];
        }
    }

    private setTag(value: any) {
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

    private resetRpcWallet() {
        this.removeRpcWalletEvents();
        const rpcWalletId = this.state.initRpcWallet(this.defaultChainId);
        const rpcWallet = this.state.getRpcWallet();
        const chainChangedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.ChainChanged, async (chainId: number) => {
            this.refreshUI();
        });
        const connectedEvent = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.Connected, async (connected: boolean) => {
            this.refreshUI();
        });
        const data: any = {
            defaultChainId: this.defaultChainId,
            wallets: this.wallets,
            networks: this.networks,
            showHeader: this.showHeader,
            rpcWalletId: rpcWallet.instanceId
        };
        if (this.dappContainer?.setData) this.dappContainer.setData(data);
    }

    private async refreshUI() {
        await this.initializeWidgetConfig();
    }

    private initWallet = async () => {
        try {
            await Wallet.getClientInstance().init();
            const rpcWallet = this.state.getRpcWallet();
            await rpcWallet.init();
        } catch (err) {
            console.log(err);
        }
    }

    private initializeWidgetConfig = async () => {
        setTimeout(async () => {
            const chainId = this.chainId;
            tokenStore.updateTokenMapData(chainId);
            await this.initWallet();
            await this.updateUI();
            const connected = isClientWalletConnected();
            if (!connected || !this.state.isRpcWalletConnected()) {
                this.btnExecute.caption = connected ? "Switch Network" : "Connect Wallet";
                this.btnExecute.enabled = true;
            } else {
                this.btnExecute.caption = "Execute";
                this.btnExecute.enabled = this.isCanExecute;
            }
        });
    }

    private getStepStatusTextAndColor(votingResultStatus: string) {
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

    private formatDate(value: Date) {
        if (!value) return '';
        return moment(value).format('MMM. DD, YYYY') + ' at ' + moment(value).format('HH:mm')
    }

    private async updateUI() {
        this.lblAddress.caption = this.votingAddress;
        const votingResult = await getVotingResult(this.state, this.votingAddress);
        if (votingResult) {
            const proposalType = votingResult.hasOwnProperty('executeParam') ? 'Executive' : 'Poll';
            const executeDelaySeconds = votingResult.executeDelay.toNumber();
            const executeDelayDatetime = moment(votingResult.endTime)
                .add(executeDelaySeconds, 'seconds')
                .toDate();
            this.lblTitle.caption = proposalType == 'Executive' ? votingResult.title : votingResult.name;
            this.lblVoteStartTime.caption = this.formatDate(votingResult.voteStartTime);
            this.lblVoteEndTime.caption = this.formatDate(votingResult.endTime);
            this.lblExecuteDeplay.caption = this.formatDate(executeDelayDatetime);
            const { status, color } = this.getStepStatusTextAndColor(votingResult?.status);
            this.lblStatus.caption = status;
            this.lblStatus.font = { size: '0.875rem', bold: true, color };
            this.isCanExecute = votingResult.status == "waiting_execution";
        } else {
            this.lblVoteStartTime.caption = "";
            this.lblVoteEndTime.caption = "";
            this.lblExecuteDeplay.caption = "";
            this.lblStatus.caption = "";
            this.isCanExecute = false;
        }
    }

    private showResultMessage = (status: 'warning' | 'success' | 'error', content?: string | Error) => {
        if (!this.txStatusModal) return;
        let params: any = { status };
        if (status === 'success') {
            params.txtHash = content;
        } else {
            params.content = content;
        }
        this.txStatusModal.message = { ...params };
        this.txStatusModal.showModal();
    }

    private connectWallet = async () => {
        if (!isClientWalletConnected()) {
            if (this.mdWallet) {
                await application.loadPackage('@scom/scom-wallet-modal', '*');
                this.mdWallet.networks = this.networks;
                this.mdWallet.wallets = this.wallets;
                this.mdWallet.showModal();
            }
            return;
        }
        if (!this.state.isRpcWalletConnected()) {
            const clientWallet = Wallet.getClientInstance();
            await clientWallet.switchNetwork(this.chainId);
        }
    }

    private async onExecuteProposal() {
        if (!isClientWalletConnected() || !this.state.isRpcWalletConnected()) {
            this.connectWallet();
            return;
        }
        try {
            this.btnExecute.rightIcon.spin = true;
            this.btnExecute.rightIcon.visible = true;
            const votingAddress = this.votingAddress;
            const chainId = this.chainId;
            this.showResultMessage('warning', 'Executing proposal');

            const receipt = await execute(votingAddress);

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
                    })
                }
            }
        } catch (err) {
            this.showResultMessage('error', err);
        }
        this.btnExecute.rightIcon.spin = false;
        this.btnExecute.rightIcon.visible = false;
    }

    render() {
        return (
            <i-scom-dapp-container id="dappContainer">
                <i-panel background={{ color: Theme.background.main }}>
                    <i-panel>
                        <i-vstack id="loadingElm" class="i-loading-overlay">
                            <i-vstack class="i-loading-spinner" horizontalAlignment="center" verticalAlignment="center">
                                <i-icon
                                    class="i-loading-spinner_icon"
                                    image={{ url: Assets.fullPath('img/loading.svg'), width: 36, height: 36 }}
                                />
                                <i-label
                                    caption="Loading..." font={{ color: '#FD4A4C', size: '1.5em' }}
                                    class="i-loading-spinner_text"
                                />
                            </i-vstack>
                        </i-vstack>
                        <i-vstack
                            width="100%"
                            height="100%"
                            maxWidth={800}
                            padding={{ top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }}
                            margin={{ left: "auto", right: "auto" }}
                            gap="1rem"
                        >
                            <i-hstack width="100%" horizontalAlignment="center" margin={{ top: "1rem", bottom: "1rem" }}>
                                <i-label caption="Execute Proposal" font={{ size: '1.25rem', weight: 700, color: Theme.colors.primary.main }} margin={{ bottom: '2rem' }}></i-label>
                            </i-hstack>
                            <i-hstack verticalAlignment="center" gap="0.5rem">
                                <i-label caption="Title: " font={{ size: '0.875rem' }}></i-label>
                                <i-label id="lblTitle" font={{ size: '0.875rem', bold: true }}></i-label>
                            </i-hstack>
                            <i-hstack verticalAlignment="center" gap="0.5rem">
                                <i-label caption="Address: " font={{ size: '0.875rem' }}></i-label>
                                <i-label id="lblAddress" font={{ size: '0.875rem', bold: true }}></i-label>
                            </i-hstack>
                            <i-hstack verticalAlignment="center" gap="0.5rem">
                                <i-label caption="Date Created: " font={{ size: '0.875rem' }}></i-label>
                                <i-label id="lblVoteStartTime" font={{ size: '0.875rem', bold: true }}></i-label>
                            </i-hstack>
                            <i-hstack verticalAlignment="center" gap="0.5rem">
                                <i-label caption="Vote Ends: " font={{ size: '0.875rem' }}></i-label>
                                <i-label id="lblVoteEndTime" font={{ size: '0.875rem', bold: true }}></i-label>
                            </i-hstack>
                            <i-hstack verticalAlignment="center" gap="0.5rem">
                                <i-label caption="Execute Delay: " font={{ size: '0.875rem' }}></i-label>
                                <i-label id="lblExecuteDeplay" font={{ size: '0.875rem', bold: true }}></i-label>
                            </i-hstack>
                            <i-hstack verticalAlignment="center" gap="0.5rem">
                                <i-label caption="Status: " font={{ size: '0.875rem' }}></i-label>
                                <i-label id="lblStatus" font={{ size: '0.875rem', bold: true }}></i-label>
                            </i-hstack>
                            <i-hstack horizontalAlignment="center" verticalAlignment="center" margin={{ top: "1rem" }}>
                                <i-button
                                    id="btnExecute"
                                    width={150}
                                    caption="Execute"
                                    font={{ size: '1rem', weight: 600, color: '#ffff' }}
                                    lineHeight={1.5}
                                    background={{ color: Theme.background.gradient }}
                                    padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                                    border={{ radius: '0.65rem' }}
                                    enabled={false}
                                    onClick={this.onExecuteProposal.bind(this)}
                                ></i-button>
                            </i-hstack>
                        </i-vstack>
                    </i-panel>
                    <i-scom-tx-status-modal id="txStatusModal"></i-scom-tx-status-modal>
                    <i-scom-wallet-modal id="mdWallet" wallets={[]}></i-scom-wallet-modal>
                </i-panel>
            </i-scom-dapp-container>
        )
    }
}