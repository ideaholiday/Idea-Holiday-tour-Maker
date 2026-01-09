
import React from 'react';
import { Quotation, AgentProfile, Category } from '../types';
import { MASTER_TOURS, MASTER_TRANSFERS } from '../constants';
import { storage } from '../utils/storage';
import { MapPin, Coffee, Sun, Moon, ShieldCheck, Plane, Building2, Globe, Calendar, Info, BedDouble, Car, CheckCircle2, XCircle, Clock, Waves, Landmark, Ship, Star, FileText, Briefcase } from 'lucide-react';

interface Props {
  quotation: Quotation;
  agent?: AgentProfile | null;
}

export default function FinalItinerary({ quotation, agent }: Props) {
  const companyRegistry = {
    gstin: "09AAGCI8928Q1ZK",
    cin: "U63030UP2022PTC172520",
    pan: "AAGCI8928Q"
  };

  const getActivityDetails = (id?: string) => {
    if (!id) return null;
    
    const tour = MASTER_TOURS.find(t => t.id === id);
    if (tour) return { name: tour.name, category: tour.category, isTransfer: false, description: tour.description };
    
    const transfer = MASTER_TRANSFERS.find(tr => tr.id === id);
    if (transfer) return { name: transfer.route, category: 'Logistics', isTransfer: true, description: transfer.description, vehicle: transfer.vehicle_type };
    
    const cmsTours = storage.getTours();
    const cmsTour = cmsTours.find(t => t.id === id);
    if (cmsTour) return { name: cmsTour.name, category: cmsTour.category, isTransfer: false, description: cmsTour.description };

    const cmsTransfers = storage.getTransfers();
    const cmsTr = cmsTransfers.find(t => t.id === id);
    if (cmsTr) return { name: cmsTr.route, category: 'Logistics', isTransfer: true, description: cmsTr.description, vehicle: cmsTr.vehicle_type };
    
    return null;
  };

  const getFormattedDate = (dayNumber: number) => {
    const date = new Date(quotation.travel_start_date);
    date.setDate(date.getDate() + (dayNumber - 1));
    return {
      fullDate: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      dayName: date.toLocaleDateString('en-GB', { weekday: 'long' }),
    };
  };

  return (
    <div className="bg-white flex flex-col font-inter text-slate-900 overflow-hidden" style={{ width: '800px', margin: '0 auto' }}>
      
      {/* 1. PREMIUM HEADER / COVER */}
      <div className="p-12 pb-16 bg-slate-50 border-b-[12px] border-slate-900 relative">
        <div className="absolute top-0 right-0 p-6">
           <div className="bg-blue-600 text-white px-5 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-[0.25em] shadow-xl">
             Private & Confidential Proposal
           </div>
        </div>
        
        <div className="flex justify-between items-start">
          <div className="space-y-10 flex-1 pr-12">
            <div className="flex items-center space-x-8">
              <div className="w-[180px] h-[90px] flex items-center justify-start bg-transparent">
                {agent?.logo_url ? (
                  <img 
                    src={agent.logo_url} 
                    className="max-w-full max-h-full object-contain" 
                    alt="Agency Logo" 
                    crossOrigin="anonymous" 
                  />
                ) : (
                  <div className="h-16 w-16 bg-slate-900 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Building2 className="text-white w-9 h-9" />
                  </div>
                )}
              </div>
              <div className="border-l-4 border-slate-200 pl-8 py-2">
                <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-1.5">Consultant Partner</p>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                  {agent?.brand_name || 'Travel Solutions Hub'}
                </h1>
              </div>
            </div>

            <div className="pt-8">
              <div className="flex items-center space-x-5 text-blue-600 mb-6">
                 <div className="w-16 h-1.5 bg-blue-600 rounded-full" />
                 <span className="text-sm font-black uppercase tracking-[0.5em]">Curated Expedition</span>
              </div>
              <h2 className="text-8xl font-black text-slate-900 tracking-tighter uppercase leading-[0.8] m-0">
                {quotation.country}
              </h2>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[3rem] w-[300px] text-white shrink-0 shadow-2xl relative overflow-hidden mt-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full" />
            <div className="space-y-6 relative z-10">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center">
                   <Star className="w-3.5 h-3.5 mr-2 text-amber-500 fill-current" /> Internal Ref
                </p>
                <p className="text-xl font-black uppercase text-blue-400 tracking-widest leading-none">#{quotation.reference_no}</p>
              </div>
              
              <div className="py-5 border-y border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase">Principal Guest</span>
                  <span className="text-sm font-black uppercase text-slate-100">{quotation.client_name || 'VIP Traveler'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase">Expedition Length</span>
                  <span className="text-sm font-black uppercase text-slate-100">{quotation.number_of_days} Days / {quotation.number_of_days - 1} Nights</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase">Guest Count</span>
                  <span className="text-sm font-black uppercase text-slate-100">{quotation.adults} ADL {quotation.children > 0 ? `• ${quotation.children} CHD` : ''}</span>
                </div>
              </div>

              <div>
                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-3">Accommodation Hubs</p>
                <div className="space-y-2.5">
                  {quotation.city_stays.map((stay, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50 group">
                      <div className="min-w-0">
                         <p className="text-[11px] font-black uppercase leading-tight truncate text-slate-200">{stay.city}</p>
                         <p className="text-[9px] font-bold text-slate-500 uppercase leading-none mt-1">{stay.nights} Night Residence</p>
                      </div>
                      <MapPin className="w-4 h-4 text-blue-500 shrink-0 ml-3" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DAILY JOURNEY */}
      <div className="px-12 pt-16 space-y-20">
        {quotation.itinerary.map((day) => {
          const date = getFormattedDate(day.day_number);
          const hasInclusions = day.inclusions && day.inclusions.length > 0;
          const hasExclusions = day.exclusions && day.exclusions.length > 0;

          return (
            <div key={day.day_number} className="page-break-avoid">
              <div className="flex items-end space-x-8 mb-10 border-b-4 border-slate-100 pb-6">
                 <div className="bg-slate-900 text-white w-20 h-20 rounded-[2rem] flex flex-col items-center justify-center shrink-0 shadow-2xl relative">
                    <div className="absolute -top-2 -right-2 bg-blue-600 w-6 h-6 rounded-full border-4 border-white" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">DAY</span>
                    <span className="text-4xl font-black leading-none">{day.day_number}</span>
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                       <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none truncate pr-6">{day.title}</h3>
                       <div className="flex items-center bg-blue-50 px-4 py-1.5 rounded-xl border border-blue-100 shrink-0 shadow-sm">
                          <MapPin className="w-4 h-4 text-blue-600 mr-2.5" />
                          <span className="text-[11px] font-black uppercase tracking-widest text-blue-700">{day.overnight_city}</span>
                       </div>
                    </div>
                    <div className="flex items-center space-x-6 mt-3">
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">{date.dayName} • {date.fullDate}</p>
                       <div className="flex space-x-4 items-center">
                          {['breakfast', 'lunch', 'dinner'].map((meal) => (
                            <div key={meal} className={`flex items-center space-x-2 ${day.meals[meal as keyof typeof day.meals] ? 'text-slate-900' : 'text-slate-200'}`}>
                               {meal === 'breakfast' && <Coffee className="w-3.5 h-3.5" />}
                               {meal === 'lunch' && <Sun className="w-3.5 h-3.5" />}
                               {meal === 'dinner' && <Moon className="w-3.5 h-3.5" />}
                               <span className="text-[9px] font-black uppercase tracking-widest">{meal}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-12 gap-10">
                <div className="col-span-12">
                   <div className="relative pl-10 border-l-[6px] border-blue-600/30">
                      <p className="text-slate-600 text-[15px] leading-relaxed font-medium">
                        {day.description}
                      </p>
                   </div>
                </div>

                {/* SERVICES GRID */}
                {day.assigned_tours.length > 0 && (
                  <div className="col-span-12 mt-4 space-y-5">
                    {day.assigned_tours.map((assigned, idx) => {
                      const details = !assigned.custom_name ? getActivityDetails(assigned.tour_id) : null;
                      const name = assigned.custom_name || details?.name || 'Curated Activity';
                      const desc = assigned.custom_description || details?.description || '';
                      const category = assigned.custom_name ? 'Premium Selection' : details?.category;
                      const isLogistics = details?.isTransfer || assigned.custom_name?.toLowerCase().includes('transfer');

                      return (
                        <div key={idx} className={`p-8 rounded-[2.5rem] border transition-all flex flex-col space-y-5 ${isLogistics ? 'bg-slate-900 border-slate-800 text-white shadow-2xl' : 'bg-white border-slate-200 shadow-sm'}`}>
                          <div className="flex items-center justify-between">
                             <div className="flex items-center space-x-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${isLogistics ? 'bg-white/10 text-white' : 'bg-blue-600 text-white'}`}>
                                   {isLogistics ? <Car className="w-7 h-7" /> : (category === Category.ISLAND_TOUR ? <Ship className="w-7 h-7" /> : <Landmark className="w-7 h-7" />)}
                                </div>
                                <div>
                                   <h4 className="text-lg font-black uppercase tracking-tight leading-none mb-2">{name}</h4>
                                   <div className="flex items-center space-x-4">
                                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${isLogistics ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'}`}>{category}</span>
                                      <span className={`text-[9px] font-black uppercase tracking-widest ${isLogistics ? 'text-slate-400' : 'text-slate-400'}`}>
                                        {isLogistics ? 'Professional Ground Logistics' : `${assigned.transfer_type} Basis Service`}
                                      </span>
                                   </div>
                                </div>
                             </div>
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${isLogistics ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-50 text-emerald-500'}`}>
                                <CheckCircle2 className="w-6 h-6" />
                             </div>
                          </div>
                          {desc && (
                            <div className={`pl-20 border-t pt-5 ${isLogistics ? 'border-white/10' : 'border-slate-50'}`}>
                              <p className={`text-[12px] leading-relaxed italic ${isLogistics ? 'text-slate-400' : 'text-slate-500'}`}>
                                {desc}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* HIGHLIGHTS / EXPENSES */}
                {(hasInclusions || hasExclusions) && (
                  <div className="col-span-12 grid grid-cols-2 gap-10 mt-6">
                    {hasInclusions && (
                      <div className="bg-emerald-50/40 p-8 rounded-[3rem] border border-emerald-100/50 shadow-inner">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center mb-6">
                          <CheckCircle2 className="w-4 h-4 mr-3" /> Service Inclusions
                        </p>
                        <div className="space-y-3">
                          {day.inclusions.map((inc, i) => (
                            <div key={i} className="text-[11px] font-bold text-slate-700 flex items-start">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-3 mt-1.5 shrink-0" /> 
                              <span className="leading-tight">{inc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {hasExclusions && (
                      <div className="bg-rose-50/40 p-8 rounded-[3rem] border border-rose-100/50 shadow-inner">
                        <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] flex items-center mb-6">
                          <XCircle className="w-4 h-4 mr-3" /> Excluded Today
                        </p>
                        <div className="space-y-3">
                          {day.exclusions.map((exc, i) => (
                            <div key={i} className="text-[11px] font-bold text-slate-500 flex items-start">
                              <div className="w-1.5 h-1.5 rounded-full bg-rose-300 mr-3 mt-1.5 shrink-0" /> 
                              <span className="leading-tight">{exc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. CORPORATE IDENTITY FOOTER */}
      <div className="mt-24 border-t-[10px] border-slate-900 p-12 bg-white flex justify-between items-center">
        <div className="flex items-center space-x-10">
          <div className="h-16 w-auto flex items-center">
            {agent?.logo_url ? (
              <img src={agent.logo_url} className="h-full object-contain grayscale opacity-50" alt="Partner Identity" crossOrigin="anonymous" />
            ) : (
              <Globe className="w-12 h-12 text-slate-200" />
            )}
          </div>
          <div className="border-l-4 border-slate-100 pl-10">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Platform Verified Proposal</p>
            <p className="text-xl font-black text-slate-900 uppercase tracking-tighter">
              {agent?.brand_name || 'B2B Partner Ecosystem'}
            </p>
            <div className="flex items-center space-x-3 mt-1.5">
               <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
               <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Authorized Destination Management</span>
            </div>
          </div>
        </div>

        <div className="text-right space-y-1">
           <div className="flex items-center justify-end space-x-2.5 text-emerald-600 mb-3 bg-emerald-50 px-4 py-1.5 rounded-full inline-flex border border-emerald-100">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Rate Protection Active</span>
           </div>
           <p className="text-[11px] font-bold text-slate-400 uppercase">Registry: {companyRegistry.cin}</p>
           <p className="text-[9px] font-black text-slate-300 uppercase mt-4 tracking-tighter">© 2024 IDEA HOLIDAY PVT LTD • PROPOSAL REF {quotation.reference_no}</p>
        </div>
      </div>
    </div>
  );
}
