import { AgentStep } from "schema/index.js";
import { Tool, Agent, AgentInput } from "./index.js";
import { PromptTemplate } from "../prompts/index.js";
import { BaseLanguageModel } from "../base_language/index.js";
export type CreatePromptArgs = {
    /** String to put before the list of tools. */
    prefix?: string;
    /** String to put after the list of tools. */
    suffix?: string;
    /** Prefix to use for AI generated responses. */
    aiPrefix?: string;
    /** Prefix to use for human responses. */
    humanPrefix?: string;
    /** List of input variables the final prompt will expect. */
    inputVariables?: string[];
};
export interface ConversationalAgentInput extends AgentInput {
    aiPrefix?: string;
}
/**
 * Agent for the MRKL chain.
 * @augments Agent
 * @augments StaticAgent
 */
export declare class ConversationalAgent extends Agent {
    aiPrefix: string;
    constructor(input: ConversationalAgentInput);
    _agentType(): "conversational-react-description";
    observationPrefix(): string;
    llmPrefix(): string;
    finishToolName(): string;
    prepareForOutput(_: Record<string, any>, __: AgentStep[]): Promise<Record<string, any>>;
    static validateTools(tools: Tool[]): void;
    /**
     * Create prompt in the style of the conversational agent.
     *
     * @param tools - List of tools the agent will have access to, used to format the prompt.
     * @param args - Arguments to create the prompt with.
     * @param args.prefix - String to put before the list of tools.
     * @param args.suffix - String to put after the list of tools.
     * @param args.aiPrefix - Prefix to use for AI generated responses.
     * @param args.humanPrefix - Prefix to use for human responses.
     * @param args.inputVariables - List of input variables the final prompt will expect.
     */
    static createPrompt(tools: Tool[], args?: CreatePromptArgs): PromptTemplate;
    static fromLLMAndTools(llm: BaseLanguageModel, tools: Tool[], args?: CreatePromptArgs): ConversationalAgent;
    extractToolAndInput(text: string): {
        tool: string;
        input: string;
    } | null;
}
