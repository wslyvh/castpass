import { useQuery } from "@tanstack/react-query";
import { useFarcasterAccount } from "./useFarcasterAccount";

export function useFarcasterChannels(fid?: number, enabled: boolean = true) {
  const { data: user } = useFarcasterAccount(enabled);
  fid = fid ?? user?.fid;

  return useQuery({
    queryKey: ["farcaster", "channels", fid],
    queryFn: async () => {
      if (!fid) throw new Error("No fid available");

      const res = await fetch(`/api/channels?fid=${fid}`);
      return res.json();
    },
    staleTime: 0,
    enabled: enabled && !!fid,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
