import {
  APIApplicationCommand,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from 'discord-api-types/v10'
import { languages } from '../deepl/languages'
import { timezones } from '../timezones/timezones'
export type Command = Omit<APIApplicationCommand, 'id' | 'application_id' | 'version'>

const translate: Command = {
  name: 'translate',
  description: 'Translate text to a specified language',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'text',
      description: 'The text to translate',
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: 'target_language',
      description: 'The language to translate the text to',
      required: true,
      choices: [...languages],
    },
  ],
  default_member_permissions: null,
}

const timezone: Command = {
  name: 'timezone',
  description: 'Set your preferred timezone for timestamp generation',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'timezone',
      description: 'The timezone to set (e.g., "America/New_York")',
      required: true,
      choices: timezones,
    },
  ],
  default_member_permissions: null,
}

const timestamp: Command = {
  name: 'timestamp',
  description:
    'Generate a Discord timestamp that shows in local timezone (defaults to UTC if unset)',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'date',
      description: 'Date (DD/MM/YYYY)',
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: 'time',
      description: 'Time (HH:MM). Defaults to 00:00',
      required: false,
    },
  ],
  default_member_permissions: null,
}

const pay: Command = {
  name: 'pay',
  description: 'Send a payment to Custard',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      type: ApplicationCommandOptionType.Number,
      name: 'amount',
      description: 'The amount to pay (max £1,000)',
      required: true,
    },
  ],
  default_member_permissions: null,
}

const earnings: Command = {
  name: 'earnings',
  description: 'Custards total earnings',
  type: ApplicationCommandType.ChatInput,
  default_member_permissions: null,
}

export const commands = [translate, timezone, timestamp, pay, earnings]
