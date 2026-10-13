export interface MedicalRecord {
  id: string;
  year: string;
  type: string;
  title: string;
  titleHindi?: string;
  doctor: string;
  doctorSpecialty: string;
  hospital: string;
  date: string;
  diagnosis: string;
  doctorNotes: string;
  bpReading?: string;
  verifiedByHospital: boolean;
}
