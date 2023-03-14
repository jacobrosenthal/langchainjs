import { PromptTemplate } from "../../prompts/index.js";
import { StuffDocumentsChain, MapReduceDocumentsChain } from "../combine_docs_chain.js";
import { BaseLanguageModel } from "../../base_language/index.js";
interface qaChainParams {
    prompt?: PromptTemplate;
    combineMapPrompt?: PromptTemplate;
    combinePrompt?: PromptTemplate;
    type?: string;
}
export declare const loadQAChain: (llm: BaseLanguageModel, params?: qaChainParams) => StuffDocumentsChain | MapReduceDocumentsChain;
interface StuffQAChainParams {
    prompt?: PromptTemplate;
}
export declare const loadQAStuffChain: (llm: BaseLanguageModel, params?: StuffQAChainParams) => StuffDocumentsChain;
interface MapReduceQAChainParams {
    combineMapPrompt?: PromptTemplate;
    combinePrompt?: PromptTemplate;
}
export declare const loadQAMapReduceChain: (llm: BaseLanguageModel, params?: MapReduceQAChainParams) => MapReduceDocumentsChain;
export {};
