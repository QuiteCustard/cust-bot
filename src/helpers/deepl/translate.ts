import * as deepl from 'deepl-node'
import { env } from 'process'

export const deeplTranslate = async (text: string, targetLanguage: deepl.TargetLanguageCode) => {
  const deeplClient = new deepl.DeepLClient(env.DEEPL_API_KEY!)
  const response = await deeplClient.translateText(text, null, targetLanguage)
  return response.text
}
