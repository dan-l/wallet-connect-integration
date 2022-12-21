import styles from '../styles/Home.module.css';

import {
  useAccount,
  useDisconnect,
  useNetwork,
} from "wagmi";

import { useWeb3Modal } from '@web3modal/react'

export default function ConnectWallet() {
  // Make sure wagmi client is setup
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect()

  return (
    <>
      <h1 className={styles.title}>
        Wallet Connect Integration
      </h1>

      <div className={styles.grid}>
        {isConnected ?
          (
            <>
              <div>
                {`Connected to: ${address} (${chain.name})`}
              </div>
              <button onClick={disconnect}>
                Disconnect
              </button>
            </>
          ) :
          (<div onClick={open} className={styles.card}>
            Connect
          </div>
          )
        }
      </div>
    </>
  )
}