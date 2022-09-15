const hre = require("hardhat");

const main = async() => {

	const epicNftGame = await hre.ethers.getContractFactory("EpicNftGame");
	const signer = await hre.ethers.getSigner();
	const epicNftGameContract = await epicNftGame.deploy(["Shadow the Hedgehog", "Sly Cooper", "Tanjiro"],       // Names
	    ["ipfs://Qmc5FVWtFCrjDg1oqHETmiyZcCKURs252cMCvVxN1q2ZAj", // Alternative: https://i.imgur.com/U0jEdnq.png
	    "ipfs://QmW3A8EwhBwWjQd4cgqn7MNVPDW74i1ZLoR3hYUMiMHTEm", 
	    "ipfs://QmVrjpYkqphG3K84ABfdVkyXmhF2a2sM3dYjwASXaJULMV"],
	    [100, 50, 300],                    // HP values
	    [150, 175, 75],
		"Thanos", // Boss name
		"ipfs://QmVENDsr79RXyU1M5iVBpxg6MCv5CYHPwJHHXU3BPme7FCr", // Boss image
		10000, // Boss hp
		50 // Boss attack damage
		);

	await epicNftGameContract.deployed();
	console.log("Contract Deployed!");
	console.log("Contract address: ", epicNftGameContract.address);
	console.log("Deployed by: ", signer.address);	

	let nftTx = await epicNftGameContract.mintCharacterNFT(2);
	await nftTx.wait();
	console.log("Minted NFT #2");

	let nftTx2 = await epicNftGameContract.mintCharacterNFT(1);
	await nftTx2.wait();
	console.log("Minted NFT #1");


	let nftTx3 = await epicNftGameContract.mintCharacterNFT(0);
	await nftTx3.wait();
	console.log("Minted NFT #0");

	let attackTx = await epicNftGameContract.attackBoss();
	await attackTx.wait();
	console.log("Attacked Boss");

};

const runMain = async() => {
	try{
		await main();
		process.exit(0);
	}
	catch (error){
		console.log(error);
		process.exit(1);
	}

};

runMain();
