import { NextResponse } from 'next/server';
import { log } from '../../../logging_middleware';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const response = await log(payload);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to write log';
    return NextResponse.json({ ok: false, message }, { status: 200 });
  }
}