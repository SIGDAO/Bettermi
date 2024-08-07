import * as React from "react";
import HorizontalScrollContainer from "../../components/horizontalScrollContainer";
import { Link } from "react-router-dom";
import IPFSImageComponent from "../../components/ipfsImgComponent";
import { useEffect, useState } from "react";
import { GetUserNftList } from "../../NftSystem/updateUserNftStorage";
import { useSelector } from "react-redux";
import { selectCurrentIsGuest } from "../../redux/profile";

interface IUserNFTListProps {
  userAccountId: string;
  ledger2: any;
  setIsPopUpNFTDetailWinodow: React.Dispatch<React.SetStateAction<boolean>>;
  setImgAddress: React.Dispatch<React.SetStateAction<string>>;
  setRewardPercentage: React.Dispatch<React.SetStateAction<string>>;
  isMyProfile: boolean;
}

interface NftProfile {
  imageAddress: string;
  rewardPercentage: string;
}

const UserNFTList: React.FunctionComponent<IUserNFTListProps> = (props) => {
  const { userAccountId, ledger2, setIsPopUpNFTDetailWinodow, setImgAddress, setRewardPercentage, isMyProfile } = props;
  const [loadingNft, setLoadingNft] = useState<boolean>(true);
  const [myNfts, setMyNfts] = useState<NftProfile[]>([]);
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  const codeHashIdForNft: string = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!;
  const isGuest = useSelector(selectCurrentIsGuest);

  const loadNftList = async () => {
    try {
      const userNftList: NftProfile[] = await GetUserNftList(ledger2, userAccountId, nftDistributor, codeHashIdForNft);
      console.log("userNftList is ", userNftList);
      setMyNfts(userNftList);
      setLoadingNft(false);
    } catch (e: any) {
      console.log(e);
    }
  };

  // fetch user own NFTs
  useEffect(() => {
    try {
      if (userAccountId && loadingNft) {
        loadNftList();
      }
    } catch (error) {
      console.log(error);
    }
  }, [userAccountId]);

  const userOwnNftDisplay = isGuest && isMyProfile ? (
    // Guest user view
    <>
      <Link to="/allNftList">
        <img className="profileBuyNft" src={`${process.env.PUBLIC_URL}/img/profile/NFT_Marketplace_button.png`} />
      </Link>
      <img
        src={`${process.env.PUBLIC_URL}/img/profile/SampleNFT.svg`}
        style={{
          width: "152px",
          height: "217px",
          objectFit: "cover",
          marginRight: "10px",
          cursor: "pointer",
        }}
        onClick={() => setIsPopUpNFTDetailWinodow(true)}
      />
    </>
  ) : (
    // logged in user view
    <>
      <Link to="/allNftList/">
        <img className="profileBuyNft" src={`${process.env.PUBLIC_URL}/img/profile/NFT_Marketplace_button.png`} />
      </Link>
      {loadingNft === true ? (
        <img
          src={"/img/loadingMinting/mimi-dancing-for-loadin-page.gif"}
          style={{
            width: "152px",
            height: "217px",
            objectFit: "cover",
            marginRight: "10px",
          }}
        />
      ) : (
        myNfts.map((MyNft) => (
          <IPFSImageComponent
            onClick={() => {
              setIsPopUpNFTDetailWinodow(true);
              setImgAddress(MyNft.imageAddress);
              setRewardPercentage(MyNft.rewardPercentage);
            }}
            imgAddress={MyNft.imageAddress}
            style={{
              width: "152px",
              height: "217px",
              objectFit: "cover",
              marginRight: "10px",
            }}
          />
        ))
      )}
    </>
  );

  return (
    <HorizontalScrollContainer
      inputClassName="profileHorizontalScroll"
      style={{
        backgroundColor: "inherit",
        width: "390px",
        height: "45%",
        overflowY: "scroll",
      }}
      // onWheel={handleScroll}
    >
      <div
        style={{
          width: "152px",
          height: "217px",
          display: "flex",
        }}
        // onWheel={handleScroll}
      >
        {userOwnNftDisplay}
      </div>
    </HorizontalScrollContainer>
  );
};

export default UserNFTList;
