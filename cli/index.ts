import * as web3 from '@solana/web3.js';
import { createPDAs } from './functions';

const connection = new web3.Connection('http://127.0.0.1:8899');

async function main() {
  let firstCreationPayer = web3.Keypair.generate();
  let secondCreationPayer = web3.Keypair.generate();

  let txhash = await connection.requestAirdrop(
    firstCreationPayer.publicKey,
    1e9
  );

  let blockHash = await connection.getLatestBlockhashAndContext();

  await connection.confirmTransaction({
    blockhash: blockHash.value.blockhash,
    lastValidBlockHeight: blockHash.value.lastValidBlockHeight,
    signature: txhash,
  });

  txhash = await connection.requestAirdrop(
    secondCreationPayer.publicKey,
    1e9
  );

  blockHash = await connection.getLatestBlockhashAndContext();

  await connection.confirmTransaction({
    blockhash: blockHash.value.blockhash,
    lastValidBlockHeight: blockHash.value.lastValidBlockHeight,
    signature: txhash,
  });

  await createPDAs(connection, firstCreationPayer, secondCreationPayer);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
