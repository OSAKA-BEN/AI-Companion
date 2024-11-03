"use client"

import ChatHeader from "@/components/ChatHeader"
import { Companion, Message } from "@prisma/client"
import { FormEvent, useState } from "react"
import ChatForm from "@/components/ChatForm"
import ChatMessages from "@/components/ChatMessages"
import { ChatMessageProps } from "@/components/ChatMessage"
import { useToast } from "@/hooks/use-toast"

interface ChatClientProps {
  companion: Companion & {
    messages: Message[]
    _count: {
      messages: number
    }
  }
}

const ChatClient = ({ companion }: ChatClientProps) => {
  const { toast } = useToast()
  const [messages, setMessages] = useState<ChatMessageProps[]>(companion.messages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userMessage: ChatMessageProps = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/chat/${companion.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        if (response.status === 402) {
          toast({
            title: "Payment Required",
            description: "You've hit your monthly spend limit. Please check your billing settings.",
            duration: 5000,
            variant: "destructive",
          });
        } else {
          throw new Error('Network response was not ok');
        }
      } else {
        const completion = await response.text();

        const systemMessage: ChatMessageProps = {
          role: "system",
          content: completion,
        };

        setMessages((prev) => [...prev, systemMessage]);
        setInput("");
      }
    } catch (error: unknown) {
      console.error('Error:', error);
      toast({
        title: "Something went wrong",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        duration: 5000,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader companion={companion} />
      <ChatMessages
        companion={companion}
        isLoading={isLoading}
        messages={messages}
      />
      <ChatForm
        isLoading={isLoading}
        input={input}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
      />
    </div>
  )
}

export default ChatClient
