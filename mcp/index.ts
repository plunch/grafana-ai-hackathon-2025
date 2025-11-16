import express from "express";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import * as pg from "pg";
import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const pool = new pg.Pool();

const server = new McpServer({
  name: "aml",
  version: "1.0.0",
});

server.registerTool(
  "get-transactions-by-from",
  {
    title: "Get Transactions by source account number",
    description: "Get Transactions by sending account number",
    inputSchema: {
      from_account: z.string(),
    },
    outputSchema: {
      transactions: z.array(
        z.object({
          id: z.number(),
          ts: z.string(),
          from_bank: z.string(),
          account: z.string(),
          to_bank: z.string(),
          account1: z.string(),
          amount_received: z.string(),
          receiving_currency: z.string(),
          amount_paid: z.string(),
          payment_currency: z.string(),
          payment_format: z.string(),
          is_laundering: z.number(),
          risk_level: z.number(),
          scoring: z.string(),
        }),
      ),
    },
  },
  async ({ from_account }) => {
    const res = await pool.query(
      `SELECT * FROM scored_transactions WHERE account = $1`,
      [from_account],
    );
    return {
      content: [{ type: "text", text: JSON.stringify(res.rows) }],
      structuredContent: {
        transactions: res.rows,
      },
    };
  },
);

server.registerTool(
  "get-transactions-by-to",
  {
    title: "Get Transactions by destinating account number",
    description: "Get Transactions by receiving account number",
    inputSchema: {
      to_account: z.string(),
    },
    outputSchema: {
      transactions: z.array(
        z.object({
          id: z.number(),
          ts: z.string(),
          from_bank: z.string(),
          account: z.string(),
          to_bank: z.string(),
          account1: z.string(),
          amount_received: z.string(),
          receiving_currency: z.string(),
          amount_paid: z.string(),
          payment_currency: z.string(),
          payment_format: z.string(),
          is_laundering: z.number(),
          risk_level: z.number(),
          scoring: z.string(),
        }),
      ),
    },
  },
  async ({ to_account }) => {
    const res = await pool.query(
      `SELECT * FROM scored_transactions WHERE account1 = $1`,
      [to_account],
    );
    return {
      content: [{ type: "text", text: JSON.stringify(res.rows) }],
      structuredContent: {
        transactions: res.rows,
      },
    };
  },
);

const app = express();

app.use(express.json());

app.post("/mcp", async (req, res, next) => {
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    res.on("close", () => {
      transport.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

app.listen(8080);
