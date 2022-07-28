import React, { useEffect, useState, } from "react";
import { ethers } from "ethers";
import reactLogo from './assets/react.svg'
import './App.css'

function App () {
  const [account, setAccount] = useState(null)
  const [accessToken, setAccessToken] = useState(null)

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      //setCurrentAccount(account)
      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      //setupEventListener()
    } else {
      console.log("No authorized account found")
    }
  }

  const connect = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }
    if (ethereum) {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log(accounts)
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        await setAccount(account)
        let accesToken = await authenticate()
        setAccessToken(accesToken)
      } else {
        console.error("No authorized account found")
      }
    }
  }

  const authenticate = async () => {
    const { ethereum } = window;
    let res = await fetch(`http://localhost:3000/nonce?address=${account}`)
    let resBody = await res.json()
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(resBody.message)
    const address = await signer.getAddress()

    let opts = {
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
        'Authorization': `Bearer ${resBody.tempToken}`
      }
    }
    res = await fetch(`http://localhost:3000/verify?signature=${signature}`, opts)
    resBody = await res.json()
    console.log(resBody)
    alert(resBody.token)
    return resBody.token
  }

  const accessSecretInfo = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }
    console.log(accessToken)
    let opts = {
      method: 'GET',
      headers: {
        'Content-Type': "application/json",
        'Authorization': `Bearer ${accessToken}`
      }
    }
    let res = await fetch(`http://localhost:3000/secret`, opts)
    let resBody = await res.json()

  }

  useEffect(() => {
    //checkIfWalletIsConnected()
  })
  return (
    <div className="App">
      <button onClick={() => connect()}>Log in web 3</button>
      <button onClick={() => accessSecretInfo()}>Get secret info</button>
    </div>
  )
}

export default App
