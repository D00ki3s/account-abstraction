import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ethers } from "ethers";

dotenv.config();

const port = process.env.PORT || "8001";

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).send("Error");
});

app.get("/", async (req: Request, res: Response) => {
  res.send("backend");
});

app.post("/sign-1", async (req: Request, res: Response) => {
  // validate request
  const { chainId, userOp } = req.body;
  const paymasterAndData = "sign-1";
  res.send({ paymasterAndData });
});

app.post("/sign-2", async (req: Request, res: Response) => {
  // validate request
  const { chainId, userOp } = req.body;
  const paymasterAndData = "sign-2";
  res.send({ paymasterAndData });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
