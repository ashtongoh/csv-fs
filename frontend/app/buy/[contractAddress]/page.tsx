"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { readContract } from '@wagmi/core'
import { carbonCreditTokenABI } from "@/utils/abi";
import { config } from "@/config";
import { sepolia } from 'wagmi/chains'

import { Address, parseEther, parseGwei } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';
import Spinner from '@/components/Spinner';

const BuyPage = () => {

    const pathname = usePathname();
    const router = useRouter();

    const { writeContract } = useWriteContract();
    const { isConnected } = useAccount();

    const [totalSupply, setTotalSupply] = useState<any>(0);
    const [tokenContractEvents, setTokenContractEvents] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [inputValue, setInputValue] = useState<string>("");
    const [contractAddress, setContractAddress] = useState<string>('');
    const [price, setPrice] = useState<any>(0);


    useEffect(() => {
        const _contractAddress = pathname.split('/')[2]; // Extract contract address from URL
        if (!_contractAddress) return;

        setIsLoading(true);

        const fetchTotalSupply = async () => {

            const result = await readContract(config, {
                abi: carbonCreditTokenABI,
                address: _contractAddress as Address,
                functionName: 'totalSupply',
                chainId: sepolia.id,
                args: [0] // Reporting period starts from 0
            })

            if (result) setTotalSupply(result);
            console.log("Total supply", result);
        }

        const fetchPricePerCredit = async () => {

            const result = await readContract(config, {
                abi: carbonCreditTokenABI,
                address: _contractAddress as Address,
                functionName: 'pricePerCredit',
                chainId: sepolia.id,
            })

            if (result) setPrice(result);
            console.log("Price per credit", result, 18);

        }


        const fetchTokenContractEvents = async () => {

            const result = await readContract(config, {
                abi: carbonCreditTokenABI,
                address: _contractAddress as Address,
                functionName: 'getTokenContractEvents',
                chainId: sepolia.id,
            })


            if (result) setTokenContractEvents(result);
            console.log("Token contract events", result);
        }

        // Execute both fetches and wait for them to complete
        Promise.all([fetchTotalSupply(), fetchPricePerCredit(), fetchTokenContractEvents()]).then(() => {
            // End loading
            setIsLoading(false);
        }).catch(error => {
            console.error("Error fetching contract data:", error);
            // End loading even if there's an error
            setIsLoading(false);
        });

        // fetchTotalSupply();
        // fetchTokenContractEvents();

    }, [pathname]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4">Buy carbon credits to support your project!</h1>
            <div className="form-control w-full max-w-xs space-y-7">
                <input
                    type="number"
                    placeholder="Number of credits to purchase"
                    className="input input-bordered w-full max-w-xs"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                    disabled={!isConnected}
                    className="btn btn-primary mt-4"
                    onClick={() =>
                        writeContract({
                            abi: carbonCreditTokenABI,
                            address: contractAddress as Address,
                            functionName: 'buyCredits',
                            args: [Number(inputValue)],
                            // Removed value field for sending ether
                            // RPC node doesnt seem to be working. Error 400
                            // value: parseEther(price * Number(inputValue)).toString()
                        })
                    }
                >
                    Buy
                </button>
            </div>
            <h1 className="text-2xl font-bold my-6">Transaction details of this project</h1>
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="overflow-x-auto overflow-y-auto h-80">
                    <table className="table table-lg w-full table-zebra">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Transaction Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tokenContractEvents.map((detail: string, index: number) => (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>{detail}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
            }
        </div>
    )
}

export default BuyPage;