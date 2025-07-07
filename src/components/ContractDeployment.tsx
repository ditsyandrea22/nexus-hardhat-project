import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Rocket, CheckCircle, XCircle, Loader2, ExternalLink, Copy, AlertTriangle, Clock } from 'lucide-react';
import { ContractTemplate } from '../types/contracts';
import { useContractDeployment } from '../hooks/useContractDeployment';
import { NEXUS_TESTNET } from '../config/nexus';

interface ContractDeploymentProps {
  template: ContractTemplate;
  parameters: Record<string, string>;
  signer: ethers.Signer | null;
  onBack: () => void;
}

export const ContractDeployment: React.FC<ContractDeploymentProps> = ({
  template,
  parameters,
  signer,
  onBack
}) => {
  const { isDeploying, deploymentResult, deploymentStep, deployContract, resetDeployment } = useContractDeployment();
  const [estimatedGas, setEstimatedGas] = useState<string>('');
  const [gasPrice, setGasPrice] = useState<string>('');
  const [deploymentCost, setDeploymentCost] = useState<string>('');
  const [userBalance, setUserBalance] = useState<string>('');

  // Get gas estimates and user balance
  useEffect(() => {
    const getEstimates = async () => {
      if (!signer) return;

      try {
        const provider = signer.provider;
        if (!provider) return;

        // Get gas price
        const feeData = await provider.getFeeData();
        const currentGasPrice = feeData.gasPrice || BigInt(20000000000); // 20 gwei default
        setGasPrice(ethers.formatUnits(currentGasPrice, 'gwei'));

        // Estimate gas for deployment
        const estimatedGasLimit = BigInt(500000); // Conservative estimate
        setEstimatedGas(estimatedGasLimit.toString());

        // Calculate deployment cost
        const cost = estimatedGasLimit * currentGasPrice;
        setDeploymentCost(ethers.formatEther(cost));

        // Get user balance
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        setUserBalance(ethers.formatEther(balance));

      } catch (error) {
        console.error('Error getting estimates:', error);
        setEstimatedGas('500000');
        setGasPrice('20');
        setDeploymentCost('0.01');
      }
    };

    getEstimates();
  }, [signer]);

  const handleDeploy = async () => {
    if (!signer) return;

    const constructorArgs = template.parameters.map(param => {
      const value = parameters[param.name] || param.defaultValue || '';
      
      // Convert based on type
      switch (param.type) {
        case 'uint256':
        case 'uint8':
          return parseInt(value) || 0;
        case 'string':
          return value;
        default:
          return value;
      }
    });

    await deployContract(template.name, template.sourceCode, constructorArgs, signer);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openInExplorer = (address: string) => {
    window.open(`${NEXUS_TESTNET.explorerUrl}/address/${address}`, '_blank');
  };

  const openTransactionInExplorer = (hash: string) => {
    window.open(`${NEXUS_TESTNET.explorerUrl}/tx/${hash}`, '_blank');
  };

  const hasInsufficientFunds = parseFloat(userBalance) < parseFloat(deploymentCost);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl text-white">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Deploy Contract</h3>
            <p className="text-sm text-gray-500">Ready to deploy {template.name}</p>
          </div>
        </div>

        {/* Deployment Status */}
        {isDeploying && deploymentStep && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <div>
                <p className="font-medium text-blue-900">Deploying Contract</p>
                <p className="text-sm text-blue-700">{deploymentStep}</p>
              </div>
            </div>
          </div>
        )}

        {/* Contract Summary */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Deployment Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Contract:</span>
              <span className="font-medium">{template.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Network:</span>
              <span className="font-medium">{NEXUS_TESTNET.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Gas:</span>
              <span className="font-medium">{estimatedGas}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gas Price:</span>
              <span className="font-medium">{gasPrice} Gwei</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Cost:</span>
              <span className="font-medium">{deploymentCost} {NEXUS_TESTNET.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Your Balance:</span>
              <span className={`font-medium ${hasInsufficientFunds ? 'text-red-600' : 'text-green-600'}`}>
                {userBalance} {NEXUS_TESTNET.symbol}
              </span>
            </div>
          </div>
        </div>

        {/* Parameters Review */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Constructor Parameters</h4>
          <div className="space-y-2">
            {template.parameters.map((param) => (
              <div key={param.name} className="flex justify-between text-sm">
                <span className="text-gray-600">{param.name} ({param.type}):</span>
                <span className="font-medium font-mono">
                  {parameters[param.name] || param.defaultValue}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Insufficient Funds Warning */}
        {hasInsufficientFunds && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-900">Insufficient Funds</p>
                <p className="text-sm text-red-700">
                  You need at least {deploymentCost} {NEXUS_TESTNET.symbol} to deploy this contract.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Deploy Button */}
        {!deploymentResult && (
          <button
            onClick={handleDeploy}
            disabled={isDeploying || !signer || hasInsufficientFunds}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
          >
            {isDeploying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Deploying Contract...
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                Deploy Contract
              </>
            )}
          </button>
        )}
      </div>

      {/* Deployment Result */}
      {deploymentResult && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            {deploymentResult.success ? (
              <div className="bg-green-500 p-3 rounded-xl text-white">
                <CheckCircle className="w-6 h-6" />
              </div>
            ) : (
              <div className="bg-red-500 p-3 rounded-xl text-white">
                <XCircle className="w-6 h-6" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {deploymentResult.success ? 'Deployment Successful!' : 'Deployment Failed'}
              </h3>
              <p className="text-sm text-gray-500">
                {deploymentResult.success 
                  ? 'Your contract has been deployed to Nexus testnet'
                  : 'There was an error deploying your contract'
                }
              </p>
            </div>
          </div>

          {deploymentResult.success ? (
            <div className="space-y-4">
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">Contract Address</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(deploymentResult.contractAddress!)}
                      className="p-1 text-green-600 hover:text-green-800 transition-colors"
                      title="Copy address"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openInExplorer(deploymentResult.contractAddress!)}
                      className="p-1 text-green-600 hover:text-green-800 transition-colors"
                      title="View on explorer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-green-900 font-mono text-sm break-all">
                  {deploymentResult.contractAddress}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Transaction Hash:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-mono text-gray-900 break-all">
                        {deploymentResult.transactionHash?.slice(0, 20)}...
                      </p>
                      <button
                        onClick={() => openTransactionInExplorer(deploymentResult.transactionHash!)}
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                        title="View transaction"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Gas Used:</span>
                    <p className="font-medium text-gray-900">{deploymentResult.gasUsed}</p>
                  </div>
                  {deploymentResult.blockNumber && (
                    <div>
                      <span className="text-gray-600">Block Number:</span>
                      <p className="font-medium text-gray-900">{deploymentResult.blockNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-red-800">{deploymentResult.error}</p>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <button
              onClick={onBack}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Deploy Another
            </button>
            {deploymentResult.success && (
              <button
                onClick={() => openInExplorer(deploymentResult.contractAddress!)}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View on Explorer
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};