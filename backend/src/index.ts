import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ethers } from "ethers";
import { checkUserWatchedAd } from "../lib/ad";

import DookiesPaymasterJson from "../lib/paymaster/DookiesPaymaster.json";

dotenv.config();

const paymasterAddress = "0x88c90fc6cf63ecfe0070ddc710a30a07547d62cc";

// todo: should use better way to manage signer key
const privateKey = process.env.PRIVATE_KEY || "";
const rpc = process.env.RPC || "http://127.0.0.1:8545";
const port = process.env.PORT || "8001";

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).send("Error");
});

app.get("/", async (req: Request, res: Response) => {
  console.log("/");
  res.send("backend");
});

app.post("/prepare", async (req: Request, res: Response) => {
  console.log("/prepare");
  const timestamp = Math.floor(Date.now() / 1000);
  const validAfter = timestamp;
  const validUntil = timestamp + 1800; //30m
  const validity = ethers.utils.defaultAbiCoder.encode(["uint48", "uint48"], [validUntil, validAfter]);
  const paymasterAndData = ethers.utils.hexConcat([
    paymasterAddress,
    validity,
    "0x" + "00".repeat(65), // put signautre for user sign
  ]);
  res.send({ paymasterAndData });
});

app.post("/sign", async (req: Request, res: Response) => {
  console.log("/sign");
  const { userOp } = req.body;
  if (!privateKey) {
    res.status(500).send("private key is not defined");
  }
  const isUserWatchedAdd = checkUserWatchedAd();
  if (!isUserWatchedAdd) {
    res.status(500).send("ad validation is failed");
  }

  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const paymasterContract = new ethers.Contract(paymasterAddress, DookiesPaymasterJson.abi, provider);

  const { validUntil, validAfter } = await paymasterContract.parsePaymasterAndData(userOp.paymasterAndData);
  const hash = await paymasterContract.getHash(userOp, validUntil, validAfter);
  const signer = new ethers.Wallet(privateKey, provider);
  const signature = await signer.signMessage(ethers.utils.arrayify(hash));
  const validity = ethers.utils.defaultAbiCoder.encode(["uint48", "uint48"], [validUntil, validAfter]);
  const paymasterAndData = ethers.utils.hexConcat([paymasterAddress, validity, signature]);

  res.send({ paymasterAndData });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
