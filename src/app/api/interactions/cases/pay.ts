import { errorResponse } from '@/helpers/error-response'
import { redis } from '@/helpers/redis/connection'
import { UserData } from '@/helpers/types'
import {
  APIApplicationCommandInteractionDataOption,
  APIUser,
  InteractionResponseType,
  InteractionType,
} from 'discord-api-types/v10'
import { NextResponse } from 'next/server'

export const pay = async (
  user: APIUser,
  options: APIApplicationCommandInteractionDataOption<InteractionType.ApplicationCommand>[],
) => {
  const amountOption = options.find((opt) => opt.name === 'amount')!
  const amountValue =
    'value' in amountOption && typeof amountOption.value == 'number' ? amountOption.value : 0

  if (amountValue <= 0) return errorResponse('❌ Amount must be greater than zero :(')

  const userKey = `user:${user.id}`

  const existingUserData: UserData | null = await redis.json.get(userKey)

  let userData: UserData
  if (existingUserData) {
    userData = {
      ...existingUserData,
      payments: {
        ...(existingUserData.payments || {}),
        [user.id]: (existingUserData.payments?.[user.id] || 0) + amountValue,
      },
    }
  } else {
    userData = {
      payments: {
        [user.id]: amountValue,
      },
      discord: {
        username: user.username ?? '',
        global_name: user.global_name ?? '',
      },
    }
  }

  await redis.json.set(userKey, '$', userData)

  return NextResponse.json({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `Successfully paid Custard £${amountValue}`,
    },
  })
}
