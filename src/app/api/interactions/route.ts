import { NextRequest, NextResponse } from 'next/server'
import { verifyKey } from 'discord-interactions'
import { APIInteraction, InteractionType, InteractionResponseType } from 'discord-api-types/v10'
import { env } from 'process'
import { errorResponse } from '@/helpers/error-response'
import { translate } from './cases/translate'
import { timestamp as handleTimestamp } from './cases/timestamp'
import { timezone } from './cases/timezone'

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-signature-ed25519')
  const timestamp = request.headers.get('x-signature-timestamp')
  const body = await request.text()

  if (!signature || !timestamp)
    return NextResponse.json({ error: 'Missing headers' }, { status: 401 })

  const isValidRequest = await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY!)

  if (!isValidRequest) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })

  const interaction: APIInteraction = JSON.parse(body)

  if (interaction.type === InteractionType.Ping) {
    return NextResponse.json({
      status: 200,
      type: InteractionResponseType.Pong,
      Headers: { 'Content-Type': 'application/json' },
    })
  }

  if (interaction.type === InteractionType.ApplicationCommand) {
    const { name } = interaction.data
    const user = interaction.member?.user
    const options = 'options' in interaction.data ? interaction.data.options : null

    if (!user?.id) return errorResponse('❌ User ID not found in interaction.')

    switch (name) {
      case 'translate': {
        if (!options) return errorResponse('❌ No options provided.')
        return await translate(options, user)
      }
      case 'timezone':
        if (!options) return errorResponse('❌ No options provided.')
        return await timezone(options, user)
      case 'timestamp': {
        if (!options) return errorResponse('❌ No options provided.')
        return await handleTimestamp(options, user)
      }
    }
  }
}
