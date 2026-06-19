import Browserbase from "@browserbasehq/sdk";

export function createBrowserbaseClient(): Browserbase {
  return new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });
}
