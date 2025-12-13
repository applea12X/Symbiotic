import { FindingsData } from "@/types/findings";

// Mock data representing quantitative findings about ML's impact on scientific progress
export const FINDINGS_DATA: FindingsData = {
  globalMetrics: {
    mlPenetration: 34.2,
    discoveryAcceleration: 8.3,
    strongestField: "Drug Discovery",
    reproducibilityDelta: -12.4,
    totalPapersAnalyzed: 847623,
  },

  attributionScore: {
    mlContribution: 42,
    domainInsight: 58,
    confidenceInterval: [38, 46],
  },

  efficiencyMetrics: [
    {
      label: "Experiments Avoided",
      value: 247,
      unit: "per project",
      trend: [180, 195, 210, 225, 235, 247],
      description: "Average reduction in physical experiments through ML-guided exploration",
    },
    {
      label: "Compute vs Lab Cost Ratio",
      value: 0.18,
      unit: "ratio",
      trend: [0.35, 0.29, 0.24, 0.21, 0.19, 0.18],
      description: "Computational cost as fraction of traditional lab expenses",
    },
    {
      label: "Candidate Screening Rate",
      value: 12400,
      unit: "per week",
      trend: [4200, 5800, 7300, 9100, 10800, 12400],
      description: "ML-accelerated candidate evaluation throughput",
    },
  ],

  disciplineMetrics: [
    {
      disciplineName: "Drug Discovery",
      mlPenetration: 68.4,
      accelerationScore: 14.2,
      citationLift: 2.8,
      reproducibilitySignal: 71,
      netImpactRating: 87,
      paperCount: 18427,
    },
    {
      disciplineName: "Materials Science",
      mlPenetration: 52.1,
      accelerationScore: 11.7,
      citationLift: 2.3,
      reproducibilitySignal: 68,
      netImpactRating: 79,
      paperCount: 24815,
    },
    {
      disciplineName: "Climate Science",
      mlPenetration: 41.8,
      accelerationScore: 6.4,
      citationLift: 1.9,
      reproducibilitySignal: 65,
      netImpactRating: 72,
      paperCount: 16203,
    },
    {
      disciplineName: "Physics",
      mlPenetration: 38.2,
      accelerationScore: 5.1,
      citationLift: 1.7,
      reproducibilitySignal: 74,
      netImpactRating: 68,
      paperCount: 32451,
    },
    {
      disciplineName: "Neuroscience",
      mlPenetration: 45.3,
      accelerationScore: 7.8,
      citationLift: 2.1,
      reproducibilitySignal: 62,
      netImpactRating: 74,
      paperCount: 21936,
    },
    {
      disciplineName: "Genomics",
      mlPenetration: 61.7,
      accelerationScore: 10.3,
      citationLift: 2.5,
      reproducibilitySignal: 69,
      netImpactRating: 82,
      paperCount: 19784,
    },
  ],

  adoptionCurves: [
    // Drug Discovery
    { year: 2016, penetration: 24.1, discipline: "Drug Discovery" },
    { year: 2017, penetration: 31.5, discipline: "Drug Discovery" },
    { year: 2018, penetration: 41.2, discipline: "Drug Discovery" },
    { year: 2019, penetration: 51.8, discipline: "Drug Discovery" },
    { year: 2020, penetration: 59.3, discipline: "Drug Discovery" },
    { year: 2021, penetration: 63.7, discipline: "Drug Discovery" },
    { year: 2022, penetration: 66.2, discipline: "Drug Discovery" },
    { year: 2023, penetration: 67.8, discipline: "Drug Discovery" },
    { year: 2024, penetration: 68.4, discipline: "Drug Discovery" },

    // Materials Science
    { year: 2016, penetration: 18.3, discipline: "Materials Science" },
    { year: 2017, penetration: 24.7, discipline: "Materials Science" },
    { year: 2018, penetration: 32.1, discipline: "Materials Science" },
    { year: 2019, penetration: 39.8, discipline: "Materials Science" },
    { year: 2020, penetration: 45.2, discipline: "Materials Science" },
    { year: 2021, penetration: 48.9, discipline: "Materials Science" },
    { year: 2022, penetration: 50.8, discipline: "Materials Science" },
    { year: 2023, penetration: 51.7, discipline: "Materials Science" },
    { year: 2024, penetration: 52.1, discipline: "Materials Science" },

    // Climate Science
    { year: 2016, penetration: 12.4, discipline: "Climate Science" },
    { year: 2017, penetration: 17.8, discipline: "Climate Science" },
    { year: 2018, penetration: 24.3, discipline: "Climate Science" },
    { year: 2019, penetration: 30.1, discipline: "Climate Science" },
    { year: 2020, penetration: 35.7, discipline: "Climate Science" },
    { year: 2021, penetration: 38.9, discipline: "Climate Science" },
    { year: 2022, penetration: 40.6, discipline: "Climate Science" },
    { year: 2023, penetration: 41.3, discipline: "Climate Science" },
    { year: 2024, penetration: 41.8, discipline: "Climate Science" },

    // Physics
    { year: 2016, penetration: 15.2, discipline: "Physics" },
    { year: 2017, penetration: 19.7, discipline: "Physics" },
    { year: 2018, penetration: 24.8, discipline: "Physics" },
    { year: 2019, penetration: 29.3, discipline: "Physics" },
    { year: 2020, penetration: 33.1, discipline: "Physics" },
    { year: 2021, penetration: 35.8, discipline: "Physics" },
    { year: 2022, penetration: 37.2, discipline: "Physics" },
    { year: 2023, penetration: 37.9, discipline: "Physics" },
    { year: 2024, penetration: 38.2, discipline: "Physics" },

    // Neuroscience
    { year: 2016, penetration: 16.8, discipline: "Neuroscience" },
    { year: 2017, penetration: 22.4, discipline: "Neuroscience" },
    { year: 2018, penetration: 29.1, discipline: "Neuroscience" },
    { year: 2019, penetration: 35.7, discipline: "Neuroscience" },
    { year: 2020, penetration: 40.8, discipline: "Neuroscience" },
    { year: 2021, penetration: 43.6, discipline: "Neuroscience" },
    { year: 2022, penetration: 44.9, discipline: "Neuroscience" },
    { year: 2023, penetration: 45.2, discipline: "Neuroscience" },
    { year: 2024, penetration: 45.3, discipline: "Neuroscience" },
  ],

  citationFlows: [
    { fromMLMethod: "Transformers", toDomain: "Drug Discovery", flowStrength: 8420, year: 2023 },
    { fromMLMethod: "Graph Neural Networks", toDomain: "Materials Science", flowStrength: 6230, year: 2023 },
    { fromMLMethod: "Diffusion Models", toDomain: "Drug Discovery", flowStrength: 4870, year: 2023 },
    { fromMLMethod: "Reinforcement Learning", toDomain: "Climate Science", flowStrength: 3140, year: 2023 },
    { fromMLMethod: "Vision Transformers", toDomain: "Neuroscience", flowStrength: 2950, year: 2023 },
  ],

  reproducibility: {
    mlPapers: {
      codeAvailable: 58.3,
      dataAvailable: 41.7,
      retractionRate: 0.34,
    },
    nonMLPapers: {
      codeAvailable: 71.2,
      dataAvailable: 53.8,
      retractionRate: 0.21,
    },
    confidenceBounds: {
      lower: -15.2,
      upper: -9.8,
    },
  },

  caseTraces: [
    {
      id: "alphafold",
      title: "AlphaFold: Protein Structure Prediction",
      mlMethod: "Deep Learning (Attention Networks)",
      domain: "Structural Biology",
      timeline: [
        {
          phase: "method",
          date: "2018-12",
          title: "AlphaFold 1 Introduced",
          description: "DeepMind releases first version using deep learning for protein folding",
          metric: {
            label: "CASP13 Accuracy",
            value: "~60 GDT",
          },
        },
        {
          phase: "method",
          date: "2020-11",
          title: "AlphaFold 2 Breakthrough",
          description: "Achieves near-experimental accuracy in CASP14 competition",
          metric: {
            label: "CASP14 Accuracy",
            value: "92.4 GDT",
          },
        },
        {
          phase: "adoption",
          date: "2021-07",
          title: "Database Released",
          description: "AlphaFold DB launches with 365,000 predicted structures",
          metric: {
            label: "Structures Available",
            value: "365K",
          },
        },
        {
          phase: "adoption",
          date: "2022-07",
          title: "Massive Expansion",
          description: "Database expands to 200M+ protein structures",
          metric: {
            label: "Total Structures",
            value: "200M+",
          },
        },
        {
          phase: "impact",
          date: "2023-06",
          title: "Drug Discovery Applications",
          description: "Over 500,000 researchers using AlphaFold predictions in active projects",
          metric: {
            label: "Active Researchers",
            value: "500K+",
          },
        },
        {
          phase: "impact",
          date: "2024-02",
          title: "Therapeutic Breakthroughs",
          description: "First AlphaFold-enabled drug candidate enters Phase II trials",
          metric: {
            label: "Clinical Candidates",
            value: "12",
          },
        },
      ],
      impactMetric: {
        label: "Time Saved per Structure",
        value: "~2 years",
      },
    },
    {
      id: "covid-drug",
      title: "COVID-19 Therapeutic Discovery",
      mlMethod: "Virtual Screening (ML-based)",
      domain: "Virology / Drug Discovery",
      timeline: [
        {
          phase: "method",
          date: "2020-03",
          title: "Rapid Screening Initiated",
          description: "ML models deployed to screen existing drug libraries against SARS-CoV-2",
          metric: {
            label: "Compounds Screened",
            value: "6,000",
          },
        },
        {
          phase: "adoption",
          date: "2020-05",
          title: "Candidate Identification",
          description: "Multiple promising candidates identified through ML-guided screening",
          metric: {
            label: "Lead Candidates",
            value: "23",
          },
        },
        {
          phase: "adoption",
          date: "2020-09",
          title: "Preclinical Validation",
          description: "ML-predicted candidates show efficacy in cell cultures",
          metric: {
            label: "Validated Hits",
            value: "7",
          },
        },
        {
          phase: "impact",
          date: "2021-03",
          title: "Clinical Trials Begin",
          description: "First ML-discovered antivirals enter human trials",
          metric: {
            label: "Trials Launched",
            value: "3",
          },
        },
        {
          phase: "impact",
          date: "2021-12",
          title: "Emergency Authorization",
          description: "Paxlovid (ML-assisted discovery) receives EUA",
          metric: {
            label: "Discovery Timeline",
            value: "18 months",
          },
        },
      ],
      impactMetric: {
        label: "vs Traditional Discovery",
        value: "~70% faster",
      },
    },
  ],

  keyTakeaways: [
    {
      category: "strong",
      title: "ML significantly accelerates discovery in data-rich domains",
      description: "Drug discovery and materials science show 10-14 month acceleration in discovery timelines with high confidence (n=43,242 papers).",
      evidenceStrength: "high",
      supportingData: "p < 0.001, effect size d=1.42",
    },
    {
      category: "strong",
      title: "Citation impact correlates with ML integration depth",
      description: "Papers with substantive ML integration (not just application) show 2.1-2.8x citation lift across disciplines.",
      evidenceStrength: "high",
      supportingData: "Controlled for venue, author h-index, funding",
    },
    {
      category: "emerging",
      title: "Reproducibility gap varies significantly by field",
      description: "ML papers in physics show minimal reproducibility penalty, while drug discovery and neuroscience show 15-18% lower code availability.",
      evidenceStrength: "medium",
      supportingData: "Based on 847K papers, 2016-2024",
    },
    {
      category: "emerging",
      title: "S-curve adoption patterns suggest field maturation",
      description: "Most disciplines are entering plateau phase (2023-2024), suggesting integration becoming standard rather than differentiating.",
      evidenceStrength: "medium",
      supportingData: "Logistic regression R²=0.94",
    },
    {
      category: "open",
      title: "Attribution between ML and domain insight remains unclear",
      description: "Current data suggests ~40-45% contribution from ML tooling, but causal decomposition is methodologically challenging.",
      evidenceStrength: "low",
      supportingData: "Wide confidence intervals [38%, 46%]",
    },
    {
      category: "open",
      title: "Long-term impact on scientific workforce unclear",
      description: "Efficiency gains documented, but effects on research career paths, training requirements, and equity not yet quantifiable.",
      evidenceStrength: "low",
      supportingData: "Qualitative signals only",
    },
  ],
};
