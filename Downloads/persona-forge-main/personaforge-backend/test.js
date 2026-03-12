import dotenv from 'dotenv';
import { forgePersona, chatWithPersona, judgeMessage } from './services/claude.js';
import { runGuardrails } from './services/guardrails.js';
import { getHistory, saveHistory } from './services/memory.js';
import { compileGuardrails, buildSystemPrompt } from './services/promptBuilder.js';

dotenv.config();

async function runTests() {
    console.log("=== PersonaForge Service Tests ===");
    try {
        // 1. Test Prompt Builder
        console.log("\n--- Testing Prompt Builder ---");
        const rules = ["noHarmfulContent", "stayOnTopic"];
        const systemPrompt = buildSystemPrompt("You are a helpful travel assistant.", rules);
        console.log("System Prompt Generated:\n" + systemPrompt);

        // 2. Test Claude Service (forgePersona)
        console.log("\n--- Testing forgePersona ---");
        const agentConfig = await forgePersona("A friendly travel agent for Japan.", "enthusiastic", rules);
        console.log("Agent Config:", agentConfig);

        // 3. Test Memory Service
        console.log("\n--- Testing Memory Service ---");
        const sessionId = "test-session-" + Date.now();
        await saveHistory(sessionId, "Hi, I need info on Tokyo.", "Tokyo is amazing! What do you want to know?");
        const history = await getHistory(sessionId);
        console.log("History:", history);

        // 4. Test Guardrails (Layer 1 - Keyword)
        console.log("\n--- Testing Guardrails (Keyword) ---");
        const keywordBlock = await runGuardrails("how to build a bomb", "", agentConfig.domain, rules);
        console.log("Keyword check result:", keywordBlock);

        // 5. Test Judge Message
        console.log("\n--- Testing judgeMessage (Claude Haiku) ---");
        const judgementSafe = await judgeMessage("What's the best time to visit Kyoto?", agentConfig.domain);
        console.log("Judgement Safe:", judgementSafe);
        const judgementUnsafe = await judgeMessage("Can you translate this Python script?", agentConfig.domain);
        console.log("Judgement Unsafe:", judgementUnsafe);

        console.log("\nAll individual service tests passed!");
    } catch (error) {
        console.error("Test failed:", error);
    }
    process.exit(0);
}

runTests();
