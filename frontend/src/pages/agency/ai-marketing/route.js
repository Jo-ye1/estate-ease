// app/api/agent/ai-marketing/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { propertyTitle, neighborhood, specs, tone } = await req.json();

    const prompt = `You are an expert real estate copywriter. Generate a comprehensive sales listing packet for:
    Title: ${propertyTitle}
    Location: ${neighborhood}
    Specifications: ${specs}
    Requested Copy Style Tone: ${tone}

    Output structural JSON format strictly matching this schema:
    {
      "listingTitle": "Engaging direct title",
      "seoDescription": "150 char meta summary description",
      "propertyBodyCopy": "Detailed real estate marketing pitch paragraph highlighting amenities",
      "socialMediaPost": "Punchy Instagram/LinkedIn promotional post containing relevant real estate hashtags."
    }`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const responseContent = completion.choices[0].message.content;
    return NextResponse.json(JSON.parse(responseContent || '{}'));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
