export interface CohortPatientRecord {
  patientId: string;
  cohort: "Bone Fracture" | "Stomach Ache" | "Viral Fever";
  age: number;
  gender: "Male" | "Female";
  bp: string;
  systolic: number;
  diastolic: number;
  spo2: number;
  bloodSugar: number;
}

/**
 * Authentic Patient Cohort Dataset extracted directly from:
 * 1. patient_clinical_datasets.pdf (Datasets 1, 2, 3)
 * 2. patient_clinical_datasets-v2.pdf (Expanded Cohorts 1, 2, 3: P001 to P045)
 */
export const CLINICAL_COHORT_DATASET: CohortPatientRecord[] = [
  // Cohort 1: Bone Fracture Admission Data (P001 - P015)
  { patientId: "P001", cohort: "Bone Fracture", age: 32, gender: "Male", bp: "141/83", systolic: 141, diastolic: 83, spo2: 97, bloodSugar: 94 },
  { patientId: "P002", cohort: "Bone Fracture", age: 35, gender: "Male", bp: "139/92", systolic: 139, diastolic: 92, spo2: 96, bloodSugar: 117 },
  { patientId: "P003", cohort: "Bone Fracture", age: 72, gender: "Male", bp: "118/77", systolic: 118, diastolic: 77, spo2: 97, bloodSugar: 94 },
  { patientId: "P004", cohort: "Bone Fracture", age: 82, gender: "Male", bp: "135/81", systolic: 135, diastolic: 81, spo2: 100, bloodSugar: 106 },
  { patientId: "P005", cohort: "Bone Fracture", age: 46, gender: "Female", bp: "136/83", systolic: 136, diastolic: 83, spo2: 96, bloodSugar: 128 },
  { patientId: "P006", cohort: "Bone Fracture", age: 38, gender: "Female", bp: "128/83", systolic: 128, diastolic: 83, spo2: 97, bloodSugar: 93 },
  { patientId: "P007", cohort: "Bone Fracture", age: 61, gender: "Male", bp: "120/87", systolic: 120, diastolic: 87, spo2: 96, bloodSugar: 102 },
  { patientId: "P008", cohort: "Bone Fracture", age: 62, gender: "Female", bp: "143/76", systolic: 143, diastolic: 76, spo2: 99, bloodSugar: 114 },
  { patientId: "P009", cohort: "Bone Fracture", age: 33, gender: "Female", bp: "120/92", systolic: 120, diastolic: 92, spo2: 98, bloodSugar: 133 },
  { patientId: "P010", cohort: "Bone Fracture", age: 64, gender: "Male", bp: "140/77", systolic: 140, diastolic: 77, spo2: 96, bloodSugar: 122 },
  { patientId: "P011", cohort: "Bone Fracture", age: 47, gender: "Female", bp: "120/82", systolic: 120, diastolic: 82, spo2: 96, bloodSugar: 104 },
  { patientId: "P012", cohort: "Bone Fracture", age: 53, gender: "Female", bp: "138/86", systolic: 138, diastolic: 86, spo2: 97, bloodSugar: 103 },
  { patientId: "P013", cohort: "Bone Fracture", age: 63, gender: "Male", bp: "139/83", systolic: 139, diastolic: 83, spo2: 96, bloodSugar: 118 },
  { patientId: "P014", cohort: "Bone Fracture", age: 39, gender: "Male", bp: "123/89", systolic: 123, diastolic: 89, spo2: 99, bloodSugar: 97 },
  { patientId: "P015", cohort: "Bone Fracture", age: 46, gender: "Female", bp: "144/76", systolic: 144, diastolic: 76, spo2: 97, bloodSugar: 132 },

  // Cohort 2: Stomach Ache Admission Data (P016 - P030)
  { patientId: "P016", cohort: "Stomach Ache", age: 22, gender: "Female", bp: "122/78", systolic: 122, diastolic: 78, spo2: 97, bloodSugar: 112 },
  { patientId: "P017", cohort: "Stomach Ache", age: 58, gender: "Male", bp: "130/85", systolic: 130, diastolic: 85, spo2: 100, bloodSugar: 143 },
  { patientId: "P018", cohort: "Stomach Ache", age: 36, gender: "Female", bp: "114/77", systolic: 114, diastolic: 77, spo2: 99, bloodSugar: 139 },
  { patientId: "P019", cohort: "Stomach Ache", age: 69, gender: "Female", bp: "117/74", systolic: 117, diastolic: 74, spo2: 100, bloodSugar: 96 },
  { patientId: "P020", cohort: "Stomach Ache", age: 24, gender: "Male", bp: "114/75", systolic: 114, diastolic: 75, spo2: 100, bloodSugar: 93 },
  { patientId: "P021", cohort: "Stomach Ache", age: 67, gender: "Female", bp: "129/84", systolic: 129, diastolic: 84, spo2: 99, bloodSugar: 86 },
  { patientId: "P022", cohort: "Stomach Ache", age: 32, gender: "Female", bp: "134/80", systolic: 134, diastolic: 80, spo2: 97, bloodSugar: 122 },
  { patientId: "P023", cohort: "Stomach Ache", age: 73, gender: "Male", bp: "124/70", systolic: 124, diastolic: 70, spo2: 99, bloodSugar: 149 },
  { patientId: "P024", cohort: "Stomach Ache", age: 40, gender: "Male", bp: "137/79", systolic: 137, diastolic: 79, spo2: 98, bloodSugar: 104 },
  { patientId: "P025", cohort: "Stomach Ache", age: 65, gender: "Male", bp: "127/86", systolic: 127, diastolic: 86, spo2: 97, bloodSugar: 126 },
  { patientId: "P026", cohort: "Stomach Ache", age: 80, gender: "Male", bp: "113/81", systolic: 113, diastolic: 81, spo2: 99, bloodSugar: 115 },
  { patientId: "P027", cohort: "Stomach Ache", age: 25, gender: "Male", bp: "138/88", systolic: 138, diastolic: 88, spo2: 97, bloodSugar: 95 },
  { patientId: "P028", cohort: "Stomach Ache", age: 80, gender: "Male", bp: "134/87", systolic: 134, diastolic: 87, spo2: 98, bloodSugar: 101 },
  { patientId: "P029", cohort: "Stomach Ache", age: 78, gender: "Male", bp: "118/86", systolic: 118, diastolic: 86, spo2: 100, bloodSugar: 112 },
  { patientId: "P030", cohort: "Stomach Ache", age: 43, gender: "Female", bp: "122/81", systolic: 122, diastolic: 81, spo2: 100, bloodSugar: 142 },

  // Cohort 3: Viral Fever Admission Data (P031 - P045)
  { patientId: "P031", cohort: "Viral Fever", age: 33, gender: "Male", bp: "112/67", systolic: 112, diastolic: 67, spo2: 95, bloodSugar: 92 },
  { patientId: "P032", cohort: "Viral Fever", age: 47, gender: "Male", bp: "105/67", systolic: 105, diastolic: 67, spo2: 98, bloodSugar: 97 },
  { patientId: "P033", cohort: "Viral Fever", age: 47, gender: "Male", bp: "106/75", systolic: 106, diastolic: 75, spo2: 93, bloodSugar: 155 },
  { patientId: "P034", cohort: "Viral Fever", age: 48, gender: "Female", bp: "126/80", systolic: 126, diastolic: 80, spo2: 94, bloodSugar: 159 },
  { patientId: "P035", cohort: "Viral Fever", age: 34, gender: "Female", bp: "112/80", systolic: 112, diastolic: 80, spo2: 99, bloodSugar: 142 },
  { patientId: "P036", cohort: "Viral Fever", age: 42, gender: "Male", bp: "108/78", systolic: 108, diastolic: 78, spo2: 95, bloodSugar: 144 },
  { patientId: "P037", cohort: "Viral Fever", age: 70, gender: "Female", bp: "128/66", systolic: 128, diastolic: 66, spo2: 98, bloodSugar: 102 },
  { patientId: "P038", cohort: "Viral Fever", age: 25, gender: "Female", bp: "128/75", systolic: 128, diastolic: 75, spo2: 99, bloodSugar: 103 },
  { patientId: "P039", cohort: "Viral Fever", age: 49, gender: "Male", bp: "111/82", systolic: 111, diastolic: 82, spo2: 96, bloodSugar: 107 },
  { patientId: "P040", cohort: "Viral Fever", age: 72, gender: "Male", bp: "113/79", systolic: 113, diastolic: 79, spo2: 94, bloodSugar: 99 },
  { patientId: "P041", cohort: "Viral Fever", age: 74, gender: "Male", bp: "106/85", systolic: 106, diastolic: 85, spo2: 97, bloodSugar: 91 },
  { patientId: "P042", cohort: "Viral Fever", age: 29, gender: "Male", bp: "110/78", systolic: 110, diastolic: 78, spo2: 96, bloodSugar: 151 },
  { patientId: "P043", cohort: "Viral Fever", age: 45, gender: "Female", bp: "106/70", systolic: 106, diastolic: 70, spo2: 96, bloodSugar: 90 },
  { patientId: "P044", cohort: "Viral Fever", age: 67, gender: "Female", bp: "130/79", systolic: 130, diastolic: 79, spo2: 95, bloodSugar: 144 },
  { patientId: "P045", cohort: "Viral Fever", age: 80, gender: "Male", bp: "111/74", systolic: 111, diastolic: 74, spo2: 94, bloodSugar: 97 },
];

export interface CohortStatisticalSummary {
  cohortName: string;
  count: number;
  avgSystolic: number;
  avgDiastolic: number;
  avgSpO2: number;
  avgBloodSugar: number;
  systolicRange: [number, number];
  diastolicRange: [number, number];
  spO2Range: [number, number];
  sugarRange: [number, number];
}

export function calculateCohortStatistics(cohort: "Bone Fracture" | "Stomach Ache" | "Viral Fever"): CohortStatisticalSummary {
  const records = CLINICAL_COHORT_DATASET.filter((p) => p.cohort === cohort);
  const n = records.length;
  if (n === 0) {
    return {
      cohortName: cohort,
      count: 0,
      avgSystolic: 0,
      avgDiastolic: 0,
      avgSpO2: 0,
      avgBloodSugar: 0,
      systolicRange: [0, 0],
      diastolicRange: [0, 0],
      spO2Range: [0, 0],
      sugarRange: [0, 0],
    };
  }

  const avgSystolic = Math.round(records.reduce((acc, r) => acc + r.systolic, 0) / n);
  const avgDiastolic = Math.round(records.reduce((acc, r) => acc + r.diastolic, 0) / n);
  const avgSpO2 = +(records.reduce((acc, r) => acc + r.spo2, 0) / n).toFixed(1);
  const avgBloodSugar = Math.round(records.reduce((acc, r) => acc + r.bloodSugar, 0) / n);

  const systolics = records.map((r) => r.systolic);
  const diastolics = records.map((r) => r.diastolic);
  const spO2s = records.map((r) => r.spo2);
  const sugars = records.map((r) => r.bloodSugar);

  return {
    cohortName: cohort,
    count: n,
    avgSystolic,
    avgDiastolic,
    avgSpO2,
    avgBloodSugar,
    systolicRange: [Math.min(...systolics), Math.max(...systolics)],
    diastolicRange: [Math.min(...diastolics), Math.max(...diastolics)],
    spO2Range: [Math.min(...spO2s), Math.max(...spO2s)],
    sugarRange: [Math.min(...sugars), Math.max(...sugars)],
  };
}
