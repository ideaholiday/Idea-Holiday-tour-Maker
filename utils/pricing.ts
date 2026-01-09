
import { Quotation, PriceBreakdown, TourItem, TransferItem } from '../types';
import { storage } from './storage';

/**
 * Calculates a complete price breakdown for a quotation.
 * Handles Tour entrance fees, Tour transfer surcharges (SIC vs PVT),
 * Logistical transfers, and Hotel components.
 */
export const calculateBreakdown = (quotation: Quotation): PriceBreakdown => {
  const allTours = storage.getTours();
  const allTransfers = storage.getTransfers();
  
  const adults = Number(quotation.adults) || 0;
  const children = Number(quotation.children) || 0;
  const totalPax = adults + children;
  
  let tourCostTotal = 0;
  
  // 1. Sum hotel costs from global field and city stays
  let hotelCost = Number(quotation.hotel_cost_inr) || 0;
  if (quotation.city_stays && quotation.city_stays.length > 0) {
    quotation.city_stays.forEach(stay => {
      hotelCost += Number(stay.hotel_cost_inr) || 0;
    });
  }

  // 2. Calculate Activity/Tour costs from Selected Pool
  quotation.selected_tour_ids.forEach(tourId => {
    const tour = allTours.find(t => t.id === tourId);
    if (!tour) return;

    // Check if this tour is assigned to any day in the itinerary to determine transfer type
    // If not assigned or assigned as Sharing, use Sharing.
    let transferType: 'Sharing' | 'Private' = 'Sharing';
    for (const day of quotation.itinerary) {
      const assignment = day.assigned_tours.find(at => at.tour_id === tourId);
      if (assignment) {
        transferType = assignment.transfer_type;
        break;
      }
    }

    // Handle is_sharing_only constraint
    if (tour.is_sharing_only) transferType = 'Sharing';

    const tourNameLower = tour.name.toLowerCase();
    const isTiered = tourNameLower.includes('airport') || (tour.city.toLowerCase() === 'goa' && tourNameLower.includes('pvt'));

    let componentCost = 0;

    if (isTiered) {
      // Tiered logic: Base price covers up to 4 people, 500 extra per additional person
      componentCost = tour.adult_price_inr; 
      if (totalPax > 4) {
        componentCost += (totalPax - 4) * 500;
      }
    } else {
      // Standard Tour Pricing: (Entrance * Pax) + (Transfer Surcharge)
      const entranceCost = (tour.adult_price_inr * adults) + (tour.child_price_inr * children);
      
      let transferSurcharge = 0;
      if (transferType === 'Sharing') {
        transferSurcharge = (tour.sharing_transfer_price_inr || 0) * totalPax;
      } else {
        // Private is usually a flat vehicle rate for the tour
        transferSurcharge = tour.private_transfer_price_inr || 0;
      }
      
      componentCost = entranceCost + transferSurcharge;
    }

    tourCostTotal += componentCost;
  });

  // 3. Add Logistical Transfer costs (selected_transfer_ids)
  // These are flat vehicle rates (Sedan/SUV/Van)
  quotation.selected_transfer_ids.forEach(transferId => {
    const transfer = allTransfers.find(tr => tr.id === transferId);
    if (transfer) {
      tourCostTotal += Number(transfer.price_inr) || 0;
    }
  });

  // 4. Add Costs from Manual/Custom Activities in Itinerary
  quotation.itinerary.forEach(day => {
    day.assigned_tours.forEach(at => {
      if (at.custom_name && (at.custom_adult_price_inr || at.custom_child_price_inr)) {
        const adultPrice = Number(at.custom_adult_price_inr) || 0;
        const childPrice = Number(at.custom_child_price_inr) || 0;
        tourCostTotal += (adultPrice * adults) + (childPrice * children);
      }
    });
  });

  // 5. Final Commercial Calculations
  const subtotal = tourCostTotal + hotelCost;
  const marginPercent = Number(quotation.margin_percent) || 0;
  const marginAmount = subtotal * (marginPercent / 100);
  const finalTotalInr = subtotal + marginAmount;

  return {
    tour_cost_inr: tourCostTotal,
    hotel_cost_inr: hotelCost,
    subtotal_inr: subtotal,
    margin_amount_inr: marginAmount,
    final_total_inr: finalTotalInr
  };
};
