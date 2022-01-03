import { ethers } from "ethers";

const CONTRACT_ADDRESS = process.env.PUBLIC_CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL;

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const provider = new ethers.getDefaultProvider(RPC_URL);
      const contractBalance = await provider.getBalance(CONTRACT_ADDRESS);
      return res.status(200).json({ balance: contractBalance.toString() });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
}
