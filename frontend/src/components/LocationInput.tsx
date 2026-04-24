'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { API_URL } from '@/utils/api';
import { useApiKey } from '@/hooks/useApiKey';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: any;
}

export default function LocationInput({ value, onChange, placeholder, label, icon: Icon = MapPin }: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const apiKey = useApiKey();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/locations/search?q=${encodeURIComponent(query)}`, {
        headers: { 'x-api-key': apiKey || '' }
      });
      const data = await res.json();
      setSuggestions(data);
      setShowDropdown(data.length > 0);
    } catch (err) {
      console.error('Failed to fetch suggestions', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    fetchSuggestions(val);
  };

  return (
    <div className="flex-1 space-y-3 w-full relative" ref={dropdownRef}>
      {label && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>}
      <div className="relative">
        <Icon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
        <input 
          type="text" 
          placeholder={placeholder} 
          className="w-full pl-14 pr-12 py-4.5 bg-slate-50 rounded-2xl font-black text-slate-900 border-2 border-transparent outline-none focus:ring-0 focus:border-blue-500/20 focus:bg-white transition-all shadow-inner shadow-slate-100/50 uppercase"
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length >= 3 && setShowDropdown(true)}
        />
        {loading && <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 animate-spin" size={18} />}
      </div>

      {showDropdown && (
        <div className="autocomplete-dropdown">
          {suggestions.map((s, i) => (
            <div 
              key={i} 
              className="autocomplete-item hover:bg-[#0A1629] group"
              onClick={() => {
                onChange(s.full_address || s.name);
                setShowDropdown(false);
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                  <MapPin size={18} className="text-blue-500 group-hover:text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-black text-slate-900 group-hover:text-white transition-colors">{s.name}</span>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-white/60 uppercase tracking-tight">{[s.city, s.state, s.country].filter(Boolean).join(', ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
