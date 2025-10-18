import {
  InteractionType,
  InteractionResponseType,
  APIApplicationCommandInteractionDataOption,
  APIUser,
} from 'discord-api-types/v10'
import { NextResponse } from 'next/server'
import { parse, isValid } from 'date-fns'
import { fromZonedTime } from 'date-fns-tz'
import { redis } from '@/helpers/redis/connection'
import { errorResponse } from '@/helpers/error-response'

export const timestamp = async (
  options: APIApplicationCommandInteractionDataOption<InteractionType.ApplicationCommand>[],
  user: APIUser,
) => {
  const dateOption = options.find((opt) => opt.name === 'date')!
  const dateValue =
    'value' in dateOption && typeof dateOption.value == 'string' ? dateOption.value : ''

  const timeOption = options.find((opt) => opt.name === 'time')
  const timeValue =
    timeOption && 'value' in timeOption && typeof timeOption.value === 'string'
      ? timeOption.value
      : '00:00'

  // Validate date format (DD/MM/YYYY) and time format (HH:MM)
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
  const timeRegex = /^([01]?\d|2[0-3]):([0-5]\d)$/

  if (!dateRegex.test(dateValue))
    return errorResponse(`❌ Invalid date format. Please use DD/MM/YYYY format (e.g., 25/12/2024)`)

  if (!timeRegex.test(timeValue))
    return errorResponse(`❌ Invalid time format. Please use HH:MM format (e.g., 14:30, 09:00)`)

  const date = parse(`${dateValue} ${timeValue}`, 'dd/MM/yyyy HH:mm', new Date())

  // Check if the parsed date is valid (handles invalid dates like 32/01/2024 or 29/02/2023)
  if (!isValid(date))
    return errorResponse(
      `❌ Invalid date or time. Please check your values (e.g., month 1-12, day 1-31)`,
    )

  const userKey = `user:${user.id}`
  const userTimezone = await redis.json.get(userKey, '$.timezone')
  const timezone = Array.isArray(userTimezone) && userTimezone[0] ? userTimezone[0] : 'UTC'
  const dateWithTimezone = fromZonedTime(date, timezone)
  const unixTimestamp = Math.floor(dateWithTimezone.getTime() / 1000)

  return NextResponse.json({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `<t:${unixTimestamp}:f>`,
    },
  })
}
