import { Hono } from "hono";
import { categories, questions } from "./api/index.js";
import { handle } from "jsr:@hono/hono/netlify";

const app = new Hono();

app.route("/", categories);
app.route("/", questions);

export default handle(app);
