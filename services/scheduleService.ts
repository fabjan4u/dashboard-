import { ScheduleEvent } from '../types';

declare global {
  interface Window {
    ICAL: any;
  }
}

export const parseICalData = (icalData: string): ScheduleEvent[] => {
  try {
    const ICAL = window.ICAL;
    if (!ICAL) throw new Error("ICAL library not loaded");

    const jcalData = ICAL.parse(icalData);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');

    const events: ScheduleEvent[] = vevents.map((evt: any) => {
      const summary = evt.getFirstPropertyValue('summary');
      const location = evt.getFirstPropertyValue('location') || 'Onbekend';
      const dtstart = evt.getFirstPropertyValue('dtstart');
      const dtend = evt.getFirstPropertyValue('dtend');

      return {
        summary: summary,
        location: location,
        start: dtstart.toJSDate(),
        end: dtend.toJSDate(),
      };
    });

    // Sort by start time
    return events.sort((a, b) => a.start.getTime() - b.start.getTime());
  } catch (e) {
    console.error("Failed to parse iCal data", e);
    return [];
  }
};

export const fetchSchedule = async (url: string): Promise<ScheduleEvent[]> => {
  if (!url) return [];
  // Using a CORS proxy to bypass browser restrictions for external iCal feeds
  const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
  
  try {
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error('Network response was not ok');
    const text = await response.text();
    return parseICalData(text);
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const getTodaysEvents = (events: ScheduleEvent[]): ScheduleEvent[] => {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));

  return events.filter(e => e.start >= startOfDay && e.start <= endOfDay);
};

export const getCurrentEvent = (events: ScheduleEvent[]): ScheduleEvent | undefined => {
  const now = new Date();
  return events.find(e => now >= e.start && now < e.end);
};

export const getNextEvent = (events: ScheduleEvent[]): ScheduleEvent | undefined => {
  const now = new Date();
  return events.find(e => e.start > now);
};
