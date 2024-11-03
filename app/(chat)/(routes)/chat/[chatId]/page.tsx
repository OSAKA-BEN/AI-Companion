import prismadb from "@/lib/prismadb";
import { RedirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ChatClient from "./components/client";

type Params = Promise<{ chatId: string }>

const ChatIdPage = async (props: { params: Params }) => {
  const { userId } = await auth();
  const params = await props.params;
  const chatId = params.chatId;

  console.log(chatId);

  if (!userId) {
    return RedirectToSignIn;
  }

  const companion = await prismadb.companion.findUnique({
    where: {
      id: chatId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        where: {
          userId: userId,
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  if (!companion) {
    return redirect("/");
  }

  return (
    <ChatClient companion={companion} />
  )
}

export default ChatIdPage