import React from 'react';
import { Wallet, AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface TransactionApprovalProps {
  isVisible: boolean;
  transactionType: string;
  estimatedGas: string;
  gasPrice: string;
  totalCost: string;
  onApprove: () => void;
  onReject: () => void;
  isProcessing: boolean;
}

export const TransactionApproval: React.FC<TransactionApprovalProps> = ({
  isVisible,
  transactionType,
  estimatedGas,
  gasPrice,
  totalCost,
  onApprove,
  onReject,
  isProcessing
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl text-white">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Transaction Approval</h3>
            <p className="text-sm text-gray-500">Review and approve transaction</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Transaction Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium">{transactionType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Gas:</span>
              <span className="font-medium">{estimatedGas}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gas Price:</span>
              <span className="font-medium">{gasPrice} Gwei</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600 font-medium">Total Cost:</span>
              <span className="font-bold text-gray-900">{totalCost} NXS</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-800">
              Please review the transaction details carefully before approving.
            </p>
          </div>
        </div>

        {isProcessing ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-600 animate-pulse" />
              <div>
                <p className="font-medium text-yellow-900">Processing Transaction</p>
                <p className="text-sm text-yellow-700">Please wait while the transaction is being processed...</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={onReject}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Reject
            </button>
            <button
              onClick={onApprove}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
};