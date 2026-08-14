import { puckHandler } from "@puckeditor/cloud-client";

export async function POST(request: Request) {
  return puckHandler(request, {
    apiKey: process.env.PUCK_API_KEY,
  });
}

export async function GET(request: Request) {
  return puckHandler(request, {
    apiKey: process.env.PUCK_API_KEY,
  });
}
