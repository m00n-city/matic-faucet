import FaucetABI from "../../abi/Faucet.json";
import { ethers } from "ethers";
import { verifyEthAddress } from "../../util";
import { withHCaptcha } from "next-hcaptcha";

const CALLER_SECRET = process.env.CALLER_SECRET;
const CONTRACT_ADDRESS = process.env.PUBLIC_CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL;
const WITHDRAW_AMOUNT = ethers.BigNumber.from(process.env.WITHDRAW_AMOUNT);

export default withHCaptcha(async (req, res) => {
  if (req.method === "POST") {
    try {
      const { address } = req.body;

      const isAddressValid = verifyEthAddress(address);

      if (!isAddressValid) {
        return res.status(400).json({ error: "Invalid wallet address." });
      }
      const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(CALLER_SECRET, provider);

      const faucet = new ethers.Contract(CONTRACT_ADDRESS, FaucetABI, wallet);

      await faucet.withdraw(address, WITHDRAW_AMOUNT);

      return res.status(200).json({ address });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: "Transaction failed." });
    }
  }

  return res.status(404).send("Not found");
});
