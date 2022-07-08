import './styles.css';
import { useMetaMaskContext } from '../../Hooks/metamask-provider';

export const Home = () => {
    const { currentProvider } = useMetaMaskContext();

    return(
        <div>
            <h1>MetaMask</h1>
            {
                currentProvider && currentProvider.isConnected() ? 'true': 'false'
            }
            <button>Entrar</button>
        </div>
    )
}