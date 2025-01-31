import { createSolanaRpc } from "@solana/web3.js";

export function getApiRpc(endpoint: string) {
  return createSolanaRpc(endpoint);
}

export type ApiRpc = ReturnType<typeof getApiRpc>;


export function getApiEndpoint(endpoint?: string) {
  return endpoint ? endpoint.split('=')[0] : 'https://api.mainnet-beta.solana.com';
}
