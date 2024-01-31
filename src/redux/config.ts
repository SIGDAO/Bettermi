// Types of Network to develop on, you decide which network you want to develop...
const Networks = {
    MainNet: "Signum",
    TestNet: "Signum-TESTNET",
  };
  
  // Here you can assign on which network you want to work
  const selectedNetwork = Networks.TestNet;
  
  // Here you can assign the dApp name
  const appName = "bettermi.io dapp";
  
  // Explorer URL
  const explorerUrl =
    selectedNetwork === Networks.TestNet
      ? "https://testnet.explorer.signum.network/"
      : "https://explorer.signum.network/";
  
  
  export const Config = {
    appName,
    IsTestnet: selectedNetwork === Networks.TestNet,
    Network: selectedNetwork,
    Explorer: explorerUrl,
  };
  