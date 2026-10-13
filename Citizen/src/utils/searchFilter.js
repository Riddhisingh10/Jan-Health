export function filterRecordsByQuery(records, query) {
  if (!query) return records;
  const q = query.toLowerCase().trim();
  return records.filter(r => r.title.toLowerCase().includes(q) || r.doctor.toLowerCase().includes(q) || r.hospital.toLowerCase().includes(q) || r.diagnosis.toLowerCase().includes(q));
}
