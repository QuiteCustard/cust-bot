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

  await redis.set(`timezone:${user.id}`, timezoneValue)

  return NextResponse.json({
    type: InteractionResponseType.ChannelMessageWithSource,
    flags: 64,
    data: {
      content: `You have set your timezone to: ${timezoneValue}`,
    },
  })
}
