import * as web3 from "@solana/web3.js";

export const SECRET = [48,94,163,75,125,167,37,186,99,172,218,55,115,47,207,161,225,244,13,52,186,136,56,161,12,201,131,153,35,139,105,176,204,25,224,73,185,238,107,68,240,170,192,158,58,99,193,135,163,76,243,235,147,10,7,19,45,24,159,10,148,60,249,57]; // your local private test-key. Try: $cat ~/.config/solana/id.json
export const PROGRAM_ID = "95hYnRjqzjNSq8Crg1A3o7KPt8zhVDW9d7cjBnAwJYe7"; // Whatever returned from solana deploy
export const KEY: Uint8Array = Uint8Array.from(SECRET);
export const programId = new web3.PublicKey(PROGRAM_ID);
export const SIGNER: web3.Keypair = web3.Keypair.fromSecretKey(KEY);
