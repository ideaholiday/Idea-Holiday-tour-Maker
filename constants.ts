
import { TourItem, TransferItem, Category, ItineraryTemplate } from './types';

export const MASTER_TOURS: TourItem[] = [
  // --- THAILAND: BANGKOK ---
  { 
    id: 'th-bkk-1', name: 'Grand Palace & Emerald Buddha', city: 'Bangkok', country: 'Thailand',
    adult_price_inr: 2850, child_price_inr: 2100, sharing_transfer_price_inr: 800, private_transfer_price_inr: 3500,
    category: Category.CITY_TOUR, duration: '4 Hours', description: 'Explore the architectural masterpiece of the Grand Palace and the sacred Emerald Buddha.',
    image: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'th-bkk-2', name: 'Safari World & Marine Park + Lunch', city: 'Bangkok', country: 'Thailand',
    adult_price_inr: 3650, child_price_inr: 3100, sharing_transfer_price_inr: 0, private_transfer_price_inr: 0,
    is_sharing_only: true, category: Category.ATTRACTION, duration: 'Full Day', description: 'A massive open-air zoo and marine park featuring world-class animal shows.',
    image: 'https://images.unsplash.com/photo-1544750040-4ea9b8a27d38?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'th-bkk-3', name: 'Chao Phraya Princess Dinner Cruise', city: 'Bangkok', country: 'Thailand',
    adult_price_inr: 2450, child_price_inr: 1850, sharing_transfer_price_inr: 600, private_transfer_price_inr: 2800,
    category: Category.CRUISE, duration: '2 Hours', description: 'International buffet and live music while cruising past illuminated landmarks.',
    image: 'https://images.unsplash.com/photo-1562778612-e1e0cda9915c?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'th-bkk-4', name: 'Wat Arun & Wat Pho (Reclining Buddha)', city: 'Bangkok', country: 'Thailand',
    adult_price_inr: 1800, child_price_inr: 1400, sharing_transfer_price_inr: 700, private_transfer_price_inr: 3200,
    category: Category.CITY_TOUR, duration: '4 Hours', description: 'Visit the Temple of Dawn and the massive gold-plated Reclining Buddha.',
    image: 'https://images.unsplash.com/photo-1504930268766-d71549a36ec2?auto=format&fit=crop&q=80&w=400'
  },

  // --- THAILAND: PATTAYA ---
  { 
    id: 'th-pyx-1', name: 'Coral Island Tour by Speedboat + SIC Lunch', city: 'Pattaya', country: 'Thailand',
    adult_price_inr: 1750, child_price_inr: 1550, sharing_transfer_price_inr: 0, private_transfer_price_inr: 0,
    is_sharing_only: true, category: Category.ISLAND_TOUR, duration: 'Full Day', description: 'Escape to the crystal waters of Koh Larn for relaxation and water sports.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'th-pyx-2', name: 'Alcazar Cabaret Show (Standard Seat)', city: 'Pattaya', country: 'Thailand',
    adult_price_inr: 1450, child_price_inr: 1450, sharing_transfer_price_inr: 450, private_transfer_price_inr: 2200,
    category: Category.ATTRACTION, duration: '1.5 Hours', description: 'World-famous theatrical transvestite cabaret with state-of-the-art light and sound.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'th-pyx-3', name: 'Nong Nooch Tropical Garden + Lunch', city: 'Pattaya', country: 'Thailand',
    adult_price_inr: 2450, child_price_inr: 1950, sharing_transfer_price_inr: 550, private_transfer_price_inr: 2800,
    category: Category.ATTRACTION, duration: '5 Hours', description: 'A 500-acre botanical paradise featuring Thai cultural shows and elephant talent.',
    image: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'th-pyx-4', name: 'Sanctuary of Truth Museum', city: 'Pattaya', country: 'Thailand',
    adult_price_inr: 1200, child_price_inr: 800, sharing_transfer_price_inr: 500, private_transfer_price_inr: 2500,
    category: Category.CITY_TOUR, duration: '3 Hours', description: 'A massive wooden structure built with ancient Thai carpentry techniques.',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=400'
  },

  // --- THAILAND: PHUKET ---
  { 
    id: 'th-hkt-1', name: 'Phi Phi Island Tour by Speedboat + Lunch', city: 'Phuket', country: 'Thailand',
    adult_price_inr: 4150, child_price_inr: 3300, sharing_transfer_price_inr: 0, private_transfer_price_inr: 0,
    is_sharing_only: true, category: Category.ISLAND_TOUR, duration: 'Full Day', description: 'Visit Maya Bay, Pileh Lagoon, and Monkey Beach on this quintessential island hopping trip.',
    image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'th-hkt-2', name: 'Phuket FantaSea Show + Gold Seat & Dinner', city: 'Phuket', country: 'Thailand',
    adult_price_inr: 5200, child_price_inr: 4800, sharing_transfer_price_inr: 650, private_transfer_price_inr: 3200,
    category: Category.ATTRACTION, duration: '4 Hours', description: 'The ultimate Thai cultural theme park and theatrical extravaganza.',
    image: 'https://images.unsplash.com/photo-1528181304800-2f143c8c798d?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'th-hkt-3', name: 'James Bond Island by Big Boat + Lunch', city: 'Phuket', country: 'Thailand',
    adult_price_inr: 3200, child_price_inr: 2600, sharing_transfer_price_inr: 0, private_transfer_price_inr: 0,
    is_sharing_only: true, category: Category.ISLAND_TOUR, duration: 'Full Day', description: 'Discover the iconic karst peaks of Phang Nga Bay and Khao Phing Kan.',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=400'
  },

  // --- THAILAND: KRABI ---
  { 
    id: 'th-kbv-1', name: 'Krabi 4 Islands Tour by Speedboat + Lunch', city: 'Krabi', country: 'Thailand',
    adult_price_inr: 2150, child_price_inr: 1850, sharing_transfer_price_inr: 0, private_transfer_price_inr: 0,
    is_sharing_only: true, category: Category.ISLAND_TOUR, duration: 'Full Day', description: 'Island hopping to Phra Nang, Tup, Chicken and Poda Islands.',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'th-kbv-2', name: 'Krabi Rainforest Tour (Tiger Cave Temple)', city: 'Krabi', country: 'Thailand',
    adult_price_inr: 2400, child_price_inr: 2000, sharing_transfer_price_inr: 0, private_transfer_price_inr: 3500,
    category: Category.CITY_TOUR, duration: '6 Hours', description: 'Visit the Hot Springs, Emerald Pool, and the stunning Tiger Cave Temple.',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'th-kbv-3', name: 'Hong Island Tour by Speedboat + Lunch', city: 'Krabi', country: 'Thailand',
    adult_price_inr: 3400, child_price_inr: 2800, sharing_transfer_price_inr: 0, private_transfer_price_inr: 0,
    is_sharing_only: true, category: Category.ISLAND_TOUR, duration: 'Full Day', description: 'Experience the hidden lagoon and limestone cliffs of Koh Hong.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=400'
  },

  // UAE TOURS - DUBAI
  { 
    id: 't1', name: 'Dhow Cruise Dinner - Creek', city: 'Dubai', country: 'UAE',
    adult_price_inr: 1250, child_price_inr: 1250, sharing_transfer_price_inr: 1000, private_transfer_price_inr: 4800,
    category: Category.CRUISE, duration: '2 Hours', description: 'A nostalgic journey through Dubai Creek with international buffet dinner.',
    image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 't2', name: 'Dubai Half Day City Tour', city: 'Dubai', country: 'UAE',
    adult_price_inr: 1600, child_price_inr: 1300, sharing_transfer_price_inr: 0, private_transfer_price_inr: 4500,
    category: Category.CITY_TOUR, duration: '4 Hours', description: 'See the icons: Burj Al Arab, Jumeirah Mosque, and Dubai Museum.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 't3', name: 'Desert Safari with BBQ Dinner', city: 'Dubai', country: 'UAE',
    adult_price_inr: 2600, child_price_inr: 2100, sharing_transfer_price_inr: 0, private_transfer_price_inr: 0,
    category: Category.DESERT, duration: '6 Hours', description: 'Dune bashing, camel riding, and BBQ dinner under the stars.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400'
  }
];

export const MASTER_TRANSFERS: TransferItem[] = [
  // THAILAND LOGISTICS
  { 
    id: 'tr-tha-1', route: 'Bangkok Apt ↔ Bangkok Hotel', country: 'Thailand', vehicle_type: 'Sedan', price_inr: 2400,
    description: 'Private sedan transfer from BKK Suvarnabhumi to city hotel.'
  },
  { 
    id: 'tr-tha-2', route: 'Bangkok Hotel ↔ Pattaya Hotel', country: 'Thailand', vehicle_type: 'Van', price_inr: 4200,
    description: 'Private road transfer from Bangkok to Pattaya (approx 2.5 hrs).'
  },
  { 
    id: 'tr-tha-3', route: 'Phuket Hotel ↔ Krabi Hotel', country: 'Thailand', vehicle_type: 'Van', price_inr: 4800,
    description: 'Private road transfer from Phuket to Krabi (approx 3 hrs).'
  },
  { 
    id: 'tr-tha-4', route: 'Phuket Apt ↔ Phuket Hotel', country: 'Thailand', vehicle_type: 'SUV', price_inr: 2100,
    description: 'Private SUV transfer from HKT Airport to hotel.'
  },
  { 
    id: 'tr-tha-5', route: 'Krabi Apt ↔ Krabi Hotel', country: 'Thailand', vehicle_type: 'Sedan', price_inr: 1800,
    description: 'Private sedan transfer from KBV Airport to hotel.'
  },
  { 
    id: 'tr-tha-6', route: 'Pattaya Hotel ↔ Bangkok Apt', country: 'Thailand', vehicle_type: 'Sedan', price_inr: 2800,
    description: 'Private sedan transfer from Pattaya hotel to BKK Airport.'
  },

  // UAE LOGISTICS
  { 
    id: 'tr-dxb-1', route: 'DXB Airport ↔ Dubai Hotel', country: 'UAE', vehicle_type: 'Sedan', price_inr: 2350,
    description: 'Private sedan transfer from DXB Airport to hotel.'
  }
];

export const MASTER_TEMPLATES: ItineraryTemplate[] = [
  {
    id: 'tmpl-tha-full',
    name: '10D/9N Grand Thailand Odyssey',
    country: 'Thailand',
    days: 10,
    city_stays: [
      { city: 'Bangkok', nights: 2, hotel_name: 'Amari Watergate', hotel_cost_inr: 14500 },
      { city: 'Pattaya', nights: 2, hotel_name: 'Cape Dara Resort', hotel_cost_inr: 16000 },
      { city: 'Phuket', nights: 3, hotel_name: 'The Shore at Katathani', hotel_cost_inr: 42000 },
      { city: 'Krabi', nights: 2, hotel_name: 'Centara Grand Krabi', hotel_cost_inr: 22000 }
    ],
    tour_ids: ['th-bkk-1', 'th-bkk-2', 'th-pyx-1', 'th-pyx-2', 'th-hkt-1', 'th-kbv-1'],
    transfer_ids: ['tr-tha-1', 'tr-tha-2', 'tr-tha-3', 'tr-tha-5'],
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800',
    tagline: 'The ultimate 4-city experience.'
  },
  {
    id: 'tmpl-dxb-5d',
    name: '5D/4N Iconic Dubai',
    country: 'UAE',
    days: 5,
    city_stays: [{ city: 'Dubai', nights: 4, hotel_name: 'City Center Hub', hotel_cost_inr: 15500 }],
    tour_ids: ['t1', 't2', 't3'],
    transfer_ids: ['tr-dxb-1'],
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800',
    tagline: 'Skylines and Sand Dunes.'
  }
];

export const GLOBAL_SETTINGS = {
  DEFAULT_INR_RATE: 93,
  DEFAULT_MARGIN: 12,
};
