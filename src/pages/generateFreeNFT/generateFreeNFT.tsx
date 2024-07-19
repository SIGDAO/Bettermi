import * as React from "react";
import { CenterLayout } from "../../components/layout";
import { BackButton } from "../../components/button";
import "./generateFreeNFT.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { FindNftIpfsAddressWithConractId, IsUserUpdatingIcon } from "../../NftSystem/updateUserNftStorage";
import { useLedger } from "../../redux/useLedger";
import { useDispatch } from "react-redux";
import { profileSlice, selectCurrentNFTId } from "../../redux/profile";
import IPFSImageComponent from "../../components/ipfsImgComponent";
import { useSelector } from "react-redux";
import { selectCurrentNFTImageAddress } from "../../redux/profile";
import { setSelectionRange } from "@testing-library/user-event/dist/utils";

interface GenerateFreeNFTProps {}

const GenerateFreeNFT: React.FunctionComponent<GenerateFreeNFTProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const Ledger = useLedger();
  const newNftImageAddress = useSelector(selectCurrentNFTImageAddress);
  const nftId = useSelector(selectCurrentNFTId);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [nftIpfsAddress, setNftIpfsAddress] = React.useState<string>("");
  const [nftNumber, setNftNumber] = React.useState<number>(0);
  const [rewardPercentage,setRewardPercentage] = React.useState<string>("");
  useEffect(() => {
    FindNftIpfsAddressWithConractId(Ledger, nftId)
      .then((result) => {
        dispatch(profileSlice.actions.setNFTImageAddress(result.nftImage));
        setRewardPercentage(result.rewardPercentage);
        setNftIpfsAddress(result.nftImage);
        setNftNumber(result.nftNumber);
        setIsLoading(false);
      })
      .catch((e: any) => {
        alert("We apologize that some error has occurred. You can still get your free NFT in myNft Collection if you haven't get one");
        console.log(e);
      });
  }, []);

  const handleImportNFT = () => {
    if (nftIpfsAddress != "") {
      dispatch(profileSlice.actions.setNFTImageAddress(nftIpfsAddress));
      dispatch(profileSlice.actions.setNFTId(nftId));
      navigate("/customizeYourProfile", { state: { nftImageAddress: nftIpfsAddress, nftId: nftId } });
    }
  };

  const content: JSX.Element = (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img className="photo" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/photo-1@1x.png`} alt="Photo" />
        {/* <BackButton /> */}
        {isLoading === true ? (
          <div className="x0-generateFreeNFT"></div>
        ) : (
          <>
            {/* <img className="x0-generateFreeNFT" src={`https://ipfs.io/ipfs/${nftIpfsAddress}`} alt="0" /> */}
            <IPFSImageComponent className="x0-generateFreeNFT" imgAddress={nftIpfsAddress} />
            <h1 className="text-1">#{nftNumber}</h1>
          </>
        )}
        <div className="x16206">
          <div className="lv-1">LV 1</div>
          <img className="x6" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/file---6@1x.png`} alt="6" />
          <div className="reward-10">REWARD +{rewardPercentage}%</div>
        </div>
        <div className="x0-signa">$0 SIGNA</div>
        <div
          className="button_-import"
          onClick={() => handleImportNFT()}
        >
          <div className="continue inter-semi-bold-white-15px">Next</div>
        </div>
      </div>
    </>
  );

  return <CenterLayout bgImg={false} content={content} />;
};

export default GenerateFreeNFT;
