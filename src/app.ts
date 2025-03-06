import { Hono } from "hono";
import { categories, questions } from "./api/index.js";
import process from "node:process";

const app = new Hono();

app.route("/", categories);
app.route("/", questions);

const port = Number(process.env.PORT) || 3000;

export default {
	port,
	fetch: app.fetch,
};
