require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = 
{
  solidity: "0.8.1",
  networks: 
	{
	  rinkeby: 
		{
			url: 'https://eth-rinkeby.alchemyapi.io/v2/SXPjo1fIqyqBeAM3bQNbXL5wF67XxNgZ',
			accounts: ['713d572b7d0923218a20376ef34e202442644b10ee4f9327a19b0e6297c08bea'],
		},
	},
};
