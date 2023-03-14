import { expect, test } from "@jest/globals";
import { OpenAIChat } from "../openai-chat.js";
import { BaseCallbackHandler, CallbackManager } from "../../callbacks/index.js";
test("Test OpenAI", async () => {
    const model = new OpenAIChat({ modelName: "gpt-3.5-turbo" });
    const res = await model.call("Print hello world");
    console.log({ res });
});
test("Test OpenAI with prefix messages", async () => {
    const model = new OpenAIChat({
        prefixMessages: [
            { role: "user", content: "My name is John" },
            { role: "assistant", content: "Hi there" },
        ],
    });
    const res = await model.call("What is my name");
    console.log({ res });
});
test("Test OpenAI in streaming mode", async () => {
    class StreamCallbackHandler extends BaseCallbackHandler {
        constructor() {
            super(...arguments);
            Object.defineProperty(this, "nrNewTokens", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: 0
            });
            Object.defineProperty(this, "alwaysVerbose", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: true
            });
            Object.defineProperty(this, "streamedCompletion", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: ""
            });
        }
        async handleLLMNewToken(token) {
            this.nrNewTokens += 1;
            this.streamedCompletion += token;
        }
    }
    const streamCallbackHandler = new StreamCallbackHandler();
    const callbackManager = new CallbackManager();
    callbackManager.addHandler(streamCallbackHandler);
    const model = new OpenAIChat({
        modelName: "gpt-3.5-turbo",
        streaming: true,
        callbackManager,
    });
    const res = await model.call("Print hello world");
    console.log({ res });
    expect(streamCallbackHandler.nrNewTokens > 0).toBe(true);
    expect(res).toBe(streamCallbackHandler.streamedCompletion);
});
//# sourceMappingURL=openai-chat.int.test.js.map