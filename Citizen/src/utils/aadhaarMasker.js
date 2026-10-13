export function maskAadhaar(aadhaar) {
  if (!aadhaar) return "";
  const clean = aadhaar.replace(/\s/g, "");
  return "XXXX-XXXX-" + clean.slice(-4);
}
