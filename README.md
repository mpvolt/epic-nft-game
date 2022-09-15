NFT Game split into the smart contract code and the replit front end.

The replit front end can be uploaded to https://replit.com/ for easy deployment. No dependencies required
The smart contract code can be compiled with hardhat. To redeploy the smart contract, run node scripts/deploy.js after assigning a private key/alchemy api to hardhat_config.js


This project demonstrates a basic Hardhat use case. It comes with a contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
