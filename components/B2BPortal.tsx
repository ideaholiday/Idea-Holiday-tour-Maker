
import React, { useState, useEffect, useRef } from 'react';
import { AgentProfile, SavedQuotation, AgentStatus } from '../types';
import { storage } from '../utils/storage';
import { 
  User, LogOut, Camera, Save, X, Building2, Mail, Phone, 
  MapPin, History, LayoutGrid, ArrowRight, Trash2, Calendar, 
  Upload, Image as ImageIcon, CheckCircle2, AlertCircle, Loader2, LogIn, UserPlus, Lock, Clock, ShieldCheck, Info, KeyRound, Smartphone, ShieldQuestion
} from 'lucide-react';

interface Props {
  onClose: () => void;
  onUpdate: () => void;
  onLoadQuote: (quote: SavedQuotation) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot' | 'verify' | 'reset';

export default function B2BPortal({ onClose, onUpdate, onLoadQuote }: Props) {
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile');
  const [savedQuotes, setSavedQuotes] = useState<SavedQuotation[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [recoveryMobile, setRecoveryMobile] = useState('');
  const [recoveryTargetId, setRecoveryTargetId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    brand_name: '',
    logo_url: '',
    mobile: '',
    address: ''
  });

  const [authForm, setAuthForm] = useState({
    mobile: '',
    password: '',
    brand_name: '',
    email: '',
    confirm_password: ''
  });

  useEffect(() => {
    const currentAgent = storage.getAgent();
    // Verify current agent status in registry to handle suspensions immediately on reload
    if (currentAgent) {
      const registry = storage.getAllAgents();
      const freshAgent = registry.find(a => a.id === currentAgent.id);
      if (freshAgent) {
        setAgent(freshAgent);
        storage.saveAgent(freshAgent); // Sync back to local storage
      } else {
        setAgent(currentAgent);
      }
    }
    setSavedQuotes(storage.getSavedQuotations());
    
    if (currentAgent) {
      setFormData({
        email: currentAgent.email,
        brand_name: currentAgent.brand_name,
        logo_url: currentAgent.logo_url || '',
        mobile: currentAgent.mobile || '',
        address: currentAgent.address || ''
      });
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const allAgents = storage.getAllAgents();

    if (authMode === 'login') {
      const found = allAgents.find(a => a.mobile === authForm.mobile && a.password === authForm.password);
      if (found) {
        if (found.status === AgentStatus.SUSPENDED) {
          setError('This account has been suspended by an administrator. Please contact support.');
          return;
        }
        storage.saveAgent(found);
        setAgent(found);
        onUpdate();
      } else {
        setError('Unauthorized credentials. Please check your mobile or security key.');
      }
    } else if (authMode === 'signup') {
      if (allAgents.some(a => a.mobile === authForm.mobile)) {
        setError('This mobile number is already registered.');
        return;
      }

      const newAgent: AgentProfile = {
        id: 'agent-' + Date.now(),
        brand_name: authForm.brand_name,
        email: authForm.email,
        mobile: authForm.mobile,
        password: authForm.password,
        status: AgentStatus.PENDING,
        joined_date: new Date().toISOString().split('T')[0],
        logo_url: '',
        quotes_generated: 0
      };

      storage.saveAgent(newAgent);
      setAgent(newAgent);
      onUpdate();
    } else if (authMode === 'forgot') {
      const found = allAgents.find(a => a.mobile === authForm.mobile);
      if (found) {
        setRecoveryTargetId(found.id);
        setRecoveryMobile(found.mobile);
        setAuthMode('verify');
      } else {
        setError('No partner account found for this mobile number.');
      }
    } else if (authMode === 'verify') {
      setAuthMode('reset');
    } else if (authMode === 'reset') {
      if (authForm.password !== authForm.confirm_password) {
        setError('Passwords do not match.');
        return;
      }
      
      const updatedAgents = allAgents.map(a => 
        a.id === recoveryTargetId ? { ...a, password: authForm.password } : a
      );
      storage.saveAllAgents(updatedAgents);
      alert('Security key updated successfully.');
      setAuthMode('login');
      setAuthForm(prev => ({ ...prev, password: '', confirm_password: '' }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("File exceeds 2MB limit."); return; }
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, logo_url: reader.result as string }));
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent) return;
    const updated: AgentProfile = { ...agent, ...formData };
    storage.saveAgent(updated);
    setAgent(updated);
    onUpdate();
    alert('Identity updated successfully.');
  };

  const handleLogout = () => {
    if (confirm('Sign out of partner portal?')) {
      storage.logoutAgent();
      setAgent(null);
      setAuthMode('login');
      onUpdate();
    }
  };

  if (agent) {
    if (agent.status === AgentStatus.PENDING) {
      return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[3.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
             <div className="p-16 text-center space-y-10">
                <div className="relative inline-block">
                  <div className="bg-amber-100 p-10 rounded-[3rem] shadow-xl shadow-amber-50 animate-pulse">
                    <Clock className="w-20 h-20 text-amber-600" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white p-3 rounded-full shadow-lg border-4 border-slate-50">
                    <ShieldCheck className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div>
                   <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Registration Pending</h2>
                   <p className="text-slate-500 mt-6 font-medium leading-relaxed px-4">
                     Welcome, <span className="text-slate-900 font-black">{agent.brand_name}</span>. Your agency application is currently being reviewed by our B2B operations team.
                   </p>
                </div>
                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex items-start space-x-4 text-left">
                   <Info className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                   <p className="text-[11px] font-black text-blue-800 leading-relaxed uppercase tracking-wider">
                     Platform access to net rates and itinerary designers will be unlocked once verification is complete.
                   </p>
                </div>
                <div className="flex flex-col space-y-3 pt-4">
                   <button onClick={onClose} className="bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">Dismiss Portal</button>
                   <button onClick={handleLogout} className="text-rose-500 font-black uppercase text-[10px] tracking-widest py-2 hover:underline">Logout & Try Another Account</button>
                </div>
             </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-[3.5rem] w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
          <div className="p-8 border-b flex items-center justify-between bg-slate-50 shrink-0">
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-600 p-3 rounded-2xl">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">B2B Dashboard</h2>
                <div className="flex items-center space-x-2 mt-1">
                   <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{agent.brand_name}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-full transition-all">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="flex border-b bg-white shrink-0">
            <button onClick={() => setActiveTab('profile')} className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center justify-center space-x-2 ${activeTab === 'profile' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-400'}`}>
              <User className="w-4 h-4" /> <span>Agency Profile</span>
            </button>
            <button onClick={() => setActiveTab('history')} className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center justify-center space-x-2 ${activeTab === 'history' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-400'}`}>
              <History className="w-4 h-4" /> <span>Saved Quotations</span>
            </button>
          </div>

          <div className="p-10 overflow-y-auto flex-1 bg-slate-50/30">
            {activeTab === 'profile' ? (
              <div className="space-y-10 animate-in fade-in duration-300">
                <div className="bg-white border rounded-[2.5rem] p-8 shadow-sm">
                  <div className="flex flex-col lg:flex-row gap-10">
                    <div className="w-full lg:w-1/3 space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Agency Brand Identity</p>
                      <div className="relative group w-full aspect-[3/1] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden hover:border-blue-400 transition-all">
                        {isUploading ? <Loader2 className="w-6 h-6 text-blue-600 animate-spin" /> : formData.logo_url ? <img src={formData.logo_url} className="w-full h-full object-contain p-4" /> : <Upload className="w-8 h-8 text-slate-300" />}
                        <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-black text-[10px] uppercase">Update Logo</button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Live Document Header Preview</p>
                       <div className="bg-slate-900 rounded-3xl p-8 flex items-center space-x-6 border-l-[8px] border-emerald-500 shadow-xl">
                          <div className="w-24 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1 shrink-0">
                            {formData.logo_url ? <img src={formData.logo_url} className="w-full h-full object-contain" /> : <ImageIcon className="text-slate-200" />}
                          </div>
                          <div className="text-white">
                             <h4 className="text-xl font-black uppercase tracking-tighter leading-none">{formData.brand_name || 'Agency Name'}</h4>
                             <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mt-2">Verified Professional DMC Partner</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                  <div className="space-y-1"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Agency Trading Name</label><input value={formData.brand_name} onChange={e => setFormData({...formData, brand_name: e.target.value})} className="w-full px-5 py-4 bg-white border rounded-2xl font-bold outline-none shadow-sm" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Work Email</label><input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-4 bg-white border rounded-2xl font-bold outline-none shadow-sm" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Registered Mobile UID</label><input readOnly value={formData.mobile} className="w-full px-5 py-4 bg-slate-100 border rounded-2xl font-bold text-slate-500" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Office H.Q. Address</label><input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-5 py-4 bg-white border rounded-2xl font-bold outline-none shadow-sm" /></div>
                  <div className="md:col-span-2 flex justify-between pt-10 border-t items-center">
                    <button type="button" onClick={handleLogout} className="flex items-center text-rose-500 font-black text-xs uppercase tracking-widest hover:bg-rose-50 px-6 py-3 rounded-xl transition-all"><LogOut className="w-4 h-4 mr-2" />Sign Out</button>
                    <button type="submit" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-emerald-600 transition-all">Synchronize Records</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300 pb-6">
                {savedQuotes.length > 0 ? savedQuotes.map(quote => (
                  <div key={quote.reference_no} className="bg-white border rounded-[2rem] p-6 flex justify-between items-center hover:border-blue-300 transition-all shadow-sm">
                    <div className="flex items-center space-x-6">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-xs border">QT</div>
                      <div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{quote.reference_no}</p>
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">{quote.client_name || 'Valued Client'}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">{quote.country} • {quote.number_of_days} Days</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-8">
                       <div className="text-right">
                          <p className="text-xl font-black text-slate-900">₹{Math.round(quote.total_inr).toLocaleString()}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{new Date(quote.saved_at).toLocaleDateString()}</p>
                       </div>
                       <button onClick={() => onLoadQuote(quote)} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-blue-600 transition-all">Edit Quote</button>
                    </div>
                  </div>
                )) : (
                  <div className="py-32 text-center flex flex-col items-center justify-center">
                    <History className="w-12 h-12 text-slate-100 mb-6" />
                    <p className="text-lg font-black text-slate-300 uppercase tracking-tighter">No Saved Quotations Found</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Itineraries you save will appear here.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const renderAuthForm = () => {
    switch(authMode) {
      case 'forgot':
        return (
          <form onSubmit={handleAuth} className="p-12 space-y-6">
            <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 mb-6">
              <p className="text-[11px] font-bold text-blue-800 leading-relaxed uppercase tracking-wide flex items-center">
                <ShieldQuestion className="w-4 h-4 mr-2 shrink-0" />
                Enter your registered mobile number for identification.
              </p>
            </div>
            {error && <div className="bg-rose-50 text-rose-600 px-4 py-3 rounded-xl text-[10px] font-black uppercase text-center border border-rose-100 flex items-center justify-center space-x-2"><AlertCircle className="w-4 h-4" /> <span>{error}</span></div>}
            <div className="relative">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
              <input required value={authForm.mobile} onChange={e => setAuthForm({...authForm, mobile: e.target.value})} placeholder="Registered Mobile" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold focus:bg-white focus:border-blue-100 outline-none transition-all" />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-blue-600 transition-all active:scale-95">Verify Identity</button>
            <button type="button" onClick={() => setAuthMode('login')} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest pt-4">Return to Login</button>
          </form>
        );
      case 'verify':
        return (
          <form onSubmit={handleAuth} className="p-12 space-y-8 text-center">
            <div className="space-y-6">
              <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                 <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Code Identification</p>
                 <p className="text-sm font-bold text-slate-700 leading-relaxed">Verification challenge sent to ending in {recoveryMobile.slice(-4)}</p>
              </div>
              <div className="flex justify-center space-x-3">
                 {[1,2,3,4].map(i => (
                   <input key={i} type="text" maxLength={1} className="w-12 h-16 bg-slate-50 border-2 border-slate-200 rounded-2xl text-2xl font-black text-center outline-none focus:border-blue-400 focus:bg-white transition-all shadow-inner" defaultValue={i} />
                 ))}
              </div>
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-blue-600 transition-all active:scale-95">Confirm Identity</button>
          </form>
        );
      case 'reset':
        return (
          <form onSubmit={handleAuth} className="p-12 space-y-6">
            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 mb-6">
              <p className="text-[11px] font-bold text-emerald-800 leading-relaxed uppercase tracking-wide flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 shrink-0" />
                Validation Success. Reset your master security key.
              </p>
            </div>
            {error && <div className="bg-rose-50 text-rose-600 px-4 py-3 rounded-xl text-[10px] font-black uppercase text-center border border-rose-100 flex items-center justify-center space-x-2"><AlertCircle className="w-4 h-4" /> <span>{error}</span></div>}
            <div className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                <input required type="password" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} placeholder="New Security Key" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold focus:bg-white focus:border-blue-100 outline-none transition-all" />
              </div>
              <div className="relative">
                <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                <input required type="password" value={authForm.confirm_password} onChange={e => setAuthForm({...authForm, confirm_password: e.target.value})} placeholder="Confirm New Key" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold focus:bg-white focus:border-blue-100 outline-none transition-all" />
              </div>
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-blue-600 transition-all active:scale-95">Finalize Reset</button>
          </form>
        );
      case 'signup':
        return (
          <form onSubmit={handleAuth} className="p-12 space-y-6">
            {error && <div className="bg-rose-50 text-rose-600 px-4 py-3 rounded-xl text-[10px] font-black uppercase text-center border border-rose-100 flex items-center justify-center space-x-2"><AlertCircle className="w-4 h-4" /> <span>{error}</span></div>}
            <div className="space-y-4">
                <div className="relative">
                  <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <input required value={authForm.brand_name} onChange={e => setAuthForm({...authForm, brand_name: e.target.value})} placeholder="Agency Name" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold focus:bg-white focus:border-blue-100 outline-none transition-all" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <input required type="email" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} placeholder="Work Email" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold focus:bg-white focus:border-blue-100 outline-none transition-all" />
                </div>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                <input required value={authForm.mobile} onChange={e => setAuthForm({...authForm, mobile: e.target.value})} placeholder="Login Mobile" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold focus:bg-white focus:border-blue-100 outline-none transition-all" />
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                <input required type="password" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} placeholder="Secure Key" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold focus:bg-white focus:border-blue-100 outline-none transition-all" />
              </div>
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-blue-600 transition-all active:scale-95">Submit Registration</button>
            <div className="pt-4 text-center">
              <button type="button" onClick={() => setAuthMode('login')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Return to Login</button>
            </div>
          </form>
        );
      default: // Login
        return (
          <form onSubmit={handleAuth} className="p-12 space-y-6">
            {error && <div className="bg-rose-50 text-rose-600 px-4 py-3 rounded-xl text-[10px] font-black uppercase text-center border border-rose-100 flex items-center justify-center space-x-2"><AlertCircle className="w-4 h-4" /> <span>{error}</span></div>}
            <div className="space-y-4">
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                <input required value={authForm.mobile} onChange={e => setAuthForm({...authForm, mobile: e.target.value})} placeholder="Registered Mobile" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold focus:bg-white focus:border-blue-100 outline-none transition-all" />
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                <input required type="password" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} placeholder="Security Key" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold focus:bg-white focus:border-blue-100 outline-none transition-all" />
              </div>
            </div>
            <div className="text-right">
              <button type="button" onClick={() => { setError(''); setAuthMode('forgot'); }} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Forgot Key?</button>
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-blue-600 transition-all active:scale-95">Authorize Session</button>
            <div className="pt-6 text-center border-t border-slate-50">
              <button type="button" onClick={() => setAuthMode('signup')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">New Agency Signup</button>
            </div>
          </form>
        );
    }
  };

  const getHeaderIcon = () => {
    if (authMode === 'login') return <LogIn className="text-white w-10 h-10" />;
    if (authMode === 'signup') return <UserPlus className="text-white w-10 h-10" />;
    if (authMode === 'forgot') return <ShieldQuestion className="text-white w-10 h-10" />;
    if (authMode === 'verify') return <Smartphone className="text-white w-10 h-10" />;
    if (authMode === 'reset') return <KeyRound className="text-white w-10 h-10" />;
    return <LogIn className="text-white w-10 h-10" />;
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4">
      <div className="bg-white rounded-[3.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-12 text-center bg-slate-50 border-b relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-900"><X className="w-6 h-6" /></button>
          <div className="bg-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-200 ring-8 ring-blue-50">
            {getHeaderIcon()}
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            {authMode === 'login' ? 'Partner Login' : 
             authMode === 'signup' ? 'Agency Request' : 
             authMode === 'forgot' ? 'Identify' : 
             authMode === 'verify' ? 'Challenge' : 'Reset Access'}
          </h2>
          <p className="text-slate-500 text-sm mt-3 font-medium">
            {authMode === 'login' ? 'Authenticated B2B Access' : 
             authMode === 'signup' ? 'Join our partner network' : 
             authMode === 'forgot' ? 'Recover your master key' : 
             authMode === 'verify' ? 'Confirm mobile ownership' : 'Set a new secure key'}
          </p>
        </div>

        {renderAuthForm()}
      </div>
    </div>
  );
}
