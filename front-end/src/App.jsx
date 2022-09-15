import React, {useState, useEffect} from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import SelectCharacter from './Components/SelectCharacter';
import {contractAddress, transformCharacterData} from './constants'
import EpicNftGame from './utils/EpicNFTGame.json';
// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
import {ethers} from 'ethers';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';
const App = () => {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const checkIfWalletIsConnected = async() =>
  {
    try{
      const {ethereum} = window;
      if(ethereum)
      {
        console.log("Metamask found", ethereum);
      }
      else
      {
        console.log("No metamask found");
        setIsLoading(false);
        return;
      }
  
      const accounts = await ethereum.request({method: "eth_accounts"});
      if(accounts.length !== 0)
      {
        setCurrentAccount(accounts[0]);
        console.log("Set as account:", accounts[0]);
      }
      else
      {
        console.log("No accounts found");
      }
      return;
    }
    catch(error){
      console.log(error);
    }
    setIsLoading(false);
  };

  const checkNetwork = async() => 
  {
    try{
      if(window.ethereum.networkVersion !== '4')
      {
        alert("Your are current not on the Rinkeby network, Please switch to Rinekby to use this site!")
      }
    }
    catch(error)
    {
      console.log(error);
    }
  }
  
  
  const renderContent = () => {
    if(isLoading)
    {
      return <LoadingIndicator/>
    }
    if(!currentAccount)
    {
      return(
        <div className="connect-wallet-container">
            <img
              src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
              alt="Monty Python Gif"
            />
            
            <button className="cta-button connect-wallet-button" onClick ={connectWallet}>Connect Wallet to Start Playing</button>
          
        </div>
        );
    }
    else if(currentAccount && !characterNFT)
    {
      return <SelectCharacter setCharacterNFT={setCharacterNFT}/>
    }
    else if(currentAccount && characterNFT)
    {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT}/>
    }
  };

  const connectWallet = async() =>
  {
    try
    {
        const {ethereum} = window;
        if(ethereum)
        {
          console.log("Metamask found", ethereum);
        }
        else
        {
          console.log("No metamask found");
          return
        }
        const accounts = await ethereum.request({method: "eth_requestAccounts"});
    
        setCurrentAccount(accounts[0]);
        console.log("Connected", accounts[0]);
    }
    catch(error){
      console.log(error);
    }
  };
  
  useEffect(() => 
    {
      setIsLoading(true);
      checkIfWalletIsConnected();
    }, []);
  useEffect(() => {checkNetwork();}, []);
  
 useEffect(() => {
  /*
   * The function we will call that interacts with out smart contract
   */
  const fetchNFTMetadata = async () => {
    console.log('Checking for Character NFT on address:', currentAccount);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      contractAddress,
      EpicNftGame.abi,
      signer
    );

    const txn = await gameContract.checkIfUserHasNft();
    if (txn.name) {
      console.log('User has character NFT');
      setCharacterNFT(transformCharacterData(txn));
    } else {
      console.log('No character NFT found');
    }
    setIsLoading(false);
  };

  /*
   * We only want to run this, if we have a connected wallet
   */
  if (currentAccount) {
    console.log('CurrentAccount:', currentAccount);
    fetchNFTMetadata();
  }
}, [currentAccount]);
  
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p> 
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
