
npm create onchain@latest

get the API KEY from Coinbase Developer Platform
https://portal.cdp.coinbase.com/projects/api-keys?projectId=30d97378-9ec4-449c-b896-abbca8cba532

after put the ai key
no share the data

and after execute:
To get started with base-batches, run the following commands:

 - cd base-batches (name of application created)
 - npm install
 - npm run dev

 ==========

 create the variables necessary on the .env

create a file wagmi.config.ts inside app directory

 after go to the Base docs  to get the code for wallet connection : https://docs.base.org/onchainkit/getting-started
 click on Wallet Connection
Copy the code where is:
Set up your wallet connections
Paste on the file wagmi.config.ts

change in the file
import { coinbaseWallet } from 'wagmi/connectors';
to
import { coinbaseWallet, metaMask } from 'wagmi/connectors';

add const variables and metamask option with coinbaseWallet.

const projectname = process.env.NEXT_PUBLIC_PROJECT_NAME;
const rpcUrl = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL;

const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'onchainkit',
    }),
    metaMask({
      dappMetadata: {
        name: projectname,
      },
    }),
  ],

delete :
function App({ children }: { children: ReactNode }) {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
}

and add the code:
declare module 'wagmi' {
    interface Register {
        config: typeof wagmiConfig;
    }
}

export default wagmiConfig;
=========
in the file has a lot of changes C:\_sonia\dev\baseChallenge\onchainKit\base-batches\app\rootProvider.tsx

"use client";
import { ReactNode } from "react";
import { baseSepolia } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "@coinbase/onchainkit/styles.css";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import wagmiConfig from "@/wagmi.config";

const queryClient = new QueryClient();

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
      <OnchainKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={baseSepolia}
        config={{
          appearance: {
            mode: "auto",
          },
          wallet: {
            display: "modal",
            preference: "all",
          },
        }}
      >
      {children}
      </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
============================

Open layout.tsx - show that this file is the default , the most important
--
execute npm run dev

-- wil load slowly because it is compiling in the first time

=========
in the page file -> C:\_sonia\dev\baseChallenge\onchainKit\base-batches\app\page.tsx
thew first content should be like below, add some imports and const variables and remove the content of div that are the image.

"use client";
import {useState, useEffect} from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useAccount, useBalance, useSignMessage } from "wagmi";
import { baseSepolia } from "wagmi/chains";

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const { signMessage, data: signature, isPending: isSigningPending } = useSignMessage( );

  const isCorrectNetwork = chain?.id === baseSepolia.id;

  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        <Wallet />
      </header>
    </div>
  );
}
=========================