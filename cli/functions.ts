import * as web3 from '@solana/web3.js';
import { Buffer } from 'buffer';
import { programId, SIGNER } from './constants';
import * as utils from './utils';

export const createPDAWithSystemAccNotFeePayer = async (
  connection: web3.Connection,
  creationPayer: web3.Keypair,
  feePayer: web3.Keypair = SIGNER
) => {
  let instructionNumber = 0;

  let dataBuffer = Buffer.from('');

  dataBuffer = utils.packUInt8(dataBuffer, instructionNumber);

  let [pda] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('pda_sys_acc'), creationPayer.publicKey.toBuffer()],
    programId
  );

  const instruction = new web3.TransactionInstruction({
    programId,
    keys: [
      { pubkey: pda, isSigner: false, isWritable: true },
      {
        pubkey: creationPayer.publicKey,
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
    [feePayer, creationPayer]
  );
  return txReceipt;
};

export const createPDAWithOwnedAccNotFeePayer = async (
  connection: web3.Connection,
  creationPayer: web3.Keypair,
  feePayer: web3.Keypair = SIGNER
) => {
  let instructionNumber = 1;

  let dataBuffer = Buffer.from('');

  dataBuffer = utils.packUInt8(dataBuffer, instructionNumber);

  let [pda] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('pda_owned_acc'), creationPayer.publicKey.toBuffer()],
    programId
  );

  const instruction = new web3.TransactionInstruction({
    programId,
    keys: [
      { pubkey: pda, isSigner: false, isWritable: true },
      {
        pubkey: creationPayer.publicKey,
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
    [feePayer, creationPayer]
  );
  return txReceipt;
};
