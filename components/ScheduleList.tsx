import React from 'react';
import { ScheduleEvent } from '../types';
import { Icons } from './Icon';

interface Props {
  events: ScheduleEvent[];
  currentEvent: ScheduleEvent | undefined;
}

const ScheduleList: React.FC<Props> = ({ events, currentEvent }) => {
  const upcomingEvents = events.filter(e => {
    if (currentEvent && e === currentEvent) return false; // Filter out current
    return e.end > new Date(); // Only future ending events
  });

  if (upcomingEvents.length === 0) {
    return (
      <div className="bg-glass border border-glassBorder rounded-3xl p-6 h-full flex flex-col items-center justify-center text-center text-gray-400">
        <div className="bg-white/5 p-4 rounded-full mb-4">
            <Icons.Calendar className="w-8 h-8 opacity-50" />
        </div>
        <p>Geen lessen meer vandaag.</p>
      </div>
    );
  }

  // Get the very next event
  const nextEvent = upcomingEvents[0];
  // Get the rest
  const laterEvents = upcomingEvents.slice(1);

  return (
    <div className="flex flex-col gap-4 h-full">
        {/* Next Up Card */}
        <div className="bg-glass border border-glassBorder rounded-3xl p-6 relative overflow-hidden flex-shrink-0">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Icons.Clock className="w-24 h-24" />
             </div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-1">Eerstvolgende</h3>
            <div className="text-xl font-bold text-white mb-1 truncate">{nextEvent.summary}</div>
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-1 text-sm text-rijnlandLight">
                    <Icons.MapPin className="w-4 h-4" /> {nextEvent.location}
                </div>
                <div className="font-mono text-lg text-white/90">
                    {nextEvent.start.toLocaleTimeString('nl-NL', {hour:'2-digit', minute:'2-digit'})}
                </div>
            </div>
        </div>

        {/* List of remaining */}
        <div className="bg-glass border border-glassBorder rounded-3xl p-6 flex-1 overflow-y-auto">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4 sticky top-0 bg-[#162032] py-2 z-10">Later Vandaag</h3>
            <div className="space-y-3">
                {laterEvents.length === 0 && <div className="text-sm text-gray-500 italic">Verder niets vandaag.</div>}
                {laterEvents.map((evt, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 group">
                        <div className="font-mono text-sm text-gray-400 group-hover:text-white transition-colors">
                            {evt.start.toLocaleTimeString('nl-NL', {hour:'2-digit', minute:'2-digit'})}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-white truncate text-sm">{evt.summary}</div>
                            <div className="text-xs text-gray-500 truncate">{evt.location}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default ScheduleList;
