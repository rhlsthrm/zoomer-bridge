import { Chain } from "wagmi/chains";
import { arbitrum, base, bsc, mainnet, optimism, polygon } from "wagmi/chains";
import { GRUMPY_BLUE, ZOOMER_YELLOW } from "./colors";
import {
  bridgeAddress,
  grumpyCatCoinAddress,
  grumpyCatLockboxAdapterAddress,
  zoomerCoinAddress,
  zoomerXerc20LockboxBaseAddress,
} from "../generated";
import { Address, Hex, encodeAbiParameters } from "viem";
import { BUY_GRUMPYCAT_LINK, BUY_ZOOMER_LINK } from "./constants";

export type AssetConfig = {
  chains: Chain[];
  color: string;
  buyLink: string;
};

export const configByAsset: Record<Asset, AssetConfig> = {
  zoomer: {
    color: ZOOMER_YELLOW,
    chains: [mainnet, base, polygon, bsc, arbitrum, optimism],
    buyLink: BUY_ZOOMER_LINK,
  },
  grumpycat: {
    color: GRUMPY_BLUE,
    chains: [mainnet, polygon, bsc, arbitrum, optimism],
    buyLink: BUY_GRUMPYCAT_LINK,
  },
};

export type Asset = "zoomer" | "grumpycat";

export const getAddressByAsset = (
  asset: Asset,
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
  asset: Asset,
  originChainId: number,
  destinationChainId: number
): Address | undefined => {
  if (asset === "zoomer") {
    if (destinationChainId === base.id) {
      return zoomerXerc20LockboxBaseAddress[
        originChainId as keyof typeof zoomerXerc20LockboxBaseAddress
      ];
    }
  }
  if (asset === "grumpycat") {
    return bridgeAddress[originChainId as keyof typeof bridgeAddress];
  }
};

export const getCalldataByAsset = (
  asset: Asset,
  destinationChainId: number,
  walletAddress: Address
): Hex => {
  if (destinationChainId === mainnet.id && asset === "grumpycat") {
    return encodeAbiParameters([{ type: "address" }], [walletAddress]);
  }
  return "0x";
};

export const getRecipientByAsset = (
  asset: Asset,
  destinationChainId: number,
  walletAddress: Address
): Address => {
  if (destinationChainId === mainnet.id && asset === "grumpycat") {
    return grumpyCatLockboxAdapterAddress[mainnet.id];
  }
  return walletAddress;
};
