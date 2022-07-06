import React, { useState, useContext, useEffect, PropsWithChildren } from 'react';
import { createContext } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';

interface ContextProps {}

interface MetaMaskProviderProps {
    children?: React.ReactNode;
}

const MetaMaskContext = createContext({} as ContextProps);

const MetaMaskProvider: React.FC<PropsWithChildren<MetaMaskProviderProps>> = ( { children } ) => {

    useEffect(() => {
        handleDetectEthereumProvider();
    })
    
    async function handleDetectEthereumProvider() {
        console.log('ue');
        const provider = await detectEthereumProvider();
      
        if (provider) {
            // initialize your app
            alert('Starting App!');
            handleStartApp(provider);
        } else {
            alert('Please install MetaMask!');
        }
    }

    function handleStartApp(provider: unknown) {
        // If the provider returned by detectEthereumProvider is not the same as
        // window.ethereum, something is overwriting it, perhaps another wallet.
        if (provider !== window.ethereum) {
          console.error('Do you have multiple wallets installed?');
        }
        // Access the decentralized web!
    }

    return (
        <MetaMaskContext.Provider
          value={{}}
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