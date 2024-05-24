import React, { useState, useEffect } from "react";
import { getApiUrls } from "./constants/constant";

interface IPFSImageComponentProps {
  imgAddress: string;
  onClick?: () => void;
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
}

const IPFSImageComponent: React.FC<IPFSImageComponentProps> = ({ imgAddress, onClick, className, alt = "NFT", style }) => {
  const domains = [
    // getApiUrls(imgAddress).imgAddress,
    `https://aqua-petite-woodpecker-504.mypinata.cloud/ipfs/${imgAddress}?pinataGatewayToken=cL2awO7TOSq6inDgH6nQzP46A38FpRr1voSLTpo14pnO1E6snmmGfJNLZZ41x8h1`,
    `https://ipfs.io/ipfs/${imgAddress}`,
    `https://gateway.pinata.cloud/ipfs/${imgAddress}`,
    `https://cloudflare-ipfs.com/ipfs/${imgAddress}`,

  ];
  const [src, setSrc] = useState(domains[0]);
  const [currentDomainIndex, setCurrentDomainIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
    setSrc(domains[currentDomainIndex]);
  }, [currentDomainIndex]);

  const handleImageError = () => {
    // setTimeout(switchDomain, 3000);

    setCurrentDomainIndex((prevDomainIndex) => (prevDomainIndex + 1) % domains.length);
    setIsLoading(true)
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
