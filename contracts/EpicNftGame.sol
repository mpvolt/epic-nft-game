pragma solidity ^0.8.0;
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./libraries/Base64.sol";
contract EpicNftGame is ERC721{
	

	struct CharacterAttributes
	{
		uint characterIndex;
		string name;
		string imageURI;
		uint hp;
		uint maxHp;
		uint attackDamage;
	}

	struct BigBoss
	{
		string name;
		string imageURI;
		uint hp;
		uint maxHp;
		uint attackDamage;
	}

	BigBoss public bigBoss;

	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;

	event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
	event AttackComplete(uint newBossHp, uint newPlayerHp);

	CharacterAttributes[] defaultCharacters;

	mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

	mapping(address => uint256) public nftHolders;


	constructor(string[] memory characterNames, string[] memory characterImageURIs, uint[] memory characterHp, uint[] memory characterAttackDamage, string memory bossName, string memory bossURI, uint bossHp, uint bossAttackDamage) ERC721("Heroes", "HERO")
	{

		for(uint i  = 0; i < characterNames.length; i += 1)
		{	
			defaultCharacters.push(CharacterAttributes({ characterIndex: i, name: characterNames[i], imageURI: characterImageURIs[i], hp: characterHp[i], maxHp: characterHp[i], attackDamage: characterAttackDamage[i]}));
		
			CharacterAttributes memory c = defaultCharacters[i];
			console.log("Minted %s with HP %s, img %s", c.name, c.hp, c.imageURI);

		}

		bigBoss = BigBoss({
			name: bossName,
			imageURI: bossURI,
			hp: bossHp,
			maxHp: bossHp,
			attackDamage: bossAttackDamage
		});
		console.log("Initialized Boss %s with %s hp, img %s", bossName, bossHp, bossURI);

		_tokenIds.increment();
		
	}

	function tokenURI(uint256 _tokenId) public view override returns (string memory)
	{
		CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];

		string memory strHp = Strings.toString(charAttributes.hp);
		string memory strMaxHp = Strings.toString(charAttributes.maxHp);
		string memory strAttackDmg = Strings.toString(charAttributes.attackDamage);

		string memory json = Base64.encode(abi.encodePacked(
			'{"name":"', charAttributes.name, ' --NFT #:', Strings.toString(_tokenId), '",',
			'"description": "This NFT can be used to play Matts Epic NFT Game",',
			'"image": "', charAttributes.imageURI, '",',
			'"attributes": [{ "trait_type": "Health Points", "value": ', strHp, ', "max_value":', strMaxHp,'}, { "trait_type": "Attack Damage", "value": ', strAttackDmg,'}]}'));
	
		string memory output = string(abi.encodePacked("data:application/json;base64,", json));

		return output;
	}

	function mintCharacterNFT(uint _characterIndex) external 
	{
		uint256 newItemId = _tokenIds.current();

		_mint(msg.sender, newItemId);

		nftHolderAttributes[newItemId] = CharacterAttributes({characterIndex: _characterIndex, name: defaultCharacters[_characterIndex].name, imageURI: defaultCharacters[_characterIndex].imageURI, hp: defaultCharacters[_characterIndex].hp, maxHp: defaultCharacters[_characterIndex].maxHp, attackDamage: defaultCharacters[_characterIndex].attackDamage});
		console.log("Minted NFT with tokenId %s and characterIndex %s", newItemId, _characterIndex);

		nftHolders[msg.sender] = newItemId;

		_tokenIds.increment();
		emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
	}

	function attackBoss() public{
		uint256 playerTokenId = nftHolders[msg.sender];
		CharacterAttributes storage player = nftHolderAttributes[playerTokenId];
		require(player.hp > 0, "Error: character must have health to attack boss");
		require(bigBoss.hp > 0, "Error: Boss is already dead");
		console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
 		console.log("Boss %s has %s HP and %s AD", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);

		if(bigBoss.hp < player.attackDamage)
		{
			bigBoss.hp = 0;
		}
		else 
		{
			bigBoss.hp = bigBoss.hp - player.attackDamage;
		}

		if(player.hp < bigBoss.attackDamage)
		{
			player.hp = 0;
		}
		else 
		{
			player.hp = player.hp - bigBoss.attackDamage;
		}

		console.log("Player attacked boss. New boss hp: %s", bigBoss.hp);
  		console.log("Boss attacked player. New player hp: %s\n", player.hp);
		emit AttackComplete(bigBoss.hp, player.hp);
	}

	function getAllDefaultCharacters() public view returns (CharacterAttributes[] memory)
	{
		return defaultCharacters;
	}

	function getBigBoss() public view returns (BigBoss memory)
	{
		return bigBoss;
	}

	function checkIfUserHasNft() public view returns (CharacterAttributes memory){
		uint256 userNftTokenId = nftHolders[msg.sender];
		if(userNftTokenId > 0){
			return nftHolderAttributes[userNftTokenId];
		}
		else {
			CharacterAttributes memory emptyStruct;
	
			return emptyStruct;

		}
	}

}
