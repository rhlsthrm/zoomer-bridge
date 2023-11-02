import { Chain } from "wagmi/chains";
import { arbitrum, base, bsc, mainnet, optimism, polygon } from "wagmi/chains";
import { GRUMPY_BLUE, ZOOMER_YELLOW } from "./colors";
import {
  bridgeAddress,
  grumpyCatCoinAddress,
  grumpyCatLockboxAdapterAddress,
  zoomerCoinAddress,
  zoomerXerc20LockboxAddress,
} from "../generated";
import { Address, Hex, encodeAbiParameters } from "viem";

export type AssetConfig = {
  chains: Chain[];
  color: string;
};

export const configByAsset: Record<Assets, AssetConfig> = {
  zoomer: { color: ZOOMER_YELLOW, chains: [mainnet, base, polygon] },
  grumpycat: {
    color: GRUMPY_BLUE,
    chains: [mainnet, polygon, bsc, arbitrum, optimism],
  },
};

export type Assets = "zoomer" | "grumpycat";

export const getAddressByAsset = (
  asset: Assets,
  originChainId: number
): Address => {
  if (asset === "zoomer") {
    return zoomerCoinAddress[originChainId as keyof typeof zoomerCoinAddress];
  }
  if (asset === "grumpycat") {
    return grumpyCatCoinAddress[
      originChainId as keyof typeof grumpyCatCoinAddress
    ];
  }
  throw new Error(`Unknown asset: ${asset}`);
};

export const getApproveToByAsset = (
  asset: Assets,
  originChainId: number,
  destinationChainId: number
): Address | undefined => {
  if (asset === "zoomer") {
    if (destinationChainId === base.id) {
      return zoomerXerc20LockboxAddress[
        originChainId as keyof typeof zoomerXerc20LockboxAddress
      ];
    }
  }
  if (asset === "grumpycat") {
    return bridgeAddress[originChainId as keyof typeof bridgeAddress];
  }
};

export const getCalldataByAsset = (
  asset: Assets,
  destinationChainId: number,
  walletAddress: Address
): Hex => {
  console.log(
    "destinationChainId === mainnet.id: ",
    destinationChainId === mainnet.id
  );
  console.log('asset === "grumpycat": ', asset === "grumpycat");
  if (destinationChainId === mainnet.id && asset === "grumpycat") {
    return encodeAbiParameters([{ type: "address" }], [walletAddress]);
  }
  return "0x";
};

export const getRecipientByAsset = (
  asset: Assets,
  destinationChainId: number,
  walletAddress: Address
): Address => {
  if (destinationChainId === mainnet.id && asset === "grumpycat") {
    return grumpyCatLockboxAdapterAddress[mainnet.id];
  }
  return walletAddress;
};