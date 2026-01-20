import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const room = req.nextUrl.searchParams.get('room');
    const username = req.nextUrl.searchParams.get('username') || 'Anonymous';

    if (!room) {
      return NextResponse.json({ error: 'Missing room parameter' }, { status: 400 });
    }

    // Check for API Keys to avoid runtime errors
    if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
      console.error("LIVEKIT_API_KEY or SECRET is not defined in .env.local");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: username,
        // Using a numeric value for TTL is safer in some SDK versions
        ttl: 7200, 
        // Adding metadata allows the Agent to see who joined
        metadata: JSON.stringify({ role: 'human_participant' }),
      }
    );

    // ADVANCED GRANTS: Optimized for Neural Mediator Intercepts
    at.addGrant({ 
      roomJoin: true, 
      room: room,
      canPublish: true,      // Essential for Agent to hear you
      canSubscribe: true,    // Essential for you to hear Agent
      canPublishData: true,  // Essential for triggering the Vibe Alert UI
    });

    // Generate the JWT
    const token = await at.toJwt();

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Token Generation Error:", error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}