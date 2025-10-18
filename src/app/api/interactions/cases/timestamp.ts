import {
  InteractionType,
  InteractionResponseType,
  APIApplicationCommandInteractionDataOption,
} from 'discord-api-types/v10'
import { NextResponse } from 'next/server'
import { parse } from 'date-fns'
import { fromZonedTime } from 'date-fns-tz'

export const timestamp = async (
  options: APIApplicationCommandInteractionDataOption<InteractionType.ApplicationCommand>[],
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
  const utcDate = fromZonedTime(date, 'UTC')
  const unixTimestamp = Math.floor(utcDate.getTime() / 1000)

  return NextResponse.json({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `<t:${unixTimestamp}:f>`,
    },
  })
}
