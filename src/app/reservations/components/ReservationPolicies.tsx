'use client';
import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Policy {
  id: string;
  question: string;
  answer: string;
}

export default function ReservationPolicies() {
  const [openId, setOpenId] = useState<string | null>('policy_cancellation');

  const policies: Policy[] = [
    {
      id: 'policy_cancellation',
      question: 'What is your cancellation policy?',
      answer:
        'Cancellations must be made at least 24 hours in advance to avoid a cancellation fee. For group bookings (8+ guests), we require 48 hours notice. You can cancel or modify your reservation by calling us or via WhatsApp.',
    },
    {
      id: 'policy_group',
      question: 'How do I book for a large group?',
      answer:
        'For groups of 10 or more guests, please contact us directly at +971 XX XXX XXXX or via WhatsApp. We can arrange private dining areas and customized menus for special occasions, corporate events, and celebrations.',
    },
    {
      id: 'policy_special',
      question: 'Can you accommodate special occasions?',
      answer:
        'Absolutely! We love celebrating special moments with our guests. Please mention any birthdays, anniversaries, or special occasions in your reservation. We can arrange decorations, special desserts, and personalized service.',
    },
    {
      id: 'policy_dietary',
      question: 'Do you cater to dietary restrictions?',
      answer:
        'Yes, we accommodate various dietary requirements including vegetarian, vegan, gluten-free, and halal options. Please inform us of any allergies or dietary restrictions when making your reservation, and our chef will prepare accordingly.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {policies.map((policy) => (
        <div key={policy.id} className="floating-card overflow-hidden transition-all duration-300">
          <button
            onClick={() => setOpenId(openId === policy.id ? null : policy.id)}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <h3 className="text-lg font-bold text-foreground pr-4">{policy.question}</h3>
            <div
              className={`w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 border-2 border-primary/30 transition-all duration-500 ${
                openId === policy.id ? 'rotate-180 border-primary/60 shadow-blue-glow' : ''
              }`}
            >
              <Icon name="ChevronDownIcon" size={20} className="text-primary" />
            </div>
          </button>
          {openId === policy.id && (
            <div className="px-6 pb-6">
              <p className="text-sm text-muted-foreground leading-relaxed">{policy.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
