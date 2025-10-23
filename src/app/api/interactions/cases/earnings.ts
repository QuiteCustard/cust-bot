import { InteractionResponseType } from 'discord-api-types/v10'
import { NextResponse } from 'next/server'
import { redis } from '@/helpers/redis/connection'
import { env } from 'process'
import { UserData } from '@/helpers/types'

export const earnings = async () => {
  const existingUserData: UserData | null = await redis.json.get(
    `${`user:${env.CUSTARD_DISCORD_ID}`}`,
  )

  if (!existingUserData || Object.keys(existingUserData.payments || {}).length === 0) {
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: '💰 No payments received yet!',
      },
    })
  }

  const sortedUsers = Object.entries(existingUserData.payments ?? {}).sort(
    ([, amountA], [, amountB]) => amountB - amountA,
  )
  const totalEarnings = Object.values(existingUserData.payments ?? {}).reduce(
    (sum, amount) => sum + amount,
    0,
  )

  const leaderboardList = sortedUsers
    .slice(0, 10)
    .map(([userId, amount], index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`
      return `${medal} <@${userId}> - **£${amount.toFixed(2)}**`
    })
    .join('\n')

  return NextResponse.json({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      embeds: [
        {
          title: '💰 Earnings Leaderboard',
          description: leaderboardList,
          color: 0x00ff00,
          footer: {
            text: `📊 Total Earnings: £${totalEarnings.toFixed(2)} | 👥 Contributors: ${
              sortedUsers.length
            }${sortedUsers.length > 10 ? ` | Showing top 10` : ''}`,
          },
          timestamp: new Date().toISOString(),
        },
      ],
    },
  })
}
