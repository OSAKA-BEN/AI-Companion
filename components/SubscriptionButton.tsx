"use client"

import React, { useState } from 'react'
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';


interface SubscriptionButtonProps {
  isPro: boolean;
}

const SubscriptionButton = ({ isPro = false }: SubscriptionButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();


  const onClick = async () => {

    try {
      setLoading(true);

      const response = await axios.get("/api/stripe");
      window.location.href = response.data;

    } catch (error: unknown) {

      if (error instanceof Error) {
        toast({
          title: "Something went wrong",
          description: error.message,
        });
      }

    } finally {
      setLoading(false);
    }

  }

  return (
    <Button size='sm' variant={isPro ? "default" : "premium"} disabled={loading} onClick={onClick}>
      {isPro ? "Manage Subscription" : "Upgrade"}
      {!isPro && <Sparkles className='w-4 h-4 ml-2 fill-white' />}
    </Button>
  )
}

export default SubscriptionButton