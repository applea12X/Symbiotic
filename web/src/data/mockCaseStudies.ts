export type CaseEventType =
  | "METHOD"
  | "DOMAIN_APPLICATION"
  | "RELEASE"
  | "REPLICATION"
  | "CORRECTION"
  | "OUTCOME"
  | "MEDIA";

export type CaseEvent = {
  id: string;
  caseId: string;
  date: string; // ISO date
  year: number;
  type: CaseEventType;
  title: string;
  description: string;

  // signals
  citations: number;
  codeAvailable: boolean;
  dataAvailable: boolean;
  replicationAttempts: number;
  corrections: number;
  patents: number;
  clinicalStage?: string;
  mediaMentions: number;
  policyMentions: number;

  // scoring
  mlImpactScore: number; // 0..100
  codeReproScore: number; // 0..100
  attribution: number; // 0..1
  accelerationMonths: number; // can be negative for "slower"
  efficiencyProxy: number; // arbitrary units, consistent scale
};

export type CaseStudy = {
  id: string;
  title: string;
  domain: string;
  startYear: number;
  endYear: number;
  summary: string;
  keywords: string[];
  headlineMetrics: {
    mlImpactScore: number; // 0..100
    codeAvailabilityRate: number; // 0..1
  };
};

export const MOCK_CASE_STUDIES: CaseStudy[] = [
  {
    id: "alphafold",
    title: "AlphaFold: Protein Structure Prediction Revolution",
    domain: "Biology",
    startYear: 2018,
    endYear: 2024,
    summary: "Deep learning breakthrough in protein folding prediction, revolutionizing structural biology and drug discovery.",
    keywords: ["protein folding", "structural biology", "deep learning", "drug discovery"],
    headlineMetrics: {
      mlImpactScore: 98,
      codeAvailabilityRate: 0.9
    }
  },
  {
    id: "covid-drug",
    title: "COVID-19 Drug Discovery Acceleration",
    domain: "Drug Discovery",
    startYear: 2020,
    endYear: 2024,
    summary: "ML-driven acceleration of COVID-19 therapeutics discovery and vaccine development.",
    keywords: ["covid-19", "drug discovery", "vaccines", "virtual screening"],
    headlineMetrics: {
      mlImpactScore: 94,
      codeAvailabilityRate: 0.7
    }
  },
  {
    id: "climate-forecast",
    title: "Neural Weather and Climate Forecasting",
    domain: "Climate",
    startYear: 2019,
    endYear: 2024,
    summary: "Machine learning models achieving breakthrough accuracy in weather prediction and climate modeling.",
    keywords: ["climate modeling", "weather prediction", "neural networks", "extreme events"],
    headlineMetrics: {
      mlImpactScore: 89,
      codeAvailabilityRate: 0.8
    }
  },
  {
    id: "materials-discovery",
    title: "AI-Driven Materials Discovery for Clean Energy",
    domain: "Materials",
    startYear: 2020,
    endYear: 2024,
    summary: "Machine learning acceleration of novel material discovery for batteries, solar cells, and catalysts.",
    keywords: ["materials science", "clean energy", "catalysts", "batteries"],
    headlineMetrics: {
      mlImpactScore: 85,
      codeAvailabilityRate: 0.6
    }
  },
  {
    id: "neuroscience-tools",
    title: "Neural Decoding and Brain-Computer Interfaces",
    domain: "Neuroscience",
    startYear: 2018,
    endYear: 2024,
    summary: "ML advances in neural signal processing enabling new brain-computer interface capabilities.",
    keywords: ["neuroscience", "brain-computer interface", "neural decoding", "neuroprosthetics"],
    headlineMetrics: {
      mlImpactScore: 82,
      codeAvailabilityRate: 0.75
    }
  },
  {
    id: "social-science-ml",
    title: "Computational Social Science Revolution",
    domain: "Social Science",
    startYear: 2019,
    endYear: 2024,
    summary: "Machine learning transforming social science research through large-scale behavioral analysis.",
    keywords: ["social science", "behavioral analysis", "computational methods", "policy"],
    headlineMetrics: {
      mlImpactScore: 76,
      codeAvailabilityRate: 0.65
    }
  }
];

export const MOCK_CASE_EVENTS: CaseEvent[] = [
  // AlphaFold Events
  {
    id: "af-1",
    caseId: "alphafold",
    date: "2018-12-02",
    year: 2018,
    type: "METHOD",
    title: "AlphaFold 1 CASP13 Victory",
    description: "DeepMind's first breakthrough in protein structure prediction at CASP13 competition.",
    citations: 2847,
    codeAvailable: false,
    dataAvailable: false,
    replicationAttempts: 12,
    corrections: 0,
    patents: 3,
    mediaMentions: 156,
    policyMentions: 8,
    mlImpactScore: 85,
    codeReproScore: 20,
    attribution: 0.9,
    accelerationMonths: 24,
    efficiencyProxy: 150
  },
  {
    id: "af-2",
    caseId: "alphafold",
    date: "2020-11-30",
    year: 2020,
    type: "METHOD",
    title: "AlphaFold 2 Achieves Atomic Accuracy",
    description: "Revolutionary improvement in accuracy, solving the 50-year protein folding problem.",
    citations: 4521,
    codeAvailable: false,
    dataAvailable: false,
    replicationAttempts: 8,
    corrections: 0,
    patents: 7,
    mediaMentions: 892,
    policyMentions: 45,
    mlImpactScore: 98,
    codeReproScore: 25,
    attribution: 0.95,
    accelerationMonths: 48,
    efficiencyProxy: 300
  },
  {
    id: "af-3",
    caseId: "alphafold",
    date: "2021-07-15",
    year: 2021,
    type: "RELEASE",
    title: "AlphaFold Database Launch",
    description: "Public release of 350,000+ protein structures, democratizing structural biology.",
    citations: 1843,
    codeAvailable: true,
    dataAvailable: true,
    replicationAttempts: 45,
    corrections: 2,
    patents: 12,
    mediaMentions: 423,
    policyMentions: 67,
    mlImpactScore: 92,
    codeReproScore: 85,
    attribution: 0.8,
    accelerationMonths: 36,
    efficiencyProxy: 250
  },
  {
    id: "af-4",
    caseId: "alphafold",
    date: "2021-12-09",
    year: 2021,
    type: "DOMAIN_APPLICATION",
    title: "First Drug Discovery Applications",
    description: "Pharmaceutical companies begin using AlphaFold structures for drug design.",
    citations: 756,
    codeAvailable: true,
    dataAvailable: true,
    replicationAttempts: 23,
    corrections: 0,
    patents: 18,
    clinicalStage: "Preclinical",
    mediaMentions: 234,
    policyMentions: 12,
    mlImpactScore: 88,
    codeReproScore: 90,
    attribution: 0.7,
    accelerationMonths: 18,
    efficiencyProxy: 180
  },
  {
    id: "af-5",
    caseId: "alphafold",
    date: "2022-03-17",
    year: 2022,
    type: "REPLICATION",
    title: "ColabFold: Open Source Alternative",
    description: "Academic teams develop faster, open-source protein folding pipeline.",
    citations: 1234,
    codeAvailable: true,
    dataAvailable: true,
    replicationAttempts: 67,
    corrections: 1,
    patents: 0,
    mediaMentions: 89,
    policyMentions: 5,
    mlImpactScore: 82,
    codeReproScore: 95,
    attribution: 0.6,
    accelerationMonths: 12,
    efficiencyProxy: 220
  },

  // COVID Drug Discovery Events
  {
    id: "covid-1",
    caseId: "covid-drug",
    date: "2020-03-15",
    year: 2020,
    type: "METHOD",
    title: "AI Drug Repurposing Initiatives",
    description: "Multiple AI platforms launched for rapid COVID-19 drug repurposing.",
    citations: 892,
    codeAvailable: true,
    dataAvailable: false,
    replicationAttempts: 15,
    corrections: 3,
    patents: 5,
    mediaMentions: 267,
    policyMentions: 89,
    mlImpactScore: 78,
    codeReproScore: 65,
    attribution: 0.8,
    accelerationMonths: 6,
    efficiencyProxy: 120
  },
  {
    id: "covid-2",
    caseId: "covid-drug",
    date: "2020-11-20",
    year: 2020,
    type: "DOMAIN_APPLICATION",
    title: "Pfizer/BioNTech Vaccine ML Design",
    description: "Machine learning optimization of mRNA vaccine design and manufacturing.",
    citations: 2156,
    codeAvailable: false,
    dataAvailable: false,
    replicationAttempts: 8,
    corrections: 0,
    patents: 24,
    clinicalStage: "Phase III",
    mediaMentions: 1245,
    policyMentions: 234,
    mlImpactScore: 94,
    codeReproScore: 30,
    attribution: 0.9,
    accelerationMonths: 8,
    efficiencyProxy: 280
  },
  {
    id: "covid-3",
    caseId: "covid-drug",
    date: "2021-04-02",
    year: 2021,
    type: "OUTCOME",
    title: "Emergency Use Authorization",
    description: "First ML-optimized COVID vaccines receive regulatory approval.",
    citations: 567,
    codeAvailable: false,
    dataAvailable: false,
    replicationAttempts: 0,
    corrections: 0,
    patents: 45,
    clinicalStage: "Approved",
    mediaMentions: 2341,
    policyMentions: 456,
    mlImpactScore: 96,
    codeReproScore: 25,
    attribution: 0.85,
    accelerationMonths: 12,
    efficiencyProxy: 350
  },

  // Climate Forecasting Events
  {
    id: "climate-1",
    caseId: "climate-forecast",
    date: "2019-09-12",
    year: 2019,
    type: "METHOD",
    title: "Graph Neural Networks for Climate",
    description: "Introduction of GNNs for modeling atmospheric dynamics and climate systems.",
    citations: 445,
    codeAvailable: true,
    dataAvailable: true,
    replicationAttempts: 23,
    corrections: 1,
    patents: 2,
    mediaMentions: 67,
    policyMentions: 12,
    mlImpactScore: 72,
    codeReproScore: 85,
    attribution: 0.75,
    accelerationMonths: 15,
    efficiencyProxy: 130
  },
  {
    id: "climate-2",
    caseId: "climate-forecast",
    date: "2021-06-30",
    year: 2021,
    type: "DOMAIN_APPLICATION",
    title: "NOAA Adopts ML Weather Models",
    description: "National Weather Service integrates neural weather prediction into operations.",
    citations: 234,
    codeAvailable: false,
    dataAvailable: false,
    replicationAttempts: 5,
    corrections: 0,
    patents: 8,
    mediaMentions: 156,
    policyMentions: 78,
    mlImpactScore: 84,
    codeReproScore: 40,
    attribution: 0.6,
    accelerationMonths: 20,
    efficiencyProxy: 190
  },
  {
    id: "climate-3",
    caseId: "climate-forecast",
    date: "2022-12-05",
    year: 2022,
    type: "MEDIA",
    title: "ML Climate Models Predict Heat Dome",
    description: "Neural networks successfully predict unprecedented Pacific Northwest heat dome.",
    citations: 123,
    codeAvailable: true,
    dataAvailable: true,
    replicationAttempts: 12,
    corrections: 0,
    patents: 1,
    mediaMentions: 789,
    policyMentions: 134,
    mlImpactScore: 89,
    codeReproScore: 90,
    attribution: 0.8,
    accelerationMonths: 5,
    efficiencyProxy: 160
  },
  {
    id: "covid-4",
    caseId: "covid-drug",
    date: "2022-01-15",
    year: 2022,
    type: "RELEASE",
    title: "Open Drug Discovery Toolkit Release",
    description: "MIT releases open-source platform for ML-driven drug discovery.",
    citations: 334,
    codeAvailable: true,
    dataAvailable: true,
    replicationAttempts: 28,
    corrections: 1,
    patents: 2,
    mediaMentions: 145,
    policyMentions: 23,
    mlImpactScore: 81,
    codeReproScore: 92,
    attribution: 0.75,
    accelerationMonths: 15,
    efficiencyProxy: 180
  },
  {
    id: "covid-5",
    caseId: "covid-drug",
    date: "2023-09-08",
    year: 2023,
    type: "OUTCOME",
    title: "Long COVID Drug Candidates",
    description: "AI-discovered compounds enter clinical trials for Long COVID treatment.",
    citations: 178,
    codeAvailable: false,
    dataAvailable: false,
    replicationAttempts: 3,
    corrections: 0,
    patents: 12,
    clinicalStage: "Phase I",
    mediaMentions: 412,
    policyMentions: 67,
    mlImpactScore: 87,
    codeReproScore: 35,
    attribution: 0.85,
    accelerationMonths: 18,
    efficiencyProxy: 240
  },

  // Climate Forecasting Events (continued)
  {
    id: "climate-4",
    caseId: "climate-forecast",
    date: "2023-07-14",
    year: 2023,
    type: "RELEASE",
    title: "Google's AI Weather Model Open Source",
    description: "DeepMind releases GraphCast, achieving 10-day weather forecast accuracy.",
    citations: 289,
    codeAvailable: true,
    dataAvailable: true,
    replicationAttempts: 15,
    corrections: 0,
    patents: 4,
    mediaMentions: 567,
    policyMentions: 89,
    mlImpactScore: 91,
    codeReproScore: 95,
    attribution: 0.9,
    accelerationMonths: 30,
    efficiencyProxy: 220
  },
  {
    id: "climate-5",
    caseId: "climate-forecast",
    date: "2024-03-22",
    year: 2024,
    type: "OUTCOME",
    title: "IPCC Adopts ML Climate Projections",
    description: "UN climate panel incorporates neural network models into official reports.",
    citations: 67,
    codeAvailable: false,
    dataAvailable: true,
    replicationAttempts: 8,
    corrections: 0,
    patents: 0,
    mediaMentions: 1234,
    policyMentions: 345,
    mlImpactScore: 93,
    codeReproScore: 80,
    attribution: 0.7,
    accelerationMonths: 36,
    efficiencyProxy: 300
  },

  // Materials Discovery Events
  {
    id: "materials-1",
    caseId: "materials-discovery",
    date: "2020-02-14",
    year: 2020,
    type: "METHOD",
    title: "Graph Neural Networks for Materials",
    description: "Crystal Graph Convolutional Networks achieve SOTA property prediction.",
    citations: 678,
    codeAvailable: true,
    dataAvailable: true,
    replicationAttempts: 34,
    corrections: 2,
    patents: 6,
    mediaMentions: 45,
    policyMentions: 8,
    mlImpactScore: 79,
    codeReproScore: 88,
    attribution: 0.85,
    accelerationMonths: 18,
    efficiencyProxy: 145
  },
  {
    id: "materials-2",
    caseId: "materials-discovery",
    date: "2021-08-23",
    year: 2021,
    type: "DOMAIN_APPLICATION",
    title: "Battery Electrolyte Discovery",
    description: "AI discovers novel solid-state battery electrolytes with superior properties.",
    citations: 445,
    codeAvailable: false,
    dataAvailable: false,
    replicationAttempts: 8,
    corrections: 0,
    patents: 23,
    mediaMentions: 234,
    policyMentions: 45,
    mlImpactScore: 85,
    codeReproScore: 45,
    attribution: 0.9,
    accelerationMonths: 24,
    efficiencyProxy: 200
  },
  {
    id: "materials-3",
    caseId: "materials-discovery",
    date: "2022-05-11",
    year: 2022,
    type: "RELEASE",
    title: "Materials Project ML Platform",
    description: "Berkeley Lab releases AI-powered materials discovery platform.",
    citations: 356,
    codeAvailable: true,
    dataAvailable: true,
    replicationAttempts: 42,
    corrections: 0,
    patents: 3,
    mediaMentions: 123,
    policyMentions: 34,
    mlImpactScore: 83,
    codeReproScore: 90,
    attribution: 0.8,
    accelerationMonths: 12,
    efficiencyProxy: 175
  },
  {
    id: "materials-4",
    caseId: "materials-discovery",
    date: "2023-01-30",
    year: 2023,
    type: "OUTCOME",
    title: "Toyota Partners for Catalyst Design",
    description: "Major automaker adopts AI for fuel cell catalyst optimization.",
    citations: 89,
    codeAvailable: false,
    dataAvailable: false,
    replicationAttempts: 2,
    corrections: 0,
    patents: 18,
    mediaMentions: 345,
    policyMentions: 56,
    mlImpactScore: 88,
    codeReproScore: 40,
    attribution: 0.75,
    accelerationMonths: 30,
    efficiencyProxy: 250
  },
  {
    id: "materials-5",
    caseId: "materials-discovery",
    date: "2024-02-14",
    year: 2024,
    type: "REPLICATION",
    title: "Independent Solar Cell Validation",
    description: "Stanford team replicates AI-discovered perovskite solar cell materials.",
    citations: 23,
    codeAvailable: true,
    dataAvailable: true,
    replicationAttempts: 15,
    corrections: 1,
    patents: 4,
    mediaMentions: 78,
    policyMentions: 12,
    mlImpactScore: 80,
    codeReproScore: 95,
    attribution: 0.6,
    accelerationMonths: 8,
    efficiencyProxy: 160
  },

  // Neural Decoding and Brain-Computer Interfaces Events
  {
    id: "neuro-1",
    caseId: "neuroscience-tools",
    date: "2018-06-15",
    year: 2018,
    type: "METHOD",
    title: "Deep Learning for Neural Decoding",
    description: "Breakthrough in decoding motor intentions from neural signals using RNNs.",
    citations: 567,
    codeAvailable: true,
    dataAvailable: false,
    replicationAttempts: 18,
    corrections: 1,
    patents: 8,
    mediaMentions: 89,
    policyMentions: 15,
    mlImpactScore: 78,
    codeReproScore: 75,
    attribution: 0.9,
    accelerationMonths: 20,
    efficiencyProxy: 140
  },
  {
    id: "neuro-2",
    caseId: "neuroscience-tools",
    date: "2019-11-08",
    year: 2019,
    type: "DOMAIN_APPLICATION",
    title: "Paralyzed Patient Types with Thoughts",
    description: "First demonstration of high-bandwidth brain-to-text communication.",
    citations: 1234,
    codeAvailable: false,
    dataAvailable: false,
    replicationAttempts: 5,
    corrections: 0,
    patents: 15,
    mediaMentions: 2345,
    policyMentions: 123,
    mlImpactScore: 92,
    codeReproScore: 30,
    attribution: 0.85,
    accelerationMonths: 36,
    efficiencyProxy: 280
  },
  {
    id: "neuro-3",
    caseId: "neuroscience-tools",
    date: "2021-04-14",
    year: 2021,
    type: "RELEASE",
    title: "Neuralink Monkey Plays Pong",
    description: "Wireless brain implant enables monkey to control computer games mentally.",
    citations: 456,
    codeAvailable: false,
    dataAvailable: false,
    replicationAttempts: 8,
    corrections: 0,
    patents: 34,
    mediaMentions: 4567,
    policyMentions: 234,
    mlImpactScore: 89,
    codeReproScore: 25,
    attribution: 0.8,
    accelerationMonths: 24,
    efficiencyProxy: 350
  },
  {
    id: "neuro-4",
    caseId: "neuroscience-tools",
    date: "2022-08-24",
    year: 2022,
    type: "OUTCOME",
    title: "FDA Approves BCI for ALS",
    description: "First commercial brain-computer interface receives regulatory approval.",
    citations: 234,
    codeAvailable: false,
    dataAvailable: false,
    replicationAttempts: 3,
    corrections: 0,
    patents: 45,
    clinicalStage: "Approved",
    mediaMentions: 1789,
    policyMentions: 345,
    mlImpactScore: 95,
    codeReproScore: 40,
    attribution: 0.9,
    accelerationMonths: 42,
    efficiencyProxy: 400
  },
  {
    id: "neuro-5",
    caseId: "neuroscience-tools",
    date: "2023-12-01",
    year: 2023,
    type: "REPLICATION",
    title: "Open Source BCI Platform Launch",
    description: "Academic consortium releases reproducible brain-computer interface toolkit.",
    citations: 112,
    codeAvailable: true,
    dataAvailable: true,
    replicationAttempts: 23,
    corrections: 2,
    patents: 2,
    mediaMentions: 234,
    policyMentions: 45,
    mlImpactScore: 81,
    codeReproScore: 88,
    attribution: 0.7,
    accelerationMonths: 15,
    efficiencyProxy: 200
  },

  // Computational Social Science Revolution Events
  {
    id: "social-1",
    caseId: "social-science-ml",
    date: "2019-03-20",
    year: 2019,
    type: "METHOD",
    title: "Large Language Models for Social Analysis",
    description: "First application of transformer models to large-scale social media analysis.",
    citations: 789,
    codeAvailable: true,
    dataAvailable: false,
    replicationAttempts: 34,
    corrections: 3,
    patents: 1,
    mediaMentions: 156,
    policyMentions: 67,
    mlImpactScore: 73,
    codeReproScore: 80,
    attribution: 0.8,
    accelerationMonths: 18,
    efficiencyProxy: 160
  },
  {
    id: "social-2",
    caseId: "social-science-ml",
    date: "2020-09-15",
    year: 2020,
    type: "DOMAIN_APPLICATION", 
    title: "COVID Misinformation Detection",
    description: "ML models deployed to track and counter pandemic misinformation at scale.",
    citations: 445,
    codeAvailable: false,
    dataAvailable: true,
    replicationAttempts: 12,
    corrections: 1,
    patents: 4,
    mediaMentions: 567,
    policyMentions: 234,
    mlImpactScore: 85,
    codeReproScore: 65,
    attribution: 0.9,
    accelerationMonths: 8,
    efficiencyProxy: 220
  },
  {
    id: "social-3",
    caseId: "social-science-ml",
    date: "2021-06-12",
    year: 2021,
    type: "RELEASE",
    title: "HuggingFace Social Science Hub",
    description: "Open platform for reproducible computational social science research.",
    citations: 567,
    codeAvailable: true,
    dataAvailable: true,
    replicationAttempts: 45,
    corrections: 0,
    patents: 0,
    mediaMentions: 234,
    policyMentions: 89,
    mlImpactScore: 79,
    codeReproScore: 95,
    attribution: 0.75,
    accelerationMonths: 12,
    efficiencyProxy: 180
  },
  {
    id: "social-4",
    caseId: "social-science-ml",
    date: "2022-11-30",
    year: 2022,
    type: "OUTCOME",
    title: "EU Policy on Algorithmic Bias",
    description: "European Parliament adopts ML research findings into AI regulation framework.",
    citations: 134,
    codeAvailable: false,
    dataAvailable: true,
    replicationAttempts: 8,
    corrections: 0,
    patents: 0,
    mediaMentions: 1245,
    policyMentions: 567,
    mlImpactScore: 88,
    codeReproScore: 70,
    attribution: 0.85,
    accelerationMonths: 24,
    efficiencyProxy: 300
  },
  {
    id: "social-5",
    caseId: "social-science-ml",
    date: "2023-04-07",
    year: 2023,
    type: "REPLICATION",
    title: "Global Reproducibility Crisis Study",
    description: "Multi-university effort successfully replicates 73% of ML social science findings.",
    citations: 89,
    codeAvailable: true,
    dataAvailable: true,
    replicationAttempts: 156,
    corrections: 12,
    patents: 0,
    mediaMentions: 345,
    policyMentions: 123,
    mlImpactScore: 76,
    codeReproScore: 85,
    attribution: 0.6,
    accelerationMonths: 6,
    efficiencyProxy: 140
  }
];

export function getCaseStudyById(id: string): CaseStudy | undefined {
  return MOCK_CASE_STUDIES.find(study => study.id === id);
}

export function getEventsByCaseId(caseId: string): CaseEvent[] {
  return MOCK_CASE_EVENTS.filter(event => event.caseId === caseId);
}

export function getEventById(id: string): CaseEvent | undefined {
  return MOCK_CASE_EVENTS.find(event => event.id === id);
}