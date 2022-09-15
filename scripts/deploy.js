const hre = require("hardhat");

const main = async() => {

	const epicNftGame = await hre.ethers.getContractFactory("EpicNftGame");
	const signer = await hre.ethers.getSigner();
	const epicNftGameContract = await epicNftGame.deploy(["Shadow the Hedgehog", "Sly Cooper", "Tanjiro"],       // Names
	    ["https://cloudflare-ipfs.com/ipfs/Qmc5FVWtFCrjDg1oqHETmiyZcCKURs252cMCvVxN1q2ZAj", // Alternative: https://i.imgur.com/U0jEdnq.png
	    "https://cloudflare-ipfs.com/ipfs/QmW3A8EwhBwWjQd4cgqn7MNVPDW74i1ZLoR3hYUMiMHTEm", 
	    "https://cloudflare-ipfs.com/ipfs/QmVrjpYkqphG3K84ABfdVkyXmhF2a2sM3dYjwASXaJULMV"],
	    [100, 50, 300],                    // HP values
	    [150, 175, 75],
		"Thanos", // Boss name
		"https://cloudflare-ipfs.com/ipfs/QmVENDsr79RXyU1M5iVBpxg6MCv5CYHPwJHHXU3BPme7FC", // Boss image
		10000, // Boss hp
		50 // Boss attack damage
		);

	await epicNftGameContract.deployed();
	console.log("Contract Deployed!");
	console.log("Contract address: ", epicNftGameContract.address);
	console.log("Deployed by: ", signer.address);	
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
