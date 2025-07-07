import { useState } from 'react';
import { ethers } from 'ethers';
import { DeploymentResult } from '../types';

export const useContractDeployer = (signer: ethers.JsonRpcSigner | null) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const estimateGas = async (bytecode: string, abi: any[], constructorParams: any[]) => {
    if (!signer) throw new Error('No signer available');

    try {
      setError(null);
      
      // Create contract factory with proper ABI and bytecode
      const factory = new ethers.ContractFactory(abi, bytecode, signer);

      // Estimate gas for deployment
      const deployTransaction = factory.getDeployTransaction(...constructorParams);
      const estimatedGas = await signer.estimateGas(deployTransaction);

      // Get current gas price
      const feeData = await signer.provider.getFeeData();
      const gasPrice = feeData.gasPrice || await signer.provider.getGasPrice();
      
      return {
        gasLimit: estimatedGas.toString(),
        gasPrice: gasPrice.toString(),
        estimatedCost: ethers.formatEther(estimatedGas * gasPrice)
      };
    } catch (error) {
      console.error('Gas estimation failed:', error);
      setError(error instanceof Error ? error : new Error('Gas estimation failed'));
      throw error;
    }
  };

  const deployContract = async (
    bytecode: string,
    abi: any[],
    constructorParams: any[],
    gasLimit?: string,
    gasPrice?: string
  ) => {
    if (!signer) throw new Error('No signer available');

    setIsDeploying(true);
    setDeploymentResult(null);
    setError(null);

    try {
      // Create contract factory with proper ABI and bytecode
      const factory = new ethers.ContractFactory(abi, bytecode, signer);

      // Deployment options
      const deployOptions: ethers.ContractDeployTransaction = {};
      if (gasLimit) deployOptions.gasLimit = ethers.toBigInt(gasLimit);
      if (gasPrice) deployOptions.gasPrice = ethers.parseUnits(gasPrice, 'gwei');

      // Deploy contract
      const contract = await factory.deploy(...constructorParams, deployOptions);
      
      // Wait for deployment
      const deploymentTx = contract.deploymentTransaction();
      if (!deploymentTx) {
        throw new Error('Deployment transaction failed');
      }
      
      const receipt = await deploymentTx.wait();
      
      if (!receipt) {
        throw new Error('Deployment transaction failed');
      }

      const contractAddress = await contract.getAddress();
      if (!contractAddress) {
        throw new Error('Failed to get contract address');
      }

      const result: DeploymentResult = {
        contractAddress,
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed.toString(),
        deploymentCost: ethers.formatEther(receipt.gasUsed * receipt.gasPrice)
      };

      setDeploymentResult(result);
      return result;
    } catch (error) {
      console.error('Contract deployment failed:', error);
      setError(error instanceof Error ? error : new Error('Contract deployment failed'));
      throw error;
    } finally {
      setIsDeploying(false);
    }
  };

  return {
    isDeploying,
    deploymentResult,
    error,
    estimateGas,
    deployContract
  };
};