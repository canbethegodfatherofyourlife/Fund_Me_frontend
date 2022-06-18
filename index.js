import { ethers } from './ethers-5.6.esm.min.js'
import { abi,contractAddress } from './constants.js'

const connectButton = document.getElementById('connectButton')
const fundButton = document.getElementById('fundButton')
const balanceButton = document.getElementById('balanceButton')
const withdrawButton = document.getElementById('withdrawButton')
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    if(typeof window.ethereum !== "undefined"){
        await window.ethereum.request({method: "eth_requestAccounts"})
        connectButton.innerHTML = "Connected"
    }else{
        connectButton.innerHTML = "Please install metamask"
    }
}

// fund function

async function getBalance() {
    if(typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function fund(){
    const ethAmount = document.getElementById('ethAmount').value
    console.log(`Funding with ${ethAmount}`);
    if(typeof window.ethereum !== "undefined"){
        // connection to the blockchain 
        // signer/ wallet / someone with gas 
        // contract that we are interacting with 
        
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress,abi,signer)
        // here we need to be connected to the localhost or else, we get error on clicking "Fund" button
        try{
            const transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)})
            // listen for the tx to be mined 
            await listenForTransactionMine(transactionResponse,provider)
            console.log("Done!")
        } 
        catch (e) {
            console.log(e)
        }

    }
}

function listenForTransactionMine(transactionResponse,provider){
    console.log(`Mining ${transactionResponse.hash}...`)
    // return new Promise()
    // listen for this transaction to finish

    return new Promise((resolve, reject) =>{
        provider.once(transactionResponse.hash,(transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
            resolve()
        })
    })
}

// withdraw

async function withdraw() {
    if(typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress,abi,signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse,provider)
        } catch (error) {
            console.log(error)
        }
       
    }
}