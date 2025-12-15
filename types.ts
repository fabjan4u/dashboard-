export interface ScheduleEvent {
  summary: string;
  location: string;
  start: Date;
  end: Date;
  description?: string;
  isCurrent?: boolean;
}

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  description: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export type ScheduleSource = 'url' | 'file';

export interface UserSettings {
  userName: string;
  icalUrl: string;
  lastScheduleSource: ScheduleSource;
  // We store the raw ical data string for offline/file usage
  cachedScheduleData: string; 
}

export interface QuickLink {
  name: string;
  url: string;
  icon: 'book' | 'mail' | 'users' | 'grid';
  color: string;
}
