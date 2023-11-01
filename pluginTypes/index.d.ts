/// <reference path="@scom/scom-dapp-container/@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@ijstech/eth-wallet/index.d.ts" />
/// <reference path="@ijstech/eth-contract/index.d.ts" />
/// <reference path="@scom/scom-token-list/index.d.ts" />
/// <amd-module name="@scom/scom-governance-execute-proposal/interface.ts" />
declare module "@scom/scom-governance-execute-proposal/interface.ts" {
    import { BigNumber } from "@ijstech/eth-wallet";
    import { INetworkConfig } from "@scom/scom-network-picker";
    import { ITokenObject } from "@scom/scom-token-list";
    import { IWalletPlugin } from "@scom/scom-wallet-modal";
    export interface IGovernanceExecuteProposal extends IGovernanceVotingFlow {
        chainId: number;
        votingAddress: string;
        wallets: IWalletPlugin[];
        networks: INetworkConfig[];
        defaultChainId?: number;
        showHeader?: boolean;
    }
    interface IGovernanceVotingFlow {
        isFlow?: boolean;
        fromToken?: string;
        toToken?: string;
        customTokens?: Record<number, ITokenObject[]>;
    }
    export interface IExecuteParam {
        cmd: string;
        token0?: string;
        token1?: string;
        oracle?: string;
        value?: any;
        address?: string;
        lotSize?: number;
        token?: string;
    }
    export interface IVotingParams {
        executor: string;
        id: BigNumber;
        name: string;
        options: string[];
        voteStartTime: BigNumber;
        voteEndTime: BigNumber;
        executeDelay: BigNumber;
        status: boolean[];
        optionsWeight: BigNumber[];
        quorum: BigNumber[];
        executeParam: string[];
        executed?: boolean;
    }
    export interface IVotingResult {
        executor: string;
        id: BigNumber;
        address: string;
        name: string;
        options: {
            [key: string]: BigNumber;
        };
        quorum: string;
        voteStartTime: Date;
        endTime: Date;
        executeDelay: BigNumber;
        executed: boolean;
        vetoed: boolean;
        totalWeight: string;
        threshold: string;
        remain: number;
        quorumRemain: string;
        veto?: boolean;
        executiveDelay?: number;
        majorityPassed?: boolean;
        thresholdPassed?: boolean;
        status?: string;
        executeParam?: IExecuteParam;
        title?: string;
    }
}
/// <amd-module name="@scom/scom-governance-execute-proposal/store/core.ts" />
declare module "@scom/scom-governance-execute-proposal/store/core.ts" {
    export interface CoreAddress {
        OAXDEX_Governance: string;
        OAXDEX_VotingRegistry: string;
        GOV_TOKEN: string;
    }
    export const coreAddress: {
        [chainId: number]: CoreAddress;
    };
}
/// <amd-module name="@scom/scom-governance-execute-proposal/store/utils.ts" />
declare module "@scom/scom-governance-execute-proposal/store/utils.ts" {
    import { ERC20ApprovalModel, IERC20ApprovalEventOptions, INetwork } from "@ijstech/eth-wallet";
    import { ITokenObject } from "@scom/scom-token-list";
    export class State {
        infuraId: string;
        networkMap: {
            [key: number]: INetwork;
        };
        rpcWalletId: string;
        approvalModel: ERC20ApprovalModel;
        handleNextFlowStep: (data: any) => Promise<void>;
        handleAddTransactions: (data: any) => Promise<void>;
        handleJumpToStep: (data: any) => Promise<void>;
        handleUpdateStepStatus: (data: any) => Promise<void>;
        constructor(options: any);
        private initData;
        initRpcWallet(defaultChainId: number): string;
        getRpcWallet(): import("@ijstech/eth-wallet").IRpcWallet;
        isRpcWalletConnected(): boolean;
        getChainId(): number;
        private setNetworkList;
        setApprovalModelAction(options: IERC20ApprovalEventOptions): Promise<import("@ijstech/eth-wallet").IERC20ApprovalAction>;
        getAddresses(chainId?: number): import("@scom/scom-governance-execute-proposal/store/core.ts").CoreAddress;
        getGovToken(chainId: number): ITokenObject;
    }
    export function isClientWalletConnected(): boolean;
    export const getWETH: (chainId: number) => ITokenObject;
}
/// <amd-module name="@scom/scom-governance-execute-proposal/store/index.ts" />
declare module "@scom/scom-governance-execute-proposal/store/index.ts" {
    export * from "@scom/scom-governance-execute-proposal/store/utils.ts";
}
/// <amd-module name="@scom/scom-governance-execute-proposal/assets.ts" />
declare module "@scom/scom-governance-execute-proposal/assets.ts" {
    function fullPath(path: string): string;
    const _default: {
        fullPath: typeof fullPath;
    };
    export default _default;
}
/// <amd-module name="@scom/scom-governance-execute-proposal/data.json.ts" />
declare module "@scom/scom-governance-execute-proposal/data.json.ts" {
    const _default_1: {
        infuraId: string;
        networks: {
            chainId: number;
            explorerTxUrl: string;
            explorerAddressUrl: string;
        }[];
        defaultBuilderData: {
            defaultChainId: number;
            networks: {
                chainId: number;
            }[];
            wallets: {
                name: string;
            }[];
            showHeader: boolean;
            showFooter: boolean;
        };
    };
    export default _default_1;
}
/// <amd-module name="@scom/scom-governance-execute-proposal/formSchema.ts" />
declare module "@scom/scom-governance-execute-proposal/formSchema.ts" {
    import ScomNetworkPicker from '@scom/scom-network-picker';
    export function getFormSchema(): {
        dataSchema: {
            type: string;
            properties: {
                chainId: {
                    type: string;
                };
                votingAddress: {
                    type: string;
                    format: string;
                };
            };
        };
        uiSchema: {
            type: string;
            elements: {
                type: string;
                scope: string;
            }[];
        };
        customControls(): {
            "#/properties/chainId": {
                render: () => ScomNetworkPicker;
                getData: (control: ScomNetworkPicker) => number;
                setData: (control: ScomNetworkPicker, value: number) => void;
            };
        };
    };
}
/// <amd-module name="@scom/scom-governance-execute-proposal/api.ts" />
declare module "@scom/scom-governance-execute-proposal/api.ts" {
    import { ITokenObject } from "@scom/scom-token-list";
    import { State } from "@scom/scom-governance-execute-proposal/store/index.ts";
    export function getVotingResult(state: State, votingAddress: string, customTokens?: Record<number, ITokenObject[]>): Promise<any>;
    export function execute(votingAddress: string): Promise<import("@ijstech/eth-contract").TransactionReceipt>;
}
/// <amd-module name="@scom/scom-governance-execute-proposal/flow/initialSetup.tsx" />
declare module "@scom/scom-governance-execute-proposal/flow/initialSetup.tsx" {
    import { Control, ControlElement, Module } from "@ijstech/components";
    import { State } from "@scom/scom-governance-execute-proposal/store/index.ts";
    interface ScomGovernanceExecuteProposalFlowInitialSetupElement extends ControlElement {
        data?: any;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-governance-execute-proposal-flow-initial-setup']: ScomGovernanceExecuteProposalFlowInitialSetupElement;
            }
        }
    }
    export default class ScomGovernanceExecuteProposalFlowInitialSetup extends Module {
        private lblConnectedStatus;
        private btnConnectWallet;
        private edtVotingAddress;
        private mdWallet;
        private _state;
        private tokenRequirements;
        private executionProperties;
        private walletEvents;
        get state(): State;
        set state(value: State);
        private get rpcWallet();
        private get chainId();
        private resetRpcWallet;
        setData(value: any): Promise<void>;
        private initWallet;
        private initializeWidgetConfig;
        private connectWallet;
        private updateConnectStatus;
        private registerEvents;
        onHide(): void;
        init(): void;
        private handleClickStart;
        render(): any;
        handleFlowStage(target: Control, stage: string, options: any): Promise<{
            widget: ScomGovernanceExecuteProposalFlowInitialSetup;
        }>;
    }
}
/// <amd-module name="@scom/scom-governance-execute-proposal" />
declare module "@scom/scom-governance-execute-proposal" {
    import { Container, Control, ControlElement, Module } from "@ijstech/components";
    import { INetworkConfig } from "@scom/scom-network-picker";
    import { IWalletPlugin } from "@scom/scom-wallet-modal";
    import { IGovernanceExecuteProposal } from "@scom/scom-governance-execute-proposal/interface.ts";
    interface ScomGovernanceExecuteProposalElement extends ControlElement {
        lazyLoad?: boolean;
        chainId: number;
        votingAddress: string;
        networks: INetworkConfig[];
        wallets: IWalletPlugin[];
        defaultChainId?: number;
        showHeader?: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-governance-execute-proposal']: ScomGovernanceExecuteProposalElement;
            }
        }
    }
    export default class ScomGovernanceExecuteProposal extends Module {
        private dappContainer;
        private loadingElm;
        private lblTitle;
        private lblAddress;
        private lblVoteStartTime;
        private lblVoteEndTime;
        private lblExecuteDeplay;
        private lblStatus;
        private btnExecute;
        private txStatusModal;
        private mdWallet;
        private state;
        private _data;
        tag: any;
        private executeTimeout;
        private get chainId();
        get defaultChainId(): number;
        set defaultChainId(value: number);
        get wallets(): IWalletPlugin[];
        set wallets(value: IWalletPlugin[]);
        get networks(): INetworkConfig[];
        set networks(value: INetworkConfig[]);
        get showHeader(): boolean;
        set showHeader(value: boolean);
        get votingAddress(): string;
        constructor(parent?: Container, options?: any);
        removeRpcWalletEvents(): void;
        onHide(): void;
        isEmptyData(value: IGovernanceExecuteProposal): boolean;
        init(): Promise<void>;
        private _getActions;
        private getProjectOwnerActions;
        getConfigurators(): ({
            name: string;
            target: string;
            getProxySelectors: (chainId: number) => Promise<any[]>;
            getActions: () => any[];
            getData: any;
            setData: (data: any) => Promise<void>;
            getTag: any;
            setTag: any;
        } | {
            name: string;
            target: string;
            getActions: any;
            getData: any;
            setData: (data: any) => Promise<void>;
            getTag: any;
            setTag: any;
            getProxySelectors?: undefined;
        } | {
            name: string;
            target: string;
            getData: () => Promise<{
                chainId: number;
                votingAddress: string;
                wallets: IWalletPlugin[];
                networks: INetworkConfig[];
                defaultChainId?: number;
                showHeader?: boolean;
                isFlow?: boolean;
                fromToken?: string;
                toToken?: string;
                customTokens?: Record<number, import("@scom/scom-token-list").ITokenObject[]>;
            }>;
            setData: (properties: IGovernanceExecuteProposal, linkParams?: Record<string, any>) => Promise<void>;
            getTag: any;
            setTag: any;
            getProxySelectors?: undefined;
            getActions?: undefined;
        })[];
        private getData;
        private setData;
        getTag(): Promise<any>;
        private updateTag;
        private setTag;
        private resetRpcWallet;
        private refreshUI;
        private initWallet;
        private initializeWidgetConfig;
        private getStepStatusTextAndColor;
        private formatDate;
        private updateUI;
        private showResultMessage;
        private connectWallet;
        private onExecuteProposal;
        render(): any;
        handleFlowStage(target: Control, stage: string, options: any): Promise<{
            widget: any;
        }>;
    }
}
