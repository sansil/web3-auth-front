# Web3 auth frontend example
Complete example of we3 auth authenticating the user by signing a message 

## 🤖 Demo

[Live demo](https://web3-auth-example.vercel.app/)
App deployed on [Vercel](https://vercel.com/)

## Backend
Checkout the backend code [here](https://github.com/sansil/web3-auth-back), deployed in [Heroku](https://dashboard.heroku.com/login)

## Why signing message to authenticate users?
You want to verify that the user owns certain address, so the backend will provide a message and the user sign it. The user use their private key to sign the message. 
To validate the signature you use some maths along with the message, and you should get the public key which in turns give you the address, cryptographically you can't get the validation from the message to be equal to the public key without the private key thus proving ownership.

You can understand more [here](https://medium.com/mycrypto/the-magic-of-digital-signatures-on-ethereum-98fe184dc9c7)

## How is the working flow?
1- User connect account
2- Server send a message with a token to the user
3- User sign the message, and send back the to the server the signing message with the token
4- Server first validate if the message it's legit using the token, and then validate the signature of the message. 
5- if the signature it's valid, server send back to the user a session token
6- User navigates in private routes using session token 

## Libraries used
- ethers
- JWT
- Tailwindcss 
