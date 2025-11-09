import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

let cachedClient: OpenAI | null = null;

const getClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey });
  }
  return cachedClient;
};

export async function POST(request: NextRequest) {
  const client = getClient();
  if (!client) {
    return NextResponse.json(
      {
        content:
          "माफ करा, AI सेवा सध्या उपलब्ध नाही. कृपया प्रशासकाशी संपर्क साधा.",
      },
      { status: 200 }
    );
  }

  try {
    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "तू Learnnova नावाचा मराठी बोलणारा अभ्यास सहाय्यक आहेस. विद्यार्थ्यांना अभ्यास, झोप आणि सवयींबद्दल समजून घेऊन व्यावहारिक टिप्स दे.",
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content =
      response.choices[0]?.message?.content?.trim() ??
      "सध्या उत्तर उपलब्ध नाही. कृपया पुन्हा प्रयत्न करा.";

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Chat API error", error);
    return NextResponse.json({
      content: "AI प्रतिसादात अडथळा निर्माण झाला आहे. कृपया पुन्हा प्रयत्न करा.",
    });
  }
}
