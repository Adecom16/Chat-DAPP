import { SUPPORTED_CHAIN } from "../connection";
import { getChat } from "../constants/contracts";
import { getProvider } from "../constants/provider";

export const isSupportedChain = (chainId) =>
  Number(chainId) === SUPPORTED_CHAIN;

export const getReadWriteChatContract = async (provider) => {
  const readWriteProvider = getProvider(provider);

  const signer = await readWriteProvider.getSigner();

  return getChat(signer);
};
