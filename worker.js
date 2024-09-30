var fs = require("fs");
const { ethers } = require("ethers");
var tries = 0, hits = 0;
const delay = time => new Promise(res => setTimeout(res, time));

// Load words from bip39.txt (make sure the file contains the BIP39 wordlist)
var words = fs.readFileSync("bip39.txt", { encoding: 'utf8', flag: 'r' })
    .replace(/(\r)/gm, "")  // Remove carriage returns
    .toLowerCase()  // Convert all words to lowercase
    .split("\n");  // Split the file content into an array of words

// Helper function to generate a random 12-word mnemonic
function generateMnemonic() {
  let mnemonic = "";
  for (let i = 0; i < 12; i++) {
    mnemonic += words[Math.floor(Math.random() * words.length)];
    if (i < 11) {
      mnemonic += " ";
    }
  }
  return mnemonic;
}

console.log("Starting...");

// Async function to generate wallet from mnemonic and log only the mnemonic and address
async function doCheck() {
  tries++;
  try {
    const mnemonic = generateMnemonic();  // Generate a random 12-word mnemonic
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);  // Create a wallet from the mnemonic

    // Log only the wallet address and mnemonic to ahits.txt (no private key)
    fs.appendFileSync('whale.txt', `${wallet.address}, ${mnemonic}\n`);
    hits++;
    process.stdout.write("+");  // Log success (wallet created)
    } catch (e) {
        // Handle any errors silently and move on
    }
    //console.log(mnemonic);
    await delay(0);
    
    process.stdout.write("-");
    
     // Prevent call stack overflow by adding a slight delay
     
    doCheck();  // Recursively call doCheck to keep generating mnemonics
}

// Start the process
doCheck();
