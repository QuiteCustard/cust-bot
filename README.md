# Cust-Bot

A Discord slash-command bot built on Next.js. Discord sends interactions over HTTP to a single route handler, so there is no gateway connection or long-running process. User data is stored in Upstash Redis as JSON documents.

## Commands

| Command      | Options                                          | What it does                                                                                                                                                  |
| ------------ | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/translate` | `text` (required), `target_language` (required)  | Translates the text with DeepL and posts it publicly, prefixed with a mention of the caller. The target language is picked from a fixed list of 25 languages.   |
| `/timezone`  | `timezone` (required)                            | Saves the caller's IANA timezone (picked from a fixed list) to Redis. Replies ephemerally.                                                                     |
| `/timestamp` | `date` (required, `DD/MM/YYYY`), `time` (`HH:MM`) | Converts the date and time from the caller's saved timezone (UTC if none is set) into a Discord `<t:…:f>` timestamp that renders in each viewer's local time. Time defaults to `00:00`. |
| `/pay`       | `amount` (required, number)                      | Records a payment from the caller to Custard. Adds the amount to the caller's running total under Custard's Redis document. Rejects amounts of zero or less.      |
| `/earnings`  | none                                             | Posts an embed leaderboard of the top 10 payers to Custard, ranked by total amount, with the grand total and contributor count in the footer.                  |

Validation failures (bad date format, missing options, non-positive amounts) are returned as ephemeral error messages.

## How it works

- `src/app/api/interactions/route.ts` is the Discord interactions endpoint. It verifies the Ed25519 request signature, answers Discord's ping, and dispatches application commands to the handlers in `src/app/api/interactions/cases/`.
- `src/helpers/commands/commands.ts` defines the slash commands and their options. `pnpm register-commands` PUTs this list to Discord's global commands endpoint, replacing whatever is registered.
- `src/helpers/deepl/` wraps the DeepL client and holds the language choice list.
- `src/helpers/timezones/timezones.ts` holds the timezone choice list.
- `src/helpers/redis/connection.ts` creates the Upstash Redis client.
- `src/app/api/ping-redis/route.ts` is a token-protected GET endpoint that writes the current time to `meta:last_ping`, intended for a keep-alive cron.
- `src/app/page.tsx` is a static landing page describing the bot.

### Redis data

Each user is a JSON document at `user:<discordId>`:

```ts
{
  discord: { username: string; global_name: string | null }
  timezone?: string                       // IANA name, set by /timezone
  payments?: { [payerDiscordId]: number } // only on Custard's own document, set by /pay
}
```

`/pay` and `/earnings` read and write the document for the user in `CUSTARD_DISCORD_ID`, not the caller's.

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create `.env` with:

   ```bash
   DISCORD_APP_ID=          # Application ID from the Discord developer portal
   DISCORD_TOKEN=           # Bot token, used only to register commands
   DISCORD_PUBLIC_KEY=      # Used to verify interaction signatures
   DEEPL_API_KEY=
   KV_REST_API_URL=         # Upstash Redis REST URL
   KV_REST_API_TOKEN=       # Upstash Redis REST token
   CUSTARD_DISCORD_ID=      # Discord user ID whose document receives /pay totals
   REDIS_TOKEN=             # Shared secret for GET /api/ping-redis?token=…
   ```

3. Register the slash commands with Discord:

   ```bash
   pnpm register-commands
   ```

4. Run the dev server:

   ```bash
   pnpm dev
   ```

5. In the Discord developer portal, set the application's Interactions Endpoint URL to `https://<your-host>/api/interactions`. Discord will send a ping to confirm the endpoint before saving.

## Scripts

| Script                   | Purpose                                             |
| ------------------------ | --------------------------------------------------- |
| `pnpm dev`               | Start Next.js in development mode with Turbopack.   |
| `pnpm build`             | Production build.                                   |
| `pnpm start`             | Serve the production build.                         |
| `pnpm lint`              | Run ESLint.                                         |
| `pnpm register-commands` | Push the command definitions to Discord.            |
