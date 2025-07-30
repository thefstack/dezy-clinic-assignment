import OpenAI from "openai";
import { NextResponse } from "next/server";
import { appointmentTools } from "@/lib/tools";
import { handleFunctionCall } from "@/lib/openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const currentDate = new Date().toISOString().split("T")[0];

const systemInstructions = `
You are Aira, the AI assistant for Dezy Clinic — a plastic surgery clinic.

Today's date is **${currentDate}**.
Always interpret and generate all dates and times in **Asia/Kolkata** time zone (Indian Standard Time, UTC+05:30), unless the user specifies a different time zone.
When interpreting date-related requests (e.g. "tomorrow", "next week", "in 2 days"),
you should base them relative to this current date.
---

## Rules:
- Only answer questions related to treatments, doctors, or appointments.
- Politely decline off-topic queries.
- You can book, reschedule, or cancel appointments.
- Always collect name, age, and phone number before booking.
- Only allow appointments between 9 AM and 6 PM EST.
`;

async function resolveFunctionChain({ response, tools }) {
  let aiOutput = response.output[0];
  console.log("response: ",response)
  let responseId = response.id;

  while (aiOutput?.type === "function_call") {
    const functionName = aiOutput.name;
    const functionArgs = JSON.parse(aiOutput.arguments);

    const functionResponse = await handleFunctionCall(functionName, functionArgs);

    const nextResponse = await openai.responses.create({
      previous_response_id: responseId,
      model: "gpt-4o-mini",
      input: [
        {
          type: "function_call_output",
          call_id: aiOutput.call_id,
          output: JSON.stringify(functionResponse),
        },
      ],
      tools,
      store: true,
      tool_choice: "auto",
    });

    aiOutput = nextResponse.output[0];
    responseId = nextResponse.id;

    console.log("aioutput in next response: ",aiOutput)

    if (aiOutput?.type !== "function_call") {
      return {
        message: aiOutput?.content?.[0]?.text || "✅ Action completed.",
        responseId,
      };
    }
  }

  return {
    message: aiOutput?.content?.[0]?.text || "✅ Action completed.",
    responseId,
  };
}

export async function POST(request) {
  try {
    const { message, responseId } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const tools = appointmentTools;
    const input = [{ role: "user", content: message }];

    const initialResponse = await openai.responses.create({
      previous_response_id: responseId || null,
      model: "gpt-4o-mini",
      instructions: systemInstructions,
      input,
      stream: false,
      temperature: 0.7,
      tools,
      tool_choice: "auto",
      max_output_tokens: 500,
    });

    const { message: finalMessage, responseId: finalId } = await resolveFunctionChain({
      response: initialResponse,
      tools,
    });

    return NextResponse.json({
      content: finalMessage,
      responseId: finalId,
      usage: initialResponse.usage,
    });
  } catch (error) {
    console.error("❌ Chat API error:", error);
    return NextResponse.json(
      {
        content: "⚠️ Sorry, something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
