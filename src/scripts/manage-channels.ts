import {
  listChannels,
  getChannel,
  followChannel,
  inviteToChannel,
} from "@/clients/channels";
import "dotenv/config";

async function main() {
  try {
    console.log("Get Farcaster channels...");
    const channels = await listChannels();
    console.log("# of channels", channels.length);

    console.log("Get food channel...");
    const channel = await getChannel("food");
    console.log(channel);

    console.log("Follow food channel...");
    const follow = await followChannel("food", false);
    console.log("Follow result", follow);

    console.log("Invite to food channel...");
    const invite = await inviteToChannel("food", 12580);
    console.log("Invite result", invite);
  } catch (err) {
    console.error("Error:", err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

main();
