import { useState } from 'react';
import styles from '../styles/Home.module.css';
import ConnectStandalone from './ConnectStandalone';
import ConnectWeb3Modal from './ConnectWeb3Modal';

export default function WalletConnector() {
  const [connector, setConnector] = useState(null)

  const renderComponent = (connector) => {
    switch (connector) {
      case "connect-web3modal":
        return <ConnectWeb3Modal />
      case "connect-standalone":
        return <ConnectStandalone />
      default:
        return <ConnectWeb3Modal />
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