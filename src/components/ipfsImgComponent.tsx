import React, { useState, useEffect } from "react";

interface IPFSImageComponentProps {
  imgAddress: string;
  onClick?: () => void;
  classname?: string;
}

const IPFSImageComponent: React.FC<IPFSImageComponentProps> = ({
  imgAddress,
  onClick,
  classname,
}) => {
  
  const domains = [
    `https://pfs.eth.aragon.network/ipfs/${imgAddress}`,
    `https://video.oneloveipfs.com/ipfs/${imgAddress}`,
    `https://gateway.pinata.cloud/ipfs/${imgAddress}`,
    `https://ipfs.io/ipfs/${imgAddress}`,
    `https://${imgAddress}.ipfs.dweb.link/`,
    `https://cloudflare-ipfs.com/ipfs/${imgAddress}`,
  ];
  const [src, setSrc] = useState(domains[0]);
  const [currentDomainIndex, setCurrentDomainIndex] = useState(0);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     const nextDomainIndex =
  //       (currentDomainIndex + 1) % domains.length; // Cycle to the next domain
  //     setSrc(domains[nextDomainIndex]);
  //     setCurrentDomainIndex(nextDomainIndex);
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // }, [currentDomainIndex, domains]);

  const handleImageError = () => {
    setTimeout(switchDomain, 3000);
  };
  const switchDomain = () =>{
    const nextDomainIndex = (currentDomainIndex + 1) % domains.length;
    setSrc(domains[nextDomainIndex]);
    setCurrentDomainIndex(nextDomainIndex);
  }

  return (
    <img
      src={`${src}`}
      alt="0"
      onError={handleImageError}
      onClick={onClick}
      className={classname}
    />
  );
};

export default IPFSImageComponent;