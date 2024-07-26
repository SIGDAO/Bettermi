import React, { useState, useEffect, useRef } from "react";
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
    `https://tomato-definite-chimpanzee-68.mypinata.cloud/ipfs/${imgAddress}?pinataGatewayToken=G42NP1or91gI4gAVdx4mKah_Q5-RYSOHbUWOulhyGJx4Wet0ik_Ja9SsqbvPwTo2`,
    `https://jade-advanced-aardvark-503.mypinata.cloud/ipfs/${imgAddress}?pinataGatewayToken=gAFR0PtrKdo2nujhw6Twn5wdI-B2LRMLCYyYGQEtFysNsr1mk-ZNKNxeWtkTEOzV`,
    `https://peach-keen-seahorse-51.mypinata.cloud/ipfs/${imgAddress}?pinataGatewayToken=WLmgo-q95o8KtMZMiZsL5vBlJzOJtRL3vhvxXLyWvJQ64yrk8KUwYOOHFLaogjh9`,
    `https://aqua-petite-woodpecker-504.mypinata.cloud/ipfs/${imgAddress}?pinataGatewayToken=4Xd22JeatBUeiw90FqP9O044hSoEdTDkOMPp7ZhYKdSGqBvjvzt5P9ttl_ov82Wj`,
    `https://cloudflare-ipfs.com/ipfs/${imgAddress}/`,

    // `https://ipfs.io/ipfs/${imgAddress}/`,
    // `https://cloudflare-ipfs.com/ipfs/${imgAddress}/`,
    // `https://${imgAddress}.ipfs.w3s.link/`,
    // `https://${imgAddress}.ipfs.dweb.link/`,
    // `https://ipfs.runfission.com/ipfs/${imgAddress}/`,
  ];
};

const IPFSImageComponent: React.FC<IPFSImageComponentProps> = ({ imgAddress, onClick, className, alt = "NFT", style = {} }) => {
  const domains = getDomains(imgAddress);
  const [src, setSrc] = useState<string>(domains[0]);
  const [currentDomainIndex, setCurrentDomainIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0);
  const AcceptedErrorNumber = 7;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSrc(domains[currentDomainIndex]);
    setIsLoading(true);
    
    timeoutRef.current = setTimeout(() => {
      if (isLoading) {
        handleImageError();
      }
    }, 5000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentDomainIndex]);

  const handleImageError = () => {
    if (count >= AcceptedErrorNumber) {
      return;
    }

    setCurrentDomainIndex((prevDomainIndex) => (prevDomainIndex + 1) % domains.length);
    setCount((prevCount) => prevCount + 1);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        onError={handleImageError}
        onClick={onClick}
        className={className}
        onLoad={handleImageLoad}
        style={isLoading ? { display: "none" } : style}
      />
      {isLoading && (
        <img src="/img/loadingMinting/mimi-dancing-for-loadin-page.gif"  alt="loading" className={className} />
      )}
    </>
  );
};

export default IPFSImageComponent;
