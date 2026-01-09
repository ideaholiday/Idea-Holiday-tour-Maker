
import React, { useState } from 'react';
import { Quotation, TransferItem } from '../types';
import { storage } from '../utils/storage';
import { Car, ChevronRight, CheckCircle2, ArrowLeft, Plus, X, Save, Sparkles, MapPin, Banknote } from 'lucide-react';

interface Props {
  quotation: Quotation;
  setQuotation: React.Dispatch<React.SetStateAction<Quotation>>;
  onBack: () => void;
  dataVersion?: number;
}

export default function TransferSelector({ quotation, setQuotation, onBack, dataVersion }: Props) {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [localVersion, setLocalVersion] = useState(0);

  const allTransfers = storage.getTransfers();
  // Filter transfers by the selected country
  const filteredTransfers = allTransfers.filter(tr => tr.country.toLowerCase() === quotation.country.toLowerCase());

  const toggleTransfer = (id: string) => {
    setQuotation(prev => {
      const isSelected = prev.selected_transfer_ids.includes(id);
      const newIds = isSelected 
        ? prev.selected_transfer_ids.filter(tid => tid !== id)
        : [...prev.selected_transfer_ids, id];
      return { ...prev, selected_transfer_ids: newIds };
    });
  };

  const handleQuickAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newTransfer: TransferItem = {
      id: `manual-tr-${Date.now()}`,
      route: formData.get('route') as string,
      country: quotation.country,
      vehicle_type: formData.get('vehicle_type') as any,
      price_inr: Number(formData.get('price_inr')),
      description: (formData.get('description') as string) || 'Manual transfer entry added during quotation.',
    };

    const updatedTransfers = [newTransfer, ...allTransfers];
    storage.saveTransfers(updatedTransfers);
    
    setQuotation(prev => ({
      ...prev,
      selected_transfer_ids: [...prev.selected_transfer_ids, newTransfer.id]
    }));

    setShowQuickAdd(false);
    setLocalVersion(v => v + 1);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 hover:underline group no-print"
          >
            <ArrowLeft className="w-3 h-3 mr-1 transition-transform group-hover:-translate-x-1" /> Back to Sightseeing
          </button>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-slate-900">Step 3: Transfer Selection ({quotation.country})</h2>
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100 flex items-center space-x-1.5">
               <Car className="w-3 h-3" />
               <span className="text-[10px] font-black uppercase tracking-widest">Route Pool</span>
            </div>
          </div>
          <p className="text-slate-500 mt-1">Select inter-city or airport transfers. For multi-city tours like Vietnam, ensure routes between {quotation.city_stays.map(s => s.city).join(' & ')} are covered.</p>
        </div>
        
        <button
          onClick={() => setShowQuickAdd(true)}
          className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-black shadow-xl transition-all active:scale-95 uppercase tracking-widest text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Manual Route Entry</span>
        </button>
      </div>

      <div className="grid gap-4">
        {filteredTransfers.length > 0 ? (
          filteredTransfers.map((transfer) => {
            const isSelected = quotation.selected_transfer_ids.includes(transfer.id);
            return (
              <div
                key={transfer.id}
                onClick={() => toggleTransfer(transfer.id)}
                className={`
                  flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all cursor-pointer group
                  ${isSelected ? 'bg-blue-50 border-blue-600 shadow-md ring-4 ring-blue-600/5' : 'bg-white border-slate-100 hover:border-blue-200'}
                `}
              >
                <div className="flex items-center space-x-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                    <Car className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 uppercase tracking-tight text-base leading-tight">
                      {transfer.route}
                    </h3>
                    <div className="flex items-center mt-2 space-x-3">
                      <span className="text-[9px] font-black text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-widest">
                        {transfer.vehicle_type}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                        <MapPin className="w-3 h-3 mr-1" /> {transfer.country}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-8">
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900 tracking-tighter">₹{transfer.price_inr.toLocaleString()}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Net Rate</p>
                  </div>
                  <div className={`transition-all duration-300 ${isSelected ? 'text-blue-600 scale-110' : 'text-slate-200'}`}>
                    {isSelected ? <CheckCircle2 className="w-7 h-7" /> : <ChevronRight className="w-7 h-7" />}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-24 text-center bg-white border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center space-y-4 shadow-sm">
             <div className="bg-slate-50 p-8 rounded-full">
                <Car className="w-12 h-12 text-slate-200" />
             </div>
             <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">No Routes Defined</h3>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] max-w-xs mx-auto mt-1">There are no transfer products for {quotation.country} yet. Add one manually to proceed.</p>
             </div>
             <button 
                onClick={() => setShowQuickAdd(true)}
                className="flex items-center space-x-2 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Transfer Route</span>
              </button>
          </div>
        )}
      </div>

      {showQuickAdd && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="px-10 py-8 border-b flex items-center justify-between bg-slate-50">
               <div className="flex items-center space-x-4">
                 <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-100">
                   <Sparkles className="text-white w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">Custom Route Setup</h4>
                    <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-1.5">Manual Logistics Entry</p>
                 </div>
               </div>
               <button onClick={() => setShowQuickAdd(false)} className="p-2 hover:bg-slate-200 rounded-full transition-all">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleQuickAdd} className="p-10 space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-2 text-indigo-500" /> Route Details
                  </label>
                  <input name="route" required placeholder="e.g. Da Nang Airport to Hoi An Hotel" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-900 focus:bg-white focus:border-indigo-100 outline-none transition-all" />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                      <Car className="w-3.5 h-3.5 mr-2 text-indigo-500" /> Vehicle Class
                    </label>
                    <select name="vehicle_type" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold outline-none cursor-pointer focus:bg-white focus:border-indigo-100">
                      <option value="Sedan">Sedan (1-3 Pax)</option>
                      <option value="SUV">SUV (1-5 Pax)</option>
                      <option value="Van">Van (1-10 Pax)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                      <Banknote className="w-3.5 h-3.5 mr-2 text-indigo-500" /> Total Cost (INR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input type="number" name="price_inr" required className="w-full pl-10 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold outline-none focus:bg-white focus:border-indigo-100" placeholder="0" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route Remarks</label>
                  <textarea name="description" rows={2} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-medium text-sm outline-none focus:bg-white focus:border-indigo-100 resize-none" placeholder="Add details like mileage, luggage limit, or pickup instructions..."></textarea>
                </div>
              </div>

              <div className="flex space-x-4 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowQuickAdd(false)}
                  className="flex-1 px-8 py-5 border-2 border-slate-100 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="flex-1 flex items-center justify-center space-x-3 bg-slate-900 text-white px-8 py-5 rounded-2xl font-black shadow-2xl hover:bg-slate-800 transition-all uppercase tracking-widest text-xs"
                >
                  <Save className="w-5 h-5" />
                  <span>Save & Apply</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
