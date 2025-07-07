import React from 'react';
import { Wallet, Loader2, AlertCircle } from 'lucide-react';

interface ConnectWalletButtonProps {
  onConnect: () => void;
  isConnecting: boolean;
  error: string | null;
}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
  onConnect,
  isConnecting,
  error
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={onConnect}
        disabled={isConnecting}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-md flex items-center justify-center gap-3"
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-700 font-medium">Connection Error</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-3">
          Supported wallets:
        </p>
        <div className="flex justify-center gap-4 text-xs text-gray-500">
          <span>MetaMask</span>
          <span>•</span>
          <span>Coinbase Wallet</span>
          <span>•</span>
          <span>WalletConnect</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-xs text-blue-700 text-center">
          <strong>Note:</strong> Make sure you have a compatible wallet installed and unlocked before connecting.
        </p>
      </div>
    </div>
  );
};