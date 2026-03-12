import { Router } from 'express';
import crypto from 'crypto';
import { forgePersona } from '../services/claude.js';

export const agentsDb = new Map();
const router = Router();

router.post('/', async (req, res) => {
    try {
        const { description, tone, guardrails, memory } = req.body;
        
        if (!description || typeof description !== 'string') {
            return res.status(400).json({ error: "description is required and must not be empty" });
        }
        
        const config = await forgePersona(description, tone, guardrails);
        
        const agentId = crypto.randomUUID();
        const apiKeyChars = crypto.randomUUID().replace(/-/g, "").slice(0, 20);
        const apiKey = `pf_${apiKeyChars}`;
        
        const agentRecord = {
            agentId,
            apiKey,
            name: config.name,
            systemPrompt: config.systemPrompt,
            domain: config.domain,
            sampleReply: config.sampleReply,
            guardrails: guardrails || [],
            memory: memory !== false // Default true, or store exactly what was sent
        };
        
        agentsDb.set(agentId, agentRecord);
        
        return res.status(201).json(agentRecord);
    } catch (error) {
        console.error("Error in /forge:", error);
        return res.status(500).json({ error: "Internal server error during persona generation" });
    }
});

export default router;
