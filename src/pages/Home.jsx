import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-6xl font-bold mb-8 text-gradient">
        XMRT Enhanced Testnet
      </h1>
      <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
        Experience the future of decentralized finance with our enhanced testnet. 
        Claim tokens from the faucet and start earning rewards through staking.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        <div className="card">
          <div className="text-4xl mb-4">💧</div>
          <h3 className="text-2xl font-bold text-blue-400 mb-4">Token Faucet</h3>
          <p className="text-gray-300 mb-6">
            Claim 1000 XMRT tokens every 24 hours. Perfect for testing and getting started.
          </p>
          <Link to="/faucet" className="btn-primary">
            Access Faucet
          </Link>
        </div>
        
        <div className="card">
          <div className="text-4xl mb-4">💎</div>
          <h3 className="text-2xl font-bold text-purple-400 mb-4">Token Staking</h3>
          <p className="text-gray-300 mb-6">
            Stake your XMRT tokens and earn 12% APY rewards. Flexible staking available.
          </p>
          <Link to="/staking" className="btn-primary">
            Start Staking
          </Link>
        </div>
      </div>
      
      <div className="card max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-white mb-4">Contract Addresses</h3>
        <div className="space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-gray-400">XMRT Token:</span>
            <span className="text-blue-400 font-mono text-sm">{import.meta.env.VITE_XMRT_CONTRACT_ADDRESS}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Faucet:</span>
            <span className="text-green-400 font-mono text-sm">{import.meta.env.VITE_FAUCET_CONTRACT_ADDRESS}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Staking:</span>
            <span className="text-purple-400 font-mono text-sm">{import.meta.env.VITE_STAKING_CONTRACT_ADDRESS}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
