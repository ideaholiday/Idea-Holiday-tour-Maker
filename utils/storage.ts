
import { TourItem, TransferItem, AgentProfile, SavedQuotation, AgentStatus } from '../types';
import { MASTER_TOURS, MASTER_TRANSFERS } from '../constants';

const TOURS_KEY = 'tour_maker_tours';
const TRANSFERS_KEY = 'tour_maker_transfers';
const AGENT_KEY = 'tour_maker_current_agent';
const ALL_AGENTS_KEY = 'tour_maker_all_agents_registry';
const SAVED_QUOTES_KEY = 'tour_maker_saved_quotes';
const COUNTRIES_KEY = 'tour_maker_countries';

export const storage = {
  getTours: (): TourItem[] => {
    const data = localStorage.getItem(TOURS_KEY);
    if (!data) {
      localStorage.setItem(TOURS_KEY, JSON.stringify(MASTER_TOURS));
      return MASTER_TOURS;
    }
    return JSON.parse(data);
  },

  saveTours: (tours: TourItem[]) => {
    localStorage.setItem(TOURS_KEY, JSON.stringify(tours));
  },

  getTransfers: (): TransferItem[] => {
    const data = localStorage.getItem(TRANSFERS_KEY);
    if (!data) {
      localStorage.setItem(TRANSFERS_KEY, JSON.stringify(MASTER_TRANSFERS));
      return MASTER_TRANSFERS;
    }
    return JSON.parse(data);
  },

  saveTransfers: (transfers: TransferItem[]) => {
    localStorage.setItem(TRANSFERS_KEY, JSON.stringify(transfers));
  },

  getCountries: (): string[] => {
    const data = localStorage.getItem(COUNTRIES_KEY);
    if (!data) {
      const initial = ['Thailand', 'UAE', 'India Goa', 'Vietnam'];
      localStorage.setItem(COUNTRIES_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  saveCountries: (countries: string[]) => {
    localStorage.setItem(COUNTRIES_KEY, JSON.stringify(countries));
  },

  getAgent: (): AgentProfile | null => {
    const data = localStorage.getItem(AGENT_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveAgent: (agent: AgentProfile) => {
    localStorage.setItem(AGENT_KEY, JSON.stringify(agent));
    // Also ensure this agent is in the global registry
    const all = storage.getAllAgents();
    const exists = all.findIndex(a => a.id === agent.id || a.mobile === agent.mobile);
    if (exists > -1) {
      all[exists] = { ...all[exists], ...agent };
    } else {
      all.push(agent);
    }
    storage.saveAllAgents(all);
  },

  getAllAgents: (): AgentProfile[] => {
    const data = localStorage.getItem(ALL_AGENTS_KEY);
    if (!data) {
      const initial: AgentProfile[] = [
        {
          id: 'mock-1',
          brand_name: 'Premium Escapes India',
          email: 'partner@premiumescapes.com',
          mobile: '9876543210',
          password: 'password123',
          status: AgentStatus.APPROVED,
          joined_date: '2024-01-15',
          logo_url: '',
          quotes_generated: 45
        }
      ];
      storage.saveAllAgents(initial);
      return initial;
    }
    return JSON.parse(data);
  },

  saveAllAgents: (agents: AgentProfile[]) => {
    localStorage.setItem(ALL_AGENTS_KEY, JSON.stringify(agents));
  },

  logoutAgent: () => {
    localStorage.removeItem(AGENT_KEY);
  },

  saveQuotation: (quote: SavedQuotation) => {
    const existing = storage.getSavedQuotations();
    const current = storage.getAgent();
    
    // Inject agent email for admin tracking
    const quoteWithAgent = {
      ...quote,
      agent_email: current?.email || 'guest@ideaholiday.com'
    };

    const index = existing.findIndex(q => q.reference_no === quote.reference_no);
    if (index > -1) {
      existing[index] = quoteWithAgent;
    } else {
      existing.unshift(quoteWithAgent);
    }
    localStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(existing));
    
    // Increment quote count for current agent in registry
    if (current) {
      const all = storage.getAllAgents();
      const aIdx = all.findIndex(a => a.id === current.id);
      if (aIdx > -1) {
        all[aIdx].quotes_generated = (all[aIdx].quotes_generated || 0) + 1;
        storage.saveAllAgents(all);
      }
    }
  },

  getSavedQuotations: (): SavedQuotation[] => {
    const data = localStorage.getItem(SAVED_QUOTES_KEY);
    return data ? JSON.parse(data) : [];
  },

  deleteQuotation: (refNo: string) => {
    const existing = storage.getSavedQuotations();
    const filtered = existing.filter(q => q.reference_no !== refNo);
    localStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(filtered));
  }
};
