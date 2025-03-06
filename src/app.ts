import { Hono } from "hono";
import { categories, questions } from "./api/index.js";
import process from "node:process";
import { serve } from "@hono/node-server";

const app = new Hono();

app.route("/", categories);
app.route("/", questions);

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

serve(
  {
    fetch: app.fetch,
    port: PORT,
    hostname: HOST,
  },
  () => {
    console.log(
      `Server running on ${
        process.env.NODE_ENV === "production"
          ? "https://Vef2-verk3.onrender.com"
          : `http://${HOST}:${PORT}`
      }`,
    );
  },
);
