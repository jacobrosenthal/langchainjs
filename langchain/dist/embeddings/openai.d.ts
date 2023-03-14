import { Embeddings } from "./base.js";
interface ModelParams {
    modelName: string;
}
export declare class OpenAIEmbeddings extends Embeddings implements ModelParams {
    modelName: string;
    /**
     * The maximum number of documents to embed in a single request. This is
     * limited by the OpenAI API to a maximum of 2048.
     */
    batchSize: number;
    /**
     * The maximum number of retries to make when the OpenAI API returns an error.
     */
    maxRetries: number;
    /**
     * Whether to strip new lines from the input text. This is recommended by
     * OpenAI, but may not be suitable for all use cases.
     */
    stripNewLines: boolean;
    private apiKey;
    private client;
    constructor(fields?: Partial<ModelParams> & {
        verbose?: boolean;
        batchSize?: number;
        maxRetries?: number;
        openAIApiKey?: string;
        stripNewLines?: boolean;
    });
    embedDocuments(texts: string[]): Promise<number[][]>;
    embedQuery(text: string): Promise<number[]>;
    private embeddingWithRetry;
}
export {};
