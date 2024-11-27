import {
  BigNum,
  COSEKey,
  COSESign1,
  Int,
  Label,
} from '@emurgo/cardano-message-signing-nodejs';
import {
  Ed25519Signature,
  PublicKey,
} from '@emurgo/cardano-serialization-lib-nodejs';
import * as Sentry from '@sentry/nextjs';
import blake from 'blakejs';

import { deriveStakeAddressFromPublicKey } from '@/lib/deriveStakeAddressFromPublicKey';
import { verifyChallenge } from '@/lib/verifyChallenge';

/**
 * Verifies wallet ownership on the BE
 * @param originalPayload - Text content of message that was signed
 * @param signedMessage - Signed message object from wallet
 * @param challenge - Challenge from the BE
 * @param stakeAddress - Stake address of the user
 * @returns true if wallet ownership is verified, false if not
 */
export const verifyWallet = async (
  originalPayload: string,
  signedMessage: {
    signature: string;
    key: string;
  },
  challenge: string,
  stakeAddress: string,
): Promise<boolean> => {
  try {
    const challengeValid = await verifyChallenge(challenge);
    if (!challengeValid) return false;
    const decoded = COSESign1.from_bytes(
      Buffer.from(signedMessage.signature, 'hex'),
    );
    const key = COSEKey.from_bytes(Buffer.from(signedMessage.key, 'hex'));
    const pubKeyBytes = key
      .header(Label.new_int(Int.new_negative(BigNum.from_str('2'))))
      ?.as_bytes();
    const publicKey = pubKeyBytes ? PublicKey.from_bytes(pubKeyBytes) : null;

    if (!publicKey) return false;

    // Ensure that the derived stake address from the signature matches the stake address from the session
    const derivedStakeAddress = deriveStakeAddressFromPublicKey(publicKey);
    if (derivedStakeAddress !== stakeAddress) return false;

    const payload = decoded.payload();
    const signature = Ed25519Signature.from_bytes(decoded.signature());
    const receivedData = decoded.signed_data().to_bytes();

    const utf8Payload = payload ? Buffer.from(payload).toString('utf8') : '';
    // const expectedPayload = `account: ${signerStakeAddrBech32}`; // reconstructed message

    // verify:
    const isVerified = publicKey?.verify(receivedData, signature);
    let payloadAsExpected = utf8Payload == originalPayload;

    // verify challenge is the same that was passed in, challenge is after :
    const signatureWords = utf8Payload.split(' ');
    const payloadChallenge = signatureWords[signatureWords.length - 1];
    const challengeAsExpected = payloadChallenge == challenge;

    // Some wallets may hash the payload before signing it (e.g. eternl). Some wallets may not hash the payload before signing it (e.g. Lace).
    // The above check is for the case where the payload is not hashed before signing.
    // If the payload does not match, then we hash the payload and compare the hash.
    if (!payloadAsExpected) {
      // Convert the string to a Uint8Array
      const originalPayloadUInt8Array = new TextEncoder().encode(
        originalPayload,
      );
      // Hash using BLAKE2b-224
      const originalPayloadHash = blake.blake2b(
        originalPayloadUInt8Array,
        undefined,
        28,
      );
      // Convert the result to a hex string
      const originalPayloadHashHex =
        Buffer.from(originalPayloadHash).toString('hex');
      // Convert the decoded payload to a hex string
      const decodedPayloadHashHex = payload
        ? Buffer.from(payload).toString('hex')
        : '';
      payloadAsExpected = originalPayloadHashHex == decodedPayloadHashHex;
    }

    const isAuthSuccess =
      isVerified && payloadAsExpected && challengeAsExpected;

    return isAuthSuccess === true;
  } catch (err) {
    Sentry.captureException(err);
    return false;
  }
};
