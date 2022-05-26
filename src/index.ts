import * as Koa from "koa";
import * as Router from "koa-router";

import * as logger from "koa-logger";
import * as json from "koa-json";
import * as bodyParser from "koa-bodyparser";

const app = new Koa();
const router = new Router();
const { Pool } = require('pg');

// Get plain text
router.get("/", async (ctx, next) => {
    ctx.body = {msg: "Hello world!!"}
    await next();
});

// Test db connection
router.get('/pg', async (ctx) => {
    const { rows } = await ctx.app.pool.query('SELECT $1::text as message', ['Hello, World!'])
    ctx.body = rows[0].message;
});

interface HelloRequest {
    name: string;
}

// Test bodyParser
router.post("/", async (ctx, next) => {
    const data = <HelloRequest>ctx.request.body;
    const responseName = data.name + " from koa"
    ctx.body = {name: responseName}
    await next();
});

// Middlewares
app.use(json());
app.use(logger());
app.use(bodyParser())

// Routes
app.use(router.routes()).use(router.allowedMethods());

app.pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE_NAME,
    password: process.env.DB_PASSWORD, // Password is empty be default
    port: process.env.POSTGRES_PORT, // Default port
});

const port = process.env.SERVER_PORT || 4000
app.listen(port, () => {
    console.log("Koa started");
});
