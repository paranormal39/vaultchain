import { AgentRuntime, elizaLogger } from "@elizaos/core";
import bootstrapPlugin from "@elizaos/plugin-bootstrap";
import nodePlugin from "@elizaos/plugin-node";
import knowledgePlugin from "@elizaos/plugin-knowledge";
import mcpPlugin from "@elizaos/plugin-mcp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const MCP_URL     = process.env.VITE_MCP_URL     || 'http://localhost:3000';
const MATTHEW_URL = process.env.VITE_MATTHEW_URL || 'http://localhost:3001';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startMatthew() {
    try {
        elizaLogger.info("🚀 Starting Matthew Treasury Agent...");

        // Load character configuration
        const characterPath = path.join(__dirname, "zk-treasury-agent-simple.json");
        
        if (!fs.existsSync(characterPath)) {
            throw new Error(`Character file not found: ${characterPath}`);
        }

        const character = JSON.parse(fs.readFileSync(characterPath, "utf8"));
        elizaLogger.info(`📋 Loaded character: ${character.name}`);

        // Initialize runtime with plugins
        const runtime = new AgentRuntime({
            databaseAdapter: null, // Use in-memory for now
            token: process.env.OPENAI_API_KEY,
            serverUrl: MATTHEW_URL,
            actions: [],
            evaluators: [],
            providers: [],
            plugins: [
                bootstrapPlugin,
                nodePlugin,
                knowledgePlugin,
                mcpPlugin
            ],
            character,
            settings: {
                ...character.settings,
                mcp: {
                    servers: {
                        "midnight-wallet": {
                            url: MCP_URL,
                            description: "Midnight Network MCP server for real wallet operations",
                            enabled: true
                        }
                    }
                }
            }
        });

        elizaLogger.info("🔌 Plugins loaded:");
        elizaLogger.info("  - Bootstrap Plugin");
        elizaLogger.info("  - Node Plugin");
        elizaLogger.info("  - Knowledge Plugin");
        elizaLogger.info("  - MCP Plugin (Midnight Network)");

        // Test MCP connection
        try {
            elizaLogger.info("🌙 Testing Midnight MCP connection...");
            const response = await fetch(`${MCP_URL}/health`);
            if (response.ok) {
                elizaLogger.info("✅ Midnight MCP server is accessible");
            } else {
                elizaLogger.warn("⚠️ Midnight MCP server responded with error");
            }
        } catch (error) {
            elizaLogger.warn("⚠️ Could not connect to Midnight MCP server:", error.message);
            elizaLogger.info(`💡 Make sure MCP server is running at ${MCP_URL}`);
        }

        elizaLogger.info("🎯 Matthew Treasury Agent is ready!");
        elizaLogger.info(`📡 Server running on ${MATTHEW_URL}`);
        elizaLogger.info(`🔗 MCP connection: ${MCP_URL}`);
        elizaLogger.info(`🪝 Xahau Hooks: ${process.env.VITE_XAHAU_SERVER || 'wss://xahau-test.net/'}`);
        elizaLogger.info("💬 Ready for treasury management conversations!");

        // Keep the process running
        process.on('SIGINT', () => {
            elizaLogger.info("👋 Shutting down Matthew Treasury Agent...");
            process.exit(0);
        });

        // Start the runtime
        await runtime.start();

    } catch (error) {
        elizaLogger.error("❌ Failed to start Matthew:", error);
        process.exit(1);
    }
}

// Start Matthew
startMatthew();
