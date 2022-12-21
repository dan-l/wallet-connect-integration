import styles from '../styles/Home.module.css';

import {
  useAccount,
  useDisconnect,
  useNetwork,
  useSignMessage,
} from "wagmi";

import { useWeb3Modal } from '@web3modal/react'
import { useState } from 'react';

export default function ConnectWallet() {
  // Make sure wagmi client is setup
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect()
  const { data, error, isError, isLoading, isSuccess, signMessage, reset } = useSignMessage({
    message: "Sign message for Wallet Connect integration"
  })

  return (
    <>
      <h1 className={styles.title}>
        Wallet Connect Integration
      </h1>

      <div>
        {isConnected ?
          (
            <>
              <div>
                {`Connected to: ${address} (${chain.name})`}
              </div>
              <button onClick={disconnect}>
                Disconnect
              </button>
              <div>
                {data ?
                  <button onClick={reset}>Sign Out</button>
                  :
                  <button disabled={isLoading} onClick={() => {
                    signMessage()
                    // Reset if no response in 30s
                    setTimeout(reset, 30000)
                  }}>Sign In</button>
                }
                {isSuccess && <div>Signature: {data}</div>}
                {isError && <div>Error signing message: {error.message}</div>}
              </div>
            </>
          ) :
          (<div onClick={open} className={styles.card}>
            Connect
          </div>
          )
        }
      </div>

      <style jsx>{`
        div, button {
          margin-bottom: 15px;
        }
      `}</style>
    </>
  )
}