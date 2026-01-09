
import React, { useState } from 'react';
import { X, BookOpen, Compass, Sun, Map, ShieldCheck, Zap, Info, Landmark, Waves, Camera, Coffee, Utensils, CreditCard, FileText, CheckCircle2, AlertCircle, MessageSquare, PhoneCall, Languages } from 'lucide-react';

interface Props {
  onClose: () => void;
  initialCountry?: string;
}

const GUIDE_DATA: Record<string, any> = {
  'Thailand': {
    accent: 'emerald',
    tagline: 'The Land of Smiles',
    bestTime: 'November to Early April (Cool & Dry)',
    visa: 'Visa on Arrival / E-Visa available for Indian Nationals.',
    voa_checklist: [
      'Original Passport with 6 months validity.',
      'One 4x6 cm photograph (white background, recent).',
      'Confirmed Return Flight Ticket (Printout).',
      'Confirmed Hotel Vouchers for all days.',
      'Proof of funds: 10,000 THB per person or 20,000 THB per family (Cash).',
      'Visa Fee: 2,000 THB (Cash only, subject to change).'
    ],
    etiquette: [
      'Dress modestly when visiting Temples (cover shoulders & knees).',
      'Never touch someone on the head; it is considered sacred.',
      'Show absolute respect to the Monarchy.',
      'Always remove shoes before entering a Thai home or temple.'
    ],
    highlights: [
      { title: 'Bangkok', desc: 'Grand Palace, Wat Arun, and world-class shopping hubs.', icon: Landmark },
      { title: 'Pattaya', desc: 'Sanctuary of Truth, Coral Island, and vibrant night shows.', icon: Camera },
      { title: 'Phuket', desc: 'Phi Phi Islands, James Bond Island, and Patong beach.', icon: Waves },
      { title: 'Krabi', desc: '4 Islands speedboat tour, Emerald Pool, and limestone cliffs.', icon: Map }
    ],
    tips: [
      { title: 'Currency', desc: 'Thai Baht (THB). Carry cash for street food.', icon: CreditCard },
      { title: 'Dining', desc: 'Try Pad Thai and Mango Sticky Rice.', icon: Utensils },
      { title: 'Commute', desc: 'Tuk-tuks are fun but agree on price first.', icon: Map }
    ],
    phrases: [
      { local: 'Sawatdee-ka/krap', eng: 'Hello (Female/Male)' },
      { local: 'Khob-kun-ka/krap', eng: 'Thank You' },
      { local: 'Tao-rai?', eng: 'How much?' },
      { local: 'Mai-pen-rai', eng: 'No problem / It\'s okay' },
      { local: 'A-roi', eng: 'Delicious' }
    ],
    emergency: [
      { label: 'Tourist Police', num: '1155' },
      { label: 'Police (General)', num: '191' },
      { label: 'Ambulance/Medical', num: '1669' }
    ]
  },
  'UAE': {
    accent: 'amber',
    tagline: 'The City of Gold & Future',
    bestTime: 'October to March (Pleasant weather)',
    visa: 'Pre-arranged Tourist Visa required (30/60 days).',
    etiquette: [
      'Respect local dress codes in public malls (shoulders/knees).',
      'Public displays of affection are strictly prohibited.',
      'Avoid eating/drinking in public during Ramadan daylight hours.',
      'Ask permission before taking photos of local people.'
    ],
    highlights: [
      { title: 'Dubai', desc: 'Burj Khalifa, Desert Safari, and Dubai Mall.', icon: Landmark },
      { title: 'Abu Dhabi', desc: 'Sheikh Zayed Mosque and Ferrari World.', icon: Zap },
      { title: 'Sharjah', desc: 'Art museums and traditional souks.', icon: Map }
    ],
    tips: [
      { title: 'Currency', desc: 'UAE Dirham (AED). Cards widely accepted.', icon: CreditCard },
      { title: 'Lifestyle', desc: 'Luxury is the standard. Book in advance.', icon: Coffee },
      { title: 'Apps', desc: 'Download Careem or Noon for easy services.', icon: Map }
    ],
    phrases: [
      { local: 'Marhaba', eng: 'Hello' },
      { local: 'Shukran', eng: 'Thank You' },
      { local: 'Kam Thaman?', eng: 'How much?' },
      { local: 'Na\'am / La', eng: 'Yes / No' },
      { local: 'Afwan', eng: 'You\'re welcome' }
    ],
    emergency: [
      { label: 'Police', num: '999' },
      { label: 'Ambulance', num: '998' },
      { label: 'Fire Dept', num: '997' }
    ]
  },
  'India': {
    accent: 'orange',
    tagline: 'The Pearl of the Orient (Goa focus)',
    bestTime: 'November to February (Mild & Sunny)',
    visa: 'E-Visa or regular Tourist Visa (for international travelers).',
    etiquette: [
      'Remove footwear before entering homes or places of worship.',
      'Public displays of affection are discouraged in rural areas.',
      'Dress modestly when visiting temples or historical churches.',
      'Ask permission before photographing individuals, especially in villages.'
    ],
    highlights: [
      { title: 'North Goa', desc: 'Famous for beaches like Baga, Calangute, and vibrant nightlife.', icon: Waves },
      { title: 'Old Goa', desc: 'UNESCO sites like Basilica of Bom Jesus and Se Cathedral.', icon: Landmark },
      { title: 'South Goa', desc: 'Serene beaches like Palolem and luxury boutique stays.', icon: Camera }
    ],
    tips: [
      { title: 'Currency', desc: 'Indian Rupee (INR). UPI is used everywhere.', icon: CreditCard },
      { title: 'Dining', desc: 'Goan Fish Curry and Bebinca are must-tries.', icon: Utensils },
      { title: 'Commute', desc: 'Rent a scooter or use "Goa Miles" app for taxis.', icon: Map }
    ],
    phrases: [
      { local: 'Namaste', eng: 'Universal Greeting (Hindi)' },
      { local: 'Deu boro dis divum', eng: 'Good day (Konkani)' },
      { local: 'Kitli duddvanchi?', eng: 'How much? (Konkani)' },
      { local: 'Dhanyavad', eng: 'Thank you (Hindi)' },
      { local: 'Barre asa?', eng: 'How are you? (Konkani)' }
    ],
    emergency: [
      { label: 'National Helpline', num: '112' },
      { label: 'Police', num: '100' },
      { label: 'Ambulance', num: '108' }
    ]
  }
};

export default function GuideBook({ onClose, initialCountry = 'Thailand' }: Props) {
  // Normalize initialCountry to match GUIDE_DATA keys (e.g., 'India Goa' -> 'India')
  const baseKey = initialCountry.split(' ')[0];
  const [activeCountry, setActiveCountry] = useState(GUIDE_DATA[baseKey] ? baseKey : 'Thailand');
  const [activeTab, setActiveTab] = useState<'info' | 'visa'>('info');
  const data = GUIDE_DATA[activeCountry];

  const accentColorClass = {
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-600',
    orange: 'bg-orange-600'
  }[data.accent as 'emerald' | 'amber' | 'orange'] || 'bg-blue-600';

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/80 backdrop-blur-xl p-4 md:p-8">
      <div className="bg-white rounded-[3.5rem] w-full max-w-6xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-10 py-8 border-b bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-6">
            <div className="bg-slate-900 p-4 rounded-3xl shadow-xl">
              <BookOpen className="text-white w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Destinational Guide</h2>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mt-1">Agent Knowledge Base</p>
            </div>
          </div>
          
          <div className="flex bg-white p-1 rounded-2xl border shadow-sm">
            {Object.keys(GUIDE_DATA).map(country => (
              <button
                key={country}
                onClick={() => { setActiveCountry(country); setActiveTab('info'); }}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCountry === country ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {country}
              </button>
            ))}
          </div>

          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-full transition-all text-slate-400">
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Sub-Tabs */}
        <div className="px-10 py-4 bg-white border-b flex space-x-8 shrink-0">
           <button onClick={() => setActiveTab('info')} className={`text-[10px] font-black uppercase tracking-[0.2em] pb-2 transition-all border-b-2 ${activeTab === 'info' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}>General Intelligence</button>
           {activeCountry === 'Thailand' && (
             <button onClick={() => setActiveTab('visa')} className={`text-[10px] font-black uppercase tracking-[0.2em] pb-2 transition-all border-b-2 ${activeTab === 'visa' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-400'}`}>Visa Success Kit</button>
           )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'info' ? (
              <div className="space-y-12 animate-in fade-in duration-300">
                {/* Intro Hero */}
                <div className={`${accentColorClass} rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl`}>
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-20 -mt-20" />
                  <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-80">{data.tagline}</span>
                    <h3 className="text-6xl font-black uppercase tracking-tighter mt-4 leading-none">{activeCountry}</h3>
                    <div className="flex flex-wrap gap-6 mt-10">
                      <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
                        <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Visa Requirement</p>
                        <p className="text-xs font-black mt-1 uppercase">{data.visa}</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
                        <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Peak Window</p>
                        <p className="text-xs font-black mt-1 uppercase">{data.bestTime}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* Left Column: Regional Highlights & Linguistic Essentials */}
                  <div className="lg:col-span-8 space-y-10">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                         <Compass className="w-5 h-5 text-slate-900" />
                         <h4 className="text-lg font-black uppercase tracking-tight text-slate-900">Regional Power-Hubs</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.highlights.map((h: any, i: number) => (
                          <div key={i} className="bg-white border p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
                            <div className={`bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors group-hover:bg-blue-600`}>
                              <h.icon className="w-6 h-6 text-slate-400 group-hover:text-white" />
                            </div>
                            <h5 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-3">{h.title}</h5>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">{h.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border rounded-[3rem] p-10 space-y-8 shadow-sm">
                      <div className="flex items-center space-x-3">
                         <Languages className="w-5 h-5 text-blue-600" />
                         <h4 className="text-lg font-black uppercase tracking-tight text-slate-900">Linguistic Essentials</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.phrases.map((phrase: any, i: number) => (
                          <div key={i} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl group hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100">
                             <div>
                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{phrase.local}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{phrase.eng}</p>
                             </div>
                             <MessageSquare className="w-4 h-4 text-slate-200 group-hover:text-blue-400 transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border rounded-[3rem] p-10 space-y-8 shadow-sm">
                      <div className="flex items-center space-x-3">
                         <ShieldCheck className="w-5 h-5 text-emerald-600" />
                         <h4 className="text-lg font-black uppercase tracking-tight text-slate-900">Etiquette & Cultural Standards</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {data.etiquette.map((rule: string, i: number) => (
                          <div key={i} className="flex items-start space-x-4 group">
                            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-black text-[10px] group-hover:bg-emerald-600 group-hover:text-white transition-all">
                              {i + 1}
                            </div>
                            <p className="text-sm font-bold text-slate-600 leading-relaxed">{rule}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Safety & Tips */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-rose-50 border border-rose-100 rounded-[3rem] p-8 space-y-6 shadow-sm">
                       <div className="flex items-center space-x-3">
                          <PhoneCall className="w-5 h-5 text-rose-600" />
                          <h4 className="text-xs font-black uppercase tracking-widest text-rose-900">Safety & Emergencies</h4>
                       </div>
                       <div className="space-y-3">
                          {data.emergency.map((item: any, i: number) => (
                            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-rose-100">
                               <div>
                                  <p className="text-[8px] font-black text-rose-400 uppercase mb-1">{item.label}</p>
                                  <p className="text-lg font-black text-rose-600 tracking-tighter">{item.num}</p>
                               </div>
                               <div className="bg-rose-600 p-2 rounded-lg text-white">
                                  <Zap className="w-4 h-4 fill-current" />
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-10 shadow-2xl relative overflow-hidden">
                       <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-600/10 blur-3xl rounded-full" />
                       <div className="relative z-10">
                         <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-8">Agent Smart-Tips</h4>
                         <div className="space-y-8">
                            {data.tips.map((tip: any, i: number) => (
                              <div key={i} className="flex items-start space-x-5">
                                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                                  <tip.icon className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-white mb-1">{tip.title}</p>
                                  <p className="text-[11px] font-medium text-slate-400 leading-normal">{tip.desc}</p>
                                </div>
                              </div>
                            ))}
                         </div>
                       </div>
                       
                       <div className="pt-8 border-t border-slate-800 relative z-10">
                          <div className="bg-blue-600/20 rounded-2xl p-6 border border-blue-600/30">
                            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Pro Consultant Advice</p>
                            <p className="text-xs font-bold leading-relaxed">Always confirm current flight schedules before booking non-refundable ground transfers or island ferries.</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-in slide-in-from-right-4 duration-500 space-y-8">
                <div className="bg-rose-50 border border-rose-100 rounded-[3rem] p-12 flex flex-col md:flex-row items-center gap-10">
                   <div className="bg-rose-600 p-8 rounded-[2.5rem] shadow-xl shadow-rose-200">
                      <FileText className="w-12 h-12 text-white" />
                   </div>
                   <div className="flex-1">
                      <h3 className="text-3xl font-black text-rose-900 uppercase tracking-tighter leading-none mb-3">Visa on Arrival (VoA) Checklist</h3>
                      <p className="text-rose-700 font-bold uppercase text-[10px] tracking-widest opacity-70">Strict entry protocols for Thailand</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-white border p-10 rounded-[3rem] shadow-sm space-y-8">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Mandatory Documents</h4>
                      <div className="space-y-4">
                         {data.voa_checklist.map((item: string, i: number) => (
                           <div key={i} className="flex items-start space-x-3 group">
                              <div className="w-5 h-5 rounded bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-500 transition-colors">
                                 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 group-hover:text-white" />
                              </div>
                              <p className="text-sm font-bold text-slate-700 leading-relaxed">{item}</p>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="bg-amber-50 border border-amber-100 p-10 rounded-[3rem]">
                         <div className="flex items-center space-x-3 mb-6">
                            <AlertCircle className="w-6 h-6 text-amber-600" />
                            <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest">Crucial Finance Note</h4>
                         </div>
                         <p className="text-sm font-bold text-amber-800 leading-relaxed">
                            Proof of funds (20,000 THB Family / 10,000 THB Person) MUST be in **Cash** (Thai Baht or equivalent USD/INR). Mobile banking apps or credit card statements are frequently rejected by Thai Immigration.
                         </p>
                      </div>

                      <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-xl">
                         <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-6">Airport Entry Process</h4>
                         <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                               <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-black text-[10px] text-blue-400">1</div>
                               <p className="text-xs font-bold">Locate "Visa on Arrival" terminal signs.</p>
                            </div>
                            <div className="flex items-center space-x-4">
                               <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-black text-[10px] text-blue-400">2</div>
                               <p className="text-xs font-bold">Complete VoA form and join the verification queue.</p>
                            </div>
                            <div className="flex items-center space-x-4">
                               <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-black text-[10px] text-blue-400">3</div>
                               <p className="text-xs font-bold">Submit fee and proceed to the Immigration desk.</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-6 border-t bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Knowledge Feed Synchronized</span>
          </div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-tight">© 2024 Idea Holiday B2B Intelligence</p>
        </div>
      </div>
    </div>
  );
}
