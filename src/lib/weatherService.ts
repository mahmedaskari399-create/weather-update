/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Weather Service using OpenWeatherMap API
// Supports: Current Weather, 5-day/3-hour Forecast, Air Quality, Geocoding

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export interface WeatherData {
  city: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  description: string;
  icon: string;
  sunrise: number;
  sunset: number;
  dt: number;
  aqi?: number;
  hourly: { time: string; temp: number; icon: string }[];
  daily: { date: string; min: number; max: number; icon: string; condition: string }[];
  location: { lat: number; lon: number };
}

// Mock data for demo mode if no API key is provided
const MOCK_WEATHER: WeatherData = {
  city: 'San Francisco',
  temp: 18,
  feelsLike: 17,
  tempMin: 15,
  tempMax: 22,
  humidity: 65,
  windSpeed: 12,
  condition: 'Clear',
  description: 'clear sky',
  icon: '01d',
  sunrise: 1625055600,
  sunset: 1625103600,
  dt: 1625070000,
  aqi: 1,
  hourly: Array.from({ length: 24 }).map((_, i) => ({
    time: `${(new Date().getHours() + i) % 24}:00`,
    temp: 18 + Math.sin(i / 4) * 5,
    icon: i % 8 === 0 ? '02d' : '01d',
  })),
  daily: Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      date: d.toLocaleDateString('en-US', { weekday: 'short' }),
      min: 14 + Math.random() * 2,
      max: 22 + Math.random() * 4,
      icon: '01d',
      condition: 'Sunny',
    };
  }),
  location: { lat: 37.7749, lon: -122.4194 }
};

export async function getWeatherData(cityQuery: string, units: 'metric' | 'imperial' = 'metric'): Promise<WeatherData> {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
    console.warn('Weather API Key missing. Using demo mode.');
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_WEATHER), 1000));
  }

  try {
    // 1. Get coordinates
    const geoRes = await fetch(`${GEO_URL}/direct?q=${cityQuery}&limit=1&appid=${API_KEY}`);
    const geoData = await geoRes.json();
    if (!geoData.length) throw new Error('City not found');

    const { lat, lon, name } = geoData[0];

    // 2. Get current weather
    const weatherRes = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`);
    const weatherData = await weatherRes.json();

    // 3. Get forecast (5 day/3 hour)
    const forecastRes = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`);
    const forecastData = await forecastRes.json();

    // 4. Get AQI
    const aqiRes = await fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    const aqiData = await aqiRes.json();

    return transformData(weatherData, forecastData, aqiData, name, { lat, lon });
  } catch (err) {
    console.error('Weather fetch error:', err);
    throw err;
  }
}

export async function getWeatherDataByCoords(lat: number, lon: number, units: 'metric' | 'imperial' = 'metric'): Promise<WeatherData> {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
    return MOCK_WEATHER;
  }

  try {
    const weatherRes = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`);
    const weatherData = await weatherRes.json();

    const forecastRes = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`);
    const forecastData = await forecastRes.json();

    const aqiRes = await fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    const aqiData = await aqiRes.json();

    return transformData(weatherData, forecastData, aqiData, weatherData.name, { lat, lon });
  } catch (err) {
    console.error('Coords weather error:', err);
    throw err;
  }
}

function transformData(current: any, forecast: any, aqi: any, name: string, coords: { lat: number, lon: number }): WeatherData {
  // Transform 3-hourly forecast to hourly for UI (simulated interpolation or just picking)
  const hourly = forecast.list.slice(0, 24).map((item: any) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(item.main.temp),
    icon: item.weather[0].icon,
  }));

  // Aggregate daily info
  const dailyMap = new Map();
  forecast.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date,
        min: item.main.temp_min,
        max: item.main.temp_max,
        icon: item.weather[0].icon,
        condition: item.weather[0].main,
      });
    } else {
      const existing = dailyMap.get(date);
      existing.min = Math.min(existing.min, item.main.temp_min);
      existing.max = Math.max(existing.max, item.main.temp_max);
    }
  });

  return {
    city: name,
    temp: Math.round(current.main.temp),
    feelsLike: Math.round(current.main.feels_like),
    tempMin: Math.round(current.main.temp_min),
    tempMax: Math.round(current.main.temp_max),
    humidity: current.main.humidity,
    windSpeed: current.wind.speed,
    condition: current.weather[0].main,
    description: current.weather[0].description,
    icon: current.weather[0].icon,
    sunrise: current.sys.sunrise,
    sunset: current.sys.sunset,
    dt: current.dt,
    aqi: aqi.list[0].main.aqi,
    hourly,
    daily: Array.from(dailyMap.values()).slice(0, 7),
    location: coords
  };
}
