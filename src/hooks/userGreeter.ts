import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { COUNTER_CONTRACT_ADDRESS, COUNTER_CONTRACT_ABI } from "../contracts/Greeter";
import { baseSepolia } from "wagmi/chains";

export const useCounter = () => {
  const { data: number, refetch: refetchNumber, error: readError } = useReadContract({
    address: COUNTER_CONTRACT_ADDRESS,
    abi: COUNTER_CONTRACT_ABI,
    functionName: "number",
    chainId: baseSepolia.id,
  })

  const { writeContract,
    data: hash,
    isPending: isWritePending,
    error: writeError 
    } = useWriteContract()

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        isError: isConfirmError,
    } = useWaitForTransactionReceipt({
            hash: hash,
            chainId: baseSepolia.id,
    })

    const increment = () => {
        writeContract({
            address: COUNTER_CONTRACT_ADDRESS,
            abi: COUNTER_CONTRACT_ABI,
            functionName: "increment",
            args: [],
            chainId: baseSepolia.id,
        })
    }

    const setNumber = (newNumber: number) => {
        writeContract({
            address: COUNTER_CONTRACT_ADDRESS,
            abi: COUNTER_CONTRACT_ABI,
            functionName: "setNumber",
            args: [BigInt(newNumber)],
            chainId: baseSepolia.id,
        })
    }

    return {
        number,
        refetchNumber,
        readError,
        increment,
        setNumber,
        isWritePending,
        writeError,
        isConfirming,
        isConfirmed,
        isConfirmError,
        hash,
    }
};