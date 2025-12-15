import { WeatherData } from '../types';

// Simple mapping based on WMO Weather interpretation codes (WW)
const getWeatherDescription = (code: number): string => {
  if (code === 0) return 'Helder';
  if (code <= 3) return 'Bewolkt';
  if (code <= 48) return 'Mist';
  if (code <= 55) return 'Motregen';
  if (code <= 65) return 'Regen';
  if (code <= 75) return 'Sneeuw';
  if (code <= 82) return 'Buien';
  if (code <= 99) return 'Onweer';
  return 'Onbekend';
};

export const fetchWeather = async (lat: number = 52.16, lon: number = 4.49): Promise<WeatherData | null> => {
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const data = await res.json();
    
    return {
      temperature: Math.round(data.current_weather.temperature),
      weatherCode: data.current_weather.weathercode,
      description: getWeatherDescription(data.current_weather.weathercode)
    };
  } catch (e) {
    console.error("Weather fetch failed", e);
    return null;
  }
};
