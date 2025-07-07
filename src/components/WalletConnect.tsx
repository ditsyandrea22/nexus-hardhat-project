import React, { useState } from 'react';
import { Wallet, Power, AlertCircle, CheckCircle, Loader, Zap, Shield } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { NEXUS_TESTNET } from '../config/nexus';

const WalletConnect: React.FC = () => {
  const { walletState, connectWallet, disconnect } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      await connectWallet();
    } catch (error: any) {
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setError(null);
  };

  const isCorrectNetwork = walletState.chainId === NEXUS_TESTNET.chainId;

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 p-3 rounded-xl shadow-lg transition-colors duration-300">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            {walletState.isConnected && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white dark:border-gray-900"></div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-300">Wallet Connection</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
              {walletState.isConnected ? 'Connected and ready' : 'Connect to get started'}
            </p>
          </div>
        </div>
        {walletState.isConnected && (
          <button
            onClick={handleDisconnect}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <Power className="h-4 w-4" />
            <span className="font-medium">Disconnect</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-700/30 rounded-xl animate-shake">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
          </div>
        </div>
      )}

      {!walletState.isConnected ? (
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/50 dark:to-purple-900/50 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse-slow border border-blue-200/30 dark:border-blue-700/30">
              <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-300">Connect your wallet to deploy smart contracts</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
              <Shield className="h-4 w-4" />
              <span>Secure connection with multiple wallet support</span>
            </div>
          </div>
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 border border-white/20"
          >
            {isConnecting ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Wallet className="h-5 w-5" />
                <span>Connect Wallet</span>
              </>
            )}
          </button>
          
          {/* Wallet Support Info */}
          <div className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-gray-800/50 dark:to-blue-900/30 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30 dark:border-gray-700/30">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Supported Wallets:</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-200/30 dark:border-gray-700/30">MetaMask</span>
              <span className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-200/30 dark:border-gray-700/30">Coinbase Wallet</span>
              <span className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-200/30 dark:border-gray-700/30">Trust Wallet</span>
              <span className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-200/30 dark:border-gray-700/30">Other Web3</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Connection Status */}
          <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/30 dark:to-emerald-900/30 backdrop-blur-sm border border-green-200 dark:border-green-700/30 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-semibold text-green-800 dark:text-green-300">Wallet Connected</p>
                <p className="text-sm text-green-600 dark:text-green-400">Ready to deploy contracts</p>
              </div>
            </div>
          </div>

          {/* Wallet Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-gray-800/50 dark:to-blue-900/30 backdrop-blur-sm rounded-xl hover:shadow-md transition-all duration-300 border border-gray-200/30 dark:border-gray-700/30">
              <span className="text-gray-600 dark:text-gray-300 font-medium">Address:</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm border border-gray-200/30 dark:border-gray-700/30">
                  {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(walletState.address || '')}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  title="Copy address"
                >
                  📋
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/30 dark:to-pink-900/30 backdrop-blur-sm rounded-xl hover:shadow-md transition-all duration-300 border border-purple-200/30 dark:border-purple-700/30">
              <span className="text-gray-600 dark:text-gray-300 font-medium">Balance:</span>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-purple-600 dark:text-purple-400">
                  {parseFloat(walletState.balance).toFixed(4)}
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-medium">NXS</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 backdrop-blur-sm rounded-xl hover:shadow-md transition-all duration-300 border border-blue-200/30 dark:border-blue-700/30">
              <span className="text-gray-600 dark:text-gray-300 font-medium">Network:</span>
              <div className="flex items-center space-x-3">
                {isCorrectNetwork ? (
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold">Nexus Testnet</span>
                    <CheckCircle className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-semibold">Wrong Network</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {!isCorrectNetwork && (
            <div className="bg-gradient-to-r from-red-50/80 to-orange-50/80 dark:from-red-900/30 dark:to-orange-900/30 backdrop-blur-sm border border-red-200 dark:border-red-700/30 rounded-xl p-4 animate-pulse-subtle">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-red-700 dark:text-red-400 font-semibold mb-1">Network Switch Required</p>
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    Please switch to Nexus Testnet (Chain ID: 3940) to deploy contracts
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnect;