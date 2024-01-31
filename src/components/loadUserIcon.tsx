import React from "react";
import { useState } from "react";
import { IsUserSettingUpdating, IsUserUpdatingIcon } from "../NftSystem/updateUserNftStorage";
import { LedgerClientFactory } from "@signumjs/core";
import { useSelector } from "react-redux";
import { selectWalletNodeHost } from "../redux/useLedger";
import { accountId } from "../redux/account";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../pages/home/home.css";
import "../pages/profile/profile.css";

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
  let finalClassNames: ClassNames = home === true ? homeClassNames : profileClassNames;
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [haveNft, setHaveNft] = useState<boolean>(false);
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const [imgAddress, setImgAddress] = useState<string>("");
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
          console.log(account);
          const description = JSON.parse(account.description);
          console.log(description);
          console.log(Object.keys(description.av));
          console.log(typeof Object.keys(description.av)[0]);
          setImgAddress(Object.keys(description.av)[0]);
          console.log(Object.keys(description.av)[0]);
          setHaveNft(true);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.log("need to equip nft");
        });
    }
  };

  useEffect(() => {
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
