export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  category: 'storage' | 'token' | 'nft' | 'defi';
  parameters: ContractParameter[];
  sourceCode: string;
}

export interface ContractParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: string;
}

export interface DeployedContract {
  address: string;
  name: string;
  deploymentHash: string;
  timestamp: number;
  deployer: string;
  verified: boolean;
}

export interface DeploymentResult {
  success: boolean;
  contractAddress?: string;
  transactionHash?: string;
  error?: string;
  gasUsed?: string;
}