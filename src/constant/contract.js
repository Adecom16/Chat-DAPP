import { ethers } from "ethers";
import Abi from "./abi.json";

export const getChat = (providerOrSigner) =>
  new ethers.Contract(
    import.meta.env.VITE_chat_contract_address,
    Abi,
    providerOrSigner
  );
