
import React, { useState, useMemo } from 'react';
import { Quotation, TourItem, TransferItem, Category } from '../types';
import { storage } from '../utils/storage';
import { Search, Clock, MapPin, Check, ArrowLeft, Plus, Sparkles, X, Save, AlertCircle, Image as ImageIcon, Waves, Landmark, TreePalm, Zap, Car, Plane, Ship, Filter, AlignLeft } from 'lucide-react';

interface Props {
  quotation: Quotation;
  setQuotation: React.Dispatch<React.SetStateAction<Quotation>>;
  onBack: () => void;
  dataVersion?: number;
}

export default function TourSelector({ quotation, setQuotation, onBack, dataVersion }: Props) {
  const [filter, setFilter] = useState('');
  const [activeSegment, setActiveSegment] = useState<'All' | 'Tours' | 'Logistics'>('All');
  const [activeCityFilter, setActiveCityFilter] = useState<string>('All');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [localVersion, setLocalVersion] = useState(0);

  const allTours = storage.getTours();
  const allTransfers = storage.getTransfers();

  // Unified Pool: Both Tours and Transfers
  const inventoryPool = useMemo(() => {
    const countryTours = allTours.filter(t => t.country.toLowerCase() === quotation.country.toLowerCase());
    const countryTransfers = allTransfers.filter(tr => tr.country.toLowerCase() === quotation.country.toLowerCase());

    return [
      ...countryTours.map(t => ({ ...t, isTransfer: false })),
      ...countryTransfers.map(tr => ({ 
        id: tr.id, 
        name: tr.route, 
        city: 'Logistics', 
        country: tr.country, 
        adult_price_inr: tr.price_inr, 
        child_price_inr: 0, 
        category: Category.TRANSFER, 
        duration: 'Point-to-Point', 
        description: tr.description,
        isTransfer: true,
        vehicle_type: tr.vehicle_type
      }))
    ];
  }, [allTours, allTransfers, quotation.country, localVersion]);

  const availableCities = useMemo(() => {
    const cities = new Set(inventoryPool.map(item => item.city));
    return ['All', ...Array.from(cities).filter(c => c !== 'Logistics').sort()];
  }, [inventoryPool]);

  const filteredItems = inventoryPool.filter(item => {
    const matchesFilter = item.name.toLowerCase().includes(filter.toLowerCase());
    const matchesSegment = activeSegment === 'All' || 
      (activeSegment === 'Tours' && !item.isTransfer) || 
      (activeSegment === 'Logistics' && item.isTransfer);
    const matchesCity = activeCityFilter === 'All' || item.city === activeCityFilter || item.city === 'Logistics';
    return matchesFilter && matchesSegment && matchesCity;
  });

  const toggleItem = (id: string, isTransfer: boolean) => {
    setQuotation(prev => {
      const key = isTransfer ? 'selected_transfer_ids' : 'selected_tour_ids';
      const isSelected = prev[key].includes(id);
      const newIds = isSelected 
        ? prev[key].filter(existingId => existingId !== id)
        : [...prev[key], id];
      
      return { ...prev, [key]: newIds };
    });
  };

  const getIcon = (item: any) => {
    if (item.isTransfer) return <Car className="w-4 h-4" />;
    const cat = item.category;
    if (cat === Category.ISLAND_TOUR) return <Waves className="w-4 h-4" />;
    if (cat === Category.CITY_TOUR) return <Landmark className="w-4 h-4" />;
    return <MapPin className="w-4 h-4" />;
  };

  const handleQuickAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const segmentChoice = formData.get('segment') as string;
    const isTr = segmentChoice === 'Logistics';
    
    if (isTr) {
      const newTr: TransferItem = {
        id: `manual-tr-${Date.now()}`,
        route: formData.get('name') as string,
        country: quotation.country,
        vehicle_type: 'Van',
        price_inr: Number(formData.get('adult_price_inr')),
        description: formData.get('description') as string || 'Manual logistics entry.',
      };
      const updatedTransfers = [newTr, ...allTransfers];
      storage.saveTransfers(updatedTransfers);
      setQuotation(prev => ({
        ...prev,
        selected_transfer_ids: [...prev.selected_transfer_ids, newTr.id]
      }));
    } else {
      const newTour: TourItem = {
        id: `manual-t-${Date.now()}`,
        name: formData.get('name') as string,
        city: formData.get('city') as string,
        country: quotation.country,
        adult_price_inr: Number(formData.get('adult_price_inr')),
        child_price_inr: Number(formData.get('child_price_inr') || 0),
        sharing_transfer_price_inr: 0,
        private_transfer_price_inr: 0,
        category: (formData.get('category') as Category) || Category.CITY_TOUR,
        duration: 'Flexible',
        description: formData.get('description') as string || 'Manual sightseeing entry.',
        image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=400',
      };
      const updatedTours = [newTour, ...allTours];
      storage.saveTours(updatedTours);
      setQuotation(prev => ({
        ...prev,
        selected_tour_ids: [...prev.selected_tour_ids, newTour.id]
      }));
    }

    setShowQuickAdd(false);
    setLocalVersion(v => v + 1);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button onClick={onBack} className="flex items-center text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 hover:underline group">
            <ArrowLeft className="w-3 h-3 mr-1 transition-transform group-hover:-translate-x-1" /> Back to Details
          </button>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Market Inventory: {quotation.country}</h2>
            <div className="bg-blue-600 text-white px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-lg shadow-blue-100">
               <Sparkles className="w-3 h-3" />
               <span className="text-[10px] font-black uppercase tracking-widest">Unified Pool</span>
            </div>
          </div>
          <p className="text-slate-500 mt-1">Select sightseeing and essential logistics for the quotation.</p>
        </div>
        
        <button onClick={() => setShowQuickAdd(true)} className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl font-black shadow-xl transition-all active:scale-95 uppercase tracking-widest text-xs">
          <Plus className="w-4 h-4" />
          <span>Add Custom Service</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter inventory by name, city or route..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold text-sm shadow-sm"
            />
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-2xl border shadow-inner">
            {['All', 'Tours', 'Logistics'].map(seg => (
              <button
                key={seg}
                onClick={() => setActiveSegment(seg as any)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSegment === seg ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {seg}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
          <div className="bg-slate-900 text-white px-3 py-1.5 rounded-full flex items-center space-x-2">
            <Filter className="w-3 h-3" />
            <span className="text-[9px] font-black uppercase tracking-widest">Region</span>
          </div>
          {availableCities.map(city => (
            <button
              key={city}
              onClick={() => setActiveCityFilter(city)}
              className={`flex items-center space-x-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-tight transition-all border
                ${activeCityFilter === city ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
            >
              <span>{city}</span>
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => {
            const isSelected = item.isTransfer 
              ? quotation.selected_transfer_ids.includes(item.id)
              : quotation.selected_tour_ids.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id, item.isTransfer)}
                className={`
                  group relative flex flex-col rounded-[2.5rem] border-2 overflow-hidden transition-all cursor-pointer h-full
                  ${isSelected ? 'border-blue-600 bg-blue-50/20 shadow-xl scale-[1.02]' : 'bg-white border-transparent hover:border-slate-200 shadow-sm'}
                `}
              >
                {!item.isTransfer ? (
                  <div className="h-44 relative">
                    <img src={(item as any).image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                       <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20">
                         {item.city}
                       </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-44 bg-slate-900 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 blur-3xl rounded-full" />
                    <Car className="w-12 h-12 text-blue-500 mb-4" />
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">Transport Route</span>
                    <h4 className="text-white font-black text-sm uppercase leading-tight tracking-tight line-clamp-2">{item.name}</h4>
                  </div>
                )}
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                       <span className={`text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${item.isTransfer ? 'bg-slate-900 text-white' : 'bg-blue-100 text-blue-600'}`}>
                         {item.category}
                       </span>
                       {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                    <h3 className="font-black text-slate-900 leading-tight text-sm uppercase tracking-tight h-10 line-clamp-2">{item.name}</h3>
                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center text-[9px] text-slate-400 font-black uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> {item.duration}
                      </div>
                      {item.isTransfer && (
                         <div className="flex items-center text-[9px] text-slate-400 font-black uppercase tracking-widest">
                           <Car className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> {(item as any).vehicle_type}
                         </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Net Rate (INR)</p>
                      <p className="text-xl font-black text-slate-900 tracking-tighter">₹{item.adult_price_inr.toLocaleString()}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-300'}`}>
                      {isSelected ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 text-center bg-white border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center space-y-4 shadow-inner">
          <div className="bg-slate-50 p-8 rounded-full border border-slate-100">
            <AlertCircle className="w-12 h-12 text-slate-200" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Inventory Vacant</h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] max-w-xs mx-auto mt-2 leading-relaxed">No products matched the current filters for {quotation.country}.</p>
          </div>
        </div>
      )}

      {showQuickAdd && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="px-10 py-8 border-b flex items-center justify-between bg-slate-50">
               <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Manual Entry</h4>
               <button onClick={() => setShowQuickAdd(false)} className="p-2 hover:bg-slate-200 rounded-full transition-all"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <form onSubmit={handleQuickAdd} className="p-10 space-y-6">
              <div className="flex bg-slate-100 p-1 rounded-2xl mb-4 border border-slate-200 shadow-inner">
                {['Tours', 'Logistics'].map(s => (
                  <label key={s} className="flex-1 text-center py-2.5 cursor-pointer rounded-xl transition-all has-[:checked]:bg-white has-[:checked]:shadow-sm has-[:checked]:text-blue-600 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                    <input type="radio" name="segment" value={s} defaultChecked={s === 'Tours'} className="sr-only" />
                    {s}
                  </label>
                ))}
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Name / Route</label>
                  <input name="name" required placeholder="e.g. Landmark Sightseeing" className="w-full px-6 py-4 bg-slate-50 border rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                    <input name="city" required placeholder="e.g. Bangkok" className="w-full px-5 py-3 bg-slate-50 border rounded-xl font-bold outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Price INR</label>
                    <input type="number" name="adult_price_inr" required className="w-full px-5 py-3 bg-slate-50 border rounded-xl font-bold outline-none" placeholder="0" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
                    <AlignLeft className="w-3 h-3 mr-1" /> Description / Remarks
                  </label>
                  <textarea name="description" rows={3} className="w-full px-6 py-4 bg-slate-50 border rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all resize-none" placeholder="Provide service details for the itinerary..." />
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-blue-600 transition-all active:scale-95">Apply to Selection</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
