import React from 'react';
import { Icons } from './Icon';
import { QuickLink } from '../types';

const links: QuickLink[] = [
    { name: 'EduArte', url: 'https://rijnland.eduarte.nl/', icon: 'book', color: 'from-orange-500 to-red-500' },
    { name: 'Canvas', url: 'https://mborijnland.instructure.com/', icon: 'grid', color: 'from-red-500 to-pink-500' },
    { name: 'Outlook', url: 'https://outlook.office.com/mail/', icon: 'mail', color: 'from-blue-500 to-cyan-500' },
    { name: 'Teams', url: 'https://teams.microsoft.com/', icon: 'users', color: 'from-indigo-500 to-purple-500' },
];

const QuickLinks: React.FC = () => {
  const getIcon = (name: string) => {
      switch(name) {
          case 'book': return <Icons.Book className="w-5 h-5 text-white" />;
          case 'grid': return <Icons.Grid className="w-5 h-5 text-white" />;
          case 'mail': return <Icons.Mail className="w-5 h-5 text-white" />;
          case 'users': return <Icons.Users className="w-5 h-5 text-white" />;
          default: return <Icons.Globe className="w-5 h-5 text-white" />;
      }
  }

  return (
    <div className="bg-glass border border-glassBorder rounded-3xl p-6 h-full flex flex-col justify-center">
        <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-bold">Snelkoppelingen</h3>
        <div className="grid grid-cols-2 gap-3">
            {links.map((link) => (
                <a 
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/5 hover:border-white/20 p-3 transition-all hover:scale-[1.02] active:scale-95"
                >
                    <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${link.color} shadow-lg`}>
                            {getIcon(link.icon)}
                        </div>
                        <span className="font-medium text-gray-200 group-hover:text-white text-sm">{link.name}</span>
                    </div>
                </a>
            ))}
        </div>
    </div>
  );
};

export default QuickLinks;
