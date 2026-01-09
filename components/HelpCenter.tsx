
import React, { useState } from 'react';
import { X, HelpCircle, Users, MapPin, Calendar, Calculator, CheckCircle2, ArrowRight, PlayCircle, ShieldCheck, Zap, Download, Printer, Settings, Globe } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const STEPS = [
  {
    id: 1,
    title: 'Scope the Trip',
    icon: Users,
    color: 'blue',
    desc: 'Enter guest details and define the night distribution. Our tool automatically calculates trip duration and initializes the day-wise itinerary.',
    proTip: 'Add multiple cities to see the "Smart-Route" logic create inter-city transfer placeholders.'
  },
  {
    id: 2,
    title: 'Select Inventory',
    icon: MapPin,
    color: 'emerald',
    desc: 'Browse our verified master library. Toggle between Sightseeing and Logistics. Everything you select here is added to your "Activity Pool".',
    proTip: 'Look for the "Sharing Only" icon for tours that don\'t support private logistics in Thailand.'
  },
  {
    id: 3,
    title: 'Design the Days',
    icon: Calendar,
    color: 'amber',
    desc: 'Assign your selected activities to specific days. Edit narratives to personalize the experience for your client. Add meals and day-specific inclusions.',
    proTip: 'Use the "Add to Day" button in the pool for instant timeline injection.'
  },
  {
    id: 4,
    title: 'Master the CMS',
    icon: Settings,
    color: 'rose',
    desc: 'Access the administrative panel to manage the global library. Add new countries, update sightseeing rates, or create custom transfer routes.',
    proTip: 'Use the "Regional Portfolio" tab to activate entirely new countries by setting up a "Discovery Anchor" city.'
  },
  {
    id: 5,
    title: 'Review & Brand',
    icon: Calculator,
    color: 'indigo',
    desc: 'Control your agency margins, review the commercial breakdown, and generate a professional, branded PDF with your own logo.',
    proTip: 'Sign in to the B2B Portal to save your profile and logo for all future exports.'
  }
];

export default function HelpCenter({ onClose }: Props) {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4">
      <div className="bg-white rounded-[3.5rem] w-full max-w-5xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-10 py-8 border-b bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-5">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
              <PlayCircle className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Idea Holiday Academy</h2>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mt-1">Platform Walkthrough</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-full transition-all text-slate-400">
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
          {/* Sidebar Nav */}
          <div className="lg:w-80 bg-slate-50/50 border-r p-8 space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Workflow Steps</p>
            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all ${activeStep === step.id ? 'bg-white shadow-xl ring-1 ring-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeStep === step.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-300'}`}>
                  <step.icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-tight text-left">{step.title}</span>
                {activeStep > step.id && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
              </button>
            ))}
            
            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                <ShieldCheck className="w-6 h-6 text-indigo-600 mb-3" />
                <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">B2B Verified</h4>
                <p className="text-[9px] font-bold text-indigo-700 leading-relaxed uppercase mt-2">All rates and itineraries generated are professional-grade and ready for guest delivery.</p>
              </div>
            </div>
          </div>

          {/* Main Display */}
          <div className="flex-1 p-12 bg-white flex flex-col">
            {STEPS.map((step) => step.id === activeStep && (
              <div key={step.id} className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full">
                <div className="flex-1 space-y-10">
                  <div className="space-y-4">
                    <span className="text-sm font-black text-blue-600 uppercase tracking-[0.3em]">Step 0{step.id}</span>
                    <h3 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">{step.title}</h3>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">{step.desc}</p>
                  </div>

                  <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <step.icon className="w-40 h-40" />
                    </div>
                    <div className="relative z-10 flex items-start space-x-6">
                      <div className="bg-amber-100 p-4 rounded-2xl">
                        <Zap className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Pro Consultant Advice</h4>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{step.proTip}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t flex items-center justify-between">
                  <div className="flex space-x-2">
                    {STEPS.map((s) => (
                      <div key={s.id} className={`w-2 h-2 rounded-full transition-all ${activeStep === s.id ? 'w-8 bg-blue-600' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                  <button
                    onClick={() => activeStep === 5 ? onClose() : setActiveStep(prev => prev + 1)}
                    className="flex items-center space-x-3 bg-slate-900 text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-blue-600 transition-all active:scale-95 group"
                  >
                    <span>{activeStep === 5 ? 'Ready to Start' : 'Next Step'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
