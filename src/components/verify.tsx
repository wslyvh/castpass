"use client";

import { useState } from "react";
import zkeSDK, { Proof } from "@zk-email/sdk";

export function VerifyEmail() {
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [proof, setProof] = useState<Proof | null>(null);

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setAlert(null);
    setProof(null);

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
      setAlert({
        type: verification ? "success" : "error",
        message: verification
          ? "Proof verified!"
          : "Proof verification failed.",
      });
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
