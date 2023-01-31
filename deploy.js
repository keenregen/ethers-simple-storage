// solidity is synchronous (line by line generally)
// js is async
// // promise in async technique : pending, fullfilled, rejected

// dependencies
const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

// aync function main() {}
const main = async () => {
  // endpoint to connect: http://...
  const provider = new ethers.providers.JsonRpcProvider(process.env.rpcPoint);

  const wallet = new ethers.Wallet(process.env.privateKey, provider);

  const abi = fs.readFileSync("SimpleStorage_sol_SimpleStorage.abi", "utf8");

  const binary = fs.readFileSync("SimpleStorage_sol_SimpleStorage.bin", "utf8");

  // deploying a contract
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, be patient.");
  const contract = await contractFactory.deploy();
  const receipt = await contract.deployTransaction.wait();

  // interacting with contract
  // retrieve the current fav num
  let currentFavNum = await contract.retrieve();
  console.log(`Current Fav Number: ${currentFavNum.toString()}`);
  // store a new fav num
  const storeResp = await contract.store("33");
  const receipt2 = await storeResp.wait("1");
  currentFavNum = await contract.retrieve();
  console.log(`The Fav Number now: ${currentFavNum.toString()}`);
};

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
