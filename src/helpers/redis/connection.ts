import { Redis } from '@upstash/redis'
import { env } from 'process'

export const redis = new Redis({
  url: env.KV_REST_API_URL!,
  token: env.KV_REST_API_TOKEN!,
  retry: {
    retries: 2,
    backoff: (retryCount: number) => Math.min(retryCount * 50, 200),
  },
})
