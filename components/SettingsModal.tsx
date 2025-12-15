import React, { useState, useRef } from 'react';
import { Icons } from './Icon';
import { ScheduleSource } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  currentName: string;
  currentSource: ScheduleSource;
  onSave: (url: string, name: string, source: ScheduleSource, fileContent?: string) => void;
}

const SettingsModal: React.FC<Props> = ({ isOpen, onClose, currentUrl, currentName, currentSource, onSave }) => {
  const [activeTab, setActiveTab] = useState<'rooster' | 'profile'>('rooster');
  const [url, setUrl] = useState(currentUrl);
  const [name, setName] = useState(currentName);
  const [sourceMode, setSourceMode] = useState<ScheduleSource>(currentSource);
  const [fileName, setFileName] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFileContent(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSave = () => {
    // If source is file but no new file uploaded, we might want to keep using cached data or current state
    // For now, if source is file, we expect fileContent to be present if it's a NEW upload, 
    // or we assume the parent app keeps the old cache if we pass undefined for fileContent.
    onSave(url, name, sourceMode, fileContent || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-[#162032] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#1a253a]">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Icons.Settings className="w-5 h-5 text-rijnlandLight" /> Instellingen
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10">
                <Icons.X className="w-5 h-5" />
            </button>
        </div>

        {/* Tabs */}
        <div className="flex p-2 bg-[#111827] gap-2">
          <button 
            onClick={() => setActiveTab('rooster')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'rooster' ? 'bg-[#1e293b] text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <Icons.Calendar className="w-4 h-4" /> Rooster
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-[#1e293b] text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <Icons.User className="w-4 h-4" /> Profiel
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
            {activeTab === 'rooster' && (
              <div className="space-y-6">
                 <div className="flex bg-black/20 p-1 rounded-xl">
                    <button 
                      onClick={() => setSourceMode('url')}
                      className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${sourceMode === 'url' ? 'bg-rijnlandLight text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      Online (URL)
                    </button>
                    <button 
                      onClick={() => setSourceMode('file')}
                      className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${sourceMode === 'file' ? 'bg-rijnlandLight text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      Upload Bestand
                    </button>
                 </div>

                 {sourceMode === 'url' ? (
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">iCal URL</label>
                        <div className="relative">
                            <Icons.Globe className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                            <input 
                                type="text" 
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://rooster.mborijnland.nl/ical/..."
                                className="w-full bg-[#0f172a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-rijnlandLight focus:ring-1 focus:ring-rijnlandLight transition-all placeholder-gray-600"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                           Kopieer de iCal link vanuit EduArte of je rooster applicatie.
                        </p>
                    </div>
                 ) : (
                    <div>
                       <label className="block text-sm font-medium text-gray-300 mb-2">Upload .ics Bestand</label>
                       <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-white/20 hover:border-rijnlandLight/50 bg-[#0f172a] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group"
                       >
                          <input 
                            type="file" 
                            accept=".ics,text/calendar"
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                          />
                          <div className="bg-white/5 p-4 rounded-full mb-3 group-hover:bg-rijnlandLight/20 transition-colors">
                             <Icons.Upload className="w-8 h-8 text-gray-400 group-hover:text-rijnlandLight" />
                          </div>
                          <p className="text-sm text-gray-300 font-medium">
                            {fileName ? fileName : "Klik om te uploaden"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Ondersteunt .ics bestanden
                          </p>
                       </div>
                       <p className="text-xs text-green-400/80 mt-3 flex items-center gap-1.5">
                          <Icons.CheckCircle className="w-3 h-3" /> Ideaal voor lokaal gebruik (geen internet nodig).
                       </p>
                    </div>
                 )}
              </div>
            )}

            {activeTab === 'profile' && (
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Jouw Naam</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Bijv. Mark"
                            className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rijnlandLight focus:ring-1 focus:ring-rijnlandLight transition-all"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                           Wordt gebruikt voor de begroeting op het dashboard.
                        </p>
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-[#1a253a]">
            <button 
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-rijnlandBlue to-rijnlandLight hover:from-cyan-700 hover:to-cyan-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-black/20 flex justify-center items-center gap-2"
            >
                <Icons.CheckCircle className="w-5 h-5" /> Opslaan & Toepassen
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
