"use client";
import {useState, useEffect} from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useAccount, useBalance } from "wagmi";
import { baseSepolia } from "wagmi/chains";

import { useCounter } from "@/src/hooks/userGreeter";
import Link from "next/link";

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });

  const isCorrectNetwork = chain?.id === baseSepolia.id;

  const { number, refetchNumber, readError, increment, setNumber, 
    isWritePending, writeError, isConfirming, isConfirmed,
     isConfirmError, hash } = useCounter();
  const [newNumber, setNewNumber] = useState<number | string>("");

  useEffect(() => {
    if (isConfirmed) {
      refetchNumber();
      setNewNumber("");
    }
  }, [isConfirmed, refetchNumber]);

  // Poll the counter every 500ms while connected to keep UI updated
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isConnected) {
      timer = setInterval(() => {
        try {
          refetchNumber();
        } catch (e) {
          // ignore polling errors
        }
      }, 500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isConnected, refetchNumber]);

  const handleSetNumber = () => {
    const parsed = typeof newNumber === 'string' ? newNumber.trim() : String(newNumber);
    if (parsed !== "") {
      const n = Number(parsed);
      if (!Number.isNaN(n)) {
        setNumber(n);
      }
    }
  };

  
  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        <Wallet />
      </header>

      <div className={styles.content}>
        <h1 className={styles.title}>Base Batches Day 2</h1>

        {isConnected && address && (
          <>
            {!isCorrectNetwork && (
              <div className={styles.section}>
                <div className={styles.errorMessage}>
                  <p>Wrong Network! Please switch to Base Sepolia in your wallet</p>
                  <p className={styles.networkInfo}>Current: {chain?.name || 'Unknown'} | Required: {baseSepolia.name}</p>
                </div>
              </div>
            )}

            {/*balance Display*/}
            <div className={styles.card}>
              <p className={styles.label}>Connected address:</p>
              <p className={styles.address}>{address}</p>
              {balance && (
                <div className={styles.balanceSection}>
                  <p className={styles.label}>ETH Balance:</p>
                  <p className={styles.balance}>
                    {parseFloat(balance.formatted).toFixed(4)} {balance?.symbol}
                  </p>
                </div>
              )}
            </div>

            {/* (Sign message removed) */}

            {/*Counter Contract*/}
            <div className={styles.card}>
              <h2 className={styles.cardTittle}>Counter Contract</h2>
              {readError && (
                <div className={styles.errorMessage}>
                  <p>Error reading counter: {readError.message}</p>
                </div>
              )}
              {typeof number !== 'undefined' && (
                <div className={styles.balanceSection}>
                  <p className={styles.label}>Current Number:</p>
                  <p className={styles.balance}>{String(number) || "Loading..."}</p>
                </div>
              )}

              <div className={styles.inlineControls}>
                <button
                  className={styles.button}
                  onClick={increment}
                  disabled={isWritePending || isConfirming}
                >
                  {isWritePending ? "Sending..." : isConfirming ? "Confirming..." : "Increment"}
                </button>

                <input
                  type="number"
                  placeholder="Set number"
                  className={styles.messageInput}
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                />
                <button
                  className={styles.button}
                  onClick={handleSetNumber}
                  disabled={isWritePending || isConfirming || String(newNumber).trim() === ''}
                >
                  Set Number
                </button>
              </div>

              {hash && (
                <div className={styles.signatureSection}>
                  <p className={styles.label}>Transaction Hash:</p>
                  <p className={styles.signature}>
                    <Link href={`https://sepolia.basescan.org/tx/${hash}`} target="_blank">
                      {hash}
                    </Link>
                  </p>
                </div>
              )}
            </div>

            {isConfirmed && (
              <div className="successMessage">
                <p>Transaction confirmed successfully</p>
              </div>
            )}
              
              {writeError && (
                <div className={styles.errorMessage}>
                  <p>Error writing transaction: {writeError.message}</p>
                </div>
              )}

              {isConfirmError && (
                <div className={styles.errorMessage}>
                  <p>Error confirming transaction: {isConfirmError}</p>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}
