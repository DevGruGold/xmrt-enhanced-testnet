import React, { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { ethers } from 'ethers';

const FAUCET_ABI = [
  {
    "inputs": [],
    "name": "claimTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "canClaim",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "", "type": "address"}],
    "name": "lastClaimed",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const Faucet = () => {
  const { address, isConnected } = useAccount();
  const [timeLeft, setTimeLeft] = useState(0);
  
  const { data: canClaim } = useContractRead({
    address: import.meta.env.VITE_FAUCET_CONTRACT_ADDRESS,
    abi: FAUCET_ABI,
    functionName: 'canClaim',
    args: [address],
    enabled: !!address,
  });
  
  const { data: lastClaimed } = useContractRead({
    address: import.meta.env.VITE_FAUCET_CONTRACT_ADDRESS,
    abi: FAUCET_ABI,
    functionName: 'lastClaimed',
    args: [address],
    enabled: !!address,
  });
  
  const { config } = usePrepareContractWrite({
    address: import.meta.env.VITE_FAUCET_CONTRACT_ADDRESS,
    abi: FAUCET_ABI,
    functionName: 'claimTokens',
    enabled: !!address && canClaim,
  });
  
  const { write, isLoading, isSuccess } = useContractWrite(config);
  
  useEffect(() => {
    if (lastClaimed && !canClaim) {
      const nextClaimTime = Number(lastClaimed) + 24 * 60 * 60;
      const now = Math.floor(Date.now() / 1000);
      setTimeLeft(Math.max(0, nextClaimTime - now));
    }
  }, [lastClaimed, canClaim]);
  
  useEffect(() => {
    if (!canClaim && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, canClaim]);
  
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (!isConnected) {
    return (
      <div className="text-center py-16">
        <h2 className="text-4xl font-bold text-white mb-8">XMRT Token Faucet</h2>
        <p className="text-xl text-gray-300 mb-8">
          Connect your wallet to claim free XMRT tokens
        </p>
        <div className="card max-w-md mx-auto">
          <div className="text-6xl mb-4">🔌</div>
          <p className="text-gray-400">Please connect your wallet to continue</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="text-center py-16">
      <h2 className="text-4xl font-bold text-white mb-8">XMRT Token Faucet</h2>
      <p className="text-xl text-gray-300 mb-8">
        Claim 1000 XMRT tokens every 24 hours
      </p>
      
      <div className="card max-w-md mx-auto">
        <div className="text-6xl mb-6">💧</div>
        
        {isSuccess && (
          <div className="mb-4 p-4 bg-green-800 border border-green-600 rounded-lg">
            <p className="text-green-200">✅ Successfully claimed 1000 XMRT tokens!</p>
          </div>
        )}
        
        {canClaim ? (
          <div>
            <p className="text-green-400 mb-4">You can claim tokens now!</p>
            <button
              onClick={() => write?.()}
              disabled={isLoading || !write}
              className="btn-primary w-full"
            >
              {isLoading ? 'Claiming...' : 'Claim 1000 XMRT'}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-orange-400 mb-4">Next claim available in:</p>
            <div className="text-3xl font-mono text-white mb-4">
              {formatTime(timeLeft)}
            </div>
            <button disabled className="btn-primary w-full opacity-50 cursor-not-allowed">
              Claim 1000 XMRT
            </button>
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-400">
          <p>• 1000 XMRT tokens per claim</p>
          <p>• 24-hour cooldown between claims</p>
          <p>• Free testnet tokens for development</p>
        </div>
      </div>
    </div>
  );
};

export default Faucet;
