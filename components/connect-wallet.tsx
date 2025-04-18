"use client";
import { motion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import Image from "next/image";

interface ConnectWalletProps {
  onConnect: () => void;
  onClose: () => void;
}

export function ConnectWallet({ onConnect, onClose }: ConnectWalletProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-900 border-4 border-white p-6 max-w-md w-full relative"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>

        <h2
          className="text-2xl font-bold mb-6 text-center glitch-text-sm"
          data-text="CONNECT WALLET"
        >
          CONNECT WALLET
        </h2>

        <div className="grid gap-4">
          <button
            className="flex items-center justify-between p-4 border-2 border-white hover:border-yellow-400 hover:bg-gray-800 transition-colors arcade-btn"
            onClick={onConnect}
          >
            <div className="flex items-center">
              <Image
                src="/metamask.png"
                width={32}
                height={32}
                alt="MetaMask"
                className="mr-3"
              />
              <span className="font-bold">MetaMask</span>
            </div>
            <ArrowRight className="h-5 w-5" />
          </button>

          <button
            className="flex items-center justify-between p-4 border-2 border-white hover:border-yellow-400 hover:bg-gray-800 transition-colors arcade-btn"
            onClick={onConnect}
          >
            <div className="flex items-center">
              <Image
                src="/walletconnect.png"
                width={32}
                height={32}
                alt="WalletConnect"
                className="mr-3"
              />
              <span className="font-bold">WalletConnect</span>
            </div>
            <ArrowRight className="h-5 w-5" />
          </button>

          <button
            className="flex items-center justify-between p-4 border-2 border-white hover:border-yellow-400 hover:bg-gray-800 transition-colors arcade-btn"
            onClick={onConnect}
          >
            <div className="flex items-center">
              <Image
                src="/coinbase.png"
                width={32}
                height={32}
                alt="Coinbase Wallet"
                className="mr-3"
              />
              <span className="font-bold">Coinbase Wallet</span>
            </div>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6 text-center">
          By connecting your wallet, you agree to our Terms of Service and
          Privacy Policy
        </p>
      </motion.div>
    </motion.div>
  );
}
