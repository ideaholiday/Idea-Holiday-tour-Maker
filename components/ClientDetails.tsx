
import React, { useState, useEffect, useMemo } from 'react';
import { Quotation, CityStay, ItineraryTemplate } from '../types';
import { storage } from '../utils/storage';
import { MASTER_TEMPLATES } from '../constants';
import { User, Calendar, Hash, Hotel, Globe, RefreshCw, Building2, Pencil, Sparkles, Plus, Trash2, MapPin, Banknote, Star, ArrowRight } from 'lucide-react';

interface Props {
  quotation: Quotation;
  setQuotation: React.Dispatch<React.SetStateAction<Quotation>>;
  onSkip?: () => void;
}

export default function ClientDetails({ quotation, setQuotation, onSkip }: Props) {
  const [isOther, setIsOther] = useState(false);
  const [customCountry, setCustomCountry] = useState('');

  const availableInventory = useMemo(() => {
    const allTours = storage.getTours();
    const allTransfers = storage.getTransfers();
    const managedCountries = storage.getCountries();
    
    const countries = new Set([
      ...managedCountries,
      ...allTours.map(t => t.country),
      ...allTransfers.map(tr => tr.country)
    ]);

    const citiesByCountry: Record<string, string[]> = {};
    allTours.forEach(t => {
      if (!citiesByCountry[t.country]) citiesByCountry[t.country] = [];
      if (!citiesByCountry[t.country].includes(t.city)) citiesByCountry[t.country].push(t.city);
    });

    return {
      countries: Array.from(countries).filter(Boolean).sort(),
      citiesByCountry
    };
  }, []);

  const PRESET_CORE = ['UAE', 'Thailand', 'India Goa', 'Vietnam'];

  useEffect(() => {
    if (quotation.country && !availableInventory.countries.includes(quotation.country)) {
      setIsOther(true);
      setCustomCountry(quotation.country);
    }
  }, [quotation.country, availableInventory.countries]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === 'country') {
      if (value === 'Other') {
        setIsOther(true);
        return;
      } else {
        setIsOther(false);
        setCustomCountry('');
        
        const firstCity = availableInventory.citiesByCountry[value]?.[0] || 'Principal City';
        setQuotation(prev => ({
          ...prev,
          country: value,
          city_stays: [{ city: firstCity, nights: 4, hotel_name: '', hotel_cost_inr: 0 }],
          number_of_days: 5,
          itinerary: []
        }));
      }
    }

    setQuotation(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const applyTemplate = (template: ItineraryTemplate) => {
    if (confirm(`Apply "${template.name}"? This will populate the destination and pre-select inventory.`)) {
      setQuotation(prev => ({
        ...prev,
        country: template.country,
        city_stays: template.city_stays,
        number_of_days: template.days,
        selected_tour_ids: [...template.tour_ids],
        selected_transfer_ids: [...template.transfer_ids],
        itinerary: [] // Clearing forces App.tsx to regenerate with correct day mapping
      }));
      
      // Small timeout ensures state settles before navigation
      setTimeout(() => {
        if (onSkip) onSkip();
      }, 100);
    }
  };

  const handleCityStayUpdate = (index: number, field: keyof CityStay, value: any) => {
    setQuotation(prev => {
      const newStays = [...prev.city_stays];
      newStays[index] = { ...newStays[index], [field]: (field === 'nights' || field === 'hotel_cost_inr') ? Number(value) : value };
      
      const totalNights = newStays.reduce((sum, s) => sum + s.nights, 0);
      return { ...prev, city_stays: newStays, number_of_days: totalNights + 1, itinerary: [] };
    });
  };

  const addCityStay = () => {
    const cities = availableInventory.citiesByCountry[quotation.country] || [];
    const usedCities = quotation.city_stays.map(s => s.city);
    const nextCity = cities.find(c => !usedCities.includes(c)) || 'Next City';
    
    setQuotation(prev => ({
      ...prev,
      city_stays: [...prev.city_stays, { city: nextCity, nights: 1, hotel_name: '', hotel_cost_inr: 0 }],
      number_of_days: prev.number_of_days + 1,
      itinerary: []
    }));
  };

  const removeCityStay = (index: number) => {
    if (quotation.city_stays.length <= 1) return;
    setQuotation(prev => {
      const removedNights = prev.city_stays[index].nights;
      const newStays = prev.city_stays.filter((_, i) => i !== index);
      return { ...prev, city_stays: newStays, number_of_days: prev.number_of_days - removedNights, itinerary: [] };
    });
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="bg-amber-100 p-2.5 rounded-2xl">
               <Star className="w-5 h-5 text-amber-600 fill-current" />
             </div>
             <div>
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">B2B Best Sellers</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Predefined Market Templates</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MASTER_TEMPLATES.map((tmpl) => (
            <div 
              key={tmpl.id} 
              className="group relative bg-white border rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col h-full"
            >
              <div className="h-40 relative">
                <img src={tmpl.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={tmpl.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute top-4 right-4">
                   <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                     {tmpl.country}
                   </span>
                </div>
                <div className="absolute bottom-4 left-6">
                   <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{tmpl.tagline}</p>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                   <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-tight mb-2">{tmpl.name}</h4>
                   <div className="flex items-center space-x-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <Calendar className="w-3.5 h-3.5" />
                     <span>{tmpl.days} Days Plan</span>
                   </div>
                </div>
                <button 
                  onClick={() => applyTemplate(tmpl)}
                  className="mt-6 w-full bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-600 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center space-x-2 border border-slate-100"
                >
                  <span>Quick Start</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-slate-100 pt-8">
        <h2 className="text-2xl font-bold text-slate-900">Step 1: Journey Scope & Destination</h2>
        <p className="text-slate-500 mt-1">Configure your destination and multi-city night distribution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
              <Globe className="w-3.5 h-3.5 mr-2 text-blue-500" /> Target Destination
            </label>
            <select
              name="country"
              value={isOther ? 'Other' : quotation.country}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none cursor-pointer"
            >
              {availableInventory.countries.map(c => (
                <option key={c} value={c}>{c} {!PRESET_CORE.includes(c) ? '(Custom)' : ''}</option>
              ))}
              <option value="Other">Manual Entry / New Market</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <User className="w-3.5 h-3.5 mr-2 text-blue-500" /> Lead Guest
              </label>
              <input type="text" name="client_name" value={quotation.client_name} onChange={handleChange} placeholder="John Doe" className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-2 text-blue-500" /> Start Date
              </label>
              <input type="date" name="travel_start_date" value={quotation.travel_start_date} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Adults</label>
                <input type="number" name="adults" min="1" value={quotation.adults} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Children</label>
                <input type="number" name="children" min="0" value={quotation.children} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold" />
             </div>
          </div>

          <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
             <div className="flex items-center space-x-3 mb-4">
                <Hotel className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-black uppercase tracking-widest text-blue-900">General Trip Logistics</span>
             </div>
             <div className="space-y-4">
               <input type="text" name="hotel_name" value={quotation.hotel_name} onChange={handleChange} placeholder="Other General Fees / Items..." className="w-full px-4 py-2 bg-white border border-blue-200 rounded-xl font-bold text-sm" />
               <div className="relative">
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                 <input type="number" name="hotel_cost_inr" value={quotation.hotel_cost_inr} onChange={handleChange} className="w-full pl-8 pr-4 py-2 bg-white border border-blue-200 rounded-xl font-bold text-sm" placeholder="Additional Logistics Cost" />
               </div>
             </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-xl">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight">Stay & Hotel Matrix</h3>
                <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">Multi-City Allocation</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-blue-400 leading-none">{quotation.number_of_days}D</p>
              <p className="text-[9px] font-black text-slate-500 uppercase">Total Trip</p>
            </div>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto max-h-[450px] pr-2 scrollbar-hide">
            {quotation.city_stays.map((stay, idx) => (
              <div key={idx} className="bg-slate-800 p-5 rounded-3xl border border-slate-700 space-y-4 animate-in slide-in-from-right-2">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                       <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400">
                          {idx + 1}
                       </div>
                       <select 
                         value={stay.city} 
                         onChange={(e) => handleCityStayUpdate(idx, 'city', e.target.value)}
                         className="bg-transparent font-black text-sm uppercase tracking-tight outline-none text-white cursor-pointer"
                       >
                         {(availableInventory.citiesByCountry[quotation.country] || [stay.city]).map(c => (
                           <option key={c} value={c} className="bg-slate-900">{c}</option>
                         ))}
                       </select>
                    </div>
                    <div className="flex items-center space-x-2">
                       <input 
                         type="number" 
                         min="1" 
                         value={stay.nights} 
                         onChange={(e) => handleCityStayUpdate(idx, 'nights', e.target.value)}
                         className="w-12 bg-slate-700 rounded-lg px-2 py-1 font-black text-blue-400 text-center outline-none"
                       />
                       <span className="text-[9px] font-black text-slate-500 uppercase">Nts</span>
                       {quotation.city_stays.length > 1 && (
                          <button onClick={() => removeCityStay(idx)} className="p-1.5 hover:bg-red-500/20 text-slate-600 hover:text-red-400 transition-colors rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                       )}
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-3 pt-3 border-t border-slate-700/50">
                    <div className="space-y-1">
                       <label className="text-[8px] font-black text-slate-500 uppercase flex items-center">
                          <Hotel className="w-2.5 h-2.5 mr-1 text-blue-500" /> City Hotel Name
                       </label>
                       <input 
                          type="text" 
                          placeholder="e.g. Hilton Hanoi Opera"
                          value={stay.hotel_name || ''}
                          onChange={(e) => handleCityStayUpdate(idx, 'hotel_name', e.target.value)}
                          className="w-full bg-slate-700/50 border border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all"
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[8px] font-black text-slate-500 uppercase flex items-center">
                          <Banknote className="w-2.5 h-2.5 mr-1 text-blue-500" /> Hotel Budget (INR)
                       </label>
                       <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[10px]">₹</span>
                          <input 
                             type="number" 
                             placeholder="Total for stay"
                             value={stay.hotel_cost_inr || ''}
                             onChange={(e) => handleCityStayUpdate(idx, 'hotel_cost_inr', e.target.value)}
                             className="w-full bg-slate-700/50 border border-slate-700 rounded-xl pl-7 pr-4 py-2 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all"
                          />
                       </div>
                    </div>
                 </div>
              </div>
            ))}
          </div>

          <button 
            onClick={addCityStay}
            className="mt-6 w-full flex items-center justify-center space-x-2 border-2 border-dashed border-slate-700 rounded-2xl py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-blue-500 hover:text-blue-400 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Next Destination City</span>
          </button>

          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
             <div className="flex items-center space-x-2 text-slate-500">
               <Sparkles className="w-4 h-4 text-amber-500" />
               <span className="text-[10px] font-black uppercase">Smart Route Sync Active</span>
             </div>
             <span className="text-[10px] font-black text-slate-500 uppercase">#{quotation.reference_no}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
