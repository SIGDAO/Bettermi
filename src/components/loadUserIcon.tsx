import React from "react";
import { useState, useRef } from "react";
import { IsUserUpdatingIcon } from "../NftSystem/updateUserNftStorage";
import { LedgerClientFactory } from "@signumjs/core";
import { useSelector } from "react-redux";
import { selectWalletNodeHost } from "../redux/useLedger";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../pages/home/home.css";
import "../pages/profile/profile.css";
import { fetchIPFSJSON } from "../NftSystem/updateUserNftStorage";
import { convertWordToNumber } from "../NftSystem/Reward/getRewardPercentage";
import { getApiUrls } from "./constants/constant";
import IPFSImageComponent from "./ipfsImgComponent";

export interface IUserIconProps {
  home?: boolean;
  profile?: boolean;
  userAccountId: string;
  setIsPopUpNFTDetailWinodow: Function;
  setSelectedNft?: Function;
  setRewardPercentage: Function;
  setEnlargeImageAddress: Function;
}

export interface ClassNames {
  forEmptyIcon: string;
  forAddSign: string;
  forNftDisplay: string;
  forLoadingSign: string;
}

const UserIcon: React.FC<IUserIconProps> = (props) => {
  const homeClassNames: ClassNames = {
    forEmptyIcon: "home_nft_-avatar",
    forAddSign: "home_icon_ic_add",
    forLoadingSign: "home_icon_ic_loading",
    forNftDisplay: "nft_-avatar-2ZgxSS",
  };

  const profileClassNames: ClassNames = {
    forEmptyIcon: "profile_icon_nft_-avatar_empty",
    forAddSign: "profile_icon_ic_add",
    forLoadingSign: "profile_icon_ic_loading",
    forNftDisplay: "nft_-avatar_empty",
  };

  const { home, userAccountId, setIsPopUpNFTDetailWinodow, setSelectedNft, setRewardPercentage, setEnlargeImageAddress } = props;
  let finalClassNames: ClassNames = home === true ? homeClassNames : profileClassNames;
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [haveNft, setHaveNft] = useState<boolean>(false);
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const [imgAddress, setImgAddress] = useState<string>("");
  const [nftIconRewardPercentage, setNftIconRewardPercentage] = useState<string>("");

  const fetchUserIcon = async () => {
    const isUserSettingUpdating = await IsUserUpdatingIcon(ledger2, userAccountId);
    if (isUserSettingUpdating === true) {
      setIsUpdating(true);
      setIsLoading(false);
    } else {
      try {
        const account = await ledger2.account.getAccount({ accountId: userAccountId });
        const description = JSON.parse(account.description);
        const accountInfo = await ledger2.contract.getContract(description.id);
        const nftInfo = await fetchIPFSJSON(JSON.parse(accountInfo.description).descriptor);
        console.log("nftInfo is", nftInfo);
        const array = nftInfo.attributes[2].key3;
        const level = convertWordToNumber(nftInfo.attributes[6].value);
        if (isNaN(level) === false) {
          console.log((level / 3).toString());
          setNftIconRewardPercentage((level / 3).toFixed(2).toString());
        } else {
          setNftIconRewardPercentage("");
        }
        setImgAddress(Object.keys(description.av)[0]);

        setHaveNft(true);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
        //reEquipNft(ledger2,Wallet,userAccountId,codeHashIdForNft,nftDistributor,userAccountpublicKey,navigate);
      }
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
      ) : haveNft === true ? (
        // <img
        //   onClick={() => {
        //     setIsPopUpNFTDetailWinodow(true);
        //     if (setSelectedNft != null) {
        //       setSelectedNft(imgAddress);
        //     }
        //     setEnlargeImageAddress(imgAddress);
        //     setRewardPercentage(nftIconRewardPercentage);
        //   }}
        //   className={finalClassNames.forNftDisplay}
        //   src={getApiUrls(imgAddress).imgAddress}
        //   alt="NFT_Avatar"
        // />
        <IPFSImageComponent
          onClick={() => {
            setIsPopUpNFTDetailWinodow(true);
            if (setSelectedNft != null) {
              setSelectedNft(imgAddress);
            }
            setEnlargeImageAddress(imgAddress);
            setRewardPercentage(nftIconRewardPercentage);
          }}
          className={finalClassNames.forNftDisplay}
          imgAddress={imgAddress}
          alt="NFT_Avatar"
        />
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
