import React, { useState, useEffect } from "react";
import { getApiUrls } from "./constants/constant";

interface IPFSImageComponentProps {
  imgAddress: string;
  onClick?: () => void;
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
}

export const getDomains = (imgAddress: string): string[] => {
  return [
    // getApiUrls(imgAddress).imgAddress,
    `https://rose-peaceful-badger-310.mypinata.cloud/ipfs/${imgAddress}?pinataGatewayToken=ucHcjsImiqy6ENBl5X8Q7kTG3IwrFohD1r_s6qhqhMPkUZpAOiIhCFZ70Cgp-k6L`,
    `https://aqua-petite-woodpecker-504.mypinata.cloud/ipfs/${imgAddress}?pinataGatewayToken=cL2awO7TOSq6inDgH6nQzP46A38FpRr1voSLTpo14pnO1E6snmmGfJNLZZ41x8h1`,
    // `https://ipfs.io/ipfs/${imgAddress}/`,
    // `https://gateway.pinata.cloud/ipfs/${imgAddress}/`,
    // `https://cloudflare-ipfs.com/ipfs/${imgAddress}/`,
    // `https://${imgAddress}.ipfs.w3s.link/`,
    // `https://${imgAddress}.ipfs.dweb.link/`,
    // `https://ipfs.runfission.com/ipfs/${imgAddress}/`,
  ];
};


const IPFSImageComponent: React.FC<IPFSImageComponentProps> = ({ imgAddress, onClick, className, alt = "NFT", style }) => {
  const domains = getDomains(imgAddress);
  const [src, setSrc] = useState<string>(domains[0]);
  const [currentDomainIndex, setCurrentDomainIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0);
  const AcceptedErrorNumber = 3;

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     const nextDomainIndex =
  //       (currentDomainIndex + 1) % domains.length; // Cycle to the next domain
  //     setSrc(domains[nextDomainIndex]);
  //     setCurrentDomainIndex(nextDomainIndex);
  //   }, 5000);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (!isLoading) {
  //       clearInterval(interval);
  //     } else {
  //       setCurrentDomainIndex(prevDomainIndex => prevDomainIndex + 1);
  // }
  //   }, 5000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [isLoading]);

  // once the currentDomainIndex change, change img src
  useEffect(() => {
    // console.log("teisofdijfapdsiofjopaisjdfoidjsfpoji");
    if (count > AcceptedErrorNumber) {
      setIsLoading(true);
      return;
    }
    setSrc(domains[currentDomainIndex]); // Remove this line
  }, [currentDomainIndex]);

  const handleImageError = () => {
    // setTimeout(switchDomain, 3000);
    if (count > AcceptedErrorNumber) {
      return;
    }

    setCurrentDomainIndex((prevDomainIndex) => (prevDomainIndex + 1) % domains.length);
    setIsLoading(true)
    setCount((prevCount) => prevCount + 1);
  };

  // return !isLoading ? (
  //   <img 
  //     src={src} 
  //     alt={alt} 
  //     onError={handleImageError} 
  //     onClick={onClick} 
  //     className={className} 
  //     onLoad={() => setIsLoading(false)} 
  //     style={style}
  //   ></img>
  // ) : (
  //   <div className="lds-ring">
  //     <div></div>
  //     <div></div>
  //     <div></div>
  //     <div></div>
  //   </div>
  // );
  return (
  <img 
    src={isLoading ? "/img/loadingMinting/mimi-dancing-for-loadin-page.gif" : src} 
    alt={alt} 
    onError={handleImageError} 
    onClick={onClick} 
    className={className} 
    onLoad={() => setIsLoading(false)} 
    style={style}
  ></img>)

};

export default IPFSImageComponent;
