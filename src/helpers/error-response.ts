import { InteractionResponseType } from 'discord-api-types/v10'
import { NextResponse } from 'next/server'

export const errorResponse = (content: string) =>
  NextResponse.json({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content, flags: 64 },
  })
