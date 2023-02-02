import React, { useEffect } from 'react';
import { useState } from 'react';
import Web3 from 'web3';
import contractABI1 from './utils/abi_contract_1';
import contractAddress from './utils/contract1';
import contractABI2 from './utils/abi_contract_2';
import contractAddress1 from './utils/contract2';


function App() {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");
  const [docCount, setdocCount] = useState(null);
  const [owner, setOwner] = useState("");
  const [verified, setVerified] = useState(false);
  const [signer, setSigner] = useState("");


  useEffect(() => {
    async function connectToWallet() {
      // Check if the user has a web3-enabled browser
      if (window.ethereum) {
        // Connect to the user's wallet
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        // Use the web3 object to interact with the blockchain
        // ...
        web3.eth.getAccounts().then(accounts => {
          if (accounts.length > 0) {
            console.log('Web3 successfully connected to wallet.');
          } else {
            console.log('Web3 not connected to wallet.');
          }
        }).catch(error => {
          console.log(error);
        });
      } else {
        // Show an error message if the user does not have a web3-enabled browser
        console.error('Please install MetaMask or use a web3-enabled browser.');
      }
    }
    connectToWallet();
  }, []);

  function handleFileUpload(event) {
    setFile(event.target.files[0]);
  }

  async function handleHashConversion() {
      setOwner("");
      setVerified(false);
      setSigner("");
      if (!file) {
          console.log("No file selected");
          return;
      }

      const web3 = new Web3("http://localhost:8545");
      web3.eth.getAccounts().then((accounts) => {
      console.log(accounts);
    });

      const reader = new FileReader();
      reader.onloadend = async () => {
          const fileData = new Uint8Array(reader.result);
          const hashBuffer = await window.crypto.subtle.digest('SHA-256', fileData);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          const hashBytes32 = "0x" + hashHex.padEnd(64, '0');
          setHash(hashBytes32);
          console.log("File Hash:", hashBytes32);
      }
      reader.readAsArrayBuffer(file);
  }

  async function handleAddDocument(documentHash){
    
    // eslint-disable-next-line
    const web3 = new Web3("http://localhost:8545");
    // eslint-disable-next-line
    const contract =await new web3.eth.Contract(contractABI1, contractAddress);
    //eslint-disable-next-line
    const accounts = await web3.eth.getAccounts();

// Ask the user to select an account
  const selectedAccount = window.prompt(
  'Please select an account to use for the transaction',
  `Available accounts: ${accounts.join(', ')}\nEnter the index of the account to use (0-${accounts.length - 1}):`
);

// Get the selected account
const selectedAccountIndex = parseInt(selectedAccount, 10);
const selectedAddress = accounts[selectedAccountIndex];
    contract.methods.addDocument(hash).send({from: selectedAddress})
  .then(receipt => {
    console.log(receipt);
  })
  .catch(error => {
    console.log(error);
});
  
  }

  async function handleVerifyDocument(documentHash){
    
    
    // eslint-disable-next-line
    const web3 = new Web3("http://localhost:8545");
    // eslint-disable-next-line
    const contract =await new web3.eth.Contract(contractABI1, contractAddress);
    //eslint-disable-next-line
    const accounts = await web3.eth.getAccounts();

// Ask the user to select an account
  const selectedAccount = window.prompt(
  'Please select an account to use for the transaction',
  `Available accounts: ${accounts.join(', ')}\nEnter the index of the account to use (0-${accounts.length - 1}):`
);

// Get the selected account
const selectedAccountIndex = parseInt(selectedAccount, 10);
const selectedAddress = accounts[selectedAccountIndex];
    contract.methods.verifyDocument(hash).send({from: selectedAddress})
  .then(receipt => {
    console.log(receipt);
  })
  .catch(error => {
    console.log(error);
});
  
  }
  
  async function handleDocumentCount(documentHash){
    
    
    // eslint-disable-next-line
    const web3 = new Web3("http://localhost:8545");
    // eslint-disable-next-line
    const contract =await new web3.eth.Contract(contractABI1, contractAddress);
    //eslint-disable-next-line
    const accounts = await web3.eth.getAccounts();


contract.methods.getNumberOfDocuments().call().then(function(result) {
  setdocCount(result);
});
  
  }


  async function handleDocumentDetails(documentHash){
    
    
    // eslint-disable-next-line
    const web3 = new Web3("http://localhost:8545");
    // eslint-disable-next-line
    const contract =await new web3.eth.Contract(contractABI1, contractAddress);
    //eslint-disable-next-line
    const accounts = await web3.eth.getAccounts();

// Get the selected account
contract.methods.getDocument(hash).call().then(function(result) {
  setOwner(result[1]);
  setVerified(String(result[2])); 
});
  window.alert("Retrieved document details");
  }


  async function handleSigning(documentHash){
    
    
    // eslint-disable-next-line
    const web3 = new Web3("http://localhost:8545");
    // eslint-disable-next-line
    const contract =await new web3.eth.Contract(contractABI2, contractAddress1);
    //eslint-disable-next-line
    const accounts = await web3.eth.getAccounts();

// Ask the user to select an account
  const selectedAccount = window.prompt(
  'Please select an account to use for the transaction',
  `Available accounts: ${accounts.join(', ')}\nEnter the index of the account to use (0-${accounts.length - 1}):`
);

// Get the selected account
const selectedAccountIndex = parseInt(selectedAccount, 10);
const selectedAddress = accounts[selectedAccountIndex];
    contract.methods.signDocument(hash).send({from: selectedAddress})
  .then(receipt => {
    console.log(receipt);
  })
  .catch(error => {
    console.log(error);
});
  
  }


  async function handleGetSigner(documentHash){
    
    
    // eslint-disable-next-line
    const web3 = new Web3("http://localhost:8545");
    // eslint-disable-next-line
    const contract =await new web3.eth.Contract(contractABI2, contractAddress1);
    //eslint-disable-next-line
    const accounts = await web3.eth.getAccounts();

// Get the selected account
contract.methods.getSigner(hash).call().then(function(result) {
  setSigner(result);
});
  window.alert("Retrieved document details");
  }

  return (
    <div>
            <input type="file" onChange={handleFileUpload} />
            <button onClick={handleHashConversion}>Convert to Hash</button>
            {hash && <p>Hash: {hash}</p>}
            <button onClick={() => handleAddDocument({hash})}>Add document hash</button>
            <button onClick={() => handleVerifyDocument({hash})}>Verify document hash</button>
            <button onClick={() => handleDocumentCount({hash})}>Document count</button>
            {docCount && <p>Number of documents on chain: {docCount}</p>}
            <button onClick={() => handleDocumentDetails({hash})}>Document details</button>
            {owner && <p>Owner: {owner}</p>}
            {verified && <p>Verified status: {verified}</p>}
            <button onClick={handleSigning}>Sign</button>
            <button onClick={handleGetSigner}>Get signers</button>
            {signer && <p>Signer: {signer}</p>}
    </div>
  );
}

export default App;
 
