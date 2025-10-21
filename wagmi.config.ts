import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, metaMask } from 'wagmi/connectors';

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
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
  },
});

declare module 'wagmi' {
    interface Register {
        config: typeof wagmiConfig;
    }
}

export default wagmiConfig;