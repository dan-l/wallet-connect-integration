import SignClient from "@walletconnect/sign-client"
import { Web3Modal } from "@web3modal/standalone"

import { useEffect, useState } from "react"

export default function ConnectStandalone() {
  const [signClient, setSignClient] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [session, setSession] = useState({})
  const web3Modal = new Web3Modal({
    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
    enableStandaloneMode: true
  })

  useEffect(() => {
    async function initClient() {
      const client = await SignClient.init({
        projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
        metadata: {
          name: "Wallet Connect Integration Dapp",
          description: "Wallet Connect Integration",
          url: "http://localhost:3000/",
          icons: ["https://walletconnect.com/walletconnect-logo.png"],
        },
      })
      setSignClient(client)
  
      client.on("session_event", ({ event }) => {
        // Handle session events, such as "chainChanged", "accountsChanged", etc.
      })
  
      client.on("session_update", ({ topic, params }) => {
        const { namespaces } = params
        const _session = client.session.get(topic)
        // Overwrite the `namespaces` of the existing session with the incoming one.
        const updatedSession = { ..._session, namespaces }
        // Integrate the updated session state into your dapp state.
        setSession(updatedSession);
      })
  
      client.on("session_delete", () => {
        // Session was deleted -> reset the dapp state, clean up from user session, etc.
        setIsConnected(false)
      })
    }

    initClient()
  }, [SignClient])

  const open = async () => {
    // NOTE: THIS ONLY WORKS WITH WALLET SUPPORTING WC V2.0
    try {
      const { uri, approval } = await signClient.connect({
        pairingTopic: signClient.core.pairing.getPairings()?.topic,
        requiredNamespaces: {
          eip155: {
            methods: [
              "eth_sendTransaction",
              "eth_signTransaction",
              "eth_sign",
              "personal_sign",
              "eth_signTypedData",
            ],
            chains: ["eip155:1", "eip155:5"],
            events: ["chainChanged", "accountsChanged"],
          }
        },
      })
  
      if (uri) {
        // mainnet, goerli
        const standaloneChains = ["eip155:1", "eip155:5"]
        web3Modal.openModal({ uri, standaloneChains })
        const session = await approval()
        setSession(session)
        web3Modal.closeModal()
      }
    } catch (e) {
      console.error('Error pairing', e)
    }
  }


  return (
    <>
      {signClient ?
        <div>
          {isConnected ?
            (
              <>
                <div>
                  {`Connected to: ${address} (${chain.name})`}
                </div>
                <code>
                  {JSON.stringify(session, null, 2)}
                </code>
              </>
            ) :
            (<button onClick={open}>
              Connect
            </button>
            )
          }
        </div>
        :
        <h1>Not ready</h1>
      }
    </>
  )
}