/**
 * Configuration des frais de livraison (modifiable facilement)
 * Unité : FCFA
 */
export const DELIVERY_CONFIG = {
  FREE_THRESHOLD_KM: 10,       // < 10 km → Livraison gratuite
  FLAT_RATE_KM: 30,            // 10–30 km → forfait fixe
  FLAT_RATE_AMOUNT: 1000,      // FCFA
  PER_KM_RATE: 50,             // > 30 km → FCFA par km
  CURRENCY: 'FCFA',
};

/**
 * Calcule les frais de livraison estimés à partir d'une distance
 * @param {number} distanceKm
 * @returns {{ amount: number, label: string }}
 */
export function estimateDelivery(distanceKm) {
  if (distanceKm === null || distanceKm === undefined) {
    return { amount: null, label: 'Calcul impossible' };
  }
  if (distanceKm < DELIVERY_CONFIG.FREE_THRESHOLD_KM) {
    return { amount: 0, label: 'Livraison gratuite' };
  }
  if (distanceKm <= DELIVERY_CONFIG.FLAT_RATE_KM) {
    return {
      amount: DELIVERY_CONFIG.FLAT_RATE_AMOUNT,
      label: `${DELIVERY_CONFIG.FLAT_RATE_AMOUNT.toLocaleString('fr-FR')} ${DELIVERY_CONFIG.CURRENCY}`,
    };
  }
  const amount = Math.round(distanceKm * DELIVERY_CONFIG.PER_KM_RATE);
  return {
    amount,
    label: `${amount.toLocaleString('fr-FR')} ${DELIVERY_CONFIG.CURRENCY}`,
  };
}
