#!/usr/bin/env ts-node
import { sha512 } from "@noble/hashes/sha512";
import { mnemonicToAccount } from "viem/accounts";
import * as ed from "@noble/ed25519";
import * as qr from "qr";
import "dotenv/config";

const APP_FID = process.env.APP_FID;
const APP_MNEMONIC = process.env.APP_MNEMONIC;

if (!APP_FID || !APP_MNEMONIC) {
  console.error("Missing APP_FID or APP_MNEMONIC in .env");
  process.exit(1);
}

ed.etc.sha512Sync = sha512;

const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
  name: "Farcaster SignedKeyRequestValidator",
  version: "1",
  chainId: 10,
  verifyingContract: "0x00000000fc700472606ed4fa22623acf62c60553",
} as const;

const SIGNED_KEY_REQUEST_TYPE = [
  { name: "requestFid", type: "uint256" },
  { name: "key", type: "bytes" },
  { name: "deadline", type: "uint256" },
] as const;

async function main() {
  // 1. Generate Ed25519 keypair
  const privateKey = ed.utils.randomPrivateKey();
  const publicKeyBytes = await ed.getPublicKey(privateKey);
  const key = "0x" + Buffer.from(publicKeyBytes).toString("hex");

  // 2. Generate Signed Key Request signature
  const account = mnemonicToAccount(APP_MNEMONIC);
  const deadline = Math.floor(Date.now() / 1000) + 86400; // 24h
  const signature = await account.signTypedData({
    domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
    types: { SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE },
    primaryType: "SignedKeyRequest",
    message: {
      requestFid: BigInt(APP_FID),
      key,
      deadline: BigInt(deadline),
    },
  });

  // 3. POST to Farcaster API
  const farcasterClientApi = "https://api.farcaster.xyz";
  const res = await fetch(`${farcasterClientApi}/v2/signed-key-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key,
      requestFid: APP_FID,
      signature,
      deadline,
    }),
  });
  if (!res.ok) {
    console.error("Failed to create signed key request:", await res.text());
    process.exit(1);
  }
  const { result } = await res.json();
  const { token, deeplinkUrl } = result.signedKeyRequest;

  // 4. Display QR code
  const asciiQR = qr.encodeQR(deeplinkUrl, "term");
  console.log(asciiQR);
  console.log(
    "Scan this QR code with your Farcaster app, or open:",
    deeplinkUrl
  );

  // 5. Poll for completion
  while (true) {
    await new Promise((r) => setTimeout(r, 2000));
    const pollRes = await fetch(
      `${farcasterClientApi}/v2/signed-key-request?token=${encodeURIComponent(token)}`
    );
    if (!pollRes.ok) {
      console.error("Polling failed:", await pollRes.text());
      continue;
    }
    const pollData = await pollRes.json();
    const state = pollData.result.signedKeyRequest.state;
    if (state === "completed") {
      console.log("Signer registered onchain!");
      console.log(
        "Ed25519 private key (hex):",
        Buffer.from(privateKey).toString("hex")
      );
      console.log("userFid:", pollData.result.signedKeyRequest.userFid);
      break;
    } else {
      console.log(
        "Waiting for user to complete signer request... (state:",
        state,
        ")"
      );
    }
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
