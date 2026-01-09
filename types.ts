
export enum Category {
  CITY_TOUR = 'City Tour',
  DESERT = 'Desert & Safari',
  CRUISE = 'Cruise',
  ATTRACTION = 'Attraction & Theme Park',
  TRANSFER = 'Transfer',
  ISLAND_TOUR = 'Island Tour'
}

export type TransferType = 'Sharing' | 'Private';

export enum AgentStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  SUSPENDED = 'Suspended'
}

export interface AssignedTour {
  tour_id?: string;
  custom_name?: string; 
  custom_description?: string; 
  custom_adult_price_inr?: number; 
  custom_child_price_inr?: number; 
  transfer_type: TransferType;
}

export interface AgentProfile {
  id: string;
  brand_name: string;
  logo_url: string;
  email: string;
  mobile: string;
  password?: string; // For simulation
  phone?: string; // Legacy field
  address?: string;
  status: AgentStatus;
  joined_date: string;
  quotes_generated?: number;
}

export interface TourItem {
  id: string;
  name: string;
  city: string;
  country: string;
  adult_price_inr: number;
  child_price_inr: number;
  sharing_transfer_price_inr: number;
  private_transfer_price_inr: number;
  category: Category;
  duration: string;
  description: string;
  image?: string;
  is_sharing_only?: boolean;
}

export interface TransferItem {
  id: string;
  route: string;
  country: string;
  vehicle_type: 'Sedan' | 'SUV' | 'Van';
  price_inr: number;
  description: string;
}

export interface ItineraryDay {
  day_number: number;
  title: string;
  description: string;
  assigned_tours: AssignedTour[];
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  overnight_city: string;
  inclusions: string[];
  exclusions: string[];
}

export interface CityStay {
  city: string;
  nights: number;
  hotel_name?: string;
  hotel_cost_inr?: number;
}

export interface Quotation {
  reference_no: string;
  client_name: string;
  country: string;
  city_stays: CityStay[];
  travel_start_date: string;
  number_of_days: number;
  adults: number;
  children: number;
  hotel_name: string;
  hotel_cost_inr: number;
  selected_tour_ids: string[];
  selected_transfer_ids: string[];
  itinerary: ItineraryDay[];
  margin_percent: number;
  agent_email?: string; // Linked agent
}

export interface ItineraryTemplate {
  id: string;
  name: string;
  country: string;
  days: number;
  city_stays: CityStay[];
  tour_ids: string[];
  transfer_ids: string[];
  image: string;
  tagline: string;
}

export interface SavedQuotation extends Quotation {
  saved_at: string;
  total_inr: number;
}

export interface PriceBreakdown {
  tour_cost_inr: number;
  hotel_cost_inr: number;
  subtotal_inr: number;
  margin_amount_inr: number;
  final_total_inr: number;
}
