import { NobleEd25519Signer } from "@farcaster/hub-nodejs";
import "dotenv/config";

function base64url(input: Buffer | Uint8Array) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export async function getAuthToken() {
  const APP_SIGNER_KEY = process.env.APP_SIGNER_KEY;
  const APP_FID = process.env.APP_FID;
  const APP_SIGNER_PUBKEY = process.env.APP_SIGNER_PUBKEY;
  const fid = Number(APP_FID);
  if (!APP_SIGNER_KEY || !APP_FID || !APP_SIGNER_PUBKEY) {
    throw new Error("Missing APP_SIGNER_KEY, APP_FID, or APP_SIGNER_PUBKEY");
  }

  const privateKey = APP_SIGNER_KEY;
  const publicKey = APP_SIGNER_PUBKEY;
  const signer = new NobleEd25519Signer(
    new Uint8Array(Buffer.from(privateKey, "hex"))
  );
  const header = {
    fid,
    type: "app_key",
    key: publicKey,
  };

  const encodedHeader = base64url(Buffer.from(JSON.stringify(header)));
  const payload = { exp: Math.floor(Date.now() / 1000) + 300 };
  const encodedPayload = base64url(Buffer.from(JSON.stringify(payload)));
  const toSign = Buffer.from(`${encodedHeader}.${encodedPayload}`, "utf-8");
  const signatureResult = await signer.signMessageHash(toSign);
  if (signatureResult.isErr()) {
    throw new Error("Failed to sign message");
  }
  const encodedSignature = base64url(signatureResult.value);

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

export async function listChannels() {
  const res = await fetch("https://api.farcaster.xyz/v2/all-channels");

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const data = await res.json();
  return data.result.channels;
}

export async function getChannel(channelId: string) {
  const res = await fetch(
    `https://api.farcaster.xyz/v1/channel?channelId=${encodeURIComponent(channelId)}`
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const data = await res.json();
  return data.result.channel;
}

export async function followChannel(
  authToken: string,
  channelId: string,
  follow: boolean = true
) {
  const method = follow ? "POST" : "DELETE";
  const res = await fetch("https://api.farcaster.xyz/fc/channel-follows", {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ channelId }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const data = await res.json();
  return data;
}

export async function inviteToChannel(
  authToken: string,
  channelId: string,
  fid: number
) {
  const res = await fetch("https://api.farcaster.xyz/fc/channel-invites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ channelId, inviteFid: fid, role: "member" }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const data = await res.json();
  return data;
}
