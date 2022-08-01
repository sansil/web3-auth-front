import React, { useEffect, useState, } from "react";
import { ethers } from "ethers";
import reactLogo from './assets/react.svg'


function App () {
  const [account, setAccount] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [secretMsgFromServer, setSecretMsgFromServer] = useState("")

  const shortAddress = (addr) => {
    return addr.slice(0, 15) + "..." + addr.slice(-5)
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
        let accesToken = await authenticate(account)
        setAccessToken(accesToken)
      } else {
        console.error("No authorized account found")
      }
    }
  }

  const authenticate = async (account) => {
    const { ethereum } = window;
    let res = await fetch(`https://web3-auth-back.herokuapp.com/nonce?address=${account}`)
    let resBody = await res.json()
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(resBody.message)
    let opts = {
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
        'Authorization': `Bearer ${resBody.tempToken}`
      }
    }
    res = await fetch(`https://web3-auth-back.herokuapp.com/verify?signature=${signature}`, opts)
    resBody = await res.json()
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
    let res = await fetch(`https://web3-auth-back.herokuapp.com/secret`, opts)
    let resBody = await res.json()
    setSecretMsgFromServer(resBody.msg)
  }


  return (
    <div className=" min-h-screen flex flex-col  items-center bg-slate-300 ">
      <h1 className="mt-20 text-4xl tracking-tight font-extrabold text-white  sm:text-6xl  xl:text-6xl">
        <span className="px-3 pb-3 block bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-cyan-600 sm:pb-5">
          Web3 auth end to end demo
        </span>
      </h1>
      <div className="mt-12 space-y-5 ">
        <div className="  ">
          <button className="bg-green-500 px-5 py-2 rounded-lg text-green-100 hover:bg-green-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" onClick={() => connect()}>➡️ Log in web 3</button>
          <h2 className="mt-2 text-slate-700 font-semibold text-sm">Connected account:</h2> {account && <span className="text-slate-700 mt-4 font-medium">🌐 {shortAddress(account)}</span>}
          <h2 className="mt-2 text-slate-700 font-semibold text-sm truncate">Account authenticated : {accessToken ? '✅' : '❌'}</h2>
        </div>
        <div className="border-t border-slate-500 pt-4">
          <button className="bg-red-500 px-5 py-2 rounded-lg text-red-100 hover:bg-red-600 focus:ring-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500" onClick={() => accessSecretInfo()}>🔒 Get secret info</button>
          <h2 className="text-slate-600 mt-4 font-semibold">{secretMsgFromServer}</h2>
        </div>
      </div>
      <footer className="absolute bottom-4 text-slate-600"> made with ❤️ by <a href="https://twitter.com/sansildev" className=" font-medium"> sansil.</a> View <a href="https://github.com/sansil/web3-auth-front" className="font-medium">source code</a> </footer>
    </div >
  )
}

export default App
