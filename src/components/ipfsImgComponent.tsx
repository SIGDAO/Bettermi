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
    "https://pfs.eth.aragon.network/ipfs/",
    "https://ipfs.io/ipfs/",
    "https://gateway.pinata.cloud/ipfs/",
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
    const nextDomainIndex = (currentDomainIndex + 1) % domains.length;
    setSrc(domains[nextDomainIndex]);
    setCurrentDomainIndex(nextDomainIndex);
  };

  return (
    <img
      src={`${src}${imgAddress}`}
      alt="0"
      onError={handleImageError}
      onClick={onClick}
      className={classname}
    />
  );
};

export default IPFSImageComponent;