export interface NexusNetwork {
  chainId: string;
  rpcUrl: string;
  wsUrl: string;
  explorerUrl: string;
  name: string;
  symbol: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  network: NexusNetwork | null;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}