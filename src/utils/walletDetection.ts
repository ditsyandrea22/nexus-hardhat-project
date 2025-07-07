export interface WalletProvider {
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  isRabby?: boolean;
  isZerion?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
  removeAllListeners?: (event: string) => void;
}

export interface EthereumProvider extends WalletProvider {
  providers?: WalletProvider[];
  selectedProvider?: WalletProvider;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export const detectWalletProvider = (): WalletProvider | null => {
  if (typeof window === 'undefined') return null;

  // Wait for page to fully load
  if (document.readyState !== 'complete') {
    return null;
  }

  const ethereum = window.ethereum;
  if (!ethereum) return null;

  // Handle multiple providers (like when multiple wallet extensions are installed)
  if (ethereum.providers && Array.isArray(ethereum.providers)) {
    // Prefer MetaMask if available
    const metaMask = ethereum.providers.find(provider => provider.isMetaMask);
    if (metaMask) return metaMask;
    
    // Fallback to first available provider
    return ethereum.providers[0];
  }

  // Single provider case
  return ethereum;
};

export const waitForWalletProvider = (timeout = 3000): Promise<WalletProvider | null> => {
  return new Promise((resolve) => {
    const checkProvider = () => {
      const provider = detectWalletProvider();
      if (provider) {
        resolve(provider);
        return;
      }
      
      // If document is still loading, wait a bit more
      if (document.readyState !== 'complete') {
        setTimeout(checkProvider, 100);
        return;
      }
      
      resolve(null);
    };

    // Start checking immediately
    checkProvider();

    // Timeout fallback
    setTimeout(() => resolve(null), timeout);
  });
};

export const getWalletName = (provider: WalletProvider): string => {
  if (provider.isMetaMask) return 'MetaMask';
  if (provider.isCoinbaseWallet) return 'Coinbase Wallet';
  if (provider.isRabby) return 'Rabby';
  if (provider.isZerion) return 'Zerion';
  return 'Unknown Wallet';
};