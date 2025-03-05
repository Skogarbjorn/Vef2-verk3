import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { categories, questions } from "./api/index.ts";
import process from "node:process";

const app = new Hono();

app.route("/", categories);
app.route("/", questions);

const port = process.env.PORT || 3000;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
