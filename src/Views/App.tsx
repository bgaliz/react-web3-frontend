import './App.css';
import { Home } from './Home';
import { MetaMaskProvider } from '../Hooks/metamask-provider';

function App() {
  return (
    <MetaMaskProvider>
      <Home />
    </MetaMaskProvider>
  );
}

export default App;
