'use client';

import { useState } from 'react';

interface LearningEvent {
  type: 'accepted' | 'rejected' | 'not_relevant';
  message: string;
  timestamp: Date;
}

interface LearningHistoryProps {
  events: LearningEvent[];
}

export default function LearningHistory({ events }: LearningHistoryProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#FFFDF8] rounded-xl border border-[#DEDACF] p-4 mt-4">
      <h2 className="text-sm font-semibold text-[#171717] mb-3 tracking-tight">Session Learning</h2>
      <div className="space-y-2">
        {events.map((event, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-[#F7F3EA] rounded-lg border border-[#DEDACF]">
            <span className="text-sm mt-0.5">
              {event.type === 'accepted' && '●'}
              {event.type === 'rejected' && '✕'}
              {event.type === 'not_relevant' && '○'}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-[#171717] block mb-1">
                {event.type === 'accepted' && 'Convention accepted'}
                {event.type === 'rejected' && 'Suggestion rejected'}
                {event.type === 'not_relevant' && 'Marked not relevant'}
              </span>
              <p className="text-xs text-[#6B6B63] italic truncate">"{event.message}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
