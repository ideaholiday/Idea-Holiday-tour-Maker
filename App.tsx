
import React, { useState, useMemo, useEffect } from 'react';
import { Quotation, ItineraryDay, PriceBreakdown, AgentProfile, CityStay } from './types';
import { GLOBAL_SETTINGS } from './constants';
import { calculateBreakdown } from './utils/pricing';
import { storage } from './utils/storage';
import ClientDetails from './components/ClientDetails';
import TourSelector from './components/TourSelector';
import ItineraryBuilder from './components/ItineraryBuilder';
import PricingSummary from './components/PricingSummary';
import AdminCMS from './components/AdminCMS';
import B2BPortal from './components/B2BPortal';
import GuideBook from './components/GuideBook';
import HelpCenter from './components/HelpCenter';
import InfoPages, { InfoPageType } from './components/InfoPages';
import { Calculator, MapPin, Users, Calendar, ArrowRight, ArrowLeft, CheckCircle2, Globe, Settings, Building2, PlusCircle, ShieldCheck, Facebook, Instagram, BookOpen, HelpCircle } from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Client Details', icon: Users },
  { id: 2, name: 'Sightseeing', icon: MapPin },
  { id: 3, name: 'Itinerary', icon: Calendar },
  { id: 4, name: 'Review & Price', icon: Calculator },
];

const generateRef = (country: string) => {
  const code = (country || 'TRV').substring(0, 3).toUpperCase();
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${code}-${date}-${random}`;
};

const INITIAL_QUOTATION = (country: string = 'Thailand'): Quotation => {
  let defaultCity = 'Principal City';
  if (country === 'Thailand') defaultCity = 'Bangkok';
  else if (country === 'UAE') defaultCity = 'Dubai';
  else if (country === 'Vietnam') defaultCity = 'Hanoi';
  else if (country.includes('Goa')) defaultCity = 'Goa';

  const defaultStays: CityStay[] = [{ 
    city: defaultCity, 
    nights: 4, 
    hotel_name: '', 
    hotel_cost_inr: 0 
  }];

  const totalNights = defaultStays.reduce((sum, s) => sum + s.nights, 0);

  return {
    reference_no: generateRef(country),
    client_name: '',
    country: country,
    city_stays: defaultStays,
    travel_start_date: new Date().toISOString().split('T')[0],
    number_of_days: totalNights + 1,
    adults: 2,
    children: 0,
    hotel_name: '',
    hotel_cost_inr: 0,
    selected_tour_ids: [],
    selected_transfer_ids: [],
    itinerary: [],
    margin_percent: GLOBAL_SETTINGS.DEFAULT_MARGIN
  };
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCMSOpen, setIsCMSOpen] = useState(false);
  const [isB2BOpen, setIsB2BOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeInfoPage, setActiveInfoPage] = useState<InfoPageType | null>(null);
  const [dataVersion, setDataVersion] = useState(0); 
  const [currentAgent, setCurrentAgent] = useState<AgentProfile | null>(null);
  
  const [quotation, setQuotation] = useState<Quotation>(INITIAL_QUOTATION('Thailand'));

  useEffect(() => {
    setCurrentAgent(storage.getAgent());
  }, []);

  useEffect(() => {
    if (!quotation.client_name && quotation.selected_tour_ids.length === 0) {
       setQuotation(prev => ({ ...prev, reference_no: generateRef(prev.country) }));
    }
  }, [quotation.country]);

  const getCityForDay = (dayNum: number, stays: CityStay[]) => {
    let dayCounter = 0;
    for (const stay of stays) {
      dayCounter += stay.nights;
      if (dayNum <= dayCounter) return stay.city;
    }
    return stays[stays.length - 1]?.city || 'Principal City';
  };

  const generateNarrative = (dayNum: number, totalDays: number, country: string, city: string, prevCity: string | null) => {
    if (dayNum === 1) {
      return `Welcome to ${country}! Upon arrival at the airport, our representative will greet you for a comfortable private transfer to your hotel in ${city}. After check-in, enjoy the rest of the day at leisure to relax or explore the nearby areas at your own pace.`;
    }
    
    if (dayNum === totalDays) {
      return `Enjoy your final breakfast at the hotel in ${city}. Spend your morning doing some last-minute shopping or soaking in the local atmosphere. At the scheduled time, our driver will pick you up for your transfer to the airport for your flight back home.`;
    }

    if (prevCity && prevCity !== city) {
      return `Today you will transition from ${prevCity} to ${city}. After breakfast and check-out, we will proceed with a scenic transfer (Road/Ferry/Flight) to your next destination. Upon arrival in ${city}, check in to your hotel and enjoy a relaxing evening as you settle into this new city.`;
    }

    return `Start your day with a delicious breakfast at the hotel in ${city}. Today is dedicated to exploring the highlights of the city. You will be picked up for your scheduled sightseeing, followed by an evening to explore the local night markets or dine at a traditional restaurant.`;
  };

  useEffect(() => {
    if (quotation.itinerary.length > 0 && quotation.itinerary.length === quotation.number_of_days) return;

    setQuotation(prev => {
      const existing = prev.itinerary;
      
      const updated = Array.from({ length: prev.number_of_days }, (_, i) => {
        const dayNum = i + 1;
        const found = existing.find(d => d.day_number === dayNum);
        const resolvedCity = getCityForDay(dayNum, prev.city_stays);
        const prevResolvedCity = dayNum > 1 ? getCityForDay(dayNum - 1, prev.city_stays) : null;

        const autoNarrative = generateNarrative(dayNum, prev.number_of_days, prev.country, resolvedCity, prevResolvedCity);

        if (found) {
            const cityChanged = found.overnight_city !== resolvedCity;
            return { 
              ...found, 
              overnight_city: resolvedCity,
              description: cityChanged ? autoNarrative : found.description
            };
        }
        
        let title = 'Leisure & Exploration';
        if (dayNum === 1) title = 'Arrival';
        if (dayNum === prev.number_of_days) title = 'Departure';
        if (prevResolvedCity && prevResolvedCity !== resolvedCity) title = `Transfer: ${prevResolvedCity} to ${resolvedCity}`;
        
        return {
          day_number: dayNum,
          title,
          description: autoNarrative,
          assigned_tours: [],
          meals: { breakfast: true, lunch: false, dinner: false },
          overnight_city: resolvedCity,
          inclusions: [],
          exclusions: []
        };
      });
      return { ...prev, itinerary: updated };
    });
  }, [quotation.number_of_days, quotation.country, quotation.city_stays, quotation.itinerary.length]);

  const currentPricing = useMemo(() => calculateBreakdown(quotation), [quotation, dataVersion]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleNewQuotation = () => {
    if (confirm('Start a new quotation? All unsaved progress will be cleared.')) {
      setQuotation(INITIAL_QUOTATION('Thailand'));
      setCurrentStep(1);
    }
  };

  const onAgentUpdate = () => {
    setCurrentAgent(storage.getAgent());
    setDataVersion(v => v + 1);
  };

  const loadSavedQuote = (saved: Quotation) => {
    setQuotation(saved);
    setCurrentStep(4);
    setIsB2BOpen(false);
  };

  return (
    <div className="min-h-screen pb-24 print:pb-0 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {currentAgent?.logo_url ? (
               <img src={currentAgent.logo_url} className="h-10 w-auto object-contain" alt="Brand Logo" />
            ) : (
              <div className="bg-blue-600 p-2 rounded-lg">
                <Globe className="text-white w-6 h-6" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">
                {currentAgent?.brand_name || 'Idea Holiday Portal'}
              </h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                {currentAgent ? 'B2B Partner Portal' : 'Idea Holiday Pvt Ltd'}
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
             <button 
                onClick={() => setIsHelpOpen(true)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                title="How to Use"
             >
                <HelpCircle className="w-5 h-5" />
             </button>
             <button 
                onClick={() => setIsGuideOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white flex items-center space-x-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
             >
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">Guide Book</span>
             </button>
             <button 
                onClick={handleNewQuotation}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 flex items-center space-x-2 hover:bg-slate-50 transition-all"
             >
                <PlusCircle className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase">New Quote</span>
             </button>
             <button 
                onClick={() => setIsB2BOpen(true)}
                className={`px-4 py-2 rounded-xl border flex items-center space-x-2 transition-all ${currentAgent ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 text-slate-400 hover:text-blue-600'}`}
             >
                <Building2 className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-tight">{currentAgent ? 'Dashboard' : 'Agent Login'}</span>
             </button>
             <button 
                onClick={() => setIsCMSOpen(true)}
                className="bg-slate-50 px-3 py-1.5 rounded-xl border flex items-center space-x-2 hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-900"
                title="CMS Access"
             >
                <Settings className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase">CMS</span>
             </button>
             <div className="flex items-center bg-slate-900 rounded-full px-4 py-2 border border-slate-800 ml-2 shadow-lg shadow-slate-200">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Net:</span>
               <span className="text-blue-400 font-bold font-mono text-base">₹{Math.round(currentPricing.subtotal_inr).toLocaleString()}</span>
             </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-4 overflow-x-auto no-print scrollbar-hide">
          <div className="flex items-center justify-between min-w-[500px]">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center relative flex-1">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10
                    ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-4 ring-blue-50' : 
                      isCompleted ? 'bg-green-500 text-white shadow-md' : 'bg-slate-200 text-slate-400'}
                  `}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`mt-2 text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                    {step.name}
                  </span>
                  {step.id !== 4 && (
                    <div className="absolute top-5 left-1/2 w-full h-[2px] bg-slate-100 -z-0">
                      <div className={`h-full bg-blue-600 transition-all duration-500 ${isCompleted ? 'w-full' : 'w-0'}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <main className={`max-w-5xl mx-auto px-4 py-12 flex-1 w-full ${currentStep === 4 ? 'print:max-w-none print:px-0 print:py-0' : ''}`}>
        <div className={`bg-white rounded-[2.5rem] border shadow-sm p-6 sm:p-12 ${currentStep === 4 ? 'print:border-none print:shadow-none print:p-0' : ''}`}>
          {currentStep === 1 && <ClientDetails quotation={quotation} setQuotation={setQuotation} onSkip={() => setCurrentStep(2)} />}
          {currentStep === 2 && <TourSelector quotation={quotation} setQuotation={setQuotation} onBack={handleBack} dataVersion={dataVersion} />}
          {currentStep === 3 && <ItineraryBuilder quotation={quotation} setQuotation={setQuotation} onBack={handleBack} dataVersion={dataVersion} />}
          {currentStep === 4 && <PricingSummary quotation={quotation} breakdown={currentPricing} setQuotation={setQuotation} onBack={handleBack} agent={currentAgent} />}
        </div>
      </main>

      <footer className="bg-white border-t py-12 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-slate-900 p-2 rounded-lg"><Globe className="text-white w-5 h-5" /></div>
                <span className="text-xl font-black uppercase tracking-tighter">Idea Holiday</span>
              </div>
              <p className="text-slate-500 text-sm leading-loose max-w-sm font-medium">
                Premier B2B travel quotation platform. Empowering travel agents with verified inventory, real-time pricing, and professional itinerary generation for Thailand, UAE, and beyond.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/ideaholiday.in" target="_blank" className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-full transition-all"><Facebook className="w-5 h-5" /></a>
                <a href="https://www.instagram.com/ideaholiday1/" target="_blank" className="p-2 bg-slate-50 text-slate-400 hover:text-pink-600 rounded-full transition-all"><Instagram className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Corporate Hub</h4>
              <ul className="space-y-2 text-sm font-bold text-slate-400">
                <li><button onClick={() => setActiveInfoPage('about')} className="hover:text-blue-600">The Company</button></li>
                <li><button onClick={() => setActiveInfoPage('contact')} className="hover:text-blue-600">Contact Support</button></li>
                <li><button onClick={() => setActiveInfoPage('faq')} className="hover:text-blue-600">Help Center</button></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Legal & Compliance</h4>
              <ul className="space-y-2 text-sm font-bold text-slate-400">
                <li><button onClick={() => setActiveInfoPage('privacy')} className="hover:text-blue-600">Privacy & Data</button></li>
                <li><button onClick={() => setActiveInfoPage('terms')} className="hover:text-blue-600">Platform Terms</button></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2024 Idea Holiday Pvt Ltd. All rights reserved.</p>
            <div className="flex items-center space-x-6">
               <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase">
                 <ShieldCheck className="w-4 h-4 text-green-500" />
                 <span>Secured B2B Gateway</span>
               </div>
            </div>
          </div>
        </div>
      </footer>

      {currentStep < 4 && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t p-4 sm:p-6 no-print z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${currentStep === 1 ? 'opacity-0' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={handleNext}
              className="flex items-center space-x-3 bg-blue-600 text-white px-12 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 group"
            >
              <span>{currentStep === 3 ? 'Review Quotation' : 'Continue Journey'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {isCMSOpen && <AdminCMS onClose={() => setIsCMSOpen(false)} onDataUpdate={() => setDataVersion(v => v + 1)} />}
      {isB2BOpen && <B2BPortal onClose={() => setIsB2BOpen(false)} onUpdate={onAgentUpdate} onLoadQuote={loadSavedQuote} />}
      {isGuideOpen && <GuideBook onClose={() => setIsGuideOpen(false)} initialCountry={quotation.country} />}
      {isHelpOpen && <HelpCenter onClose={() => setIsHelpOpen(false)} />}
      {activeInfoPage && <InfoPages type={activeInfoPage} onClose={() => setActiveInfoPage(null)} />}
    </div>
  );
}
