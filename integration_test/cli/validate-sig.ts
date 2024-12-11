import { ed25519,loadCrypto, cborBackend,blake, bech32, CoseSign1, Ed25519Key } from "libcardano";
import * as fs from 'fs';
import { parse } from 'csv-parse';



type RowData = { [key: string]: string };

// Function to process each row
const processRow = async (row: RowData) => {
  const signature=row.signature
  const stakeAddress=row.walletAddress
  const vote=row.vote
  const message=row.message
  const publicKey = row.publicKey
  const txId = row.txId
  
  const userStakeAddress=bech32.decode(stakeAddress).data
  const userStakeKeyHash=userStakeAddress.subarray(1)

  // extract pub-key
  const signerPubKey : Buffer= cborBackend.decode(Buffer.from(publicKey,'hex')).get(-2)
  const signerPubKeyHash = blake.hash28(signerPubKey)

  // validate signature
  const cosign1=CoseSign1.fromBytes(Buffer.from(signature,'hex'))
  const isSignatureValid = await cosign1.verify(await Ed25519Key.fromPublicKey(signerPubKey))
  const isSignerSame = Buffer.compare(signerPubKeyHash,userStakeKeyHash)=== 0
  console.log("\nUser =",stakeAddress,"\nvote =",vote,"\nisValid =",isSignatureValid && isSignerSame,"sameSigner =",isSignerSame,"signatureValid =",isSignatureValid)

};

const readAndProcessCSV = async (filePath: string) => {
  return new Promise<void>((resolve, reject) => {
    const parser = fs
      .createReadStream(filePath)
      .pipe(
        parse({
          columns: true,
          skip_empty_lines: true,
        })
      );

    parser.on('data', async (row: RowData) => {
      await processRow(row);
    });

    parser.on('end', () => {
      console.log("Finished processing CSV file.");
      resolve();
    });

    parser.on('error', (err) => {
      console.error("Error reading CSV file:", err);
      reject(err);
    });

  });
};


// const file = process.argv[process.argv.length-1]
const filePath = './export.csv';

loadCrypto().then(async ()=>{
  return await readAndProcessCSV(filePath).catch((err) => {
    console.error("Error:", err);
  });
})

