import { redis } from '@/helpers/redis/connection'
import {
  APIApplicationCommandInteractionDataOption,
  APIUser,
  InteractionResponseType,
  InteractionType,
} from 'discord-api-types/v10'
import { NextResponse } from 'next/server'

export const timezone = async (
  options: APIApplicationCommandInteractionDataOption<InteractionType.ApplicationCommand>[],
  user: APIUser,
) => {
  const timezoneOption = options.find((opt) => opt.name === 'timezone')!
  const timezoneValue =
    'value' in timezoneOption && typeof timezoneOption.value == 'string'
      ? timezoneOption.value
      : 'UTC'

  const userKey = `user:${user.id}`

  // Get existing user data or create new structure
  const existingUserData = await redis.json.get(userKey)

  let userData
  if (existingUserData) {
    // User exists, merge timezone into existing data
    userData = { ...existingUserData, timezone: timezoneValue }
  } else {
    // User doesn't exist, create new document
    userData = {
      timezone: timezoneValue,
      discord: {
        username: user.username ?? '',
        global_name: user.global_name ?? '',
      },
    }
  }

  // Set the complete user data
  await redis.json.set(userKey, '$', userData)

  return NextResponse.json({
    type: InteractionResponseType.ChannelMessageWithSource,
    flags: 64,
    data: {
      content: `You have set your timezone to: ${timezoneValue}`,
    },
  })
}
