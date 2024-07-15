import React, { useState, useEffect } from "react";

interface IPFSImageComponentProps {
  imgAddress: string;
  onClick?: () => void;
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
}

const domains = [
  // `https://pfs.eth.aragon.network/ipfs/${imgAddress}`,
  // `https://video.oneloveipfs.com/ipfs/${imgAddress}`,
  // `https://video.oneloveipfs.com/ipfs/${imgAddress}`,
  `https://ipfs.io/ipfs/${imgAddress}`,
  `https://aqua-petite-woodpecker-504.mypinata.cloud/ipfs/${imageAddress}?pinataGatewayToken=cL2awO7TOSq6inDgH6nQzP46A38FpRr1voSLTpo14pnO1E6snmmGfJNLZZ41x8h1`,
  // `https://${imgAddress}.ipfs.dweb.link/`,
  // `https://cloudflare-ipfs.com/ipfs/${imgAddress}`,
  // `https://gateway.pinata.cloud/ipfs/${imgAddress}`,
];


const IPFSImageComponent: React.FC<IPFSImageComponentProps> = ({ imgAddress, onClick, className, alt = "NFT", style }) => {
  const domains = [
    `https://ipfs.io/ipfs/${imgAddress}`,

  ];
  if (className === "allNftImage") {
  }
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

  //   return () => clearTimeout(timer);
  // }, [currentDomainIndex, domains]);

  const switchDomain = () => {
    // const nextDomainIndex = (currentDomainIndex + 1) % domains.length;


    setSrc(domains[(currentDomainIndex + 1) % domains.length]);
    setCurrentDomainIndex((prevDomainIndex) => prevDomainIndex + 1);
  };

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

  useEffect(() => {
    const nextDomainIndex = (currentDomainIndex + 1) % domains.length;

    setSrc(domains[nextDomainIndex]);
  }, [currentDomainIndex]);

  const handleImageError = () => {
    // setTimeout(switchDomain, 3000);

    // switchDomain();
    setCurrentDomainIndex((prevDomainIndex) => prevDomainIndex + 1);
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