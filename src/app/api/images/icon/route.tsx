import { ImageResponse } from "next/og";
import { APP_EMOJI } from "@/utils/config";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        tw="flex flex-col items-center justify-center w-full h-full"
        style={{
          background:
            "linear-gradient(120deg, #b2e6ee 0%, #7dc2e6 60%, #e6f2f7 100%)",
        }}
      >
        <div tw="flex text-[700px]">{APP_EMOJI}</div>
      </div>
    ),
    {
      width: 1024,
      height: 1024,
    }
  );
}
