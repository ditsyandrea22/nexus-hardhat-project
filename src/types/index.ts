export interface NetworkConfig {
  chainId: string;
  rpcUrl: string;
  wsUrl: string;
  explorerUrl: string;
  name: string;
  symbol: string;
}

export interface ContractTemplate {
  name: string;
  description: string;
  code: string;
  bytecode: string;
  abi: any[];
  constructorParams: string[];
}

export interface DeploymentResult {
  contractAddress: string;
  transactionHash: string;
  gasUsed: string;
  deploymentCost: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string;
  chainId: string | null;
}