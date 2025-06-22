"use client";

import { useEffect, useState } from "react";
import zkeSDK, { Proof } from "@zk-email/sdk";
import { DomainChannels } from "@/utils/channels";
import { useFarcasterChannels } from "@/hooks/useFarcasterChannels";
import { useFarcasterAccount } from "@/hooks/useFarcasterAccount";

export function VerifyEmail() {
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [proof, setProof] = useState<Proof | null>(null);
  const [availableChannels, setAvailableChannels] = useState<string[]>([]);
  const [channelInvited, setChannelInvited] = useState(false);
  const { data: channels, refetch } = useFarcasterChannels();
  const { data: user } = useFarcasterAccount();

  useEffect(() => {
    if (!channels || channels.length === 0) {
      const interval = setInterval(() => {
        refetch();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [channels, refetch]);

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
      if (verification) {
        setAlert({
          type: "success",
          message: "Proof verified 🎉",
        });

        const verifiedDomains = proof.props.publicData?.domain;
        if (verifiedDomains) {
          const channels = Object.entries(DomainChannels)
            .filter(([, domains]: [string, string[]]) =>
              Array.isArray(verifiedDomains)
                ? verifiedDomains.some((domain) => domains.includes(domain))
                : domains.includes(verifiedDomains)
            )
            .map(([channel]) => channel);
          setAvailableChannels(channels);
        }
      } else {
        setAlert({
          type: "error",
          message: "Proof verification failed.",
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

  async function joinChannel(channelId: string) {
    if (!user?.fid) return;

    try {
      const res = await fetch(
        `/api/channels?fid=${user?.fid}&channelId=${channelId}`,
        {
          method: "POST",
        }
      );

      const data = await res.json();
      if (data.ok) {
        setAlert({
          type: "success",
          message: "Invite sent 🎉",
        });

        setChannelInvited(true);
      }

      if (data.error) {
        setAlert({
          type: "error",
          message: data.error,
        });
        setChannelInvited(false);
      }
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error?.message || "Error inviting to channel.",
      });

      setChannelInvited(false);
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

      {/* Available Channels Section */}
      {alert && availableChannels.length > 0 && (
        <div className="mt-6 p-4 border rounded-lg bg-green-50">
          <div className={`alert alert-${alert.type} mb-4`}>
            <span>{alert.message}</span>
          </div>

          <h3 className="text-xl font-bold mb-3"> Channels you can join</h3>
          <p className="text-gray-600 mb-4">
            Based on your verified domain ({proof?.props.publicData?.domain}),
            you can join these Farcaster channels:
          </p>
          <div className="space-y-3">
            {availableChannels.map((channel) => {
              const isMember = channels?.find((c: any) => c.id === channel);
              return (
                <div
                  key={channel}
                  className="flex items-center justify-between p-3 bg-white border rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold">{channel}</h4>
                  </div>
                  {isMember && channelInvited && (
                    <a
                      href={`https://farcaster.xyz/~/channel/${channel}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-primary"
                    >
                      Invited
                    </a>
                  )}
                  {isMember && !channelInvited ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => joinChannel(channel)}
                    >
                      Request Invite
                    </button>
                  ) : (
                    <a
                      href={`https://farcaster.xyz/~/channel/${channel}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-primary"
                    >
                      Follow Channel
                    </a>
                  )}
                </div>
              );
            })}
          </div>
          {proof && (
            <button
              className="mt-6 btn btn-outline btn-primary"
              onClick={() => {
                const proofJson = {
                  public: {
                    domain: Array.isArray(proof?.props.publicData?.domain)
                      ? proof.props.publicData.domain
                      : [proof?.props.publicData?.domain],
                  },
                  proof: proof?.props.proofData,
                };
                const dataStr =
                  "data:text/json;charset=utf-8," +
                  encodeURIComponent(JSON.stringify(proofJson, null, 2));
                const downloadAnchorNode = document.createElement("a");
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", "proof.json");
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
              }}
            >
              Download Proof as JSON
            </button>
          )}
        </div>
      )}
    </div>
  );
}
