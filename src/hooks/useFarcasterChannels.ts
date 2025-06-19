import { useQuery } from "@tanstack/react-query";
import { useFarcasterContext } from "./useFarcasterContext";

export function useFarcasterChannels(fid?: number, enabled: boolean = true) {
  const context = useFarcasterContext(enabled);
  fid = fid ?? context.data?.user?.fid;

  return useQuery({
    queryKey: ["farcaster", "channels", fid],
    queryFn: async () => {
      if (!fid) throw new Error("No fid available");

      const res = await fetch(`/api/channels?fid=${fid}`);
      const data = await res.json();

      return data;
    },
    staleTime: 0,
    enabled: enabled && !!fid,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
