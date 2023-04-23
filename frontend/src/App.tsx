import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Admin } from './admin/Admin';
import { AdminPostEdit } from './admin/AdminPostEdit';
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
import { AdminTagEdit } from './admin/tags/AdminTagEdit';
import { Tags } from './admin/tags/Tags';
import { Down } from './Down';
import { useEffect, useState } from 'react';

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


export const App = (API_URL: string) => {
    let [maintenance, setMaintenance] = useState(false);
    let [unexpectedDown, setUnexpectedDown] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(API_URL);
                if (res.status === 503) {
                    setMaintenance(true);
                } else if (res.status !== 200) {
                    setUnexpectedDown(true);
                }
            } catch (error) {
                console.error("Couldn't fetch maintenance status: "+ error)
            }
        };

        fetchData();
    }, []);
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
                        {unexpectedDown ? (
                            <Route path="/" element={<Down />} />
                        ) : (
                            <>
                                {!maintenance ||
                                localStorage.getItem('luc-debug') ? (
                                    <>
                                        <Route path="/" element={<Home />} />
                                        <Route
                                            path="/admin"
                                            element={<Admin />}
                                        />
                                        <Route
                                            path="/admin/new"
                                            element={<AdminPostEdit isNew />}
                                        />
                                        <Route
                                            path="/admin/:id/edit"
                                            element={<AdminPostEdit />}
                                        />
                                        <Route
                                            path="/admin/tags"
                                            element={<Tags />}
                                        />
                                        <Route
                                            path="/admin/tags/new"
                                            element={<AdminTagEdit isNew />}
                                        />
                                        <Route
                                            path="/admin/tags/:id/edit"
                                            element={<AdminTagEdit />}
                                        />
                                        <Route
                                            path="/grant/:id"
                                            element={<Grant />}
                                        />
                                    </>
                                ) : (
                                    <Route path="/" element={<WIP />} />
                                )}
                            </>
                        )}
                    </Routes>
                </BrowserRouter>
            </RainbowKitProvider>
        </WagmiConfig>
    );
};
