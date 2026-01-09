
import React, { useState, useEffect } from 'react';
import { TourItem, TransferItem, Category, AgentProfile, AgentStatus, SavedQuotation } from '../types';
import { storage } from '../utils/storage';
import { MASTER_TOURS, MASTER_TRANSFERS } from '../constants';
import { 
  Lock, LayoutGrid, Plus, Trash2, Edit2, X, Save, 
  MapPin, Globe, Clock, Banknote, LogOut, Search, Pencil, Image as ImageIcon, AlignLeft, Sparkles, Flag, Zap, PlusCircle, Map, ShieldAlert, RefreshCcw, Info, ShieldCheck, Users, CheckCircle, XCircle, UserPlus, Mail, Phone, Calendar, Building2, Eye, FileText, ArrowRight, TrendingUp, AlertCircle
} from 'lucide-react';

interface Props {
  onClose: () => void;
  onDataUpdate: () => void;
}

const AUTH_KEY = 'admin_cms_authenticated';

export default function AdminCMS({ onClose, onDataUpdate }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'tours' | 'transfers' | 'regions' | 'agents'>('tours');
  const [tours, setTours] = useState<TourItem[]>([]);
  const [transfers, setTransfers] = useState<TransferItem[]>([]);
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [allQuotes, setAllQuotes] = useState<SavedQuotation[]>([]);
  
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AgentStatus | 'ALL'>('ALL');
  
  // Agent Quotes Inspector State
  const [viewingAgentQuotes, setViewingAgentQuotes] = useState<AgentProfile | null>(null);

  useEffect(() => {
    setTours(storage.getTours());
    setTransfers(storage.getTransfers());
    setAgents(storage.getAllAgents());
    setCountries(storage.getCountries());
    setAllQuotes(storage.getSavedQuotations());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_KEY, 'true');
      setError('');
    } else {
      setError('Invalid master password.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    if (confirm('Logout from Master CMS?')) {
      setIsAuthenticated(false);
      sessionStorage.removeItem(AUTH_KEY);
    }
  };

  const handleAgentStatus = (agentId: string, newStatus: AgentStatus) => {
    const updated = agents.map(a => a.id === agentId ? { ...a, status: newStatus } : a);
    setAgents(updated);
    storage.saveAllAgents(updated);
    onDataUpdate();
  };

  const deleteAgent = (id: string) => {
    if (confirm('Permanently remove this agency and all their records?')) {
      const updated = agents.filter(a => a.id !== id);
      setAgents(updated);
      storage.saveAllAgents(updated);
    }
  };

  const handleAddCountry = () => {
    const name = prompt('Enter new destination name:');
    if (name && !countries.includes(name)) {
      const updated = [...countries, name];
      setCountries(updated);
      storage.saveCountries(updated);
      onDataUpdate();
    }
  };

  const deleteCountry = (name: string) => {
    if (confirm(`Remove ${name} from destinations? This won't delete existing products but hides it from the quick selector if no products remain.`)) {
      const updated = countries.filter(c => c !== name);
      setCountries(updated);
      storage.saveCountries(updated);
      onDataUpdate();
    }
  };

  const saveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingItem.id;
    const item = { ...editingItem, id: editingItem.id || `cms-${Date.now()}` };

    if (activeTab === 'tours') {
      const updated = isNew ? [item, ...tours] : tours.map(t => t.id === item.id ? item : t);
      setTours(updated);
      storage.saveTours(updated);
    } else {
      const updated = isNew ? [item, ...transfers] : transfers.map(t => t.id === item.id ? item : t);
      setTransfers(updated);
      storage.saveTransfers(updated);
    }
    
    setEditingItem(null);
    onDataUpdate();
  };

  const deleteProduct = (id: string) => {
    if (confirm('Delete this product from master inventory?')) {
      if (activeTab === 'tours') {
        const updated = tours.filter(t => t.id !== id);
        setTours(updated);
        storage.saveTours(updated);
      } else {
        const updated = transfers.filter(t => t.id !== id);
        setTransfers(updated);
        storage.saveTransfers(updated);
      }
      onDataUpdate();
    }
  };

  const pendingCount = agents.filter(a => a.status === AgentStatus.PENDING).length;

  const filteredAgents = agents.filter(a => {
    const matchesSearch = a.brand_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         a.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         a.mobile.includes(searchQuery);
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredItems = activeTab === 'tours' 
    ? tours.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.city.toLowerCase().includes(searchQuery.toLowerCase()) || t.country.toLowerCase().includes(searchQuery.toLowerCase()))
    : activeTab === 'transfers' 
    ? transfers.filter(tr => tr.route.toLowerCase().includes(searchQuery.toLowerCase()) || tr.country.toLowerCase().includes(searchQuery.toLowerCase()))
    : filteredAgents;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
        <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-slate-900 p-5 rounded-3xl mb-4 shadow-xl ring-8 ring-slate-100"><ShieldCheck className="text-white w-8 h-8" /></div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Master Portal</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 font-mono text-center text-lg transition-all" placeholder="Secure Key" />
            </div>
            <div className="flex space-x-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 px-6 py-4 border-2 border-slate-100 rounded-2xl font-black text-slate-400 uppercase tracking-widest text-xs">Cancel</button>
              <button type="submit" className="flex-1 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs">Unlock</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom-4 duration-300">
      <header className="border-b bg-white px-10 py-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-6">
          <div className="bg-slate-900 p-3 rounded-2xl shadow-sm"><LayoutGrid className="text-white w-6 h-6" /></div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Master CMS</h2>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">B2B Product Inventory</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 flex items-center font-black text-[10px] uppercase tracking-widest transition-colors"><LogOut className="w-4 h-4 mr-2" /> Logout</button>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full transition-all group"><X className="w-8 h-8 text-slate-400 group-hover:rotate-90 transition-transform" /></button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex bg-slate-50/30">
        <aside className="w-72 border-r bg-white p-8 space-y-4 shrink-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Segments</p>
          <button onClick={() => setActiveTab('tours')} className={`w-full flex items-center px-5 py-4 rounded-2xl font-black text-xs uppercase transition-all ${activeTab === 'tours' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}><MapPin className="w-4 h-4 mr-3" /> Tours</button>
          <button onClick={() => setActiveTab('transfers')} className={`w-full flex items-center px-5 py-4 rounded-2xl font-black text-xs uppercase transition-all ${activeTab === 'transfers' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}><Globe className="w-4 h-4 mr-3" /> Transfers</button>
          <button onClick={() => setActiveTab('regions')} className={`w-full flex items-center px-5 py-4 rounded-2xl font-black text-xs uppercase transition-all ${activeTab === 'regions' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}><Flag className="w-4 h-4 mr-3" /> Regions</button>
          <button onClick={() => setActiveTab('agents')} className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-black text-xs uppercase transition-all ${activeTab === 'agents' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}>
            <div className="flex items-center"><Users className="w-4 h-4 mr-3" /> <span>Agents</span></div>
            {pendingCount > 0 && <span className="bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse">{pendingCount}</span>}
          </button>
        </aside>

        <main className="flex-1 overflow-y-auto p-12">
          {activeTab === 'agents' ? (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
               <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Partner Network</h3>
                    <p className="text-slate-500 mt-2">Manage agency access, approve signups, and audit generated quotations.</p>
                  </div>
                  <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-2xl border">
                    {(['ALL', AgentStatus.PENDING, AgentStatus.APPROVED, AgentStatus.SUSPENDED] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-white shadow-md text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input type="text" placeholder="Search by brand, email or mobile..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[2rem] outline-none shadow-sm font-bold text-lg" />
              </div>

               <div className="bg-white border rounded-[2.5rem] shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Agency Identity</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Platform Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Production</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredAgents.map((agent: AgentProfile) => (
                      <tr key={agent.id} className="hover:bg-slate-50/50 group transition-colors">
                        <td className="px-8 py-6">
                           <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden border flex items-center justify-center shrink-0">
                                 {agent.logo_url ? <img src={agent.logo_url} className="w-full h-full object-contain p-1" /> : <Building2 className="w-5 h-5 text-slate-300" />}
                              </div>
                              <div>
                                 <p className="font-black text-slate-900 uppercase tracking-tight">{agent.brand_name}</p>
                                 <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{agent.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border inline-flex items-center space-x-2 ${
                              agent.status === AgentStatus.APPROVED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                              agent.status === AgentStatus.PENDING ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.1)]' : 
                              'bg-slate-50 text-slate-400 border-slate-100'
                           }`}>
                              {agent.status === AgentStatus.PENDING && <AlertCircle className="w-3 h-3" />}
                              <span>{agent.status}</span>
                           </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                           <button 
                             onClick={() => setViewingAgentQuotes(agent)}
                             className="inline-flex flex-col items-center group/btn"
                           >
                              <p className="text-sm font-black text-slate-900 leading-none mb-1 group-hover/btn:text-blue-600 transition-colors">
                                {allQuotes.filter(q => q.agent_email === agent.email).length}
                              </p>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Quotes</p>
                           </button>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex items-center justify-end space-x-2">
                              {agent.status === AgentStatus.PENDING ? (
                                <button onClick={() => handleAgentStatus(agent.id, AgentStatus.APPROVED)} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center">
                                   <CheckCircle className="w-3.5 h-3.5 mr-2" /> Approve
                                </button>
                              ) : agent.status === AgentStatus.APPROVED ? (
                                <button onClick={() => handleAgentStatus(agent.id, AgentStatus.SUSPENDED)} className="bg-amber-50 text-amber-600 px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest border border-amber-100 hover:bg-amber-600 hover:text-white transition-all flex items-center">
                                   <ShieldAlert className="w-3.5 h-3.5 mr-2" /> Suspend
                                </button>
                              ) : (
                                <button onClick={() => handleAgentStatus(agent.id, AgentStatus.APPROVED)} className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                                   Restore Access
                                </button>
                              )}
                              <button onClick={() => deleteAgent(agent.id)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm" title="Delete Agency">
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               </div>
            </div>
          ) : activeTab === 'regions' ? (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
               <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Regional Portfolio</h3>
                  <p className="text-slate-500 mt-2">Manage supported destinations and markets.</p>
                </div>
                <button onClick={handleAddCountry} className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase text-xs shadow-xl flex items-center space-x-2">
                  <Plus className="w-5 h-5" /> <span>Add Destination</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {countries.map(country => (
                  <div key={country} className="bg-white border rounded-[2.5rem] p-8 shadow-sm flex items-center justify-between group hover:border-blue-300 transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center border group-hover:bg-blue-600 transition-all">
                        <Flag className="w-5 h-5 text-slate-400 group-hover:text-white" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 uppercase tracking-tight">{country}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {tours.filter(t => t.country === country).length + transfers.filter(t => t.country === country).length} Products
                        </p>
                      </div>
                    </div>
                    <button onClick={() => deleteCountry(country)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{activeTab === 'tours' ? 'Sightseeing Master' : 'Transfer Matrix'}</h3>
                  <p className="text-slate-500 mt-2">Update inventory rates and product details.</p>
                </div>
                <button onClick={() => setEditingItem({ category: Category.CITY_TOUR, country: countries[0], city: '', adult_price_inr: 0, child_price_inr: 0, sharing_transfer_price_inr: 0, private_transfer_price_inr: 0, duration: '4 Hours', description: '' })} className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase text-xs shadow-xl flex items-center space-x-2">
                  <Plus className="w-5 h-5" /> <span>Create Product</span>
                </button>
              </div>
              <div className="bg-white border rounded-[2.5rem] shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Market</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredItems.map((item: any) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 group transition-colors">
                        <td className="px-8 py-6">
                          <p className="font-black text-slate-900 uppercase tracking-tight">{item.name || item.route}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.city || 'Logistics'}</p>
                        </td>
                        <td className="px-8 py-6"><span className="text-[10px] font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full uppercase tracking-widest">{item.country}</span></td>
                        <td className="px-8 py-6 font-mono font-bold text-slate-900">₹{(item.adult_price_inr ?? item.price_inr ?? 0).toLocaleString()}</td>
                        <td className="px-8 py-6 text-right space-x-2">
                           <button onClick={() => setEditingItem(item)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit2 className="w-4 h-4" /></button>
                           <button onClick={() => deleteProduct(item.id)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* PRODUCT EDITOR MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[3.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="px-10 py-8 border-b bg-slate-50 flex items-center justify-between">
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                {editingItem.id ? 'Edit Inventory' : 'Add New Product'}
              </h4>
              <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-slate-200 rounded-full transition-all text-slate-400"><X className="w-8 h-8" /></button>
            </div>
            <form onSubmit={saveProduct} className="p-10 space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination</label>
                    <select value={editingItem.country} onChange={e => setEditingItem({...editingItem, country: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border rounded-xl font-bold">
                      {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City Hub</label>
                    <input value={editingItem.city || editingItem.route || ''} onChange={e => setEditingItem({...editingItem, [activeTab === 'tours' ? 'city' : 'route']: e.target.value})} placeholder="e.g. Bangkok" className="w-full px-5 py-3 bg-slate-50 border rounded-xl font-bold outline-none" required />
                  </div>
               </div>
               
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{activeTab === 'tours' ? 'Product Name' : 'Route Name'}</label>
                 <input value={editingItem.name || editingItem.route || ''} onChange={e => setEditingItem({...editingItem, [activeTab === 'tours' ? 'name' : 'route']: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border rounded-xl font-bold outline-none" required />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adult Net Rate (INR)</label>
                   <input type="number" value={editingItem.adult_price_inr ?? editingItem.price_inr ?? 0} onChange={e => setEditingItem({...editingItem, [activeTab === 'tours' ? 'adult_price_inr' : 'price_inr']: Number(e.target.value)})} className="w-full px-5 py-3 bg-slate-50 border rounded-xl font-bold" required />
                 </div>
                 {activeTab === 'tours' && (
                   <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Child Net Rate (INR)</label>
                     <input type="number" value={editingItem.child_price_inr ?? 0} onChange={e => setEditingItem({...editingItem, child_price_inr: Number(e.target.value)})} className="w-full px-5 py-3 bg-slate-50 border rounded-xl font-bold" />
                   </div>
                 )}
               </div>

               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Narrative</label>
                 <textarea value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} rows={3} className="w-full px-5 py-3 bg-slate-50 border rounded-xl font-medium text-sm outline-none resize-none" placeholder="Description for the itinerary..." />
               </div>

               <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-blue-600 transition-all active:scale-95">Save to Master Portfolio</button>
            </form>
          </div>
        </div>
      )}

      {/* AGENT QUOTES INSPECTOR MODAL */}
      {viewingAgentQuotes && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[3.5rem] w-full max-w-5xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="px-10 py-8 border-b flex items-center justify-between bg-slate-900 text-white">
               <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border-4 border-slate-800 shadow-inner overflow-hidden shrink-0">
                    {viewingAgentQuotes.logo_url ? <img src={viewingAgentQuotes.logo_url} className="w-full h-full object-contain p-2" /> : <Building2 className="text-slate-300 w-8 h-8" />}
                  </div>
                  <div>
                    <h4 className="text-2xl font-black uppercase tracking-tighter leading-none">{viewingAgentQuotes.brand_name}</h4>
                    <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-2">Partner Mobile: {viewingAgentQuotes.mobile}</p>
                  </div>
               </div>
               <button onClick={() => setViewingAgentQuotes(null)} className="p-2 hover:bg-slate-800 rounded-full transition-all"><X className="w-8 h-8 text-slate-400" /></button>
            </div>

            <div className="p-10 overflow-y-auto flex-1 bg-slate-50/50">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-white p-6 rounded-[2rem] border shadow-sm flex items-center space-x-4">
                    <div className="bg-blue-50 p-3 rounded-2xl"><Mail className="w-5 h-5 text-blue-600" /></div>
                    <div className="truncate"><p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Contact</p><p className="font-bold text-slate-900 text-sm truncate">{viewingAgentQuotes.email}</p></div>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border shadow-sm flex items-center space-x-4">
                    <div className="bg-emerald-50 p-3 rounded-2xl"><ShieldCheck className="w-5 h-5 text-emerald-600" /></div>
                    <div><p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Status</p><p className="font-black text-emerald-600 text-sm uppercase tracking-widest">{viewingAgentQuotes.status}</p></div>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl flex items-center space-x-4 text-white">
                    <div className="bg-blue-600 p-3 rounded-2xl"><TrendingUp className="w-5 h-5 text-white" /></div>
                    <div><p className="text-[9px] font-black text-slate-500 uppercase mb-0.5">Cumulative Value</p><p className="font-mono font-black text-white text-lg">₹{allQuotes.filter(q => q.agent_email === viewingAgentQuotes.email).reduce((sum, q) => sum + q.total_inr, 0).toLocaleString()}</p></div>
                  </div>
               </div>

               <div className="space-y-4">
                  {allQuotes.filter(q => q.agent_email === viewingAgentQuotes.email).length > 0 ? (
                    allQuotes.filter(q => q.agent_email === viewingAgentQuotes.email).map((quote, idx) => (
                      <div key={quote.reference_no} className="bg-white border rounded-[2.5rem] p-8 flex items-center justify-between group hover:border-blue-300 transition-all shadow-sm">
                        <div className="flex items-center space-x-8">
                          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 font-black shrink-0 border group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <span className="text-[9px] uppercase leading-none mb-1">QT</span>
                            <span className="text-xl leading-none">{idx + 1}</span>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{quote.reference_no}</p>
                            <h5 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">{quote.client_name || 'VIP Traveler'}</h5>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{quote.country} • {quote.number_of_days} Days • {new Date(quote.saved_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                           <p className="text-2xl font-black text-slate-900 tracking-tighter">₹{Math.round(quote.total_inr).toLocaleString()}</p>
                           <button onClick={() => { if(confirm('Delete archived record?')) { storage.deleteQuotation(quote.reference_no); setAllQuotes(storage.getSavedQuotations()); } }} className="text-slate-200 hover:text-red-500 mt-2 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-24 text-center bg-white border border-dashed rounded-[3rem]">
                       <FileText className="w-12 h-12 text-slate-200 mx-auto mb-6" />
                       <h5 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Zero Quota History</h5>
                       <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">This agent hasn't generated any platform itineraries yet.</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
