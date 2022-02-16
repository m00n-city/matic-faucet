import { getDatabase, ref, get, set, child } from "firebase/database";

const db = getDatabase();

export const validateWithdrawal = async (address: string, ip: string): Promise<boolean> => {
  const addressRes = await validateInterval(`addresses/${address}`);
  const IpsRes = await validateInterval(`ips/${ip}`);
  return addressRes && IpsRes;
};

export const createWithdrawalRecord = async (address: string, ip: string): Promise<boolean> => {
  const addressRes = await createRecord(`addresses/${address}`);
  const IpsRes = await createRecord(`ips/${ip}`);
  return addressRes && IpsRes;
};

export const validateInterval = async (value: string, interval = 8.64e7): Promise<boolean> => {
  try {
    const currentTime = Date.now();
    const snapshot = await get(ref(db, value));

    if (snapshot.exists()) {
      if (currentTime - snapshot.val() < interval) {
        // Cooldown not over yet
        return false;
      } else {
        // Cooldown over
        return true;
      }
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const createRecord = async (value: string): Promise<boolean> => {
  try {
    const currentTime = Date.now();
    const valRef = ref(db, value);
    await set(valRef, currentTime);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};