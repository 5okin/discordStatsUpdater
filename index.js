import { MongoClient } from "mongodb";
import "dotenv/config";

const {
  MONGODB_URI,
  MONGODB_DB,
  TOPGG_TOKEN,
  DISCORDFORGE_TOKEN,
  BOT_ID
} = process.env;

async function postStats(name, url, token, payload) {
  console.log(`Updating ${name}...`);
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000)
    });

    if (!response.ok) {
      throw new Error(`${name}: ${await response.text()}`);
    }
    console.log(`${name} updated`);
  }
  catch(err){
    console.error(`${name} failed to update:`, err.message);
  }
}

(async () => {
  const client = new MongoClient(MONGODB_URI);
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    const db = client.db("servers");
    const serverCount = await db.collection(MONGODB_DB).countDocuments();
    const userCount = (await db.collection("discord").aggregate([
                {
                  $group: {
                    _id: null,
                    totalPopulation: { $sum: "$population" }
                  }
                }
              ]).toArray())[0].totalPopulation;

    console.log(`Server count: ${serverCount}\nUser count: ${userCount}`);

    await Promise.all([
      postStats("DiscordForge", 'https://discordforge.org/api/v1/bots/stats', `Bearer ${DISCORDFORGE_TOKEN}`, { server_count: serverCount, user_count: userCount }),
      postStats("top.gg", `https://top.gg/api/bots/${BOT_ID}/stats`, TOPGG_TOKEN, { server_count: serverCount }),
    ])
  
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await client.close();
  }
})();
