import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Modal } from '@web3modal/react';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Faucet from './pages/Faucet';
import Staking from './pages/Staking';
import './App.css';

const chains = [sepolia];
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

function App() {
  return (
    <>
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
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}

export default App;
