import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Admin } from './admin/Admin';
import { Grant } from './grant/Grant';
import { Home } from './home/Home';

import {
    darkTheme,
    getDefaultWallets,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { WIP } from './WIP';

const { chains, provider } = configureChains(
    [chain.mainnet],
    [publicProvider()]
);

const { connectors } = getDefaultWallets({
    appName: 'Grantr.app',
    chains,
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

const maintenance = false;

export const App = () => {
    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider
                chains={chains}
                theme={darkTheme({
                    accentColor: '#FFCC00',
                    accentColorForeground: '#000',
                    borderRadius: 'none',
                    fontStack: 'system',
                })}
            >
                <BrowserRouter>
                    <Routes>
                        {!maintenance || localStorage.getItem('luc-debug') ? (
                            <>
                                <Route path="/" element={<Home />} />
                                <Route path="/admin" element={<Admin />} />
                                <Route path="/admin/g/:id" element={<Admin />} />
                                <Route path="/grant/:id" element={<Grant />} />
                            </>
                        ) : (
                            <Route path="/" element={<WIP />} />
                        )}
                    </Routes>
                </BrowserRouter>
            </RainbowKitProvider>
        </WagmiConfig>
    );
};
