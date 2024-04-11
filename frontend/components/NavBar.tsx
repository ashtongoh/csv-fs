"use client";

import { formatAddress } from '@/utils/formatAddress';
import Link from 'next/link';
import { useAccount, useEnsName, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

const NavBar = () => {

    const { connect } = useConnect();
    const { disconnect } = useDisconnect();
    const { address, isConnected } = useAccount();

    return (
        <div className="navbar bg-base-300">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                            <Link href="/" >
                                Home
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center">
                <a className="btn btn-ghost text-xl">CSV App</a>
            </div>
            {
                isConnected ? (
                    <div className="flex navbar-end gap-3">
                        <span className="">{address && formatAddress(address)}</span>
                        <a className="btn btn-error" onClick={() => disconnect()}>Disconnect</a>
                    </div>
                ) :
                (
                    <div className="navbar-end">
                        <a className="btn btn-primary" onClick={() => connect({ connector: injected() })}>Connect</a>
                    </div>
                )
            }
        </div>
    )
}

export default NavBar;