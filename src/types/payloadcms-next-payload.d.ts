declare module '@payloadcms/next-payload' {
  import { Config } from 'payload/config';
  import { Payload } from 'payload';
  import { NextRequest, NextResponse } from 'next/server';
  
  export function getPayload(options: { config: Config }): Promise<Payload>;
  export function revalidatePath(path: string): Promise<void>;
  
  export default function nextPayloadHandler(
    req: NextRequest,
    res: NextResponse,
    options: {
      config: Config;
    }
  ): Promise<Response>;
}

declare module 'payload' {
  export interface GeneratedTypes {}
}
