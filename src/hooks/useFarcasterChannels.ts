import { useQuery } from "@tanstack/react-query";
import { useFarcasterContext } from "./useFarcasterContext";

const DEFAULT_CACHE_TIME = 1000 * 60 * 5; // 5 minutes

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
    staleTime: DEFAULT_CACHE_TIME,
    enabled: enabled && !!fid,
  });
}
