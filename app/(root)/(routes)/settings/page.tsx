import React from 'react'
import { checkSubscription } from '../../../../lib/subscription'
import SubscriptionButton from '../../../../components/SubscriptionButton';

const SettingsPage = async () => {
  const isPro = await checkSubscription();

  return (
    <div className='h-full p-4 space-y-2'>
      <h3 className='text-lg font-medium'>
        Settings
      </h3>
      <div className='text-sm text-muted-foreground'>
        {isPro ? "You are a Pro user." : "You are currently on a free plan."}
      </div>
      <SubscriptionButton isPro={isPro} />
    </div>
  )
}

export default SettingsPage
