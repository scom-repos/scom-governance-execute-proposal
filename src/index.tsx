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
import Assets from './assets';
import { Constants, Wallet } from "@ijstech/eth-wallet";

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
    private txStatusModal: ScomTxStatusModal;
    private mdWallet: ScomWalletModal;

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
                            maxWidth={440}
                            padding={{ top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }}
                            margin={{ left: "auto", right: "auto" }}
                            gap="1rem"
                        >
                            <i-hstack width="100%" horizontalAlignment="center" margin={{ top: "1rem", bottom: "1rem" }}>
                                <i-label caption="Execute Proposal" font={{ size: "1rem", bold: true, color: Theme.text.third }}></i-label>
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