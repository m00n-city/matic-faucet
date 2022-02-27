import { ethers } from "ethers";

const RPC_URL = process.env.RPC_URL;
const CALLER_SECRET = process.env.CALLER_SECRET;

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(CALLER_SECRET, provider);

      const balance = await wallet.getBalance();
      // console.log(await wallet.getAddress(), balance);

      return res.status(200).json({ balance: balance.toString() });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  return res.status(404).send("Not found");
}
