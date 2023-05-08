import * as web3 from "@solana/web3.js";

export const SECRET = []; // your local private test-key. Try: $cat ~/.config/solana/id.json
export const PROGRAM_ID = ""; // Whatever returned from solana deploy
export const KEY: Uint8Array = Uint8Array.from(SECRET);
export const programId = new web3.PublicKey(PROGRAM_ID);
export const SIGNER: web3.Keypair = web3.Keypair.fromSecretKey(KEY);
