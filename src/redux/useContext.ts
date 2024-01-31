import { FC, ReactNode, createContext } from "react";
import { DeeplinkableWallet, GenericExtensionWallet } from "@signumjs/wallets";
import { Config } from "./config";

export interface AppContextType {
  appName: string;
  Wallet: {
    Extension: GenericExtensionWallet;
    Deeplink: DeeplinkableWallet;
  };
  Ledger: {
    IsTestnet: boolean;
    AddressPrefix: string;
    Network: string;
    Explorer: string;
  };
}

export const appConfig: AppContextType = {
  appName: Config.appName,
  Wallet: {
    Extension: new GenericExtensionWallet(),
    Deeplink: new DeeplinkableWallet({ openInBrowser: true }),
  },
  Ledger: {
    IsTestnet: Config.IsTestnet,
    AddressPrefix: Config.IsTestnet ? "TS" : "S",
    Network: Config.Network,
    Explorer: Config.Explorer,
  },
};

export const AppContext = createContext<AppContextType>(appConfig);

