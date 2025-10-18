import { deeplTranslate } from '@/helpers/deepl/translate'
import { TargetLanguageCode } from 'deepl-node'
import {
  InteractionType,
  InteractionResponseType,
  APIApplicationCommandInteractionDataOption,
  APIUser,
} from 'discord-api-types/v10'
import { NextResponse } from 'next/server'

export const translate = async (
  options: APIApplicationCommandInteractionDataOption<InteractionType.ApplicationCommand>[],
  user: APIUser,
) => {
  const textOption = options.find((opt) => opt.name === 'text')!
  const textValue =
    'value' in textOption && typeof textOption.value == 'string' ? textOption.value : 'en'
  const targetLangOption = options.find((opt) => opt.name === 'target_language')!
  const targetLangValue =
    'value' in targetLangOption && typeof targetLangOption.value == 'string'
      ? targetLangOption.value
      : 'es'

  const translation = await deeplTranslate(
    `said: ${textValue}`,
    targetLangValue as TargetLanguageCode,
  )
  return NextResponse.json({
    status: 200,
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `<@${user.id}> ${translation}`,
    },
  })
}
