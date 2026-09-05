// Rough Delhi-NCR pincode prefix ranges, used only to SUGGEST a fulfillment
// method in the dashboard UI (badge/hint) — the brand owner always makes the
// final call by clicking a button, this never auto-decides anything.
const NCR_PREFIXES = [
    "110", // Delhi
    "121", // Faridabad
    "122", // Gurgaon
    "123", // Rewari/Gurgaon belt
    "201", // Ghaziabad / Noida
    "203", // Bulandshahr belt (outer NCR)
];

export function isLikelyDelhiNCR(pincode: string) {
    return NCR_PREFIXES.some((prefix) => pincode.startsWith(prefix));
}