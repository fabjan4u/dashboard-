import React, { useState, useEffect } from 'react';
import { ScheduleEvent, WeatherData, ScheduleSource } from './types';
import { fetchSchedule, getTodaysEvents, getCurrentEvent, parseICalData } from './services/scheduleService';
import { fetchWeather } from './services/weatherService';
import CurrentClassCard from './components/CurrentClassCard';
import ScheduleList from './components/ScheduleList';
import FocusTimer from './components/FocusTimer';
import TodoList from './components/TodoList';
import SettingsModal from './components/SettingsModal';
import QuickLinks from './components/QuickLinks';
import { Icons } from './components/Icon';

const App: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Settings State
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Persisted Settings
  const [icalUrl, setIcalUrl] = useState(localStorage.getItem('settings_ical_url') || '');
  const [userName, setUserName] = useState(localStorage.getItem('settings_user_name') || 'Student');
  const [scheduleSource, setScheduleSource] = useState<ScheduleSource>((localStorage.getItem('settings_source') as ScheduleSource) || 'url');
  
  // Greeting Logic
  const hour = currentTime.getHours();
  let greeting = "Goedemorgen";
  if (hour >= 12) greeting = "Goedemiddag";
  if (hour >= 18) greeting = "Goedenavond";

  const refreshData = async () => {
    setLoading(true);
    try {
      let events: ScheduleEvent[] = [];
      
      if (scheduleSource === 'file') {
        // Load from cache
        const cachedData = localStorage.getItem('cache_ical_data');
        if (cachedData) {
          events = parseICalData(cachedData);
        }
      } else {
        // Load from URL
        if (icalUrl) {
           // Try fetch
           try {
             events = await fetchSchedule(icalUrl);
             // Note: fetchSchedule (in previous logic) doesn't return raw data easily to cache without modifying it, 
             // but for now we assume online fetch works.
           } catch (err) {
             console.warn("Online fetch failed, trying fallback?");
           }
        }
      }
      setSchedule(events);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchWeather().then(setWeather);
    refreshData();
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [icalUrl, scheduleSource]);

  const handleSaveSettings = (newUrl: string, newName: string, newSource: ScheduleSource, newFileContent?: string) => {
    // Save settings
    setIcalUrl(newUrl);
    setUserName(newName);
    setScheduleSource(newSource);

    localStorage.setItem('settings_ical_url', newUrl);
    localStorage.setItem('settings_user_name', newName);
    localStorage.setItem('settings_source', newSource);

    if (newSource === 'file' && newFileContent) {
      localStorage.setItem('cache_ical_data', newFileContent);
      // Immediately parse and update
      const events = parseICalData(newFileContent);
      setSchedule(events);
    } else {
        // If switching back to URL or just name change, trigger refresh in effect
    }
  };

  const todaysEvents = getTodaysEvents(schedule);
  const currentEvent = getCurrentEvent(todaysEvents);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 animate-[fadeIn_0.5s_ease-out]">
        <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-2 drop-shadow-lg">
                {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-rijnlandLight to-cyan-200">{userName}</span>
            </h1>
            <p className="text-gray-400 font-mono text-sm flex items-center gap-2">
                <Icons.Calendar className="w-4 h-4" />
                {currentTime.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
        </div>

        <div className="flex items-center gap-3 bg-[#1e293b]/60 backdrop-blur-md border border-white/10 rounded-2xl p-2 pr-6 shadow-xl">
            <div className="bg-gradient-to-br from-white/10 to-white/5 p-3 rounded-xl border border-white/5">
                 {weather ? (
                     <div className="text-2xl text-white">{weather.weatherCode <= 3 ? <Icons.Sun className="text-yellow-400" /> : <Icons.Cloud className="text-gray-300"/>}</div>
                 ) : <Icons.RefreshCw className="animate-spin text-gray-500"/>}
            </div>
            <div>
                <div className="text-xl font-bold text-white">{weather?.temperature ?? '--'}°C</div>
                <div className="text-xs text-gray-400 capitalize">{weather?.description ?? 'Laden...'}</div>
            </div>
            <div className="h-8 w-px bg-white/10 mx-2"></div>
            <button 
                onClick={() => setSettingsOpen(true)}
                className="group relative p-2"
                title="Instellingen"
            >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-lg transition-colors"></div>
                <Icons.Settings className="w-6 h-6 text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all duration-500" />
            </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 animate-[slideUp_0.6s_ease-out]">
        
        {/* Left Column (Main Focus) */}
        <section className="md:col-span-8 flex flex-col gap-6">
            
            {/* Current Class (Hero) */}
            <div className="flex-1 min-h-[320px]">
                <CurrentClassCard event={currentEvent} />
            </div>
            
            {/* Widget Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 min-h-[280px]">
                <FocusTimer />
                <TodoList />
            </div>
        </section>

        {/* Right Column (Sidebar) */}
        <section className="md:col-span-4 flex flex-col gap-6">
            <div className="flex-[2] min-h-[400px]">
                <ScheduleList events={todaysEvents} currentEvent={currentEvent} />
            </div>
            <div className="flex-1 min-h-[150px]">
                <QuickLinks />
            </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-12 text-center flex justify-center items-center gap-4 text-gray-600 text-xs font-medium">
         <span>MBO Rijnland Dashboard v3.0</span>
         <span className="w-1 h-1 rounded-full bg-gray-700"></span>
         <span className={loading ? "text-yellow-500 animate-pulse" : "text-green-500"}>
            {loading ? "Rooster updaten..." : (scheduleSource === 'file' ? "Offline modus" : "Online modus")}
         </span>
      </footer>

      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)}
        currentUrl={icalUrl}
        currentName={userName}
        currentSource={scheduleSource}
        onSave={handleSaveSettings}
      />
    </div>
  );
};

export default App;
