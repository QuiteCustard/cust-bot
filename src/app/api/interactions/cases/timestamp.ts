import {
  InteractionType,
  InteractionResponseType,
  APIApplicationCommandInteractionDataOption,
  APIUser,
} from 'discord-api-types/v10'
import { NextResponse } from 'next/server'
import { parse } from 'date-fns'
import { fromZonedTime } from 'date-fns-tz'
import { redis } from '@/helpers/redis/connection'

export const timestamp = async (
  options: APIApplicationCommandInteractionDataOption<InteractionType.ApplicationCommand>[],
  user: APIUser,
) => {
  const dateOption = options.find((opt) => opt.name === 'date')!
  const dateValue =
    'value' in dateOption && typeof dateOption.value == 'string'
      ? dateOption.value
      : new Date().toISOString().split('T')[0]

  const timeOption = options.find((opt) => opt.name === 'time')
  const timeValue =
    timeOption && 'value' in timeOption && typeof timeOption.value === 'string'
      ? timeOption.value
      : '00:00'

  const date = parse(`${dateValue} ${timeValue}`, 'yyyy-MM-dd HH:mm', new Date())

  const timezone: string | null = await redis.get(`timezone:${user.id}`)
  const dateWithTimezone = fromZonedTime(date, timezone ?? 'UTC')
  const unixTimestamp = Math.floor(dateWithTimezone.getTime() / 1000)

  return NextResponse.json({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `<t:${unixTimestamp}:f>`,
    },
  })
}
