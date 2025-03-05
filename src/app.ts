import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { categories, questions } from "./api/index.ts";

const app = new Hono();

app.route("/", categories);
app.route("/", questions);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
