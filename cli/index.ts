import * as web3 from '@solana/web3.js';
import {
  createPDAWithOwnedAccNotFeePayer,
  createPDAWithSystemAccNotFeePayer,
} from './functions';
import { SIGNER, programId } from './constants';

const connection = new web3.Connection('http://127.0.0.1:8899');

async function main() {
  let systemAccCreationPayer = web3.Keypair.generate();

  let txhash = await connection.requestAirdrop(
    systemAccCreationPayer.publicKey,
    1e9
  );

  let blockHash = await connection.getLatestBlockhashAndContext();

  await connection.confirmTransaction({
    blockhash: blockHash.value.blockhash,
    lastValidBlockHeight: blockHash.value.lastValidBlockHeight,
    signature: txhash,
  });

  await createPDAWithSystemAccNotFeePayer(connection, systemAccCreationPayer);

  console.log('Creating owned account...');
  let ownedAccCreationPayer = web3.Keypair.generate();

  console.log('pubkey: ', ownedAccCreationPayer.publicKey.toBase58());

  let space = 1;

  const rentExemptionAmount =
    await connection.getMinimumBalanceForRentExemption(space);

  const createAccountParams = {
    fromPubkey: SIGNER.publicKey,
    newAccountPubkey: ownedAccCreationPayer.publicKey,
    lamports: rentExemptionAmount,
    space,
    programId: programId,
  };

  const createAccountTransaction = new web3.Transaction().add(
    web3.SystemProgram.createAccount(createAccountParams)
  );

  await web3.sendAndConfirmTransaction(connection, createAccountTransaction, [
    SIGNER,
    ownedAccCreationPayer,
  ]);

  console.log('Airdropping owned account...');

  txhash = await connection.requestAirdrop(
    ownedAccCreationPayer.publicKey,
    1e9
  );

  blockHash = await connection.getLatestBlockhashAndContext();

  await connection.confirmTransaction({
    blockhash: blockHash.value.blockhash,
    lastValidBlockHeight: blockHash.value.lastValidBlockHeight,
    signature: txhash,
  });

  await createPDAWithOwnedAccNotFeePayer(connection, ownedAccCreationPayer);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
