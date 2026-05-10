/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWeatherData, getWeatherDataByCoords, WeatherData } from './weatherService';

type Units = 'metric' | 'imperial';

interface WeatherContextType {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  units: Units;
  toggleUnits: () => void;
  searchCity: (city: string) => Promise<void>;
  detectLocation: () => Promise<void>;
  favorites: string[];
  toggleFavorite: (city: string) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<Units>('metric');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('skycast_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchWeather = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherData(query, units);
      setWeather(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  }, [units]);

  const detectLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await getWeatherDataByCoords(pos.coords.latitude, pos.coords.longitude, units);
          setWeather(data);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch weather by location');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError('Location access denied. Please search for a city.');
        setLoading(false);
        fetchWeather('San Francisco'); // Fallback
      }
    );
  }, [units, fetchWeather]);

  useEffect(() => {
    detectLocation();
  }, [units]); // Refresh on unit change

  useEffect(() => {
    localStorage.setItem('skycast_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleUnits = () => setUnits(prev => prev === 'metric' ? 'imperial' : 'metric');

  const searchCity = async (city: string) => {
    await fetchWeather(city);
  };

  const toggleFavorite = (city: string) => {
    setFavorites(prev => 
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
  };

  return (
    <WeatherContext.Provider value={{
      weather,
      loading,
      error,
      units,
      toggleUnits,
      searchCity,
      detectLocation,
      favorites,
      toggleFavorite
    }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error('useWeather must be used within WeatherProvider');
  return context;
};
