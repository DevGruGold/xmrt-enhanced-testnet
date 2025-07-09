import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { WagmiConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Faucet from './pages/Faucet';
import Staking from './pages/Staking';
import './App.css';

const chains = [sepolia];
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

const metadata = {
  name: 'XMRT Enhanced Testnet',
  description: 'Enhanced XMRT testnet with working faucet and staking functionality',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({ wagmiConfig, projectId, chains });

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/faucet" element={<Faucet />} />
              <Route path="/staking" element={<Staking />} />
            </Routes>
          </main>
        </div>
      </Router>
    </WagmiConfig>
  );
}

export default App;


