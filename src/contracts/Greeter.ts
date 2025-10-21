export const COUNTER_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_COUNTER_CONTRACT_ADDRESS ?? "0xF6E35A7C80e895fbe14ff9165f9b3179BBCc9189") as `0x${string}`;

export const COUNTER_CONTRACT_ABI = [
    {"inputs":[],"name":"increment","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"number","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"newNumber","type":"uint256"}],"name":"setNumber","outputs":[],"stateMutability":"nonpayable","type":"function"}
] as const;