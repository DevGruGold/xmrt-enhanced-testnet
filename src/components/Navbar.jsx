import React from 'react';
import { Link } from 'react-router-dom';
import { Web3Button } from '@web3modal/wagmi/react';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-gradient">
              XMRT Testnet
            </Link>
            <div className="flex space-x-4">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/faucet" className="text-gray-300 hover:text-white transition-colors">
                Faucet
              </Link>
              <Link to="/staking" className="text-gray-300 hover:text-white transition-colors">
                Staking
              </Link>
            </div>
          </div>
          <Web3Button />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


