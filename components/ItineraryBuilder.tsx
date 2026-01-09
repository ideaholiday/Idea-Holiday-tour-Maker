
import React, { useState, useMemo } from 'react';
import { Quotation, TransferType, Category, CityStay, TourItem, TransferItem } from '../types';
import { storage } from '../utils/storage';
import { 
  Coffee, Sun, Moon, MapPin, Check, Plane, ArrowLeft, 
  Plus, Trash2, LayoutGrid, AlertTriangle, Edit3, 
  Building2, Filter, Sparkles, Search, Globe2, 
  Landmark, Zap, Calendar, Ship, AlignLeft, X, Lock, Waves,
  ChevronRight, ToggleRight, ToggleLeft, MinusCircle, PlusCircle, CheckCircle2, XCircle, FileText, Info,
  ShieldCheck, Database, BookmarkCheck, LayoutPanelLeft, Layers, Tags, Ticket
} from 'lucide-react';

interface Props {
  quotation: Quotation;
  setQuotation: React.Dispatch<React.SetStateAction<Quotation>>;
  onBack: () => void;
  dataVersion?: number;
}

export default function ItineraryBuilder({ quotation, setQuotation, onBack, dataVersion }: Props) {
  const [activeDayNumber, setActiveDayNumber] = useState(1);
  const [showCustomAdd, setShowCustomAdd] = useState(false);
  const [poolFilter, setPoolFilter] = useState<'All' | 'Tours' | 'Logistics'>('All');
  const [poolSource, setPoolSource] = useState<'Selected' | 'Global'>('Selected');
  const [activeEditorTab, setActiveEditorTab] = useState<'plan' | 'extras'>('plan');
  const [showAllRegions, setShowAllRegions] = useState(false);
  const [poolSearch, setPoolSearch] = useState('');
  
  // Custom Add State
  const [customType, setCustomType] = useState<'tour' | 'transfer'>('tour');
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customAdultPrice, setCustomAdultPrice] = useState<string>('');
  const [customChildPrice, setCustomChildPrice] = useState<string>('');
  
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');
  
  const [confirmDelete, setConfirmDelete] = useState<{ dayNum: number, idx: number } | null>(null);

  // Unified Data Pulling
  const allTours = storage.getTours();
  const allTransfers = storage.getTransfers();

  const activeDay = quotation.itinerary.find(d => d.day_number === activeDayNumber) || quotation.itinerary[0];

  const availableActivities = useMemo(() => {
    const qCountry = (quotation.country || '').toLowerCase();
    
    // Determine Source
    const toursToFilter = poolSource === 'Selected' 
      ? allTours.filter(t => quotation.selected_tour_ids.includes(t.id))
      : allTours.filter(t => (t.country || '').toLowerCase() === qCountry);

    const transfersToFilter = poolSource === 'Selected'
      ? allTransfers.filter(tr => quotation.selected_transfer_ids.includes(tr.id))
      : allTransfers.filter(tr => (tr.country || '').toLowerCase() === qCountry);

    let combined = [
      ...toursToFilter.map(t => ({ 
        id: t.id, 
        name: t.name, 
        city: t.city,
        category: t.category,
        description: t.description,
        type: 'tour' as const,
        isSharingOnly: t.is_sharing_only,
        image: t.image,
        isMaster: true
      })),
      ...transfersToFilter.map(tr => ({ 
        id: tr.id, 
        name: `${tr.route} (${tr.vehicle_type})`, 
        city: 'Logistics',
        category: Category.TRANSFER,
        description: tr.description,
        type: 'transfer' as const,
        isSharingOnly: false,
        image: undefined,
        isMaster: true
      }))
    ];

    // Search filter
    if (poolSearch.trim()) {
      const query = poolSearch.toLowerCase();
      combined = combined.filter(a => 
        a.name.toLowerCase().includes(query) || 
        a.city.toLowerCase().includes(query)
      );
    }

    // Segment filter
    if (poolFilter === 'Tours') combined = combined.filter(a => a.type === 'tour');
    if (poolFilter === 'Logistics') combined = combined.filter(a => a.type === 'transfer');

    // Region Visibility
    if (!showAllRegions) {
      const currentCityLower = (activeDay.overnight_city || '').toLowerCase();
      const cityMatch = combined.filter(a => a.type === 'tour' && a.city.toLowerCase() === currentCityLower);
      if (cityMatch.length > 0) {
        combined = combined.filter(a => a.type === 'transfer' || a.city.toLowerCase() === currentCityLower);
      }
    }

    return combined;
  }, [allTours, allTransfers, poolFilter, poolSource, activeDay.overnight_city, showAllRegions, poolSearch, quotation.selected_tour_ids, quotation.selected_transfer_ids, quotation.country, dataVersion]);

  const updateDay = (dayNum: number, updates: any) => {
    setQuotation(prev => ({
      ...prev,
      itinerary: prev.itinerary.map(d => d.day_number === dayNum ? { ...d, ...updates } : d)
    }));
  };

  const addActivityToDay = (dayNum: number, activityId: string, type: 'tour' | 'transfer') => {
    setQuotation(prev => {
      const updatedTours = type === 'tour' && !prev.selected_tour_ids.includes(activityId)
        ? [...prev.selected_tour_ids, activityId]
        : prev.selected_tour_ids;
      
      const updatedTransfers = type === 'transfer' && !prev.selected_transfer_ids.includes(activityId)
        ? [...prev.selected_transfer_ids, activityId]
        : prev.selected_transfer_ids;

      return {
        ...prev,
        selected_tour_ids: updatedTours,
        selected_transfer_ids: updatedTransfers,
        itinerary: prev.itinerary.map(d => {
          if (d.day_number !== dayNum) return d;
          return { 
            ...d, 
            assigned_tours: [...d.assigned_tours, { tour_id: activityId, transfer_type: 'Sharing' }] 
          };
        })
      };
    });
  };

  const removeActivityFromDay = (dayNum: number, idx: number) => {
    setQuotation(prev => ({
      ...prev,
      itinerary: prev.itinerary.map(d => {
        if (d.day_number !== dayNum) return d;
        const newAssigned = [...d.assigned_tours];
        newAssigned.splice(idx, 1);
        return { ...d, assigned_tours: newAssigned };
      })
    }));
    setConfirmDelete(null);
  };

  const toggleMeal = (dayNum: number, meal: 'breakfast' | 'lunch' | 'dinner') => {
    setQuotation(prev => ({
      ...prev,
      itinerary: prev.itinerary.map(d => d.day_number === dayNum ? { ...d, meals: { ...d.meals, [meal]: !d.meals[meal] } } : d)
    }));
  };

  const updateTransferType = (dayNum: number, idx: number, type: TransferType) => {
    setQuotation(prev => ({
      ...prev,
      itinerary: prev.itinerary.map(d => {
        if (d.day_number !== dayNum) return d;
        const newAssigned = [...d.assigned_tours];
        newAssigned[idx] = { ...newAssigned[idx], transfer_type: type };
        return { ...d, assigned_tours: newAssigned };
      })
    }));
  };

  const addTag = (type: 'inclusion' | 'exclusion', value: string) => {
    if (!value.trim()) return;
    const key = type === 'inclusion' ? 'inclusions' : 'exclusions';
    const currentList = activeDay[key] || [];
    if (currentList.includes(value)) return;
    updateDay(activeDay.day_number, { [key]: [...currentList, value] });
    if (type === 'inclusion') setNewInclusion(''); else setNewExclusion('');
  };

  const removeTag = (type: 'inclusion' | 'exclusion', value: string) => {
    const key = type === 'inclusion' ? 'inclusions' : 'exclusions';
    updateDay(activeDay.day_number, { [key]: (activeDay[key] || []).filter(v => v !== value) });
  };

  const getFormattedDate = (dayNumber: number) => {
    const baseDate = quotation.travel_start_date ? new Date(quotation.travel_start_date) : new Date();
    const date = new Date(baseDate);
    date.setDate(date.getDate() + (dayNumber - 1));
    return {
      compact: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      weekday: date.toLocaleDateString('en-GB', { weekday: 'short' }),
      full: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      fullWeekday: date.toLocaleDateString('en-GB', { weekday: 'long' })
    };
  };

  const currentStay = (function() {
    let cumulativeNights = 0;
    for (const stay of quotation.city_stays) {
      cumulativeNights += stay.nights;
      if (activeDayNumber <= cumulativeNights) return stay;
    }
    return quotation.city_stays[quotation.city_stays.length - 1];
  })();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case Category.ISLAND_TOUR: return <Waves className="w-5 h-5" />;
      case Category.CITY_TOUR: return <Landmark className="w-5 h-5" />;
      case Category.CRUISE: return <Ship className="w-5 h-5" />;
      case Category.TRANSFER: return <Plane className="w-5 h-5" />;
      default: return <Ticket className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-700">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 backdrop-blur-sm p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-6">
          <button onClick={onBack} className="p-3 hover:bg-slate-100 rounded-2xl transition-all group border border-slate-100 bg-white">
            <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-1.5">Smart Itinerary Builder</h2>
            <div className="flex items-center space-x-3">
               <span className="bg-blue-600 text-white px-3 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest">{quotation.country}</span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{quotation.number_of_days} Days Trip</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-4">
           <div className="flex items-center bg-white px-5 py-2.5 rounded-2xl border border-slate-100">
              <Calendar className="w-4 h-4 text-blue-600 mr-3" />
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Start Date</p>
                <p className="text-[10px] font-black text-slate-900 uppercase">{getFormattedDate(1).full}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-2 space-y-3 max-h-[800px] overflow-y-auto pr-2 scrollbar-hide">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 px-3">Trip Roadmap</p>
          {quotation.itinerary.map((day) => {
            const isActive = activeDayNumber === day.day_number;
            const dateInfo = getFormattedDate(day.day_number);
            return (
              <button
                key={day.day_number}
                onClick={() => setActiveDayNumber(day.day_number)}
                className={`w-full group flex flex-col p-4 rounded-[1.8rem] border transition-all duration-300 ${
                  isActive 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.05] z-10' 
                  : 'bg-white border-transparent text-slate-500 hover:border-blue-100 hover:bg-blue-50/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2 w-full">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-blue-400' : 'text-slate-400'}`}>Day {day.day_number}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${day.assigned_tours.length > 0 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                </div>
                <h4 className="text-[10px] font-black uppercase truncate text-left mb-0.5">{day.title}</h4>
                <p className={`text-[8px] font-bold uppercase tracking-widest text-left ${isActive ? 'text-slate-500' : 'text-slate-300'}`}>{dateInfo.compact}</p>
              </button>
            );
          })}
        </div>

        {/* Content Designer */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-[3.5rem] border border-slate-100 p-8 shadow-2xl min-h-[800px] flex flex-col relative overflow-hidden">
             <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
             
             <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100 mb-8 shrink-0">
               <button onClick={() => setActiveEditorTab('plan')} className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeEditorTab === 'plan' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>Narrative & Services</button>
               <button onClick={() => setActiveEditorTab('extras')} className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeEditorTab === 'extras' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>Details & Meals</button>
             </div>

             <div className="flex-1">
                {activeEditorTab === 'plan' ? (
                  <div className="space-y-10 animate-in fade-in duration-500">
                    <div className="border-b border-slate-50 pb-6">
                      <div className="flex items-center space-x-3 mb-3">
                         <div className="bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Day {activeDay.day_number} Plan</div>
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{getFormattedDate(activeDay.day_number).fullWeekday}</span>
                      </div>
                      <input 
                        type="text" 
                        value={activeDay.title} 
                        onChange={(e) => updateDay(activeDay.day_number, { title: e.target.value })} 
                        className="text-3xl font-black bg-transparent border-none focus:ring-0 outline-none w-full p-0 text-slate-900 placeholder:text-slate-200 transition-all uppercase tracking-tighter" 
                        placeholder="Day Title..." 
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center px-2"><AlignLeft className="w-3.5 h-3.5 mr-2 text-blue-500" /> Itinerary Context</label>
                      <textarea 
                        rows={5} 
                        value={activeDay.description} 
                        onChange={(e) => updateDay(activeDay.day_number, { description: e.target.value })} 
                        className="w-full bg-slate-50/30 border-2 border-slate-50 rounded-[2.5rem] p-8 text-[15px] text-slate-600 font-medium leading-relaxed outline-none focus:bg-white focus:border-blue-100 transition-all resize-none" 
                        placeholder="Describe the day's events..." 
                      />
                    </div>

                    <div className="space-y-6">
                       <div className="flex items-center justify-between px-2">
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center"><Zap className="w-4 h-4 mr-2 text-blue-600" /> Scheduled Services</p>
                          <button onClick={() => setShowCustomAdd(!showCustomAdd)} className="text-[9px] font-black text-blue-600 uppercase flex items-center space-x-1.5 hover:bg-blue-50 px-3 py-1.5 rounded-xl transition-all border border-blue-100">
                            {showCustomAdd ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            <span>Manual Service</span>
                          </button>
                       </div>

                       {showCustomAdd && (
                         <div className="bg-slate-900 text-white p-8 rounded-[3rem] space-y-5 shadow-2xl animate-in zoom-in border-t-8 border-blue-600">
                           <div className="flex bg-slate-800 p-1 rounded-xl">
                             <button onClick={() => setCustomType('tour')} className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg ${customType === 'tour' ? 'bg-blue-600' : 'text-slate-400'}`}>Tours</button>
                             <button onClick={() => setCustomType('transfer')} className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg ${customType === 'transfer' ? 'bg-blue-600' : 'text-slate-400'}`}>Logistics</button>
                           </div>
                           <input value={customName} onChange={(e) => setCustomName(e.target.value)} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-sm font-bold text-white outline-none focus:border-blue-500" placeholder="Service Name..." />
                           <div className="grid grid-cols-2 gap-4">
                             <input type="number" value={customAdultPrice} onChange={(e) => setCustomAdultPrice(e.target.value)} className="w-full px-6 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-xs font-bold text-white outline-none" placeholder="Adult Rate (INR)" />
                             <input type="number" value={customChildPrice} onChange={(e) => setCustomChildPrice(e.target.value)} className="w-full px-6 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-xs font-bold text-white outline-none" placeholder="Child Rate (INR)" />
                           </div>
                           <button onClick={() => {
                              if (!customName) return;
                              updateDay(activeDayNumber, { assigned_tours: [...activeDay.assigned_tours, { custom_name: customName, custom_description: customDescription, custom_adult_price_inr: Number(customAdultPrice) || 0, custom_child_price_inr: Number(customChildPrice) || 0, transfer_type: 'Private' }] });
                              setCustomName(''); setCustomDescription(''); setCustomAdultPrice(''); setCustomChildPrice(''); setShowCustomAdd(false);
                           }} className="w-full bg-blue-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl">Inject to Day {activeDay.day_number}</button>
                         </div>
                       )}

                       <div className="space-y-4">
                         {activeDay.assigned_tours.map((at, idx) => {
                           const act = [...allTours, ...allTransfers].find(a => a.id === at.tour_id);
                           const name = at.custom_name || (act as any)?.name || (act as any)?.route || 'Voucher Item';
                           // Use description from the assignment or the found product activity
                           const description = at.custom_description || (act as any)?.description || '';
                           const isTransfer = at.custom_name ? (customType === 'transfer') : (act as any)?.category === Category.TRANSFER;

                           return (
                             <div key={idx} className={`bg-white border rounded-[2.2rem] p-6 flex flex-col group hover:border-blue-400 transition-all ${isTransfer ? 'bg-slate-50/30' : ''}`}>
                               <div className="flex items-center justify-between">
                                 <div className="flex items-center space-x-5">
                                   <div className={`w-14 h-14 rounded-[1.4rem] flex items-center justify-center shrink-0 shadow-md ${isTransfer ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'}`}>
                                      {isTransfer ? <Plane className="w-7 h-7" /> : <Landmark className="w-7 h-7" />}
                                   </div>
                                   <div>
                                     <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">{name}</h4>
                                     <div className="flex items-center space-x-3">
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${isTransfer ? 'bg-slate-900 text-slate-100' : 'bg-blue-100 text-blue-600'}`}>{isTransfer ? 'Logistics' : 'Sightseeing'}</span>
                                        {at.custom_name && <span className="text-[8px] font-black bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded uppercase tracking-widest">Manual</span>}
                                        <span className="text-[9px] font-black text-slate-400 uppercase">{at.transfer_type} Basis</span>
                                     </div>
                                   </div>
                                 </div>
                                 <button onClick={() => removeActivityFromDay(activeDay.day_number, idx)} className="p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"><Trash2 className="w-5 h-5" /></button>
                               </div>
                               {/* Render description if exists */}
                               {description && (
                                 <div className="mt-4 pl-14">
                                   <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-4 truncate max-w-full">
                                     {description}
                                   </p>
                                 </div>
                               )}
                             </div>
                           );
                         })}
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl flex items-start space-x-6 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full" />
                       <div className="bg-blue-600 p-4 rounded-2xl shadow-lg relative z-10"><Building2 className="w-7 h-7" /></div>
                       <div className="relative z-10">
                          <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1.5">Confirmed Accommodation</p>
                          <h4 className="text-xl font-black uppercase truncate tracking-tight leading-tight">{currentStay?.hotel_name || 'TBD Hub Stay'}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">{activeDay.overnight_city} • {currentStay?.nights} Nights Overall</p>
                       </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 rounded-[2.8rem] p-8 space-y-6 shadow-sm">
                       <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center"><Coffee className="w-4 h-4 mr-2 text-amber-500" /> Daily Nutritional Package</p>
                       <div className="grid grid-cols-3 gap-4">
                         {[
                           { key: 'breakfast', icon: Coffee, label: 'Breakfast' },
                           { key: 'lunch', icon: Sun, label: 'Lunch' },
                           { key: 'dinner', icon: Moon, label: 'Dinner' }
                         ].map(meal => (
                           <button 
                             key={meal.key}
                             onClick={() => toggleMeal(activeDay.day_number, meal.key as any)}
                             className={`group flex flex-col items-center p-6 rounded-[2.2rem] border-2 transition-all ${activeDay.meals[meal.key as keyof typeof activeDay.meals] ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-slate-50 border-transparent text-slate-300 hover:border-slate-200'}`}
                           >
                             <meal.icon className="w-7 h-7 mb-3" />
                             <span className="text-[9px] font-black uppercase tracking-widest">{meal.label}</span>
                           </button>
                         ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center"><Tags className="w-4 h-4 mr-2 text-blue-600" /> Dynamic Service Highlights</p>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-emerald-50/30 border border-emerald-100 p-6 rounded-[2.2rem]">
                             <p className="text-[9px] font-black text-emerald-600 uppercase mb-4 tracking-widest">Included Today</p>
                             <div className="flex gap-2 mb-4">
                                <input value={newInclusion} onChange={(e) => setNewInclusion(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTag('inclusion', newInclusion)} className="flex-1 bg-white border border-emerald-100 rounded-xl px-4 py-2 text-xs font-bold outline-none" placeholder="e.g. Free Wi-Fi" />
                                <button onClick={() => addTag('inclusion', newInclusion)} className="bg-emerald-600 text-white p-2 rounded-xl"><Plus className="w-4 h-4" /></button>
                             </div>
                             <div className="flex flex-wrap gap-2">
                                {activeDay.inclusions.map(tag => (
                                  <span key={tag} className="bg-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase text-emerald-600 border border-emerald-100 flex items-center">{tag}<button onClick={() => removeTag('inclusion', tag)} className="ml-2 text-slate-300 hover:text-rose-500"><X className="w-3 h-3" /></button></span>
                                ))}
                             </div>
                          </div>
                          <div className="bg-rose-50/30 border border-rose-100 p-6 rounded-[2.2rem]">
                             <p className="text-[9px] font-black text-rose-600 uppercase mb-4 tracking-widest">Client Expenses</p>
                             <div className="flex gap-2 mb-4">
                                <input value={newExclusion} onChange={(e) => setNewExclusion(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTag('exclusion', newExclusion)} className="flex-1 bg-white border border-rose-100 rounded-xl px-4 py-2 text-xs font-bold outline-none" placeholder="e.g. Tips" />
                                <button onClick={() => addTag('exclusion', newExclusion)} className="bg-rose-600 text-white p-2 rounded-xl"><Plus className="w-4 h-4" /></button>
                             </div>
                             <div className="flex flex-wrap gap-2">
                                {activeDay.exclusions.map(tag => (
                                  <span key={tag} className="bg-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase text-rose-600 border border-rose-100 flex items-center">{tag}<button onClick={() => removeTag('exclusion', tag)} className="ml-2 text-slate-300 hover:text-rose-500"><X className="w-3 h-3" /></button></span>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Unified Inventory Pool */}
        <div className="lg:col-span-4 h-full flex flex-col space-y-4">
          <div className="bg-slate-100 rounded-[3rem] border border-slate-200 p-6 h-[800px] flex flex-col shadow-inner overflow-hidden text-slate-900">
            <div className="flex items-center justify-between mb-6 px-2 shrink-0">
               <div className="flex items-center space-x-3">
                 <div className="bg-slate-900 p-2.5 rounded-2xl shadow-lg"><Database className="w-5 h-5 text-white" /></div>
                 <p className="text-[11px] font-black uppercase tracking-widest">Inventory Pool</p>
               </div>
               <button onClick={() => setShowAllRegions(!showAllRegions)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${showAllRegions ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200'}`}>
                 {showAllRegions ? 'Country-Wide' : `${activeDay.overnight_city} Hub`}
               </button>
            </div>

            {/* Source Switch */}
            <div className="grid grid-cols-2 gap-2 bg-white/60 p-1 rounded-2xl mb-4 shrink-0 border border-slate-200/50 shadow-sm">
               <button onClick={() => setPoolSource('Selected')} className={`flex items-center justify-center space-x-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${poolSource === 'Selected' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>
                 <BookmarkCheck className="w-4 h-4" />
                 <span>My Selection</span>
               </button>
               <button onClick={() => setPoolSource('Global')} className={`flex items-center justify-center space-x-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${poolSource === 'Global' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>
                 <Database className="w-4 h-4" />
                 <span>Master Database</span>
               </button>
            </div>

            {/* Local Search */}
            <div className="relative mb-4 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input value={poolSearch} onChange={(e) => setPoolSearch(e.target.value)} placeholder="Filter pool items..." className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3.5 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm" />
            </div>

            {/* Category Filter */}
            <div className="flex bg-white/40 p-1 rounded-2xl border border-slate-200 mb-6 shrink-0 backdrop-blur-md">
              {['All', 'Tours', 'Logistics'].map(cat => (
                <button key={cat} onClick={() => setPoolFilter(cat as any)} className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${poolFilter === cat ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-hide pb-8">
              {availableActivities.length > 0 ? availableActivities.map(act => {
                const isAssigned = activeDay.assigned_tours.some(at => at.tour_id === act.id);
                const isTransfer = act.type === 'transfer';
                
                return (
                  <div key={act.id} className={`group bg-white rounded-[2.2rem] border-2 transition-all relative overflow-hidden flex flex-col shadow-sm ${isAssigned ? 'border-blue-600 ring-4 ring-blue-600/5' : 'border-transparent hover:border-blue-100'}`}>
                    
                    {!isTransfer && act.image && (
                      <div className="h-28 w-full relative">
                        <img src={act.image} alt={act.name} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                        <div className="absolute top-3 left-4">
                           <span className="bg-white/30 backdrop-blur-md text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">{act.city}</span>
                        </div>
                      </div>
                    )}

                    <div className="p-5 relative flex flex-col flex-1">
                       <div className="flex items-start justify-between">
                         <div className="flex items-center space-x-4 flex-1 min-w-0">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${isTransfer ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'}`}>
                             {getCategoryIcon(act.category)}
                           </div>
                           <div className="min-w-0 flex-1">
                              <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1">{act.category}</p>
                              <h5 className="text-xs font-black uppercase tracking-tight leading-tight line-clamp-2 text-slate-800">{act.name}</h5>
                           </div>
                         </div>
                         <button 
                            onClick={() => addActivityToDay(activeDay.day_number, act.id, act.type)}
                            className={`p-2.5 rounded-xl border-2 transition-all active:scale-90 ${isAssigned ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-blue-400 hover:text-blue-600'}`}
                         >
                           <Plus className="w-4 h-4" />
                         </button>
                       </div>

                       <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${act.isMaster ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-blue-400'}`} />
                             <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{act.isMaster ? 'Master Rates' : 'Custom Service'}</span>
                          </div>
                          <button onClick={() => addActivityToDay(activeDay.day_number, act.id, act.type)} className={`text-[9px] font-black uppercase tracking-widest transition-all ${isAssigned ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-900'}`}>Assign</button>
                       </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="py-24 text-center flex flex-col items-center justify-center">
                  <div className="bg-white p-8 rounded-3xl shadow-sm mb-4 border border-slate-50">
                    <Search className="w-10 h-10 text-slate-100" />
                  </div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No matching services</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
