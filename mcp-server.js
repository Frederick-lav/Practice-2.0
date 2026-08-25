import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
    name: "practice-mcp",
    version: "1.0.0"
});

server.registerTool(
    "hello",
    {
        description: "Dit bonjour à une personne",
        inputSchema: {
            name: z.string()
        }
    },
    async ({ name }) => {
        return {
            content: [
                {
                    type: "text",
                    text: `Bonjour ${name} ! Message envoyé depuis notre serveur MCP.`
                }
            ]
        };
    }
);

server.registerTool(
    "get_user",
    {
        description: "Récupère un utilisateur JSONPlaceholder avec son ID",
        inputSchema: {
            id: z.number()
        }
    },
    async ({ id }) => {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/users/${id}`
        );

        if (!response.ok) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Utilisateur ${id} introuvable.`
                    }
                ]
            };
        }

        const user = await response.json();

        return {
            content: [
                {
                    type: "text",
                    text:
                        `Nom: ${user.name}\n` +
                        `Username: ${user.username}\n` +
                        `Email: ${user.email}\n` +
                        `Ville: ${user.address.city}`
                }
            ]
        };
    }
);

const transport = new StdioServerTransport();

await server.connect(transport);
