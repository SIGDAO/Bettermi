import React from "react";
import { useState,useRef } from "react";
import { IsUserSettingUpdating, IsUserUpdatingIcon } from "../NftSystem/updateUserNftStorage";
import { LedgerClientFactory } from "@signumjs/core";
import { useSelector } from "react-redux";
import { selectWalletNodeHost } from "../redux/useLedger";
import { accountId } from "../redux/account";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../pages/home/home.css";
import "../pages/profile/profile.css";
import IPFSImageComponent from "./ipfsImgComponent";
import { reEquipNft } from "../NftSystem/displayNft/reequipNft";
import { AppContext } from "../redux/useContext";
import { useContext } from "react";
import { accountPublicKey } from "../redux/account";

export interface IUserIconProps {
  home?: boolean;
  profile?: boolean;
  userAccountId: string;
  setIsPopUpIcon: Function;
  setSelectedNft?:Function;
}
export interface ClassNames {
  forEmptyIcon: string;
  forAddSign: string;
  forNftDisplay: string;
  forLoadingSign: string;
}
const UserIcon: React.FC<IUserIconProps> = (props) => {
  const homeClassNames = {
    forEmptyIcon: "home_nft_-avatar",
    forAddSign: "home_icon_ic_add",
    forLoadingSign: "home_icon_ic_loading",
    forNftDisplay: "nft_-avatar-2ZgxSS",
  };
  const profileClassNames = { forEmptyIcon: "profile_icon_nft_-avatar_empty", forAddSign: "profile_icon_ic_add", forLoadingSign: "profile_icon_ic_loading", forNftDisplay: "nft_-avatar_empty" };
  const { home, profile, userAccountId, setIsPopUpIcon,setSelectedNft } = props;
  const { appName, Wallet, Ledger } = useContext(AppContext);
  let finalClassNames: ClassNames = home === true ? homeClassNames : profileClassNames;
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [haveNft, setHaveNft] = useState<boolean>(false);
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const [imgAddress, setImgAddress] = useState<string>("");
  const codeHashIdForNft = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!;
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  const userAccountpublicKey = useSelector(accountPublicKey);
  const navigate = useNavigate();
  const fetchUserIcon = async () => {
    //const isUserSettingUpdating = await IsUserSettingUpdating(ledger2,userAccountId);
    const isUserSettingUpdating = await IsUserUpdatingIcon(ledger2, userAccountId);
    if (isUserSettingUpdating === true) {
      setIsUpdating(true);
      setIsLoading(false);
    } else {
      ledger2.account
        .getAccount({ accountId: userAccountId })
        .then((account) => {

          const description = JSON.parse(account.description);



          setImgAddress(Object.keys(description.av)[0]);
          //setImgAddress("bafybeifbyw43mxmn3yymgkfpehutftath3qwjhwlzox75l53zrjxfwxhra");

          setHaveNft(true);
          setIsLoading(false);
          //reEquipNft(ledger2,Wallet,userAccountId,codeHashIdForNft,nftDistributor,userAccountpublicKey,navigate);
        })
        .catch((error) => {
          setIsLoading(false);
          //reEquipNft(ledger2,Wallet,userAccountId,codeHashIdForNft,nftDistributor,userAccountpublicKey,navigate);

        });
    }
  };
  const nftIconCheck = useRef(false);
  useEffect(() => {
    if (nftIconCheck.current) {

      return;
    }
    nftIconCheck.current = true;
    fetchUserIcon();
  }, []);
  return (
    <>
      {isLoading === true ? (
        <div className={finalClassNames.forEmptyIcon}>
          <img className={finalClassNames.forLoadingSign} src="/img/loadingMinting/mimi-dancing-for-loadin-page.gif" alt="ic_add" />
        </div>
      ) : isUpdating === true ? (
        <Link to="/allNftList/">
          <div className={finalClassNames.forEmptyIcon}>
            <img className={finalClassNames.forLoadingSign} src="/img/loadingMinting/mimi-dancing-for-loadin-page.gif" alt="ic_add" />
          </div>
        </Link>
      ) : // <div
      //   className="nft_-avatar_empty"
      // />
      haveNft === true ? (
        <img onClick={() => {
          setIsPopUpIcon(true);
          if(setSelectedNft != null){
            setSelectedNft(imgAddress);
          }
        }} className={finalClassNames.forNftDisplay} src={`https://ipfs.io/ipfs/${imgAddress}`} alt="NFT_Avatar" />
        // <IPFSImageComponent
        //   imgAddress={imgAddress}
        //   onClick={() => {
        //     setIsPopUpIcon(true);
        //     if (setSelectedNft != null) {
        //       setSelectedNft(imgAddress);
        //     }
        //   }}
        //   className={finalClassNames.forNftDisplay}
        // />
      ) : (
        <Link to="/allNftList/">
          <div className={finalClassNames.forEmptyIcon}>
            <img className={finalClassNames.forAddSign} src="img/profile/ic-add-2@1x.png" alt="ic_add" />
          </div>
        </Link>
      )}
    </>
  );
};

export default UserIcon;
