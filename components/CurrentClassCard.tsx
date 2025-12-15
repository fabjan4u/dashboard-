import React, { useEffect, useState } from 'react';
import { ScheduleEvent } from '../types';
import { Icons } from './Icon';

interface Props {
  event: ScheduleEvent | undefined;
}

const CurrentClassCard: React.FC<Props> = ({ event }) => {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!event) {
      setProgress(0);
      setTimeLeft('');
      return;
    }

    const update = () => {
      const now = new Date();
      const start = event.start.getTime();
      const end = event.end.getTime();
      const current = now.getTime();

      const total = end - start;
      const elapsed = current - start;
      const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
      
      setProgress(pct);

      const minsLeft = Math.ceil((end - current) / 60000);
      setTimeLeft(`${minsLeft} min`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [event]);

  if (!event) {
    return (
      <div className="bg-glass border border-glassBorder rounded-3xl p-8 flex flex-col justify-center items-center text-center h-full min-h-[250px] shadow-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="z-10 bg-green-500/20 text-green-300 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide mb-4 flex items-center gap-2">
           <Icons.CheckCircle className="w-4 h-4" /> VRIJ
        </div>
        <h2 className="z-10 text-3xl md:text-4xl font-bold text-white mb-2">Geen les momenteel</h2>
        <p className="z-10 text-gray-400">Geniet van je vrije tijd!</p>
      </div>
    );
  }

  return (
    <div className="bg-glass border border-glassBorder rounded-3xl p-6 md:p-8 flex flex-col justify-between h-full min-h-[250px] shadow-lg relative overflow-hidden">
      {/* Background Pulse Effect */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-rijnlandLight/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>

      <div className="flex justify-between items-start z-10">
        <div className="bg-rijnlandLight text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg shadow-rijnlandLight/20 animate-pulse">
          Nu Bezig
        </div>
        <div className="text-right">
             <div className="text-3xl font-mono font-bold text-white">{timeLeft}</div>
             <div className="text-xs text-gray-400 uppercase tracking-wider">resterend</div>
        </div>
      </div>

      <div className="z-10 my-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight drop-shadow-md">
          {event.summary}
        </h2>
        <div className="flex items-center gap-2 text-xl text-gray-300">
          <Icons.MapPin className="text-rijnlandLight" />
          <span>{event.location}</span>
        </div>
      </div>

      <div className="z-10">
        <div className="flex justify-between text-sm text-gray-400 mb-2 font-mono">
            <span>{event.start.toLocaleTimeString('nl-NL', {hour:'2-digit', minute:'2-digit'})}</span>
            <span>{event.end.toLocaleTimeString('nl-NL', {hour:'2-digit', minute:'2-digit'})}</span>
        </div>
        <div className="h-3 w-full bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-rijnlandLight to-cyan-300 shadow-[0_0_15px_rgba(0,169,206,0.6)] transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CurrentClassCard;
