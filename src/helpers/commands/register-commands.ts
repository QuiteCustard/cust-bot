import { env } from 'process'
import { commands } from './commands'

const url = `https://discord.com/api/v10/applications/${env.DISCORD_APP_ID}/commands`

const registerCommands = async () => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${env.DISCORD_TOKEN}`,
    },
    method: 'PUT',
    body: JSON.stringify(commands),
  })

  if (!response.ok)
    return console.error(
      `Error registering commands: ${response.url}: ${response.status} ${response.statusText}`,
    )

  const data = await response.json()
  return data
}

registerCommands()
