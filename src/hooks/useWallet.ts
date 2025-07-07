import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { WalletState } from '../types';
import { NEXUS_TESTNET } from '../config/nexus';

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: '0',
    chainId: null
  });
  
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

  // Safe ethereum provider detection that avoids conflicts
  const getEthereumProvider = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    try {
      // Use a more defensive approach to avoid property conflicts
      const ethereum = (window as any).ethereum;
      
      if (!ethereum) return null;
      
      // If multiple providers exist, prefer MetaMask
      if (ethereum.providers && Array.isArray(ethereum.providers)) {
        const metaMask = ethereum.providers.find((p: any) => p.isMetaMask);
        return metaMask || ethereum.providers[0];
      }
      
      // Return the main provider
      return ethereum;
    } catch (error) {
      console.warn('Error accessing ethereum provider:', error);
      return null;
    }
  }, []);

  // Safe provider request wrapper
  const safeRequest = async (method: string, params?: any[]) => {
    const ethereum = getEthereumProvider();
    if (!ethereum || typeof ethereum.request !== 'function') {
      throw new Error('No valid Web3 provider found');
    }
    
    try {
      return await ethereum.request({ method, params });
    } catch (error: any) {
      console.error(`Provider request failed for ${method}:`, error);
      throw error;
    }
  };

  const connectWallet = async () => {
    try {
      // Wait for wallet extensions to fully load
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const ethereum = getEthereumProvider();
      if (!ethereum) {
        throw new Error('No Web3 wallet detected. Please install MetaMask or another Web3 wallet.');
      }

      // Request account access
      const accounts = await safeRequest('eth_requestAccounts');

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your wallet.');
      }

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      
      // Check if we're on the correct network
      if (network.chainId.toString() !== NEXUS_TESTNET.chainId) {
        try {
          await switchToNexusTestnet();
          // Refresh network info after switch
          const newNetwork = await provider.getNetwork();
          if (newNetwork.chainId.toString() !== NEXUS_TESTNET.chainId) {
            console.warn('Network switch may not have completed');
          }
        } catch (switchError) {
          console.warn('Failed to switch network:', switchError);
        }
      }

      const balance = await provider.getBalance(accounts[0]);
      
      setWalletState({
        isConnected: true,
        address: accounts[0],
        balance: ethers.formatEther(balance),
        chainId: network.chainId.toString()
      });
      
      setProvider(provider);
      setSigner(signer);
      
      return { success: true, address: accounts[0] };
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      
      // Handle specific error cases
      if (error.code === 4001) {
        throw new Error('Connection rejected by user');
      } else if (error.code === -32002) {
        throw new Error('Connection request already pending');
      } else {
        throw new Error(error.message || 'Failed to connect wallet');
      }
    }
  };

  const switchToNexusTestnet = async () => {
    try {
      await safeRequest('wallet_switchEthereumChain', [
        { chainId: `0x${parseInt(NEXUS_TESTNET.chainId).toString(16)}` }
      ]);
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await safeRequest('wallet_addEthereumChain', [{
            chainId: `0x${parseInt(NEXUS_TESTNET.chainId).toString(16)}`,
            chainName: NEXUS_TESTNET.name,
            rpcUrls: [NEXUS_TESTNET.rpcUrl],
            blockExplorerUrls: [NEXUS_TESTNET.explorerUrl],
            nativeCurrency: {
              name: NEXUS_TESTNET.name,
              symbol: NEXUS_TESTNET.symbol,
              decimals: 18
            }
          }]);
        } catch (addError) {
          console.error('Failed to add network:', addError);
          throw new Error('Failed to add Nexus Testnet to wallet');
        }
      } else {
        console.error('Failed to switch network:', switchError);
        throw new Error('Failed to switch to Nexus Testnet');
      }
    }
  };

  const disconnect = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: null,
      balance: '0',
      chainId: null
    });
    setProvider(null);
    setSigner(null);
  }, []);

  const updateBalance = useCallback(async () => {
    if (provider && walletState.address) {
      try {
        const balance = await provider.getBalance(walletState.address);
        setWalletState(prev => ({
          ...prev,
          balance: ethers.formatEther(balance)
        }));
      } catch (error) {
        console.error('Failed to update balance:', error);
      }
    }
  }, [provider, walletState.address]);

  // Set up event listeners with better error handling
  useEffect(() => {
    const ethereum = getEthereumProvider();
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      try {
        if (accounts.length === 0) {
          disconnect();
        } else if (accounts[0] !== walletState.address) {
          connectWallet().catch(console.error);
        }
      } catch (error) {
        console.error('Error handling accounts change:', error);
      }
    };

    const handleChainChanged = (chainId: string) => {
      try {
        const decimalChainId = typeof chainId === 'string' && chainId.startsWith('0x') 
          ? parseInt(chainId, 16).toString() 
          : chainId;
        
        setWalletState(prev => ({
          ...prev,
          chainId: decimalChainId
        }));
        
        updateBalance();
      } catch (error) {
        console.error('Error handling chain change:', error);
      }
    };

    const handleDisconnect = () => {
      try {
        disconnect();
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    };

    // Add event listeners safely
    try {
      if (ethereum.on && typeof ethereum.on === 'function') {
        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('chainChanged', handleChainChanged);
        ethereum.on('disconnect', handleDisconnect);
      }
    } catch (error) {
      console.warn('Failed to set up wallet event listeners:', error);
    }

    // Cleanup function
    return () => {
      try {
        if (ethereum.removeListener && typeof ethereum.removeListener === 'function') {
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('disconnect', handleDisconnect);
        } else if (ethereum.off && typeof ethereum.off === 'function') {
          ethereum.off('accountsChanged', handleAccountsChanged);
          ethereum.off('chainChanged', handleChainChanged);
          ethereum.off('disconnect', handleDisconnect);
        }
      } catch (error) {
        console.warn('Failed to remove wallet event listeners:', error);
      }
    };
  }, [walletState.address, disconnect, updateBalance]);

  // Auto-connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for extensions
        
        const ethereum = getEthereumProvider();
        if (!ethereum) return;

        const accounts = await safeRequest('eth_accounts');
        if (accounts && accounts.length > 0) {
          await connectWallet();
        }
      } catch (error) {
        console.warn('Auto-connect failed:', error);
      }
    };

    autoConnect();
  }, []);

  return {
    walletState,
    provider,
    signer,
    connectWallet,
    disconnect,
    switchToNexusTestnet,
    updateBalance
  };
};

// Global type declarations
declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}