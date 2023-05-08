# Solana Signers And Fee Payers
This is a research program to test out what type of accounts can or cannot be used as payers in an account creation in a Solana program.

It tests with a SystemAccount different than the fee payer, and with an account owned by caller the program.

Spoiler: It is possible to use a different payer than the feePayer, but is not possible to pay for account creation with an account owned by a custom program.

Side effects of this research: When trying to create an account with a custom program owned account, there are two different possible errors:
- if data.len = 0, `instruction spent from the balance of an account it does not own`
- if data.len > 0, `'Transfer: 'from' must not carry data'`


## Usage
Pre-Requirements:
* solana cli
* nodeJS

### From the root folder:
1 - cd program-as-payer/cli && npm install && cd ../..
2 - solana-test-validator -r (This will start a local validator)  

### In another terminal:
3 - `cd payers/ && cargo build-sbf && solana program deploy target/deploy/payers.so --url localhost && cd ..`  
4 - Paste the returned programId into the PROGRAM_ID field in payers/cli/constants.ts   
5 - In program-as-payer/cli/constants.ts, insert your test private key. Try: $cat ~/.config/solana/id.json (If you don't have one yet, run `solana-keygen new` first)  
6 - Open payers/cli/index.ts. You'll find function calls to send txs to the deployed contracts.  
7 - Comment and uncomment fns to have a taste of what you can and cannot do.  