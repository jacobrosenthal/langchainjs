var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ConversationalAgent_1;
import { Agent, staticImplements, } from "./index.js";
import { LLMChain } from "../chains/llm_chain.js";
import { PromptTemplate } from "../prompts/index.js";
const PREFIX = `Answer the following questions as best you can. You have access to the following tools:`;
const formatInstructions = (toolNames, aiPrefix, _humanPrefix) => `Use the following format:
  
  Question: the input question you must answer
  Thought: you should always think about what to do
  Action: the action to take, should be one of [${toolNames}]
  Action Input: the input to the action
  Observation: the result of the action
  ... (this Thought/Action/Action Input/Observation can repeat N times)
  (Finally, When you have a response to say to the Human, or if you do not need to use a tool, you MUST use the format:)
  Thought: Do I need to use a tool? No
  ${aiPrefix}: the final answer to the original input question
  
  Questions often come in multiple parts and need to be broken down. For example
  How would John Tanners respond to What are Royalties, you first need to find out what royalties are. then you can style transfer the response.`;
const SUFFIX = `Begin!
  
  Previous conversation history:
  {chat_history}
  
  Question: {input}
  Thought:{agent_scratchpad}`;
/**
 * Agent for the MRKL chain.
 * @augments Agent
 * @augments StaticAgent
 */
let ConversationalAgent = ConversationalAgent_1 = class ConversationalAgent extends Agent {
    constructor(input) {
        super(input);
        Object.defineProperty(this, "aiPrefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.aiPrefix = input.aiPrefix || "AI";
    }
    _agentType() {
        return "conversational-react-description";
    }
    observationPrefix() {
        return "Observation: ";
    }
    llmPrefix() {
        return "Thought:";
    }
    finishToolName() {
        return this.aiPrefix;
    }
    prepareForOutput(_, __) {
        return new Promise((resolve) => {
            resolve({ suggestions: [] });
        });
    }
    static validateTools(tools) {
        const invalidTool = tools.find((tool) => !tool.description);
        if (invalidTool) {
            const msg = `Got a tool ${invalidTool.name} without a description.` +
                ` This agent requires descriptions for all tools.`;
            throw new Error(msg);
        }
    }
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
    static createPrompt(tools, args) {
        const { prefix = PREFIX, suffix = SUFFIX, aiPrefix = "AI", // if you override this, remember to override aiPrefix in constructor for finishToolName
        humanPrefix = "Human", inputVariables = ["input", "chat_history", "agent_scratchpad"], } = args ?? {};
        const toolStrings = tools
            .map((tool) => `${tool.name}: ${tool.description}`)
            .join("\n");
        const toolNames = tools.map((tool) => tool.name).join(",");
        const instructions = formatInstructions(toolNames, aiPrefix, humanPrefix);
        const template = [prefix, toolStrings, instructions, suffix].join("\n\n");
        return new PromptTemplate({
            template,
            inputVariables,
        });
    }
    static fromLLMAndTools(llm, tools, args) {
        ConversationalAgent_1.validateTools(tools);
        const prompt = ConversationalAgent_1.createPrompt(tools, args);
        const chain = new LLMChain({ prompt, llm });
        return new ConversationalAgent_1({
            llmChain: chain,
            allowedTools: tools.map((t) => t.name),
        });
    }
    extractToolAndInput(text) {
        if (text.includes(`${this.aiPrefix}:`)) {
            const parts = text.split(`${this.aiPrefix}:`);
            const input = parts[parts.length - 1].trim();
            return { tool: this.aiPrefix, input };
        }
        const match = /Action: (.*)\nAction Input: (.*)/s.exec(text);
        if (!match) {
            throw new Error(`Could not parse LLM output: ${text}`);
        }
        return {
            tool: match[1].trim(),
            input: match[2].trim().replace(/^"+|"+$/g, ""),
        };
    }
};
ConversationalAgent = ConversationalAgent_1 = __decorate([
    (staticImplements)
], ConversationalAgent);
export { ConversationalAgent };
//# sourceMappingURL=conversational.js.map