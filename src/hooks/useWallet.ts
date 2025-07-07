import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { WalletState } from '../types/nexus';
import { NEXUS_TESTNET } from '../config/nexus';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: null,
    network: null
  });
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the preferred ethereum provider
  const getEthereumProvider = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    // Check for MetaMask specifically
    if (window.ethereum?.isMetaMask) {
      return window.ethereum;
    }
    
    // Check for multiple providers
    if (window.ethereum?.providers?.length) {
      // Find MetaMask in the providers array
      const metaMaskProvider = window.ethereum.providers.find((provider: any) => provider.isMetaMask);
      if (metaMaskProvider) return metaMaskProvider;
      
      // Fallback to first provider
      return window.ethereum.providers[0];
    }
    
    // Fallback to window.ethereum
    return window.ethereum;
  }, []);

  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      const ethereum = getEthereumProvider();
      if (!ethereum) return;

      const provider = new ethers.BrowserProvider(ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        
        setWalletState({
          isConnected: true,
          address,
          balance: ethers.formatEther(balance),
          network: NEXUS_TESTNET
        });
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
    }
  }, [getEthereumProvider]);

  const connectWallet = useCallback(async () => {
    const ethereum = getEthereumProvider();
    
    if (!ethereum) {
      setError('No Ethereum wallet found. Please install MetaMask or another compatible wallet.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      await ethereum.request({ method: 'eth_requestAccounts' });
      
      // Switch to Nexus testnet
      await switchToNexusNetwork();
      
      // Get account info
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      
      setWalletState({
        isConnected: true,
        address,
        balance: ethers.formatEther(balance),
        network: NEXUS_TESTNET
      });
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [getEthereumProvider]);

  const switchToNexusNetwork = useCallback(async () => {
    const ethereum = getEthereumProvider();
    if (!ethereum) throw new Error('No Ethereum provider found');

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${parseInt(NEXUS_TESTNET.chainId).toString(16)}` }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${parseInt(NEXUS_TESTNET.chainId).toString(16)}`,
                chainName: NEXUS_TESTNET.name,
                rpcUrls: [NEXUS_TESTNET.rpcUrl],
                blockExplorerUrls: [NEXUS_TESTNET.explorerUrl],
                nativeCurrency: {
                  name: NEXUS_TESTNET.symbol,
                  symbol: NEXUS_TESTNET.symbol,
                  decimals: 18,
                },
              },
            ],
          });
        } catch (addError) {
          throw new Error('Failed to add Nexus network to wallet');
        }
      } else {
        throw switchError;
      }
    }
  }, [getEthereumProvider]);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: null,
      balance: null,
      network: null
    });
    setError(null);
  }, []);

  const refreshBalance = useCallback(async () => {
    if (walletState.isConnected && walletState.address) {
      try {
        const ethereum = getEthereumProvider();
        if (!ethereum) return;

        const provider = new ethers.BrowserProvider(ethereum);
        const balance = await provider.getBalance(walletState.address);
        
        setWalletState(prev => ({
          ...prev,
          balance: ethers.formatEther(balance)
        }));
      } catch (err) {
        console.error('Error refreshing balance:', err);
      }
    }
  }, [walletState.isConnected, walletState.address, getEthereumProvider]);

  useEffect(() => {
    // Wait for page to load before checking wallet
    const timer = setTimeout(() => {
      checkIfWalletIsConnected();
    }, 1000);

    return () => clearTimeout(timer);
  }, [checkIfWalletIsConnected]);

  useEffect(() => {
    const ethereum = getEthereumProvider();
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        checkIfWalletIsConnected();
      }
    };

    const handleChainChanged = () => {
      checkIfWalletIsConnected();
    };

    // Add event listeners
    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('chainChanged', handleChainChanged);

    return () => {
      // Remove event listeners
      if (ethereum.removeListener) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [checkIfWalletIsConnected, disconnectWallet, getEthereumProvider]);

  return {
    walletState,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    switchToNexusNetwork
  };
};