import { redis } from '@/helpers/redis/connection'
import { NextRequest, NextResponse } from 'next/server'
import { env } from 'process'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token)
    return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 })
  if (token !== env.REDIS_TOKEN)
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  await redis.set('meta:last_ping', new Date().toISOString())
  return NextResponse.json({ success: true, message: 'Ping successful' }, { status: 200 })
}
