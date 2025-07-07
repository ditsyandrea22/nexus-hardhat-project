import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Rocket, CheckCircle, XCircle, Loader2, ExternalLink, Copy } from 'lucide-react';
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
  const { isDeploying, deploymentResult, deployContract, resetDeployment } = useContractDeployment();
  const [estimatedGas, setEstimatedGas] = useState<string>('~500,000');

  const handleDeploy = async () => {
    if (!signer) return;

    const constructorArgs = template.parameters.map(param => {
      const value = parameters[param.name] || param.defaultValue || '';
      
      // Convert based on type
      switch (param.type) {
        case 'uint256':
        case 'uint8':
          return parseInt(value);
        case 'string':
          return value;
        default:
          return value;
      }
    });

    await deployContract(template.name, template.sourceCode, constructorArgs, signer);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openInExplorer = (address: string) => {
    window.open(`${NEXUS_TESTNET.explorerUrl}/address/${address}`, '_blank');
  };

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
          </div>
        </div>

        {/* Parameters Review */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Constructor Parameters</h4>
          <div className="space-y-2">
            {template.parameters.map((param) => (
              <div key={param.name} className="flex justify-between text-sm">
                <span className="text-gray-600">{param.name}:</span>
                <span className="font-medium font-mono">
                  {parameters[param.name] || param.defaultValue}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Deploy Button */}
        {!deploymentResult && (
          <button
            onClick={handleDeploy}
            disabled={isDeploying || !signer}
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
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openInExplorer(deploymentResult.contractAddress!)}
                      className="p-1 text-green-600 hover:text-green-800 transition-colors"
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
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Transaction Hash:</span>
                    <p className="font-mono text-gray-900 break-all">
                      {deploymentResult.transactionHash?.slice(0, 20)}...
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Gas Used:</span>
                    <p className="font-medium text-gray-900">{deploymentResult.gasUsed}</p>
                  </div>
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