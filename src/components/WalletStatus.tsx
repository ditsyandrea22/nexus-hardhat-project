import React from 'react'
import { useAccount, useBalance, useDisconnect } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react'

export const WalletStatus: React.FC = () => {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const { disconnect } = useDisconnect()

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  const openExplorer = () => {
    if (address) {
      window.open(`https://testnet3.explorer.nexus.xyz/address/${address}`, '_blank')
    }
  }

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center"
      >
        <ConnectButton />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">Wallet Connected</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Nexus Testnet</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => disconnect()}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Address:</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-mono text-gray-800 dark:text-white">
              {shortenAddress(address!)}
            </span>
            <button
              onClick={copyAddress}
              className="p-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={openExplorer}
              className="p-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Balance:</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-white">
            {balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000 NXS'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}