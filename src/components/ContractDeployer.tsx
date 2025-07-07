import React, { useState } from 'react';
import { Send, DollarSign, Clock, AlertCircle, CheckCircle, Zap, TrendingUp } from 'lucide-react';
import { ContractTemplate } from '../types';
import { useContractDeployer } from '../hooks/useContractDeployer';
import { ethers } from 'ethers';

interface ContractDeployerProps {
  template: ContractTemplate;
  signer: ethers.JsonRpcSigner | null;
}

const ContractDeployer: React.FC<ContractDeployerProps> = ({
  template,
  signer
}) => {
  const { isDeploying, deploymentResult, estimateGas, deployContract, error } = useContractDeployer(signer);
  const [constructorParams, setConstructorParams] = useState<string[]>(
    template.constructorParams.map(() => '')
  );
  const [gasEstimate, setGasEstimate] = useState<any>(null);
  const [customGasLimit, setCustomGasLimit] = useState('');
  const [customGasPrice, setCustomGasPrice] = useState('');
  const [isEstimating, setIsEstimating] = useState(false);

  const handleParamChange = (index: number, value: string) => {
    const newParams = [...constructorParams];
    newParams[index] = value;
    setConstructorParams(newParams);
  };

  const handleEstimateGas = async () => {
    setIsEstimating(true);
    try {
      const params = constructorParams.map((param, index) => {
        const paramType = template.constructorParams[index];
        if (paramType === 'uint256') {
          try {
            return ethers.parseUnits(param, 0).toString();
          } catch (e) {
            throw new Error(`Invalid uint256 value for parameter ${index + 1}`);
          }
        } else if (paramType === 'string') {
          return param;
        } else if (paramType === 'address[]') {
          return param.split(',').map(addr => addr.trim());
        } else if (paramType === 'address') {
          if (!ethers.isAddress(param)) {
            throw new Error(`Invalid address for parameter ${index + 1}`);
          }
          return param;
        }
        return param;
      });

      const estimate = await estimateGas(template.bytecode, template.abi, params);
      setGasEstimate(estimate);
    } catch (error) {
      console.error('Gas estimation failed:', error);
      alert(`Gas estimation failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsEstimating(false);
    }
  };

  const handleDeploy = async () => {
    try {
      const params = constructorParams.map((param, index) => {
        const paramType = template.constructorParams[index];
        if (paramType === 'uint256') {
          try {
            return ethers.parseUnits(param, 0).toString();
          } catch (e) {
            throw new Error(`Invalid uint256 value for parameter ${index + 1}`);
          }
        } else if (paramType === 'string') {
          return param;
        } else if (paramType === 'address[]') {
          return param.split(',').map(addr => addr.trim());
        } else if (paramType === 'address') {
          if (!ethers.isAddress(param)) {
            throw new Error(`Invalid address for parameter ${index + 1}`);
          }
          return param;
        }
        return param;
      });

      await deployContract(
        template.bytecode,
        template.abi,
        params,
        customGasLimit || undefined,
        customGasPrice || undefined
      );
    } catch (error) {
      console.error('Deployment failed:', error);
      alert(`Deployment failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const isFormValid = constructorParams.every((param, index) => {
    const paramType = template.constructorParams[index];
    if (param.trim() === '') return false;
    
    if (paramType === 'uint256') {
      try {
        ethers.parseUnits(param, 0);
        return true;
      } catch {
        return false;
      }
    }
    
    if (paramType === 'address' || paramType === 'address[]') {
      const addresses = paramType === 'address' ? [param] : param.split(',').map(addr => addr.trim());
      return addresses.every(addr => ethers.isAddress(addr));
    }
    
    return true;
  });

  const getParamPlaceholder = (paramType: string) => {
    switch (paramType) {
      case 'uint256':
        return 'e.g., 1000000';
      case 'string':
        return 'e.g., "My Token"';
      case 'address':
        return 'e.g., 0x1234...';
      case 'address[]':
        return 'e.g., 0x123..., 0x456...';
      default:
        return `Enter ${paramType} value`;
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center space-x-4 mb-8">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 p-3 rounded-xl shadow-lg transition-colors duration-300">
          <Send className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-300">Deploy Contract</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Configure and deploy your smart contract</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Constructor Parameters */}
        {template.constructorParams.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-bold text-gray-800 dark:text-white flex items-center space-x-2 transition-colors duration-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Constructor Parameters</span>
            </h4>
            <div className="grid gap-4">
              {template.constructorParams.map((paramType, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Parameter {index + 1} ({paramType})
                  </label>
                  <input
                    type="text"
                    value={constructorParams[index] || ''}
                    onChange={(e) => handleParamChange(index, e.target.value)}
                    placeholder={getParamPlaceholder(paramType)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gas Estimation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-gray-800 dark:text-white flex items-center space-x-2 transition-colors duration-300">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Gas Estimation</span>
            </h4>
            <button
              onClick={handleEstimateGas}
              disabled={!isFormValid || !signer || isEstimating}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none flex items-center space-x-2 font-medium shadow-lg border border-white/20"
            >
              {isEstimating ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  <span>Estimating...</span>
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4" />
                  <span>Estimate Gas</span>
                </>
              )}
            </button>
          </div>
          
          {gasEstimate && (
            <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-700/30 rounded-xl p-6 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20 dark:border-gray-700/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Gas Limit</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{gasEstimate.gasLimit}</span>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20 dark:border-gray-700/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Gas Price</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {ethers.formatUnits(gasEstimate.gasPrice, 'gwei')} Gwei
                  </span>
                </div>
                <div className="md:col-span-2 bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-900/30 dark:to-emerald-900/30 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-green-200/30 dark:border-green-700/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Estimated Cost</span>
                  </div>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">{gasEstimate.estimatedCost} NXS</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Custom Gas Settings */}
        <div className="space-y-4">
          <h4 className="font-bold text-gray-800 dark:text-white flex items-center space-x-2 transition-colors duration-300">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>Custom Gas Settings</span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(Optional)</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Gas Limit
              </label>
              <input
                type="text"
                value={customGasLimit}
                onChange={(e) => setCustomGasLimit(e.target.value)}
                placeholder="Auto-calculated"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Gas Price (Gwei)
              </label>
              <input
                type="text"
                value={customGasPrice}
                onChange={(e) => setCustomGasPrice(e.target.value)}
                placeholder="Auto-calculated"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-red-50/80 to-orange-50/80 dark:from-red-900/30 dark:to-orange-900/30 backdrop-blur-sm border-2 border-red-200 dark:border-red-700/30 rounded-xl p-6 animate-slide-up">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              <h4 className="font-bold text-red-800 dark:text-red-300 text-lg">Deployment Error</h4>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20 dark:border-gray-700/30">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 block mb-2">Error Details:</span>
              <span className="font-mono text-sm break-all text-red-600 dark:text-red-400">
                {error instanceof Error ? error.message : String(error)}
              </span>
            </div>
          </div>
        )}

        {/* Deploy Button */}
        <button
          onClick={handleDeploy}
          disabled={!isFormValid || !signer || isDeploying}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-600 dark:hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] disabled:transform-none border border-white/20"
        >
          {isDeploying ? (
            <>
              <Clock className="h-5 w-5 animate-spin" />
              <span>Deploying Contract...</span>
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Deploy Contract</span>
            </>
          )}
        </button>

        {/* Deployment Result */}
        {deploymentResult && (
          <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/30 dark:to-emerald-900/30 backdrop-blur-sm border-2 border-green-200 dark:border-green-700/30 rounded-xl p-6 animate-slide-up shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              <h4 className="font-bold text-green-800 dark:text-green-300 text-lg">Deployment Successful! 🎉</h4>
            </div>
            <div className="grid gap-4">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20 dark:border-gray-700/30">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 block mb-2">Contract Address:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm flex-1 break-all text-gray-900 dark:text-white">
                    {deploymentResult.contractAddress}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(deploymentResult.contractAddress)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    title="Copy address"
                  >
                    📋
                  </button>
                </div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20 dark:border-gray-700/30">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 block mb-2">Transaction Hash:</span>
                <a
                  href={`https://testnet3.explorer.nexus.xyz/tx/${deploymentResult.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-mono text-sm break-all"
                >
                  {deploymentResult.transactionHash}
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20 dark:border-gray-700/30">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 block mb-1">Gas Used:</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{deploymentResult.gasUsed}</span>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20 dark:border-gray-700/30">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 block mb-1">Total Cost:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">{deploymentResult.deploymentCost} NXS</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractDeployer;