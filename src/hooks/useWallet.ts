import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { WalletState } from '../types/nexus';
import { NEXUS_TESTNET } from '../config/nexus';
import { detectWalletProvider, waitForWalletProvider, WalletProvider } from '../utils/walletDetection';

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: null,
    network: null
  });
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletProvider, setWalletProvider] = useState<WalletProvider | null>(null);

  const initializeWalletProvider = useCallback(async () => {
    try {
      const provider = await waitForWalletProvider();
      if (provider) {
        setWalletProvider(provider);
        return provider;
      }
    } catch (err) {
      console.error('Error initializing wallet provider:', err);
    }
    return null;
  }, []);

  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      const provider = walletProvider || await initializeWalletProvider();
      if (!provider) return;

      const ethProvider = new ethers.BrowserProvider(provider);
      const accounts = await ethProvider.listAccounts();
      
      if (accounts.length > 0) {
        const signer = await ethProvider.getSigner();
        const address = await signer.getAddress();
        const balance = await ethProvider.getBalance(address);
        
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
  }, [walletProvider, initializeWalletProvider]);

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const provider = walletProvider || await initializeWalletProvider();
      
      if (!provider) {
        throw new Error('No Ethereum wallet found. Please install MetaMask or another compatible wallet.');
      }

      // Request account access
      const accounts = await provider.request({ 
        method: 'eth_requestAccounts' 
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your wallet.');
      }
      
      // Switch to Nexus testnet
      await switchToNexusNetwork(provider);
      
      // Get account info
      const ethProvider = new ethers.BrowserProvider(provider);
      const signer = await ethProvider.getSigner();
      const address = await signer.getAddress();
      const balance = await ethProvider.getBalance(address);
      
      setWalletState({
        isConnected: true,
        address,
        balance: ethers.formatEther(balance),
        network: NEXUS_TESTNET
      });

      setWalletProvider(provider);
      
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      
      let errorMessage = 'Failed to connect wallet';
      
      if (err.code === 4001) {
        errorMessage = 'Connection request was rejected by user';
      } else if (err.code === -32002) {
        errorMessage = 'Connection request is already pending. Please check your wallet.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  }, [walletProvider, initializeWalletProvider]);

  const switchToNexusNetwork = useCallback(async (provider?: WalletProvider) => {
    const walletProvider = provider || walletProvider;
    if (!walletProvider) throw new Error('No wallet provider available');

    const chainIdHex = `0x${parseInt(NEXUS_TESTNET.chainId).toString(16)}`;

    try {
      await walletProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to the wallet
      if (switchError.code === 4902) {
        try {
          await walletProvider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainIdHex,
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
  }, [walletProvider]);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: null,
      balance: null,
      network: null
    });
    setError(null);
    setWalletProvider(null);
  }, []);

  const refreshBalance = useCallback(async () => {
    if (walletState.isConnected && walletState.address && walletProvider) {
      try {
        const ethProvider = new ethers.BrowserProvider(walletProvider);
        const balance = await ethProvider.getBalance(walletState.address);
        
        setWalletState(prev => ({
          ...prev,
          balance: ethers.formatEther(balance)
        }));
      } catch (err) {
        console.error('Error refreshing balance:', err);
      }
    }
  }, [walletState.isConnected, walletState.address, walletProvider]);

  // Initialize wallet provider on mount
  useEffect(() => {
    const init = async () => {
      await initializeWalletProvider();
    };
    
    // Wait for page to load
    if (document.readyState === 'complete') {
      init();
    } else {
      window.addEventListener('load', init);
      return () => window.removeEventListener('load', init);
    }
  }, [initializeWalletProvider]);

  // Check connection when provider is available
  useEffect(() => {
    if (walletProvider) {
      checkIfWalletIsConnected();
    }
  }, [walletProvider, checkIfWalletIsConnected]);

  // Set up event listeners
  useEffect(() => {
    if (!walletProvider) return;

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

    const handleDisconnect = () => {
      disconnectWallet();
    };

    // Add event listeners
    walletProvider.on('accountsChanged', handleAccountsChanged);
    walletProvider.on('chainChanged', handleChainChanged);
    walletProvider.on('disconnect', handleDisconnect);

    return () => {
      // Remove event listeners
      if (walletProvider.removeListener) {
        walletProvider.removeListener('accountsChanged', handleAccountsChanged);
        walletProvider.removeListener('chainChanged', handleChainChanged);
        walletProvider.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [walletProvider, checkIfWalletIsConnected, disconnectWallet]);

  return {
    walletState,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    switchToNexusNetwork: () => switchToNexusNetwork()
  };
};