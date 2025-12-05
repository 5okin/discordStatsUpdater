import fetch from "node-fetch";
import { MongoClient } from "mongodb";
import "dotenv/config";

const {
  MONGODB_URI,
  MONGODB_DB,
  TOPGG_TOKEN,
  BOT_ID
} = process.env;

(async () => {
  try {
    console.log("Connecting to MongoDB...");
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db("servers");
    const count = await db.collection(MONGODB_DB).countDocuments();

    console.log(`Server count: ${count}`);
    console.log("Sending to top.gg...");

    const response = await fetch(`https://top.gg/api/bots/${BOT_ID}/stats`, {
      method: "POST",
      headers: {
        "Authorization": TOPGG_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ server_count: count })
    });

    if (!response.ok) {
      console.error("Top.gg Error:", await response.text());
      process.exit(1);
    }

    console.log("Successfully updated top.gg!");
    await client.close();
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
