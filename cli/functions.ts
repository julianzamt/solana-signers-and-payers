import * as web3 from '@solana/web3.js';
import { Buffer } from 'buffer';
import { programId, SIGNER } from './constants';
import * as utils from './utils';

export const createPDAs = async (
  connection: web3.Connection,
  firstCreationPayer: web3.Keypair,
  secondCreationPayer: web3.Keypair,
  feePayer: web3.Keypair = SIGNER
) => {
  let instructionNumber = 0;

  let dataBuffer = Buffer.from('');

  dataBuffer = utils.packUInt8(dataBuffer, instructionNumber);

  let [first_pda] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('first_pda'), firstCreationPayer.publicKey.toBuffer()],
    programId
  );

  let [second_pda] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('second_pda'), secondCreationPayer.publicKey.toBuffer()],
    programId
  );

  const instruction = new web3.TransactionInstruction({
    programId,
    keys: [
      { pubkey: first_pda, isSigner: false, isWritable: true },
      { pubkey: second_pda, isSigner: false, isWritable: true },
      {
        pubkey: firstCreationPayer.publicKey,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: secondCreationPayer.publicKey,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: web3.SystemProgram.programId,
        isSigner: false,
        isWritable: true,
      },
    ],
    data: dataBuffer,
  });

  let txReceipt = await web3.sendAndConfirmTransaction(
    connection,
    new web3.Transaction().add(instruction),
    [feePayer, firstCreationPayer, secondCreationPayer]
  );
  return txReceipt;
};
