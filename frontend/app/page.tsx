"use client";

import React, { useEffect, useState } from "react";

import { readContract } from '@wagmi/core'
import { useWriteContract, useAccount } from 'wagmi'
import { csvCoreABI } from "@/utils/abi";

import { config } from "@/config";
import { sepolia } from 'wagmi/chains'
import Spinner from "@/components/Spinner";
import { Address } from "viem";

const HomePage = () => {

  const { writeContract } = useWriteContract();
  const { isConnected } = useAccount();

  const [inputValue, setInputValue] = useState<string>("");
  const [tableData, setTableData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await readContract(config, {
        abi: csvCoreABI,
        address: process.env.NEXT_PUBLIC_CORE_CONTRACT_ADDR as Address,
        functionName: 'getCoreContractEvents',
        chainId: sepolia.id,
      })

      //console.log(result);

      if (result) {
        setTableData(result);
      }
      setIsLoading(false);
    }

    fetchData();

  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">List your first project!</h1>
      <div className="form-control w-full max-w-xs space-y-7">
        <input
          type="text"
          placeholder="Your wallet address here"
          className="input input-bordered w-full max-w-xs"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          disabled={!isConnected}
          className="btn btn-primary mt-4"
          onClick={() =>
            writeContract({
              abi: csvCoreABI,
              address: process.env.NEXT_PUBLIC_CORE_CONTRACT_ADDR as Address,
              functionName: 'createCarbonCreditToken',
              args: [inputValue],
            })
          }
        >
          Create
        </button>
      </div>
      <h1 className="text-2xl font-bold my-6">Past records of projects already listed</h1>
        {isLoading ? (
            <Spinner />
          ) : (
            <div className="overflow-x-auto overflow-y-auto h-80">
            <table className="table w-full table-zebra">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Transaction Details</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((detail: string, index: number) => (
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

export default HomePage;
