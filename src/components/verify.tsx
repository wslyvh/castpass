"use client";

import { useState } from "react";
import zkeSDK, { Proof } from "@zk-email/sdk";
import { domainChannelsData, Channel } from "../data/domain-channels";

export function VerifyEmail() {
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [proof, setProof] = useState<Proof | null>(null);
  const [availableChannels, setAvailableChannels] = useState<Channel[]>([]);

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setAlert(null);
    setProof(null);
    setAvailableChannels([]);

    try {
      const eml = await file.text();
      const sdk = zkeSDK();
      const blueprint = await sdk.getBlueprint("wslyvh/Org_Email@v1");
      const prover = blueprint.createProver();
      const proof = await prover.generateProof(eml);
      console.log("proof", proof);

      setProof(proof);
      setAlert({ type: "success", message: "Proof generated successfully!" });

      const verification = await blueprint.verifyProof(proof);
      console.log("verification", verification);
      
      if (verification) {
        setAlert({
          type: "success",
          message: "Proof verified!"
        });

        // Check for available channels based on verified domain
        const verifiedDomain = proof.props.publicData?.domain;
        if (verifiedDomain) {
          const channels = domainChannelsData[verifiedDomain] || [];
          setAvailableChannels(channels);
        }
      } else {
        setAlert({
          type: "error",
          message: "Proof verification failed."
        });
      }
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error?.message || "Error generating proof.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Verify Email address</h2>
      <input
        type="file"
        accept=".eml"
        className="file-input w-full"
        onChange={handleFileUpload}
        disabled={loading}
      />
      {loading && <p>Generating proof...</p>}
      {alert && (
        <div className="mt-4">
          <div className={`alert alert-${alert.type}`}>
            <span>{alert.message}</span>
          </div>
        </div>
      )}

      {/* Available Channels Section */}
      {availableChannels.length > 0 && (
        <div className="mt-6 p-4 border rounded-lg bg-green-50">
          <h3 className="text-xl font-bold mb-3">🎉 Available Channels</h3>
          <p className="text-gray-600 mb-4">
            Based on your verified domain ({proof?.props.publicData?.domain}), you can join these Farcaster channels:
          </p>
          <div className="space-y-3">
            {availableChannels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                <div>
                  <h4 className="font-semibold">/{channel.id}</h4>
                  <p className="text-sm text-gray-600">{channel.description}</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Join Channel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {proof && (
        <div className="mt-4 flex flex-col gap-2">
          <h3 className="font-bold">Proof Generated:</h3>
          <pre className="overflow-x-auto bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(proof.props.proofData, null, 2)}
          </pre>

          <h3 className="font-bold">Public outputs</h3>
          <pre className="overflow-x-auto bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(proof.props.publicData, null, 2)}
          </pre>

          <h3 className="font-bold">Domain</h3>
          <p>{proof.props.publicData?.domain}</p>
        </div>
      )}
    </div>
  );
}