import { FormEvent, useEffect, useState, useRef } from "react";
import { Button, Container, Form, Input, Message, Placeholder } from "semantic-ui-react";
import { verifyEthAddress } from "../util";
import axios from "axios";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const HCAPTCHA_SITE_KEY = process.env.HCAPTCHA_SITE_KEY || "";

function Home(): React.ReactNode {
  const [address, setAddress] = useState("");
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [contractBalance, setContractBalance] = useState<string>();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const captchaRef = useRef<HCaptcha>(null);

  const getContractBalance = async () => {
    try {
      const { data } = await axios.get("/api/balance");
      const { balance } = data;
      const formattedBalance = (parseInt(balance) / Math.pow(10, 18)).toFixed(2);
      setContractBalance(formattedBalance);
    } catch (e) {
      console.log(e);
      setContractBalance("");
    }
  };

  const requestFunds = async (token: string) => {
    setSuccess(false);
    setError("");
    setLoading(true);
    try {
      const withdrawRes = await axios.post("/api/withdraw", { address, "h-captcha-response": token });
      if (withdrawRes.data.error) {
        setError(withdrawRes.data.error);
      } else {
        setSuccess(true);
      }
    } catch (e: any) {
      console.log(e);
      setError(e.message);
    }
    setLoading(false);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid) {
      return setError("Invalid wallet address.");
    }

    captchaRef.current?.execute();
  };

  const onVerify = (token: string) => {
    if (!token) {
      return;
    }

    captchaRef.current?.resetCaptcha();
    return requestFunds(token);
  };

  useEffect(() => {
    if (address) {
      setTouched(true);
    }

    setIsValid(verifyEthAddress(address));
  }, [address]);

  useEffect(() => {
    if (!isValid) {
      setError("");
    }
  }, [address]);

  useEffect(() => {
    getContractBalance();
  }, []);

  return (
    <Container>
      <div className="card">
        <Form success={success} error={!!error} onSubmit={onSubmit}>
          <HCaptcha size="invisible" sitekey={HCAPTCHA_SITE_KEY} onVerify={onVerify} ref={captchaRef} />
          <div className="title">
            <span className="Orbitron">Polygon Faucet</span>
          </div>
          <Form.Field error={touched && !isValid}>
            <span className="label">Your Polygon wallet address</span>
            <Input disabled={loading} type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
          </Form.Field>
          <Message error content={error} />
          {success && <Message success content="0.005 $MATIC will soon be transferred to your wallet." />}
          <Button type="submit" style={{ marginBottom: 50 }} loading={loading} primary className="Orbitron font-18">
            Request $MATIC
          </Button>
        </Form>
        <p>Please send any unused $MATIC to {process.env.PUBLIC_CONTRACT_ADDRESS} to keep this faucet running.</p>
        {contractBalance ? <p>Contract balance: {contractBalance} $MATIC</p> : <p>Contract balance: 0 $MATIC</p>}

        <div className="dev_by">
          <h3>Developed &amp; maintained by</h3>
          <div>
            <a href="https://m00n.city" target="_blank">
              <img src="./images/moon-city-logo3.png" />
            </a>
            /
            <a href="https://lca.m00n.city" target="_blank">
              <img src="./images/LCA_side_1.png" />
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Home;
