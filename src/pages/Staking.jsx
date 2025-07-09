import React, { useState } from 'react';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { ethers } from 'ethers';

const STAKING_ABI = [
  {
    "inputs": [{"name": "amount", "type": "uint256"}],
    "name": "stake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "amount", "type": "uint256"}],
    "name": "unstake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "getStakeInfo",
    "outputs": [
      {"name": "amount", "type": "uint256"},
      {"name": "timestamp", "type": "uint256"},
      {"name": "pendingRewards", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const ERC20_ABI = [
  {
    "inputs": [{"name": "spender", "type": "address"}, {"name": "amount", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const Staking = () => {
  const { address, isConnected } = useAccount();
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [showApprove, setShowApprove] = useState(false);
  
  const { data: stakeInfo } = useContractRead({
    address: import.meta.env.VITE_STAKING_CONTRACT_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'getStakeInfo',
    args: [address],
    enabled: !!address,
  });
  
  const { data: tokenBalance } = useContractRead({
    address: import.meta.env.VITE_XMRT_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
  });
  
  const { config: approveConfig } = usePrepareContractWrite({
    address: import.meta.env.VITE_XMRT_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [import.meta.env.VITE_STAKING_CONTRACT_ADDRESS, ethers.utils.parseEther(stakeAmount || '0')],
    enabled: !!address && !!stakeAmount,
  });
  
  const { config: stakeConfig } = usePrepareContractWrite({
    address: import.meta.env.VITE_STAKING_CONTRACT_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'stake',
    args: [ethers.utils.parseEther(stakeAmount || '0')],
    enabled: !!address && !!stakeAmount,
  });
  
  const { config: unstakeConfig } = usePrepareContractWrite({
    address: import.meta.env.VITE_STAKING_CONTRACT_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'unstake',
    args: [ethers.utils.parseEther(unstakeAmount || '0')],
    enabled: !!address && !!unstakeAmount,
  });
  
  const { config: claimConfig } = usePrepareContractWrite({
    address: import.meta.env.VITE_STAKING_CONTRACT_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'claimRewards',
    enabled: !!address,
  });
  
  const { write: approve, isLoading: isApproving } = useContractWrite(approveConfig);
  const { write: stake, isLoading: isStaking } = useContractWrite(stakeConfig);
  const { write: unstake, isLoading: isUnstaking } = useContractWrite(unstakeConfig);
  const { write: claimRewards, isLoading: isClaiming } = useContractWrite(claimConfig);
  
  const stakedAmount = stakeInfo ? ethers.utils.formatEther(stakeInfo[0] || 0) : '0';
  const pendingRewards = stakeInfo ? ethers.utils.formatEther(stakeInfo[2] || 0) : '0';
  const balance = tokenBalance ? ethers.utils.formatEther(tokenBalance) : '0';
  
  const handleStake = () => {
    if (!showApprove) {
      setShowApprove(true);
    } else {
      stake?.();
      setShowApprove(false);
      setStakeAmount('');
    }
  };
  
  const handleApprove = () => {
    approve?.();
    setShowApprove(false);
  };
  
  if (!isConnected) {
    return (
      <div className="text-center py-16">
        <h2 className="text-4xl font-bold text-white mb-8">XMRT Token Staking</h2>
        <p className="text-xl text-gray-300 mb-8">
          Connect your wallet to start staking
        </p>
        <div className="card max-w-md mx-auto">
          <div className="text-6xl mb-4">🔌</div>
          <p className="text-gray-400">Please connect your wallet to continue</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">XMRT Token Staking</h2>
        <p className="text-xl text-gray-300">
          Stake your XMRT tokens and earn 12% APY rewards
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Staking Form */}
        <div className="card">
          <h3 className="text-2xl font-bold text-white mb-6">Stake Tokens</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount to Stake
              </label>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              />
              <p className="text-sm text-gray-400 mt-1">
                Available: {parseFloat(balance).toFixed(4)} XMRT
              </p>
            </div>
            
            {showApprove ? (
              <button
                onClick={handleApprove}
                disabled={isApproving || !approve}
                className="btn-secondary w-full"
              >
                {isApproving ? 'Approving...' : 'Approve Tokens'}
              </button>
            ) : (
              <button
                onClick={handleStake}
                disabled={isStaking || !stakeAmount || parseFloat(stakeAmount) <= 0}
                className="btn-primary w-full"
              >
                {isStaking ? 'Staking...' : 'Stake Tokens'}
              </button>
            )}
          </div>
        </div>
        
        {/* Unstaking Form */}
        <div className="card">
          <h3 className="text-2xl font-bold text-white mb-6">Unstake Tokens</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount to Unstake
              </label>
              <input
                type="number"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              />
              <p className="text-sm text-gray-400 mt-1">
                Staked: {parseFloat(stakedAmount).toFixed(4)} XMRT
              </p>
            </div>
            
            <button
              onClick={() => {
                unstake?.();
                setUnstakeAmount('');
              }}
              disabled={isUnstaking || !unstakeAmount || parseFloat(unstakeAmount) <= 0}
              className="btn-secondary w-full"
            >
              {isUnstaking ? 'Unstaking...' : 'Unstake Tokens'}
            </button>
          </div>
        </div>
        
        {/* Staking Stats */}
        <div className="card">
          <h3 className="text-2xl font-bold text-white mb-6">Your Staking Info</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
              <span className="text-gray-300">Total Staked</span>
              <span className="text-blue-400 font-semibold">{parseFloat(stakedAmount).toFixed(4)} XMRT</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
              <span className="text-gray-300">Pending Rewards</span>
              <span className="text-green-400 font-semibold">{parseFloat(pendingRewards).toFixed(6)} XMRT</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
              <span className="text-gray-300">Token Balance</span>
              <span className="text-purple-400 font-semibold">{parseFloat(balance).toFixed(4)} XMRT</span>
            </div>
          </div>
          
          <button
            onClick={() => claimRewards?.()}
            disabled={isClaiming || parseFloat(pendingRewards) <= 0}
            className="btn-primary w-full mt-6"
          >
            {isClaiming ? 'Claiming...' : 'Claim Rewards'}
          </button>
        </div>
        
        {/* APY Info */}
        <div className="card">
          <h3 className="text-2xl font-bold text-white mb-6">Staking Details</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
              <span className="text-gray-300">Annual Percentage Yield</span>
              <span className="text-green-400 font-semibold text-xl">12%</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
              <span className="text-gray-300">Lock Period</span>
              <span className="text-blue-400 font-semibold">None (Flexible)</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
              <span className="text-gray-300">Compound Frequency</span>
              <span className="text-purple-400 font-semibold">Continuous</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-300">
              💡 <strong>How it works:</strong> Rewards are calculated continuously based on your staked amount. 
              You can claim rewards and unstake at any time without penalties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staking;
