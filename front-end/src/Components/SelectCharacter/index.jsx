import React, {useEffect, useState} from 'react';
import './SelectCharacter.css';
import {ethers} from 'ethers';
import {contractAddress, transformCharacterData} from '../../constants';
import EpicNftGame from '../../utils/EpicNFTGame.json';
import LoadingIndicator from "../../Components/LoadingIndicator";
const SelectCharacter = ({setCharacterNFT}) => 
{
    const [characters, setCharacters] = useState([]);
    const [gameContract, setGameContract] = useState(null);
    const [mintingCharacter, setMintingCharacter] = useState(false);
  
    useEffect(() => {
      const {ethereum} = window;

      if(ethereum)
      {  
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const gameContract = new ethers.Contract(contractAddress, EpicNftGame.abi, signer);
        setGameContract(gameContract);
      }
      else
      {
        console.log("Ethereum object not found");
      }
    }, []);

    useEffect(() => {
      const getCharacters = async () => {
        try {
          console.log('Getting contract characters to mint');
    
          /*
           * Call contract to get all mint-able characters
           */
          const charactersTxn = await gameContract.getAllDefaultCharacters();
          console.log('charactersTxn:', charactersTxn);
    
          /*
           * Go through all of our characters and transform the data
           */
          const characters = charactersTxn.map((characterData) =>
            transformCharacterData(characterData)
          );
    
          /*
           * Set all mint-able characters in state
           */
          setCharacters(characters);
        } catch (error) {
          console.error('Something went wrong fetching characters:', error);
        }
      };

      const onCharacterMint = async(sender, tokenId, characterIndex) =>
        {
          console.log(`CharacterNFTMinted -sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`);
          
          if(gameContract)
          {
            const characterNFT = await gameContract.checkIfUserHasNFT();
            console.log("Character NFT is now: ", characterNFT);
            setCharacterNFT(transformCharacterData(characterNFT));
          }
        }
      /*
       * If our gameContract is ready, let's get characters!
       */
      if (gameContract) {
        getCharacters();
        gameContract.on('CharacterNFTMinted', onCharacterMint);
      }
      return () => {
        if(gameContract)
        {
          gameContract.off('CharacterNFTMinted', onCharacterMint);
        }
      }
    }, [gameContract]);
    
    const renderCharacters = () =>
      characters.map((character, index) => (
        <div className="character-item" key={character.name}>
          <div className="name-container">
            <p>{character.name}</p>
          </div>
          <img src={character.imageURI} alt={character.name}/>
          <button type="button" className="character-mint-button" onClick={()=>mintCharacterNFTAction(index)}>{`Mint ${character.name}`}</button>
        </div>
      ));
    
  const mintCharacterNFTAction = async (characterId) => {
  try {
    if(gameContract)
    {
      setMintingCharacter(true);
      console.log("Minting character");
      const mintCharacterTxn = await gameContract.mintCharacterNFT(characterId);
      await mintCharacterTxn.wait();
      console.log("Mint Txn:", mintCharacterTxn);
      alert(`Your NFT is all done -- see it here: https://testnets.opensea.io/assets/${contractAddress}/${tokenId.toNumber()}`)
      setMintingCharacter(false);
    }
  } catch (error) {
    console.warn("MintCharacterAction Error:", error);
    setMintingCharacter(false);
  }
};
  
  return(
    <div className="select-character-container">
      <h2>Mint Your Hero</h2>
      {characters.length > 0 && (<div className="character-grid">{renderCharacters()}</div>)}
      {mintingCharacter && (
        <div className="loading">
          <div className="indicator">
            <LoadingIndicator/>
            <p>Minting In Progress...</p>
          </div>
          <img src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
            alt="Minting loading indicator"
          />
        </div>  
      )}
    </div>
  );
};



export default SelectCharacter;