import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { Replicate } from "@langchain/community/llms/replicate";
import { MemoryManager } from "../../../../lib/memory";
import { getRateLimit } from "../../../../lib/rate-limit";
import prismadb from "../../../../lib/prismadb";

export async function POST(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  const awaitedParams = await params
  try {
    const { prompt } = await req.json();
    const user = await currentUser();

    if (!user || !user.firstName || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const identifier = req.url + "-" + user.id;
    const { success } = await getRateLimit(identifier);

    if (!success) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    const companion = await prismadb.companion.update({
      where: {
        id: awaitedParams.chatId,
      },
      data: {
        messages: {
          create: {
            content: prompt,
            role: "user",
            userId: user.id,
          },
        },
      },
    });

    if (!companion) {
      return new NextResponse("Companion not found", { status: 404 });
    }

    const name = companion.id;
    const companionKey = {
      companionName: name,
      userId: user.id,
      modelName: "llama-3-8b",
    };

    const memoryManager = await MemoryManager.getInstance();

    const records = await memoryManager.readFromHistory(companionKey);

    if (records.length === 0) {
      await memoryManager.seedChatHistory(
        companion.seed,
        "\n\n",
        companionKey
      );
    }

    await memoryManager.writeToHistory("User: " + prompt + "\n", companionKey);

    const recentChatHistory = await memoryManager.readFromHistory(companionKey);

    const similarDocs = await memoryManager.vectorSearch(
      recentChatHistory,
      name + ".txt"
    );

    let relevantHistory = "";

    if (similarDocs && similarDocs.length !== 0) {
      relevantHistory = similarDocs
        .map((doc) => doc.pageContent)
        .join("\n");
    }

    const promptText = `ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${name}: prefix.
        
${companion.instructions}

Below are the relevant details about ${name}'s past and the conversation you are in.
${relevantHistory}

${recentChatHistory}\n${name}
`;

    // Appeler le modèle LLM et obtenir la réponse
    const model = new Replicate({
      model: "meta/meta-llama-3-8b-instruct:5a6809ca6288247d06daf6365557e5e429063f32a21146b2a807c682652136b8",
      input: {
        max_length: 1024,
      },
      apiKey: process.env.REPLICATE_API_TOKEN,
    });

    model.verbose = true;

    try {
      const output = await model.call(promptText);
      const text = output.trim();

      await memoryManager.writeToHistory(text.trim(), companionKey);

      await prismadb.companion.update({
        where: {
          id: awaitedParams.chatId,
        },
        data: {
          messages: {
            create: {
              content: text.trim(),
              role: "system",
              userId: user.id,
            },
          },
        },
      });

      // Retourner la réponse au frontend
      return new NextResponse(text, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("Monthly spend limit reached")) {
        return new NextResponse("Monthly spend limit reached", { status: 402 });
      }
      console.error(error);
      return new NextResponse("Internal error", { status: 500 });
    }
  } catch (error) {
    console.log("[CHAT_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
 