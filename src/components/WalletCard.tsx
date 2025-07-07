import React from 'react';
import { Wallet, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { WalletState } from '../types/nexus';

interface WalletCardProps {
  walletState: WalletState;
  onRefresh: () => void;
  onDisconnect: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({ 
  walletState, 
  onRefresh, 
  onDisconnect 
}) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const openExplorer = () => {
    if (walletState.network && walletState.address) {
      window.open(`${walletState.network.explorerUrl}/address/${walletState.address}`, '_blank');
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    return num.toFixed(4);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto transform transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Connected Wallet</h3>
            <p className="text-sm text-gray-500">{walletState.network?.name}</p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Address</span>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(walletState.address || '')}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title="Copy address"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={openExplorer}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title="View on explorer"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-lg font-mono text-gray-900">
            {formatAddress(walletState.address || '')}
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Balance</span>
            <span className="text-sm text-gray-500">{walletState.network?.symbol}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatBalance(walletState.balance || '0')}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Network</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600">Connected</span>
            </div>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {walletState.network?.name}
          </p>
        </div>
      </div>

      <button
        onClick={onDisconnect}
        className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
      >
        Disconnect Wallet
      </button>
    </div>
  );
};