export function formatAbhaNumber(val) {
  if (!val) return "";
  if (val.includes("@")) return val.toLowerCase();
  const digits = val.replace(/\D/g, "").slice(0, 14);
  let res = "";
  if (digits.length > 0) res += digits.slice(0, 2);
  if (digits.length > 2) res += "-" + digits.slice(2, 6);
  if (digits.length > 6) res += "-" + digits.slice(6, 10);
  if (digits.length > 10) res += "-" + digits.slice(10, 14);
  return res || digits;
}

export function maskAbha(val) {
  if (!val) return "";
  if (val.includes("@")) return val;
  const clean = val.replace(/\D/g, "");
  if (clean.length < 14) return val;
  return `${clean.slice(0, 2)}-XXXX-XXXX-${clean.slice(10, 14)}`;
}

// Kept for backward compatibility
export function maskAadhaar(aadhaar) {
  return maskAbha(aadhaar);
}
