import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

export const config = createConfig({
  chains: [mainnet, sepolia],
  ssr: true,
  pollingInterval: 1_000,
  connectors: [injected({target: 'metaMask'})],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
  },
})