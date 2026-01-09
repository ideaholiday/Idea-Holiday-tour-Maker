
import React from 'react';
import { X, Mail, MapPin, Globe, Phone, ShieldCheck, FileText, HelpCircle, Info, ChevronRight, Building2, Facebook, Instagram, CreditCard, Award, Landmark, History, Users2 } from 'lucide-react';

export type InfoPageType = 'privacy' | 'terms' | 'faq' | 'about' | 'contact';

interface Props {
  type: InfoPageType;
  onClose: () => void;
}

export default function InfoPages({ type, onClose }: Props) {
  const companyInfo = {
    name: "Idea Holiday Pvt Ltd",
    address: "Office No 129 deva Palace viram Khand 1 Gomti Nagar Lucknow.",
    emails: {
      general: "info@ideaholiday.com",
      b2b: "b2b@ideaholiday.com",
      online: "online@ideaholiday.com"
    },
    locations: ["Delhi", "Mumbai", "Lucknow", "Thailand", "Srilanka", "Vietnam"],
    legal: {
      gstin: "09AAGCI8928Q1ZK",
      cin: "U63030UP2022PTC172520",
      pan: "AAGCI8928Q"
    },
    social: {
      facebook: "https://www.facebook.com/ideaholiday.in",
      instagram: "https://www.instagram.com/ideaholiday1/"
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'about':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
              <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tight leading-none">Redefining B2B Travel <span className="text-blue-600">Since 2022</span></h3>
              <p className="text-slate-600 leading-loose text-xl font-medium">
                Idea Holiday Pvt Ltd is a trailblazing Destination Management Company (DMC) and Travel Technology provider. We specialize in empowering travel professionals with the tools and inventory needed to thrive in a dynamic global market.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all">
                <History className="w-10 h-10 text-blue-600 mb-6" />
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-3">Legacy</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Built on years of ground-level operational expertise across Asian and Middle Eastern markets.</p>
              </div>
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-200">
                <Users2 className="w-10 h-10 text-blue-400 mb-6" />
                <h4 className="font-black uppercase text-xs tracking-widest mb-3">B2B Focused</h4>
                <p className="text-sm text-slate-400 leading-relaxed">Our platform serves 500+ active agents, providing real-time pricing and verified itineraries.</p>
              </div>
              <div className="bg-white border p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all">
                <Globe className="w-10 h-10 text-indigo-600 mb-6" />
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-3">Global Reach</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Headquartered in India with dedicated operational hubs in Thailand, Sri Lanka, and Vietnam.</p>
              </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 p-10 rounded-[3rem]">
              <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-8 flex items-center">
                <Landmark className="w-4 h-4 mr-2" /> Registered Entity Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase">GST Registration</p>
                  <p className="text-lg font-black text-slate-900">{companyInfo.legal.gstin}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase">CIN Corporate ID</p>
                  <p className="text-lg font-black text-slate-900">{companyInfo.legal.cin}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Income Tax PAN</p>
                  <p className="text-lg font-black text-slate-900">{companyInfo.legal.pan}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white border p-8 rounded-[2.5rem] shadow-sm">
                <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-100">
                  <MapPin className="text-white w-6 h-6" />
                </div>
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-3">Lucknow Head Office</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{companyInfo.address}</p>
              </div>

              <div className="bg-white border p-8 rounded-[2.5rem] shadow-sm">
                <div className="bg-slate-900 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-slate-100">
                  <Mail className="text-white w-6 h-6" />
                </div>
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-3">Electronic Mail</h4>
                <div className="space-y-2">
                  <a href={`mailto:${companyInfo.emails.general}`} className="text-blue-600 font-bold block hover:underline text-sm">{companyInfo.emails.general}</a>
                  <a href={`mailto:${companyInfo.emails.b2b}`} className="text-blue-600 font-bold block hover:underline text-sm">{companyInfo.emails.b2b}</a>
                  <a href={`mailto:${companyInfo.emails.online}`} className="text-blue-600 font-bold block hover:underline text-sm">{companyInfo.emails.online}</a>
                </div>
              </div>

              <div className="bg-white border p-8 rounded-[2.5rem] shadow-sm">
                <div className="bg-pink-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-pink-100">
                  <Globe className="text-white w-6 h-6" />
                </div>
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-3">Connect Globally</h4>
                <div className="flex space-x-3">
                  <a href={companyInfo.social.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href={companyInfo.social.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-pink-50 text-pink-600 rounded-xl hover:bg-pink-600 hover:text-white transition-all">
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-200">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Operational Presence</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {companyInfo.locations.map(loc => (
                  <div key={loc} className="bg-white border px-4 py-3 rounded-2xl flex items-center justify-center space-x-2 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span className="text-[10px] font-black text-slate-700 uppercase">{loc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative shadow-2xl">
               <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full" />
               <h4 className="text-2xl font-black uppercase tracking-tight mb-8 relative z-10">Instant Message</h4>
               <form className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                 <input type="text" placeholder="Your Name" className="bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
                 <input type="email" placeholder="Agency Email" className="bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 font-bold" />
                 <textarea placeholder="How can we assist you today?" className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-3xl px-6 py-4 h-32 outline-none focus:ring-2 focus:ring-blue-500 font-medium"></textarea>
                 <button className="md:col-span-2 bg-blue-600 text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-xl hover:bg-blue-500 transition-all active:scale-95">Dispatch Message</button>
               </form>
            </div>
          </div>
        );
      case 'faq':
        const faqs = [
          { q: "Who can use the Tour Maker tool?", a: "This platform is exclusively designed for travel agents and tour operators registered with Idea Holiday Pvt Ltd. It simplifies the B2B quotation process." },
          { q: "How current are the sightseeing rates?", a: "Rates are synced with our central inventory pool and reflect the current market pricing for the selected travel window." },
          { q: "Can I manage my own margins?", a: "Yes, the tool allows agents to adjust markup percentages dynamically in the final step to suit their commercial strategy." },
          { q: "What if my destination isn't listed?", a: "We currently support UAE, Thailand, and India (Goa). New destinations are added periodically based on operational demand." },
          { q: "Are international taxes handled automatically?", a: "The tool provides net costs. Local taxes and agency margins should be accounted for using the 'Revenue Controls' feature." }
        ];
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {faqs.map((item, i) => (
              <div key={i} className="bg-white border border-slate-100 p-10 rounded-[2.5rem] hover:border-blue-200 transition-all shadow-sm">
                <div className="flex items-start space-x-6">
                  <div className="bg-slate-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0">?</div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 leading-tight mb-4 uppercase tracking-tighter">{item.q}</h4>
                    <p className="text-slate-500 leading-relaxed font-medium text-lg">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'privacy':
      case 'terms':
        return (
          <div className="bg-white border border-slate-200 p-12 sm:p-20 rounded-[3.5rem] shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="prose prose-slate max-w-none">
              <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-10 border-b pb-6">
                {type === 'privacy' ? 'Data Stewardship & Privacy' : 'Platform Terms of Use'}
              </h3>
              <p className="text-slate-500 leading-loose text-lg mb-10 italic">
                Effective Date: October 20, 2024. Idea Holiday Pvt Ltd operates with strict adherence to data integrity and commercial transparency.
              </p>
              <div className="space-y-12">
                <section>
                  <h4 className="text-slate-900 font-black uppercase tracking-widest text-sm mb-6 flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-3 text-blue-600" /> 1. Operational Framework
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-lg">Idea Holiday Pvt Ltd provides the Tour Maker B2B tool for the sole purpose of generating itinerary quotes. All data entered by agents is treated as confidential and is used only to facilitate the requested services.</p>
                </section>
                <section>
                  <h4 className="text-slate-900 font-black uppercase tracking-widest text-sm mb-6 flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-3 text-blue-600" /> 2. Accuracy of Master Data
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-lg">While we maintain 99% accuracy in our pricing pool, all quotes generated are subject to dynamic availability and re-confirmation by our ground operations team at the time of final booking.</p>
                </section>
                <section>
                  <h4 className="text-slate-900 font-black uppercase tracking-widest text-sm mb-6 flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-3 text-blue-600" /> 3. Proprietary Assets
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-lg">The software architecture, sightseeing database, and branding assets of Idea Holiday Pvt Ltd are protected intellectual property. Unauthorized replication or extraction of data is strictly prohibited.</p>
                </section>
                <section>
                  <h4 className="text-slate-900 font-black uppercase tracking-widest text-sm mb-6 flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-3 text-blue-600" /> 4. Local Compliance
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-lg">As a registered Indian entity (GSTIN: {companyInfo.legal.gstin}), we operate within the legal framework of the Indian Ministry of Tourism and local regional laws of our international operational hubs.</p>
                </section>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch(type) {
      case 'privacy': return { t: 'Privacy Policy', icon: ShieldCheck };
      case 'terms': return { t: 'Terms of Use', icon: FileText };
      case 'faq': return { t: 'Help Center', icon: HelpCircle };
      case 'about': return { t: 'The Company', icon: Info };
      case 'contact': return { t: 'Support Hub', icon: Globe };
    }
  };

  const HeaderIcon = getTitle().icon;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/70 backdrop-blur-xl p-4 overflow-hidden">
      <div className="bg-slate-50 rounded-[3.5rem] w-full max-w-6xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[95vh] border border-white/20">
        {/* Header */}
        <div className="px-12 py-10 border-b bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-8">
            <div className="bg-slate-900 p-4 rounded-3xl shadow-xl shadow-slate-200">
              <HeaderIcon className="text-white w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{getTitle().t}</h2>
              <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em] mt-2">{companyInfo.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-900 group">
            <X className="w-10 h-10 transition-transform group-hover:rotate-90" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-12 sm:p-20 custom-scrollbar bg-slate-50/50">
          <div className="max-w-5xl mx-auto">
            {renderContent()}
          </div>
        </div>

        {/* Footer Branding Bar */}
        <div className="px-12 py-8 border-t bg-white flex flex-col sm:flex-row justify-between items-center shrink-0 gap-6">
           <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
             <ShieldCheck className="w-4 h-4 mr-2 text-green-500" /> Official B2B Ecosystem
           </div>
           <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
             <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">GST: {companyInfo.legal.gstin}</div>
             <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">CIN: {companyInfo.legal.cin}</div>
             <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">PAN: {companyInfo.legal.pan}</div>
           </div>
           <div className="text-[10px] font-black text-slate-200 uppercase tracking-widest">
             © 2024 {companyInfo.name}
           </div>
        </div>
      </div>
    </div>
  );
}
