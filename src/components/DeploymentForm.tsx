import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount, useWalletClient, usePublicClient } from 'wagmi'
import { parseEther, waitForTransactionReceipt } from 'viem'
import { ERC20_ABI, ERC20_BYTECODE } from '../contracts/ERC20'
import { Rocket, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

interface DeploymentFormProps {
  onDeploymentSuccess: (address: string, txHash: string, name?: string, symbol?: string) => void
}

export const DeploymentForm: React.FC<DeploymentFormProps> = ({ onDeploymentSuccess }) => {
  const { isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    totalSupply: '',
  })
  const [isDeploying, setIsDeploying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [txHash, setTxHash] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
    setIsSuccess(false)
  }

  const validateForm = () => {
    if (!formData.name.trim()) return 'Token name is required'
    if (formData.name.length > 30) return 'Token name too long (max 30 chars)'
    if (!formData.symbol.trim()) return 'Token symbol is required'
    if (formData.symbol.length > 10) return 'Token symbol too long (max 10 chars)'
    if (!formData.totalSupply || parseFloat(formData.totalSupply) <= 0) return 'Total supply must be greater than 0'
    if (parseFloat(formData.totalSupply) > 1e12) return 'Total supply too large (max 1 trillion)'
    return null
  }

  const resetForm = () => {
    setFormData({ name: '', symbol: '', totalSupply: '' })
    setIsSuccess(false)
    setTxHash('')
  }

  const deployContract = async () => {
    if (!isConnected || !walletClient || !publicClient) {
      setError('Please connect your wallet first')
      return
    }

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsDeploying(true)
    setError(null)
    setIsSuccess(false)

    try {
      // Convert total supply to wei (18 decimals)
      const totalSupplyWei = parseEther(formData.totalSupply)
      
      // Deploy the contract
      const hash = await walletClient.deployContract({
        abi: ERC20_ABI,
        bytecode: ERC20_BYTECODE as `0x${string}`,
        args: [formData.name, formData.symbol, totalSupplyWei],
      })
      
      setTxHash(hash)
      
      // Wait for transaction receipt to get contract address
      const receipt = await waitForTransactionReceipt(publicClient, { hash })
      
      if (!receipt.contractAddress) {
        throw new Error('Contract deployment failed - no contract address returned')
      }
      
      // Call success handler
      onDeploymentSuccess(receipt.contractAddress, hash, formData.name, formData.symbol)
      
      // Show success state
      setIsSuccess(true)
      
    } catch (err: any) {
      console.error('Deployment error:', err)
      let errorMessage = 'Failed to deploy contract'
      
      // Handle common errors
      if (err.message.includes('user rejected transaction')) {
        errorMessage = 'Transaction rejected by user'
      } else if (err.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for deployment'
      } else if (err.message.includes('gas')) {
        errorMessage = 'Gas estimation failed - check your balance'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-gray-700/50"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
          <Rocket className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Deploy ERC20 Token</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Token Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., My Token"
            maxLength={30}
            className="w-full px-4 py-3 rounded-xl bg-white/20 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
            disabled={isDeploying}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Token Symbol
          </label>
          <input
            type="text"
            name="symbol"
            value={formData.symbol}
            onChange={handleInputChange}
            placeholder="e.g., MTK"
            maxLength={10}
            className="w-full px-4 py-3 rounded-xl bg-white/20 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
            disabled={isDeploying}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Total Supply
          </label>
          <input
            type="number"
            name="totalSupply"
            value={formData.totalSupply}
            onChange={handleInputChange}
            placeholder="e.g., 1000000"
            min="1"
            max="1000000000000"
            step="1"
            className="w-full px-4 py-3 rounded-xl bg-white/20 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
            disabled={isDeploying}
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-red-500 bg-red-500/10 p-3 rounded-lg"
          >
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-green-500 bg-green-500/10 p-3 rounded-lg"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">Token deployed successfully!</span>
          </motion.div>
        )}

        {isSuccess ? (
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetForm}
              className="flex-1 py-4 px-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Deploy Another</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open(`https://testnet3.explorer.nexus.xyz/tx/${txHash}`, '_blank')}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>View Transaction</span>
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={deployContract}
            disabled={!isConnected || isDeploying}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isDeploying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Deploying...</span>
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                <span>Deploy Contract</span>
              </>
            )}
          </motion.button>
        )}

        {!isConnected && (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Please connect your wallet to deploy contracts
          </p>
        )}
      </div>
    </motion.div>
  )
}