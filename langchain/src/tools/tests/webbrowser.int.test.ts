import { test, expect, describe } from "@jest/globals";
import { WebBrowser } from "../webbrowser.js";
import { ChatOpenAI } from "../../chat_models/openai.js";
import { OpenAIEmbeddings } from "../../embeddings/openai.js";

describe("webbrowser Test suite", () => {
  test("get word of the day", async () => {
    const model = new ChatOpenAI({ temperature: 0 });
    const embeddings = new OpenAIEmbeddings();

    const browser = new WebBrowser({ model, embeddings });
    const result = await browser.call(
      `"https://www.merriam-webster.com/word-of-the-day","word of the day"`
    );

    expect(result).toContain("Word of the Day:");
  });

  test("get a summary of the page when empty request", async () => {
    const model = new ChatOpenAI({ temperature: 0 });
    const embeddings = new OpenAIEmbeddings();

    const browser = new WebBrowser({ model, embeddings });
    const result = await browser.call(
      `"https://www.merriam-webster.com/word-of-the-day",""`
    );

    // fuzzy, sometimes its capped and others not
    expect(result).toMatch(/word of the day/i);
  });

  test("get a summary of the page if it drops second request quote", async () => {
    const model = new ChatOpenAI({ temperature: 0 });
    const embeddings = new OpenAIEmbeddings();

    const browser = new WebBrowser({ model, embeddings });
    const result = await browser.call(
      `"https://www.merriam-webster.com/word-of-the-day","`
    );

    // fuzzy, sometimes its capped and others not
    expect(result).toMatch(/word of the day/i);
  });

  test("get a summary of the page if it gives nothing after comma", async () => {
    const model = new ChatOpenAI({ temperature: 0 });
    const embeddings = new OpenAIEmbeddings();

    const browser = new WebBrowser({ model, embeddings });
    const result = await browser.call(
      `"https://www.merriam-webster.com/word-of-the-day",`
    );

    // fuzzy, sometimes its capped and others not
    expect(result).toMatch(/word of the day/i);
  });

  test("get a summary of the page if it gives no comma", async () => {
    const model = new ChatOpenAI({ temperature: 0 });
    const embeddings = new OpenAIEmbeddings();

    const browser = new WebBrowser({ model, embeddings });
    const result = await browser.call(
      `"https://www.merriam-webster.com/word-of-the-day"`
    );

    // fuzzy, sometimes its capped and others not
    expect(result).toMatch(/word of the day/i);
  });

  test("error no url", async () => {
    const model = new ChatOpenAI({ temperature: 0 });
    const embeddings = new OpenAIEmbeddings();

    const browser = new WebBrowser({ model, embeddings });
    const result = await browser.call(`"",""`);

    expect(result).toEqual("TypeError [ERR_INVALID_URL]: Invalid URL");
  });

  test("error no protocol or malformed", async () => {
    const model = new ChatOpenAI({ temperature: 0 });
    const embeddings = new OpenAIEmbeddings();

    const browser = new WebBrowser({ model, embeddings });
    const result = await browser.call(
      `"www.merriam-webster.com/word-of-the-day","word of the day"`
    );

    expect(result).toEqual("TypeError [ERR_INVALID_URL]: Invalid URL");
  });

  test("error bad site", async () => {
    const model = new ChatOpenAI({ temperature: 0 });
    const embeddings = new OpenAIEmbeddings();

    const browser = new WebBrowser({ model, embeddings });
    const result = await browser.call(
      `"https://www.hDjRBKoAD0EIbF29TWM4rbXDGGM5Nhy4uzNEAdDS.com","word of the day"`
    );

    expect(result).toEqual(
      "Error: getaddrinfo ENOTFOUND www.hdjrbkoad0eibf29twm4rbxdggm5nhy4uzneadds.com"
    );
  });

  test("get a summary of a page that detects scraping", async () => {
    const model = new ChatOpenAI({ temperature: 0 });
    const embeddings = new OpenAIEmbeddings();

    const browser = new WebBrowser({ model, embeddings });
    const result = await browser.call(
      `"https://www.musicgateway.com/spotify-pre-save",""`
    );

    expect(result).not.toEqual("Error: http response 403");
  });

  // cant we figure the headers to fix this?
  test.skip("get a summary of a page that detects scraping 2", async () => {
    const model = new ChatOpenAI({ temperature: 0 });
    const embeddings = new OpenAIEmbeddings();

    const browser = new WebBrowser({ model, embeddings });
    const result = await browser.call(
      `"https://parade.com/991228/marynliles/couples-goals",""`
    );
    expect(result).not.toEqual("Error: http response 403");
  });

  test("get a summary of a page that rejects unauthorized", async () => {
    const model = new ChatOpenAI({ temperature: 0 });
    const embeddings = new OpenAIEmbeddings();

    const browser = new WebBrowser({ model, embeddings });
    const result = await browser.call(
      `"https://firstround.com/review/how-to-fix-the-co-founder-fights-youre-sick-of-having-lessons-from-couples-therapist-esther-perel",""`
    );

    expect(result).toContain("Esther Perel");
  });

  test("get a summary of a page that redirects", async () => {
    const model = new ChatOpenAI({ temperature: 0 });
    const embeddings = new OpenAIEmbeddings();

    const browser = new WebBrowser({ model, embeddings });
    const result = await browser.call(
      `"https://www.themarginalian.org/2015/04/09/find-your-bliss-joseph-campbell-power-of-myth",""`
    );
    expect(result).toContain("The Marginalian");
  });

  // other urls that have done this too
  // "https://wsimag.com/economy-and-politics/15473-power-and-money",
  // "https://thriveglobal.com/stories/sleep-what-to-do-what-not-to-do",
  test("get a summary of a page that redirects too many times", async () => {
    const model = new ChatOpenAI({ temperature: 0 });
    const embeddings = new OpenAIEmbeddings();

    const browser = new WebBrowser({ model, embeddings });
    const result = await browser.call(
      `"https://www.healtheuropa.eu/why-mdma-must-be-reclassified-as-a-schedule-2-drug/95780",""`
    );
    expect(result).toContain("Beckley Foundation");
  });
});
