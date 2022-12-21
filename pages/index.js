import Head from 'next/head'
import styles from '../styles/Home.module.css';

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

import WalletConnector from '../components/WalletConnector';

export default function Home() {
  const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID

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

  return (
    <div className={styles.container}>
      <Head>
        <title>Wallet Connect Integration</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          Wallet Connect Integration
        </h1>

        <WagmiConfig client={wagmiClient}>
          <WalletConnector />
        </WagmiConfig>

        <Web3Modal
          projectId={projectId}
          ethereumClient={ethereumClient}
        />
      </main>

      <footer>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}