import { createServerFn } from "@tanstack/react-start";
import { Composio } from "@composio/core";
import OpenAI from "openai";
import { z } from "zod";

// Initialize OpenAI targeting Neurometric Marketplace
const openai = new OpenAI({
  apiKey: process.env.NEUROMETRIC_API_KEY,
  baseURL: "https://api.neurometric.ai/v1",
});

// Initialize the modern Composio client
const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY,
});

const TriageInput = z.object({
  repository: z.string(),
  issueTitle: z.string(),
  issueBody: z.string(),
});

type GitClawTriageResponse =
  | { success: true; message: string; logs: any }
  | { success: false; error: string };

export const runGitClawAgent = createServerFn({ method: "POST" })
  .inputValidator(TriageInput)
  .handler(async ({ data }): Promise<GitClawTriageResponse> => {
    try {
      console.log(`[TrustClaw Engine] Fetching workspace toolsets...`);

      // Modern SDK style: All operations are cleanly scoped to a user session definition
      const tools = await composio.tools.get("default", {
        toolkits: ["github", "slack"],
      });

      const prompt = `
        You are GitClaw PM, an automated issue wrangler.
        An issue was opened in '${data.repository}':
        Title: ${data.issueTitle}
        Body: ${data.issueBody}

        Use your tools to:
        1. Parse the issue details and determine if it's a structural Bug or Feature Request via ClawPack.
        2. Draft and post an automated triage greeting back to that GitHub issue.
        3. Dispatch an alert message outlining the tracking context directly to the #dev-alerts channel on Slack.
      `;

      // Pass the updated tools straight through to Neurometric
      const response = await openai.chat.completions.create({
        model: "clawpack",
        messages: [{ role: "user", content: prompt }],
        tools: tools,
        tool_choice: "auto",
      });

      // --- AUTOMATED TOOL EXECUTION ---
      let executionLogs: any[] = [];

      if (response.choices?.[0]?.message?.tool_calls) {
        console.log(
          `[TrustClaw Engine] Model requested ${response.choices[0].message.tool_calls.length} tool execution steps.`,
        );

        // Loop over the tool calls and cast explicitly to any to circumvent the strict extended union type check
        for (const rawToolCall of response.choices[0].message.tool_calls) {
          const toolCall = rawToolCall as any;

          if (toolCall.function) {
            const result = await composio.tools.execute(toolCall.function.name, {
              userId: "default",
              arguments:
                typeof toolCall.function.arguments === "string"
                  ? JSON.parse(toolCall.function.arguments)
                  : toolCall.function.arguments,
              dangerouslySkipVersionCheck: true,
            });
            executionLogs.push(result);
          }
        }
      } else {
        console.log(`[TrustClaw Engine] No structural tool execution requested by the model.`);
        executionLogs.push({ message: response.choices?.[0]?.message?.content });
      }

      return {
        success: true,
        message: `Triage complete for: ${data.issueTitle}`,
        logs: executionLogs,
      };
    } catch (error: any) {
      console.error("[Agent Failure]:", error);
      return { success: false, error: error?.message || "Execution exception occurred." };
    }
  });
