"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { useProModal } from "../hooks/use-pro-modal";
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

export const ProModal = () => {
  const proModal = useProModal();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onSubscribe = async () => {

    try {

      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;

    } catch (error) {

      console.log("[STRIPE_ERROR]", error);
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });

    } finally {
      setLoading(false);
    }
  
  }
  
  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center">
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription className="text-center space-y-2">
            Create <span className="text-sky-500 mx-1 font-medium">Custom AI</span>Companions.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex justify-between">
          <p className="text-2xl font-medium">
            $9
            <span className="text-sm font-normal">
              .99 / mo
            </span>
          </p>
          <Button variant="premium" disabled={loading} onClick={onSubscribe}>
            {loading ? "Please wait..." : "Upgrade"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
