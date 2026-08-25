import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
    name: "practice-mcp",
    version: "1.2.0"
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

server.registerTool(
    "get_user_posts",
    {
        description: "Récupère les articles JSONPlaceholder d'un utilisateur avec son ID",
        inputSchema: {
            id: z.number()
        }
    },
    async ({ id }) => {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/posts?userId=${id}`
        );

        if (!response.ok) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Impossible de récupérer les articles de l'utilisateur ${id}.`
                    }
                ]
            };
        }

        const posts = await response.json();

        if (posts.length === 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Aucun article trouvé pour l'utilisateur ${id}.`
                    }
                ]
            };
        }

        const text = posts
            .map(
                (post) =>
                    `Titre: ${post.title}\n${post.body}`
            )
            .join("\n\n");

        return {
            content: [
                {
                    type: "text",
                    text
                }
            ]
        };
    }
);

server.registerTool(
    "get_user_summary",
    {
        description: "Gets a user profile and the number of posts they have",
        inputSchema: {
            id: z.number()
        }
    },
    async ({ id }) => {

        const userResponse = await fetch(
            `https://jsonplaceholder.typicode.com/users/${id}`
        );

        if (!userResponse.ok) {
            return {
                content: [
                    {
                        type: "text",
                        text: `User ${id} was not found.`
                    }
                ]
            };
        }

        const postsResponse = await fetch(
            `https://jsonplaceholder.typicode.com/posts?userId=${id}`
        );

        const user = await userResponse.json();
        const posts = await postsResponse.json();

        return {
            content: [
                {
                    type: "text",
                    text:
                        `Name: ${user.name}\n` +
                        `Username: ${user.username}\n` +
                        `Email: ${user.email}\n` +
                        `City: ${user.address.city}\n` +
                        `Number of posts: ${posts.length}`
                }
            ]
        };
    }
);
server.registerTool(
    "create_post",
    {
        description: "Creates a new JSONPlaceholder post",
        inputSchema: {
            userId: z.number(),
            title: z.string(),
            body: z.string()
        }
    },
    async ({ userId, title, body }) => {

        const newPost = {
            userId,
            title,
            body
        };

        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newPost)
            }
        );

        if (!response.ok) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Could not create the post."
                    }
                ]
            };
        }

        const createdPost = await response.json();

        return {
            content: [
                {
                    type: "text",
                    text:
                        `Post created!\n` +
                        `ID: ${createdPost.id}\n` +
                        `User ID: ${createdPost.userId}\n` +
                        `Title: ${createdPost.title}\n` +
                        `Body: ${createdPost.body}`
                }
            ]
        };
    }
);
const transport = new StdioServerTransport();

await server.connect(transport);
