
import React, { useState } from 'react';
import { Quotation, PriceBreakdown, SavedQuotation, AgentProfile } from '../types';
import { storage } from '../utils/storage';
import { TrendingUp, Info, MapPin, Printer, ArrowLeft, Download, Loader2, Save, CheckCircle, Building2, ShieldCheck, Star } from 'lucide-react';
import FinalItinerary from './FinalItinerary';

interface Props {
  quotation: Quotation;
  breakdown: PriceBreakdown;
  setQuotation: React.Dispatch<React.SetStateAction<Quotation>>;
  onBack: () => void;
  agent?: AgentProfile | null;
}

export default function PricingSummary({ quotation, breakdown, setQuotation, onBack, agent }: Props) {
  const [viewMode, setViewMode] = React.useState<'pricing' | 'itinerary'>('pricing');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuotation(prev => ({ ...prev, margin_percent: Number(e.target.value) }));
  };

  const handleSaveQuote = () => {
    setIsSaving(true);
    const saved: SavedQuotation = {
      ...quotation,
      saved_at: new Date().toISOString(),
      total_inr: breakdown.final_total_inr
    };
    storage.saveQuotation(saved);
    
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    const element = document.getElementById('itinerary-pdf-export-root');
    
    if (!element) {
      alert('Error: Export content not found.');
      setIsGenerating(false);
      return;
    }

    // High-fidelity PDF configuration optimized for A4
    const opt = {
      margin: 0,
      filename: `${quotation.client_name.replace(/\s+/g, '_') || 'Proposal'}_${quotation.reference_no}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 800, // Explicit width matching the container to ensure alignment
        backgroundColor: '#FFFFFF',
        dpi: 300
      },
      jsPDF: { 
        unit: 'px', // Using pixels for exact container mapping
        format: [800, 1131], // A4 ratio in pixels at 96dpi (approx)
        orientation: 'portrait',
        hotfixes: ['px_scaling']
      }
    };

    try {
      // @ts-ignore - html2pdf is globally available via CDN script
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF Generation failed:', err);
      alert('PDF generation failed. Using System Print (Ctrl+P) instead is recommended.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <button 
            onClick={onBack}
            className="flex items-center text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 hover:underline group no-print"
          >
            <ArrowLeft className="w-3 h-3 mr-1 transition-transform group-hover:-translate-x-1" /> Back to Editor
          </button>
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Commercial Review</h2>
            <div className="hidden sm:flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100 no-print">
               <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
               <span className="text-[10px] font-black uppercase tracking-widest">Rate Verified</span>
            </div>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto no-print shadow-inner border border-slate-200">
          <button
            onClick={() => setViewMode('pricing')}
            className={`flex-1 sm:flex-none px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'pricing' ? 'bg-white shadow-lg text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Commercials
          </button>
          <button
            onClick={() => setViewMode('itinerary')}
            className={`flex-1 sm:flex-none px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'itinerary' ? 'bg-white shadow-lg text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Full Itinerary
          </button>
        </div>
      </div>

      {/* 
          OFF-SCREEN EXPORT CONTAINER 
          Specifically sized for PDF generation.
      */}
      <div className="fixed left-[-9999px] top-0 no-print" aria-hidden="true">
        <div id="itinerary-pdf-export-root" className="bg-white" style={{ width: '800px' }}>
          <FinalItinerary quotation={quotation} agent={agent} />
        </div>
      </div>

      {viewMode === 'pricing' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full" />
              <h3 className="flex items-center text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10 relative z-10">
                <TrendingUp className="w-4 h-4 mr-3 text-blue-400" /> Revenue Controls
              </h3>
              
              <div className="space-y-10 relative z-10">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <label className="text-xs font-black text-slate-200 uppercase tracking-widest">Agency Markup</label>
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl text-sm font-black shadow-lg shadow-blue-900/40 border border-blue-400">
                       {quotation.margin_percent}%
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={quotation.margin_percent}
                    onChange={handleMarginChange}
                    className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between mt-3 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-800 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Net Cost</span>
                    <span className="font-mono font-bold text-slate-300 text-lg">₹{Math.round(breakdown.subtotal_inr).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-blue-400">
                    <span className="text-xs font-black uppercase tracking-wider">Markup Earned</span>
                    <span className="font-mono font-bold text-xl">+₹{Math.round(breakdown.margin_amount_inr).toLocaleString()}</span>
                  </div>
                  <div className="pt-10 border-t border-slate-800">
                    <div className="flex flex-col items-end">
                      <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Final Guest Quote</span>
                      <span className="text-5xl font-black text-white tracking-tighter">₹{Math.round(breakdown.final_total_inr).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveQuote}
              disabled={isSaving}
              className={`w-full flex items-center justify-center space-x-3 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl active:scale-95 ${saveSuccess ? 'bg-green-600 text-white shadow-green-200 ring-4 ring-green-600/10' : 'bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white hover:shadow-slate-200'}`}
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (saveSuccess ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />)}
              <span>{isSaving ? 'Archiving...' : (saveSuccess ? 'Saved' : 'Archive Quote')}</span>
            </button>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border rounded-[3rem] p-10 sm:p-14 shadow-sm h-full flex flex-col border-slate-100">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                  Commercial Breakdown
                </h3>
                <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                  <span>Verified Master Rates</span>
                </div>
              </div>
              
              <div className="space-y-6 flex-1">
                <div className="flex justify-between items-center p-8 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-blue-200 transition-all">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-2xl bg-white border flex items-center justify-center mr-6 shadow-sm group-hover:scale-110 transition-transform">
                      <MapPin className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 uppercase tracking-tight text-base">Tours & Logistics</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{quotation.selected_tour_ids.length + quotation.selected_transfer_ids.length} Services Pool</p>
                    </div>
                  </div>
                  <span className="font-black text-slate-900 text-2xl tracking-tighter">₹{Math.round(breakdown.tour_cost_inr).toLocaleString()}</span>
                </div>

                {breakdown.hotel_cost_inr > 0 && (
                  <div className="flex justify-between items-center p-8 bg-blue-50/40 rounded-[2rem] border border-blue-100 group hover:border-blue-300 transition-all">
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mr-6 shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                        <Building2 className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 uppercase tracking-tight text-base">Hotel Component</p>
                        <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mt-1.5">{quotation.hotel_name || 'Multi-City Accommodations'}</p>
                      </div>
                    </div>
                    <span className="font-black text-slate-900 text-2xl tracking-tighter">₹{Math.round(breakdown.hotel_cost_inr).toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="mt-16 flex flex-col md:flex-row justify-between items-end border-t border-slate-100 pt-12 gap-8">
                <div className="flex flex-col items-start space-y-3">
                   <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <Info className="w-4 h-4 mr-2 text-blue-500" /> Tax-Inclusive Net Quote
                   </div>
                   {agent?.brand_name && (
                     <div className="flex items-center space-x-2 bg-slate-900 px-4 py-2 rounded-xl text-white">
                        <Building2 className="w-3 h-3 text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{agent.brand_name} Branded</span>
                     </div>
                   )}
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Total Itinerary Valuation</p>
                  <p className="text-6xl font-black text-blue-600 tracking-tighter">₹{Math.round(breakdown.final_total_inr).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-[3rem] p-6 sm:p-12 shadow-inner overflow-hidden flex flex-col items-center">
           <div className="flex justify-between w-full max-w-[800px] mb-10 no-print px-4">
            <div className="flex items-center space-x-4">
               <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
               <div className="flex flex-col">
                  <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Ready for Export</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">A4 Professional Standard</span>
               </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 font-black text-xs uppercase tracking-widest bg-white border-2 border-slate-200 px-6 py-3.5 rounded-2xl transition-all shadow-sm hover:shadow-md"
              >
                <Printer className="w-5 h-5" />
                <span>System Print</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="flex items-center space-x-3 text-white bg-slate-900 hover:bg-slate-800 font-black text-xs uppercase tracking-[0.2em] px-10 py-4 rounded-2xl transition-all shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />}
                <span>{isGenerating ? 'Generating...' : 'Download Branded PDF'}</span>
              </button>
            </div>
          </div>
          
          <div className="bg-white shadow-[0_0_80px_rgba(0,0,0,0.08)] rounded-2xl ring-1 ring-slate-200 max-w-full overflow-auto">
            {/* Visual Preview scale */}
            <div className="mx-auto" style={{ width: '800px', padding: '40px', boxSizing: 'content-box' }}>
               <FinalItinerary quotation={quotation} agent={agent} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
