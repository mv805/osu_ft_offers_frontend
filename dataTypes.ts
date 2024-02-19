//common datatypes between components

export interface FormValues {
  userName: string;
  offerDate: string;
  personalProject: number;
  returnship: number;
  timeInProgram: number | null;
  salary: number | null;
  gpa: number | null;
  swePosition: number;
  bigTechOffer: number;
  ageOfCandidate: number | null;
  idOfferSource: number | null;
  idOfficeLocation: number | null;
  idWorkArrangement: number | null;
  idPriorExperience: number | null;
  idPreviousDegree: number | null;
}
