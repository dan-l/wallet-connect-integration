import { useState } from 'react';
import styles from '../styles/Home.module.css';
import ConnectStandalone from './ConnectStandalone';
import ConnectWeb3Modal from './ConnectWeb3Modal';

import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";

import {
  configureChains,
  createClient,
  WagmiConfig
} from "wagmi";

import { mainnet, goerli } from "wagmi/chains";
import { Web3Modal } from '@web3modal/react'

export default function WalletConnector() {
  const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID

  const [connector, setConnector] = useState(null)

  // Wagmi client using wallet connect as provider with supported chains
  const chains = [mainnet, goerli]
  const { provider } = configureChains(chains, [
    walletConnectProvider({ projectId }),
  ])
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: modalConnectors({ appName: "web3Modal", chains }),
    provider,
  })
  // Web3Modal Ethereum Client
  const ethereumClient = new EthereumClient(wagmiClient, chains)

  const renderComponent = (connector) => {
    switch (connector) {
      case "connect-web3modal":
        return (<><WagmiConfig client={wagmiClient}>
          <ConnectWeb3Modal />

        </WagmiConfig><Web3Modal
            projectId={projectId}
            ethereumClient={ethereumClient} /></>)
      case "connect-standalone":
        return <ConnectStandalone />
      default:
        console.error('No selecto')
    }
  }

  return (
    connector ?
      renderComponent(connector)
      :
      (<>
        <div className={styles.grid}>
          <div onClick={() => { setConnector("connect-web3modal") }} className={styles.card}>
            Use Web3Modal + WAGMI
          </div>

          <div onClick={() => { setConnector("connect-standalone") }} className={styles.card}>
            Use Standalone with Auth+Sign Client
          </div>
        </div>
      </>
      )
  )
}