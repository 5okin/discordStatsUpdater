# Top.gg Server Count Updater

A small Node.js script that updates your bot's server count on [top.gg](https://top.gg) and [discordforge](https://discordforge.org/) once per day  using a **Fly.io machine**. The machine is started via **GitHub Actions**, runs the update script, and then stops automatically to minimize costs. 

---

## How It Works

1. The **Node.js script (`index.js`)**:
   - Connects to your MongoDB server
   - Counts the documents in the `discord_server` collection
   - Sends the server count to the top.gg API
   - Exits automatically

2. A **Fly.io machine** runs the script on demand:
   - Configured with `auto_start_machines = true` and `auto_stop_machines = true`
   - Only consumes resources while running

3. **GitHub Actions** triggers the machine:
   - Scheduled using a cron workflow
   - Can also be triggered manually via `workflow_dispatch`

---

## Setup

### 1. Fly.io

1. Create a Fly app (if you haven’t already):

```bash
flyctl launch
```

2. Deploy the app:
```
flyctl deploy
```

3. Get your machine ID
```
flyctl machines list --app topggupdater
```

4. Create a deploy Token from fly.io

### 2. GitHub Actions

1. Create a GitHub Actions workflow in .github/workflows/fly-updater.yml (already included in this repo).

2. Add the following repository secrets:

| Secret Name      | Value                                    |
| ---------------- | ---------------------------------------- |
| `FLY_API_TOKEN`  | Your Fly.io API token                    |
| `FLY_APP_NAME`   | Your Fly app name (`topggserverupdater`) |
| `FLY_MACHINE_ID` | The ID of your updater machine           |


## Environment Variables
You have to setup  the following environment variables: 

| Variable          | Description                       |
| ----------------- | --------------------------------- |
| `MONGODB_URI`     | Connection string to your MongoDB |
| `TOPGG_API_TOKEN` | API token for your bot on top.gg  |
| `DISCORDFORGE_TOKEN` | API token for your bot on discordForge  |
| `MONGODB_DB` | mongo collection with your servers|
