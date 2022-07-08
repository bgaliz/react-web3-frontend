import React, { useState, useContext, useEffect, PropsWithChildren } from 'react';
import { createContext } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';

interface ContextProps {
  currentProvider: any
}

interface MetaMaskProviderProps {
    children?: React.ReactNode;
}

const MetaMaskContext = createContext({} as ContextProps);

const MetaMaskProvider: React.FC<PropsWithChildren<MetaMaskProviderProps>> = ( { children } ) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentChainID, setCurrentChainID] = useState('');
  const [currentProvider, setCurrentProvider] = useState<any>(null);

    useEffect(() => {
      if(!currentProvider){
        handleGetNewCurrentProvider();
      } else {
        if(!currentChainID) {
          handleGetNewChainID();
        }
        handleStartApp();
      }
    },[currentProvider, currentAccount])

    async function handleGetNewCurrentProvider() {
        const provider = await detectEthereumProvider({mustBeMetaMask: true});

        if(provider){
          setCurrentProvider(provider);
        } else {
          console.log('Please install MetaMask!');
        }
    }

    async function handleStartApp() {
      // If the provider returned by detectEthereumProvider is not the same as
      // window.ethereum, something is overwriting it, perhaps another wallet.
      if (currentProvider !== window.ethereum) {
        console.error('Do you have multiple wallets installed?');
      }
      
      await handleConnectAccount();
      // Access the decentralized web!
    }

    async function handleGetNewChainID () {
      const chainId = await currentProvider.request({ method: 'eth_chainId' });
      handleChainChanged(chainId);
      currentProvider.on('chainChanged', handleChainChanged);
    }

    async function handleChainChanged(_chainId: string) {
      // We recommend reloading the page, unless you must do otherwise
        setCurrentChainID(_chainId)
    }

    async function handleConnectAccount(){
      try {
        await currentProvider
          .request({ method: 'eth_requestAccounts', params: [] })
          .then(handleAccountsChanged)
          .catch((err: any) => {
            // Some unexpected error.
            // For backwards compatibility reasons, if no accounts are available,
            // eth_accounts will return an empty array.
            console.error('batata',err);
          });

        // Note that this event is emitted on page load.
        // If the array of accounts is non-empty, you're already
        // connected.
        await currentProvider.on('accountsChanged', handleAccountsChanged);
      }catch (error) {
        throw Error('Deu ruim')
      }
    }

    // For now, 'eth_accounts' will continue to always return an array
    function handleAccountsChanged(accounts: any) {
      console.log(accounts)
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log('Please connect to MetaMask.');
      } else if (accounts[0] !== currentAccount) {
        setCurrentAccount(accounts[0]);
        // Do any other work!
      }
    }

    return (
        <MetaMaskContext.Provider
          value={{
            currentProvider
          }}
        >
          {children}
        </MetaMaskContext.Provider>
      )
}


function useMetaMaskContext() {
  const context = useContext(MetaMaskContext)

  if (!context) {
    throw new Error("There's a mistake on using Context")
  }

  return context
}

export { MetaMaskProvider, useMetaMaskContext }