import React, { useState, useEffect } from 'react';
import { Icons } from './Icon';

const FocusTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev !== null ? prev - 1 : 0));
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound or alert could go here
      document.title = "⏰ Tijd om!";
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (timeLeft && isActive) {
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        document.title = `${m}:${s.toString().padStart(2, '0')} - Focus`;
    } else {
        document.title = "MBO Rijnland Dashboard";
    }
  }, [timeLeft, isActive]);

  const startTimer = (minutes: number) => {
    const seconds = minutes * 60;
    setTimeLeft(seconds);
    setInitialTime(seconds);
    setIsActive(true);
  };

  const toggleTimer = () => {
      if (timeLeft === null) return;
      setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(null);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Circular progress calculation
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = timeLeft && initialTime 
    ? circumference - (timeLeft / initialTime) * circumference 
    : 0;

  return (
    <div className="bg-glass border border-glassBorder rounded-3xl p-6 flex flex-col items-center justify-between h-full relative overflow-hidden">
      <div className="flex justify-between w-full items-center mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Icons.Clock className="w-5 h-5 text-rijnlandLight"/> Focus
          </h3>
          {timeLeft !== null && (
            <button onClick={resetTimer} className="text-xs text-red-400 hover:text-red-300">Stop</button>
          )}
      </div>

      <div className="relative w-40 h-40 flex items-center justify-center mb-4">
        {/* Background Circle */}
        <svg className="absolute w-full h-full transform -rotate-90">
            <circle cx="50%" cy="50%" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="transparent" />
            <circle 
                cx="50%" cy="50%" r={radius} 
                stroke="#00a9ce" 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray={circumference} 
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
            />
        </svg>
        <div className="text-4xl font-mono font-bold text-white z-10">
            {timeLeft !== null ? formatTime(timeLeft) : '00:00'}
        </div>
      </div>

      {timeLeft === null ? (
         <div className="grid grid-cols-3 gap-2 w-full">
            {[15, 30, 45].map(min => (
                <button 
                    key={min}
                    onClick={() => startTimer(min)}
                    className="bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    {min}m
                </button>
            ))}
         </div>
      ) : (
          <button 
            onClick={toggleTimer}
            className="bg-rijnlandLight hover:bg-cyan-500 text-white w-full py-3 rounded-xl font-bold transition-colors flex justify-center items-center gap-2"
          >
             {isActive ? <Icons.Square className="w-4 h-4 fill-current"/> : <Icons.Play className="w-4 h-4 fill-current"/>}
             {isActive ? 'Pauzeren' : 'Hervatten'}
          </button>
      )}
    </div>
  );
};

export default FocusTimer;
