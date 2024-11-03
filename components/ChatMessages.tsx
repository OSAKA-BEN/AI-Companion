import React, { ElementRef, useEffect, useRef, useState } from 'react'
import { Companion } from '@prisma/client';
import ChatMessage, { ChatMessageProps } from './ChatMessage';

interface ChatMessagesProps {
  companion: Companion;
  messages: ChatMessageProps[];
  isLoading: boolean;
}

const ChatMessages = ({ companion, messages = [], isLoading }: ChatMessagesProps) => {
  const scrollRef = useRef<ElementRef<"div">>(null);
  const [fakeLoading, setFakeLoading] = useState(messages.length === 0 ? true : false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFakeLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);
 
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, scrollRef]);

  return (
    <div className="flex-1 overflow-y-auto">
      <ChatMessage src={companion.src} role="system" isLoading={fakeLoading} content={` Hello, I am ${companion.name}, ${companion.description}`} />
      {messages.map((message, index) => (
        <ChatMessage key={index} role={message.role} content={message.content} src={companion.src} isLoading={fakeLoading} />
      ))}
      {isLoading && (
        <ChatMessage role="system" isLoading src={companion.src} />
      )}
      <div ref={scrollRef} />
    </div>
  )
}

export default ChatMessages

