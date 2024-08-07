import React, { useEffect } from "react";
import { CenterLayout } from "../../components/layout";
import "./leaderboard.css";
import { ShortTitleBar } from "../../components/titleBar";
import { GetTokenRanking } from "../../components/getTokenRanking";
import { LedgerClientFactory } from "@signumjs/core";
import { useSelector } from "react-redux";
import { selectWalletNodeHost } from "../../redux/useLedger";
import { UpdateUserNftList } from "../../NftSystem/updateUserNftList";
import { LeaderBoardBanner } from "./leaderBoardBanner";
import { useRef } from "react";
import { store } from "../../redux/reducer";
import { leaderBoardBanner, userRankingSlice } from "../../redux/userRanking";
import { userRanking } from "../../redux/userRanking";
import { userRankingListRedux } from "../../redux/userRanking";
import { useNavigate } from "react-router-dom";
import IPFSImageComponent from "../../components/ipfsImgComponent";
import { selectCurrentIsGuest } from "../../redux/profile";
import SigdaoIcon from "../../components/icon";

type Props = {};

const Leaderboard = (props: Props) => {
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const [userRankingList, setUserRankingList] = React.useState<leaderBoardBanner[]>([]);
  const nftLoaded = useRef(false);
  const [isLeaderBoardLoading, setIsLeaderBoardLoading] = React.useState<boolean>(true);
  const userRankingListFromRedux = useSelector(userRankingListRedux);
  const navigate = useNavigate();
  const isGuest = useSelector(selectCurrentIsGuest);


  const imageLoadForTop3 = (index: number) => {
    return (
      <>
        {userRankingList[index]?.accountImage || index == 0 ? (
          <IPFSImageComponent
            className={index == 0 ? "leaderboard_nft_-avatar" : "leaderboard_nft_-avatar-top3"}
            // imgAddress={index == 0 ? `QmPs1xzhieR4RjC9k1VMHauyqhALrK1tJyvk9Wtn8hHpY7` : `${userRankingList[index]?.accountImage}`}
            imgAddress={`${userRankingList[index]?.accountImage}`}
            alt="NFT_Avatar"
            onClick={() => {
              navigate("/OtherUserProfile", { state: { userId: userRankingList[0].accountId } });
            }}
          />
        ) : (
          <div className="leaderboard_nft_-avatar-top3">
            <img className="home_icon_ic_add" src={`${process.env.PUBLIC_URL}/img/profile/ic-add-2@1x.png`} alt="ic_add" />
          </div>
        )}
      </>
    );
  };

  const Top3displayContainer = (index: number) => {
    const top3text = ["1ˢᵗ", "2ⁿᵈ", "3ʳᵈ"];
    return (
      <div
        className={index == 0 ? "first-container" : "top3-container"}
        onClick={() => {
          navigate("/OtherUserProfile", { state: { userId: userRankingList[index]?.accountId } });
        }}
      >
        <div className="top3-text">
          <div className="inter-semi-bold-white-18px">{top3text[index]}</div>
        </div>
        {index == 0 && (
          <div className="crown-with-red-stone">
            <div className="crown-with-red-stone-1">
              <div className="overlap-group-leader-1">
                <img className="x11694" src="img/leaderboard/file---11694@1x.png" alt="11694" />
                <img className="x11695" src="img/leaderboard/file---11695@1x.png" alt="11695" />
                <img className="x11696" src="img/leaderboard/file---11696@1x.png" alt="11696" />
                <img className="x11697" src="img/leaderboard/file---11697@1x.png" alt="11697" />
                <img className="x11698" src="img/leaderboard/file---11698@1x.png" alt="11698" />
                <img className="x16232" src="img/leaderboard/file--16232@1x.png" alt="16232" />
                <img className="x16233" src="img/leaderboard/file--16233@1x.png" alt="16233" />
                <img className="x117" src="img/leaderboard/file---11703@1x.png" alt="11703" />
                <img className="x11704" src="img/leaderboard/file---11704@1x.png" alt="11704" />
                <img className="x11705" src="img/leaderboard/file---11705@1x.png" alt="11705" />
                <img className="x11706" src="img/leaderboard/file---11706@1x.png" alt="11706" />
                <img className="x11707" src="img/leaderboard/file---11707@1x.png" alt="11707" />
                <img className="x11708" src="img/leaderboard/file---11708@1x.png" alt="11708" />
                <img className="x11709" src="img/leaderboard/file---11709@1x.png" alt="11709" />
                <img className="x11710" src="img/leaderboard/file---11710@1x.png" alt="11710" />
                <img className="x16234" src="img/leaderboard/file--16234@1x.png" alt="16234" />
                <img className="x1171" src="img/leaderboard/file---11713@1x.png" alt="11713" />
                <img className="x11714" src="img/leaderboard/file---11714@1x.png" alt="11714" />
                <img className="x11715" src="img/leaderboard/file---11715@1x.png" alt="11715" />
                <img className="x1171" src="img/leaderboard/file---11716@1x.png" alt="11716" />
                <img className="x11717" src="img/leaderboard/file---11717@1x.png" alt="11717" />
                <img className="x11718" src="img/leaderboard/file---11718@1x.png" alt="11718" />
                <img className="x11719" src="img/leaderboard/file---11715@1x.png" alt="11719" />
                <img className="x11720" src="img/leaderboard/file---11720@1x.png" alt="11720" />
                <img className="x11721" src="img/leaderboard/file---11721@1x.png" alt="11721" />
                <img className="x11722" src="img/leaderboard/file---11722@1x.png" alt="11722" />
                <img className="x11723" src="img/leaderboard/file---11723@1x.png" alt="11723" />
                <img className="x11724" src="img/leaderboard/file---11718@1x.png" alt="11724" />
                <img className="x11725" src="img/leaderboard/file---11725@1x.png" alt="11725" />
                <img className="x117" src="img/leaderboard/file---11726@1x.png" alt="11726" />
                <img className="x11727" src="img/leaderboard/file---11727@1x.png" alt="11727" />
                <img className="x11728" src="img/leaderboard/file---11728@1x.png" alt="11728" />
                <img className="x11729" src="img/leaderboard/file---11729@1x.png" alt="11729" />
                <img className="x11730" src="img/leaderboard/file---11730@1x.png" alt="11730" />
                <img className="x11731" src="img/leaderboard/file---11731@1x.png" alt="11731" />
                <img className="x11732" src="img/leaderboard/file---11732@1x.png" alt="11732" />
                <img className="x11733" src="img/leaderboard/file---11733@1x.png" alt="11733" />
              </div>
            </div>
          </div>
        )}
        <div className={index == 0 ? "first-avatar" : "top3-avatar"}>{imageLoadForTop3(index)}</div>
        <div className="top3-accountId">
          <div className="inter-medium-white-12px">{userRankingList[index]?.displayAccountId.substring(0, 11)}</div>
        </div>
        <div className="sigdao-score-3 sigdao-score-4">
          <SigdaoIcon width="17px" height="17px" />
          <div className="x10-2 x10-7 inter-semi-bold-keppel-14px">{userRankingList[index]?.tokenBalance}</div>
        </div>
      </div>
    );
  };

  const fetchUserRankingList = () => {
    GetTokenRanking(ledger2)
      .then((userRankingList) => {
        setUserRankingList(userRankingList);

        setIsLeaderBoardLoading(false);
        let state: userRanking = { userRankingList: userRankingList };

        store.dispatch(userRankingSlice.actions.setUserRanking(state));
      })
      .catch((e: any) => {
        setIsLeaderBoardLoading(false);
        alert("some unkown error has happened. We would be grateful if this can be reported to us");
        console.log(e);
      });
  };

  useEffect(() => {

    if (nftLoaded.current === true) {

    } else {
      nftLoaded.current = true;
      //if(userRankingListFromRedux == null ){

      fetchUserRankingList();
      //}
      // else{
      //   if(userRankingListFromRedux.length === 0){//This is written because I am afraid that the userRankingList is [] but not null initially

      //     fetchUserRankingList();
      //   }
      //   else{
      //     setUserRankingList(userRankingListFromRedux);
      // setIsLeaderBoardLoading(false);
      //   }
      // }
    }
  }, []);
  const leaderBoardBanner = () => {
    var banners: JSX.Element[] = [];
    for (var i = 3; i < Math.min(userRankingList.length, 100); i++) {
      banners.push(
        <LeaderBoardBanner
          displayAccountId={userRankingList[i].displayAccountId}
          userRanking={userRankingList[i].userRanking}
          tokenBalance={Number(userRankingList[i].tokenBalance)}
          accountId={userRankingList[i].accountId}
          accountImage={userRankingList[i].accountImage}
        />
      );
    }
    return banners;
  };
  const content: JSX.Element = (
    // <div className="screen">
    <div className="bettermidapp-leaderboad-the-best-100 screen">
      <ShortTitleBar title="The Best 100" setting={true} aiCoach={true} />
      {isLeaderBoardLoading === true ? (
        <div></div>
      ) : (
        <>
          <div className="overlap-group-leader6">
            <div className="_px-container">
              <div className="ic_sentiment_very_satisfied_24px"></div>
              <div className="ic_settings_24px"></div>
            </div>
            <div className="overlap-group-leader7">
              <img className="photo" src={`${process.env.PUBLIC_URL}/img/leaderboard/Leaderboard_Banner.png`} alt="Photo" />
              <div className="leaderboard-top3">
                {Top3displayContainer(1)}
                {Top3displayContainer(0)}
                {Top3displayContainer(2)}
              </div>
            </div>
            <div className="x26">
              {leaderBoardBanner()}
            </div>
          </div>
        </>
      )}
    </div>
    // </div>
  );

  return <CenterLayout content={content} bgImg={false} />;
};

export default Leaderboard;

/** 
                <div className="leadboard_st-container">
                  <div className="leadboard_1st">
                    <div className="overlap-group-leader2">
                      <div className="overlap-group-leader1">
                        {userRankingList[0].accountImage ? (
                          <img
                            className="nft_-avatar-2 nft_-avatar-3"
                            src={`https://ipfs.io/ipfs/${userRankingList[0].accountImage}`}
                            alt="NFT_Avatar"
                            onClick={() => {
                              navigate("/OtherUserProfile", { state: { userId: userRankingList[0].accountId } });
                            }}
                          />
                        ) : (
                          <img className="nft_-avatar-2 nft_-avatar-3" src={`https://ipfs.io/ipfs/QmPs1xzhieR4RjC9k1VMHauyqhALrK1tJyvk9Wtn8hHpY7`} alt="NFT_Avatar" />
                        )}

                        <div className="crown-with-red-stone">
                          <div className="crown-with-red-stone-1">
                            <div className="overlap-group-leader-1">
                              <img className="x11694" src="img/leaderboard/file---11694@1x.png" alt="11694" />
                              <img className="x11695" src="img/leaderboard/file---11695@1x.png" alt="11695" />
                              <img className="x11696" src="img/leaderboard/file---11696@1x.png" alt="11696" />
                              <img className="x11697" src="img/leaderboard/file---11697@1x.png" alt="11697" />
                              <img className="x11698" src="img/leaderboard/file---11698@1x.png" alt="11698" />
                              <img className="x16232" src="img/leaderboard/file--16232@1x.png" alt="16232" />
                              <img className="x16233" src="img/leaderboard/file--16233@1x.png" alt="16233" />
                              <img className="x117" src="img/leaderboard/file---11703@1x.png" alt="11703" />
                              <img className="x11704" src="img/leaderboard/file---11704@1x.png" alt="11704" />
                              <img className="x11705" src="img/leaderboard/file---11705@1x.png" alt="11705" />
                              <img className="x11706" src="img/leaderboard/file---11706@1x.png" alt="11706" />
                              <img className="x11707" src="img/leaderboard/file---11707@1x.png" alt="11707" />
                              <img className="x11708" src="img/leaderboard/file---11708@1x.png" alt="11708" />
                              <img className="x11709" src="img/leaderboard/file---11709@1x.png" alt="11709" />
                              <img className="x11710" src="img/leaderboard/file---11710@1x.png" alt="11710" />
                              <img className="x16234" src="img/leaderboard/file--16234@1x.png" alt="16234" />
                              <img className="x1171" src="img/leaderboard/file---11713@1x.png" alt="11713" />
                              <img className="x11714" src="img/leaderboard/file---11714@1x.png" alt="11714" />
                              <img className="x11715" src="img/leaderboard/file---11715@1x.png" alt="11715" />
                              <img className="x1171" src="img/leaderboard/file---11716@1x.png" alt="11716" />
                              <img className="x11717" src="img/leaderboard/file---11717@1x.png" alt="11717" />
                              <img className="x11718" src="img/leaderboard/file---11718@1x.png" alt="11718" />
                              <img className="x11719" src="img/leaderboard/file---11715@1x.png" alt="11719" />
                              <img className="x11720" src="img/leaderboard/file---11720@1x.png" alt="11720" />
                              <img className="x11721" src="img/leaderboard/file---11721@1x.png" alt="11721" />
                              <img className="x11722" src="img/leaderboard/file---11722@1x.png" alt="11722" />
                              <img className="x11723" src="img/leaderboard/file---11723@1x.png" alt="11723" />
                              <img className="x11724" src="img/leaderboard/file---11718@1x.png" alt="11724" />
                              <img className="x11725" src="img/leaderboard/file---11725@1x.png" alt="11725" />
                              <img className="x117" src="img/leaderboard/file---11726@1x.png" alt="11726" />
                              <img className="x11727" src="img/leaderboard/file---11727@1x.png" alt="11727" />
                              <img className="x11728" src="img/leaderboard/file---11728@1x.png" alt="11728" />
                              <img className="x11729" src="img/leaderboard/file---11729@1x.png" alt="11729" />
                              <img className="x11730" src="img/leaderboard/file---11730@1x.png" alt="11730" />
                              <img className="x11731" src="img/leaderboard/file---11731@1x.png" alt="11731" />
                              <img className="x11732" src="img/leaderboard/file---11732@1x.png" alt="11732" />
                              <img className="x11733" src="img/leaderboard/file---11733@1x.png" alt="11733" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="x1st inter-semi-bold-white-18px-2">
                        <span className="inter-semi-bold-white-18px">1</span>
                        <span className="inter-semi-bold-white-18px">st</span>
                      </div>
                    </div>
                    <div className="fung_fung00 inter-medium-white-12px">{userRankingList[0].displayAccountId.substring(0, 11)}</div>
                    <div className="sigdao-score-1 sigdao-score-4">
                      <div className="sigdao_tokengradient">
                        <div className="x441"></div>
                        <div className="x442"></div>
                        <img className="x880" src="img/leaderboard/file---880@1x.png" alt="880" />
                      </div>
                      <div className="x10 inter-semi-bold-keppel-14px"></div>
                      <div className="x10 inter-semi-bold-keppel-14px">{userRankingList[0].tokenBalance}</div>
                    </div>
                  </div>
                  <div
                    className="leadboard_1st-1 leadboard_1st-3"
                    onClick={() => {
                      navigate("/OtherUserProfile", { state: { userId: userRankingList[1].accountId } });
                    }}
                  >
                    <div className="x2nd inter-semi-bold-white-18px-2">
                      <span className="inter-semi-bold-white-18px">2</span>
                      <span className="inter-semi-bold-white-18px">nd</span>
                    </div>
                    {imageLoadForTop3(1)}
                    <div className="son inter-medium-white-12px">{userRankingList[1].displayAccountId.substring(0, 11)}</div>
                    <div className="sigdao-score-2 sigdao-score-4">
                      <div className="sigdao_tokengradient">
                        <div className="x441"></div>
                        <div className="x442"></div>
                        <img className="x880" src="img/leaderboard/file---880@1x.png" alt="880" />
                      </div>
                      <div className="x10-1 x10-7 inter-semi-bold-keppel-14px">{userRankingList[1].tokenBalance}</div>
                    </div>
                  </div>
                  <div
                  className="leadboard_1st-2 leadboard_1st-3 numberThree"
                  onClick={() => {
                    navigate("/OtherUserProfile", { state: { userId: userRankingList[2].accountId } });
                  }}
                >
                  <div className="x3rd inter-semi-bold-white-18px-2">
                    <span className="inter-semi-bold-white-18px">3</span>
                    <span className="inter-semi-bold-white-18px">rd</span>
                  </div>
                  {imageLoadForTop3(2)}
                  <img className="nft_-avatar"    src={`https://ipfs.io/ipfs/${userRankingList[2].accountImage}`} alt="NFT_Avatar" />
                  <div className="son inter-medium-white-12px">{userRankingList[2].displayAccountId.substring(0, 11)}</div>
                  <div className="sigdao-score-3 sigdao-score-4">
                    <div className="sigdao_tokengradient">
                      <div className="x441"></div>
                      <div className="x442"></div>
                      <img className="x880" src="img/leaderboard/file---880@1x.png" alt="880" />
                    </div>
                    <div className="x10-2 x10-7 inter-semi-bold-keppel-14px">{userRankingList[2].tokenBalance}</div>
                  </div>
                </div>
                </div>

 * **/
