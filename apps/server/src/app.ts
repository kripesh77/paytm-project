import express from "express";
import { rootRouter } from "./route/index.js";
const app = express();

app.use(express.json());

app.use("/api/v1", rootRouter);

export { app };
