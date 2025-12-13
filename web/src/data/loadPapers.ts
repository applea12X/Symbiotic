/**
 * Type definitions for paper data from JSONL files
 */
export interface RawPaper {
  title: string;
  year: string;
  field: string;
  ml_impact: "none" | "minimal" | "moderate" | "substantial" | "core";
  code_availability: boolean;
  summary: string;
  ml_frameworks: string[];
  methodology: string;
  statistics: string;
  research_outcomes: string;
  sources_of_inspiration: string[];
}

/**
 * Load and parse papers from the data directory
 * Note: In a real implementation, these would be loaded from the API or file system
 * For now, we'll create a representative sample based on the actual data structure
 */

// Sample papers extracted from actual data files
export const SAMPLE_ML_PAPERS: RawPaper[] = [
  {
    title: "Deep Batch Active Learning by Diverse, Uncertain Gradient Lower Bounds",
    year: "2019",
    field: "ComputerScience",
    ml_impact: "substantial",
    code_availability: true,
    summary: "This paper presents a new algorithm for batch active learning with deep neural network models. BADGE (Batch Active Learning by Diverse Gradient Embeddings) samples groups of points that are disparate and high-magnitude when represented in a hallucinated gradient space, trading off between diversity and uncertainty without requiring any hand-tuned hyperparameters.",
    ml_frameworks: ["TensorFlow", "PyTorch"],
    methodology: "The algorithm uses gradient embeddings to capture uncertainty about an example through the lens of gradients. It then selects a set of points by sampling via the k-MEANS++ initialization scheme, which tends to produce diverse batches similar to a k-Determinantal Point Process.",
    statistics: "Proposition 1 shows that the norm of the gradient embedding is a lower bound on the norm of the loss gradient induced by the example with true label y with respect to the weights in the last layer.",
    research_outcomes: "The paper shows that BADGE consistently performs as well or better than other approaches, making it a versatile option for practical active learning problems.",
    sources_of_inspiration: ["Cohn et al., 1994", "Balcan et al., 2006"]
  },
  {
    title: "Recursive-NeRF: An Efficient and Dynamically Growing NeRF",
    year: "2022",
    field: "ComputerScience",
    ml_impact: "substantial",
    code_availability: true,
    summary: "This paper presents Recursive-NeRF, a novel method for efficient and adaptive rendering of scenes using Neural Radiance Fields (NeRF). By recursively growing neural networks based on the complexity of the scene, Recursive-NeRF achieves significant gains in speed while providing high-quality view synthesis.",
    ml_frameworks: ["TensorFlow"],
    methodology: "Recursive-NeRF uses a recursive scene rendering method where early termination prevents further processing once output quality is good enough, achieving state-of-the-art novel view synthesis results with much reduced computation.",
    statistics: "The paper uses statistical methods for rendering and training neural networks, including hierarchical volume sampling and importance sampling.",
    research_outcomes: "Recursive-NeRF achieves significant gains in speed while providing high-quality view synthesis. The approach is complementary to existing methods such as NSVF and can be combined for further speed improvements.",
    sources_of_inspiration: ["Neural Radiance Field (NeRF) method", "NSVF sampling strategy"]
  },
  {
    title: "CU-UD: text-mining drug and chemical-protein interactions with ensembles of BERT-based models",
    year: "2021",
    field: "ComputerScience",
    ml_impact: "substantial",
    code_availability: true,
    summary: "This paper presents an ensemble system for text-mining drug and chemical-protein interactions using BERT-based models. The system combines the outputs of individual models using majority voting and multilayer perceptron, achieving state-of-the-art performance on the DrugProt task in BioCreative VII.",
    ml_frameworks: ["TensorFlow"],
    methodology: "The paper uses an ensemble approach combining multiple BERT-based language representation models to achieve better predictive performance.",
    statistics: "F1 score of 0.7739",
    research_outcomes: "The paper presents state-of-the-art performance on the DrugProt task in BioCreative VII, with an F1 score of 0.8902 for the ANTAGONIST relation and 0.8570 for the INHIBITOR relation.",
    sources_of_inspiration: ["BERT", "BioBERT", "PubMedBERT"]
  }
];

export const SAMPLE_NONML_PAPERS: RawPaper[] = [
  {
    title: "Minimizing Weighted Sum Download Time for One-to-Many File Transfer in Peer-to-Peer Networks",
    year: "2011",
    field: "ComputerScience",
    ml_impact: "none",
    code_availability: false,
    summary: "This paper focuses on minimizing the weighted sum download time (WSDT) for one-to-many file transfer in peer-to-peer networks. It considers heterogeneous peers with both uplink and downlink bandwidth constraints.",
    ml_frameworks: [],
    methodology: "The paper uses linear network coding and convex optimization to solve the problem of minimizing WSDT.",
    statistics: "convex optimization, linear network coding",
    research_outcomes: "The paper presents several schemes to optimize WSDT, including a static routing-based scheme and a dynamic rateless-coding-based scheme.",
    sources_of_inspiration: []
  }
];

/**
 * Get all papers (for server-side or build-time processing)
 */
export function getAllPapers(): RawPaper[] {
  return [...SAMPLE_ML_PAPERS, ...SAMPLE_NONML_PAPERS];
}

/**
 * Get papers by field
 */
export function getPapersByField(field: string): RawPaper[] {
  return getAllPapers().filter(paper => paper.field === field);
}

/**
 * Get papers with ML impact
 */
export function getMLPapers(): RawPaper[] {
  return getAllPapers().filter(paper =>
    paper.ml_impact !== "none" && paper.ml_impact !== "minimal"
  );
}

/**
 * Get papers with code availability
 */
export function getPapersWithCode(): RawPaper[] {
  return getAllPapers().filter(paper => paper.code_availability);
}

/**
 * Get high impact papers (substantial or core ML impact)
 */
export function getHighImpactPapers(): RawPaper[] {
  return getAllPapers().filter(paper =>
    paper.ml_impact === "substantial" || paper.ml_impact === "core"
  );
}
