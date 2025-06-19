import { NextRequest, NextResponse } from "next/server";
import { fetchAllUserChannels, inviteToChannel } from "@/clients/channels";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");
  if (!fid) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const channels = await fetchAllUserChannels(Number(fid));

  return NextResponse.json(channels);
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");
  const channelId = searchParams.get("channelId");
  if (!channelId || !fid) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const data = await inviteToChannel(channelId, Number(fid));

    return NextResponse.json(data);
  } catch (error: any) {
    const errorMessage = JSON.parse(error.message);
    return NextResponse.json(
      {
        error: errorMessage.errors[0]?.message || "Unable to invite to channel",
      },
      { status: 400 }
    );
  }
}
