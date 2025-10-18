'use server'
import { env } from 'process'
import { Command } from './commands'

interface FetchCommandsResponse extends Command {
  id: string
  application_id: string
  default_member_permissions: string | null
  version: string
}

export const fetchCommands = async () => {
  const url = `https://discord.com/api/v10/applications/${env.DISCORD_APP_ID}/commands`

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${env.DISCORD_TOKEN}`,
    },
    method: 'GET',
  })

  if (!response.ok) {
    console.error(
      `Error fetching commands: ${response.url}: ${response.status} ${response.statusText}`,
    )
    return []
  }

  const data: FetchCommandsResponse[] = await response.json()
  return data
}
