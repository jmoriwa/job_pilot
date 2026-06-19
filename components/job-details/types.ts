export type CompanyResearchDossier = {
  companyOverview: string;
  techStack: string[];
  culture: string[];
  whyThisRole: string;
  yourEdge: string[];
  gapsToAddress: string[];
  smartQuestions: string[];
  interviewPrep: string[];
  sources: string[];
};

export type JobDetailsViewModel = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  dateFound: string;
  matchScore: number;
  matchReason: string;
  matchedSkills: string[];
  missingSkills: string[];
  description: string;
  descriptionIsTruncated: boolean;
  applyUrl: string;
  companyResearch: CompanyResearchDossier | null;
};
