import { LLMChain, OpenAI } from "langchain";
import { AgentExecutor, ZeroShotAgent } from "langchain/agents";
import { SerpAPI, Calculator } from "langchain/tools";
import { BufferMemory } from "langchain/memory";

export const run = async () => {
  const model = new OpenAI({ temperature: 0 });
  const tools = [new SerpAPI(), new Calculator()];

  const prefix = `Answer the following questions as best you can. You have access to the following tools:`;

  const suffix = `Begin!

Previous conversation history:
{chat_history}

Question: {input}
Thought:{agent_scratchpad}`;

  const createPromptArgs = {
    tools,
    suffix,
    prefix,
    inputVariables: ["input", "agent_scratchpad", "chat_history"],
  };

  const promptTemplate = ZeroShotAgent.createPrompt(tools, createPromptArgs);

  const memory = new BufferMemory({ memoryKey: "chat_history" });

  ZeroShotAgent.validateTools(tools);
  const prompt = ZeroShotAgent.createPrompt(tools, promptTemplate);
  const chain = new LLMChain({ prompt, llm: model });
  const agent = new ZeroShotAgent({
    llmChain: chain,
    allowedTools: tools.map((t) => t.name),
    memory
  });

  const executor = await AgentExecutor.fromAgentAndTools({
    agent,
    tools,
    returnIntermediateSteps: true,
  });

  console.log("Loaded agent.");

  const inputs = [
    `Hi agent, I am bob`,
    `What color is it?`,
    `What is my name?`,
  ];

  for (const input of inputs) {
    console.log(`Executing with input "${input}"...`);

    const result = await executor.call({ input });

    console.log(`Got output ${result.output}`);

    console.log(
      `Got intermediate steps ${JSON.stringify(
        result.intermediateSteps,
        null,
        2
      )}`
    );
  }

  console.log(memory.chatHistory.messages)
};
