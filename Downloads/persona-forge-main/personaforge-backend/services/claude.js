import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

/**
 * Function 1 — forgePersona
 */
export async function forgePersona(description, tone, guardrails) {
    const model = new ChatGroq({
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
    });

    const promptText = `Convert this persona description into agent config JSON only.
No markdown, no explanation.
Description: {description}, Tone: {tone}, Guardrails: {guardrails}
Return: {{ "name": "...", "systemPrompt": "...", "domain": "...", "sampleReply": "..." }}`;

    const prompt = ChatPromptTemplate.fromTemplate(promptText);

    const chain = RunnableSequence.from([
        prompt,
        model,
        new StringOutputParser()
    ]);

    const res = await chain.invoke({
        description,
        tone,
        guardrails
    });

    try {
        const parsed = JSON.parse(res.trim());
        return parsed;
    } catch (e) {
        console.error("Failed to parse JSON from Claude:", res);
        throw new Error("Invalid format returned by the model during persona creation.");
    }
}

/**
 * Function 2 — chatWithPersona
 */
export async function chatWithPersona(systemPrompt, history, userMessage) {
    const model = new ChatGroq({
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
    });

    // Formatting history from generic {role, content} to Langchain message objects
    const formattedHistory = history.map(msg => {
        if (msg.role === "user") return new HumanMessage(msg.content);
        if (msg.role === "assistant") return new AIMessage(msg.content);
        return new AIMessage(msg.content);
    });

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", systemPrompt],
        new MessagesPlaceholder("history"),
        ["human", "{userMessage}"]
    ]);

    const chain = RunnableSequence.from([
        prompt,
        model,
        new StringOutputParser()
    ]);

    const res = await chain.invoke({
        history: formattedHistory,
        userMessage
    });

    return res;
}

/**
 * Function 3 — judgeMessage
 */
export async function judgeMessage(message, context) {
    const model = new ChatGroq({
        model: "llama-3.1-8b-instant",
        temperature: 0,
    });

    const promptText = `Is this message safe and on-topic for a {context} AI agent?
Message: {message}
Reply with ONLY one word: SAFE or UNSAFE`;

    const prompt = ChatPromptTemplate.fromTemplate(promptText);

    const chain = RunnableSequence.from([
        prompt,
        model,
        new StringOutputParser()
    ]);

    const res = await chain.invoke({
        context,
        message
    });

    return res.trim();
}
