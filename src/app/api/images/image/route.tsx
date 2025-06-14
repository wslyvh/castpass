import { ImageResponse } from "next/og";
import {
  APP_EMOJI,
  APP_NAME,
  APP_DESCRIPTION,
  SOCIAL_FARCASTER,
} from "@/utils/config";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        tw="flex flex-col items-center justify-center w-full h-full p-10 relative"
        style={{
          background:
            "linear-gradient(120deg, #b2e6ee 0%, #7dc2e6 60%, #e6f2f7 100%)",
        }}
      >
        <div tw="flex text-[200px]">{APP_EMOJI}</div>

        <div tw="flex text-6xl font-bold text-white mb-8">{APP_NAME}</div>

        <div tw="flex text-3xl text-gray-500">{APP_DESCRIPTION}</div>

        <div tw="flex text-xl text-gray-800 absolute bottom-10 right-10">
          @{SOCIAL_FARCASTER}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 800,
    }
  );
}
