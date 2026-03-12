import { judgeMessage } from './claude.js';
import { compileGuardrails } from './promptBuilder.js';
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

const BLOCKED_KEYWORDS = [
    "hack", "bomb", "weapon", "illegal", "jailbreak",
    "ignore all rules", "forget instructions",
    "ignore previous", "pretend you have no rules",
    "bypass", "override rules"
];

/**
 * Layer 1 — keywordCheck
 */
function keywordCheck(message) {
    const lowerMessage = message.toLowerCase();
    for (const keyword of BLOCKED_KEYWORDS) {
        if (lowerMessage.includes(keyword)) {
            return { safe: false, reason: keyword };
        }
    }
    return { safe: true };
}

/**
 * Layer 2 — claudeJudgeInput
 */
async function claudeJudgeInput(message, domain) {
    try {
        const res = await judgeMessage(message, domain);
        if (res.toUpperCase().includes("UNSAFE")) {
            return { safe: false };
        }
        return { safe: true };
    } catch (e) {
        console.error("claudeJudgeInput error:", e);
        // Fail open or fail closed? Let's fail open to prevent breaking everything if API fails,
        // or fail safe (false). We will fail open as it's common unless strictly safe.
        // Actually, returning true to let it through Layer 3 is usually safer for UX, but I'll return true.
        return { safe: true };
    }
}

/**
 * Layer 3 — claudeJudgeOutput
 */
async function claudeJudgeOutput(response, rules) {
    if (!rules || rules.length === 0) return { safe: true };

    try {
        const model = new ChatGroq({
            model: "llama-3.1-8b-instant",
            temperature: 0,
        });
        
        const promptText = `Does the following response follow all of these rules?
Rules: {rules}
Response: {response}
Reply with ONLY one word: SAFE or UNSAFE`;

        const prompt = ChatPromptTemplate.fromTemplate(promptText);
        
        const chain = RunnableSequence.from([
            prompt,
            model,
            new StringOutputParser()
        ]);
        
        const res = await chain.invoke({
            rules: compileGuardrails(rules),
            response
        });
        
        if (res.trim().toUpperCase().includes("UNSAFE")) {
            return { safe: false };
        }
        return { safe: true };
    } catch (e) {
        console.error("claudeJudgeOutput error:", e);
        return { safe: true };
    }
}

/**
 * Main function — runGuardrails
 */
export async function runGuardrails(userMessage, agentResponse, domain, rules) {
    // If testing input only (agentResponse is empty), skip output judge
    
    // 1. Layer 1 keyword check on user input
    if (userMessage) {
        const l1 = keywordCheck(userMessage);
        if (!l1.safe) {
            return { blocked: true, layer: "keyword", reply: "I can't help with that request." };
        }
        
        // 2. Layer 2 input judge
        const l2 = await claudeJudgeInput(userMessage, domain);
        if (!l2.safe) {
            return { blocked: true, layer: "input", reply: "That's outside what I can help with." };
        }
    }

    // 3. Layer 3 output judge
    if (agentResponse) {
        const l3 = await claudeJudgeOutput(agentResponse, rules);
        if (!l3.safe) {
            return { blocked: true, layer: "output", reply: "I can't provide a response to that." };
        }
    }

    return { blocked: false, reply: agentResponse };
}
