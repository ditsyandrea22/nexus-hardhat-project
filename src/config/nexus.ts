import { NexusNetwork } from '../types/nexus';

export const NEXUS_TESTNET: NexusNetwork = {
  chainId: '3940',
  rpcUrl: 'https://testnet3.rpc.nexus.xyz',
  wsUrl: 'wss://testnet3.rpc.nexus.xyz',
  explorerUrl: 'https://testnet3.explorer.nexus.xyz',
  name: 'Nexus Testnet',
  symbol: 'NXS'
};

export const SUPPORTED_NETWORKS = [NEXUS_TESTNET];