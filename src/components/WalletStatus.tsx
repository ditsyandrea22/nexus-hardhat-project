import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface WalletStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  address?: string | null;
}

export const WalletStatus: React.FC<WalletStatusProps> = ({
  isConnected,
  isConnecting,
  error,
  address
}) => {
  if (isConnecting) {
    return (
      <div className="flex items-center gap-2 text-blue-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm font-medium">Connecting...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <XCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Connection Failed</span>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-gray-500">
      <AlertTriangle className="w-4 h-4" />
      <span className="text-sm font-medium">Not Connected</span>
    </div>
  );
};