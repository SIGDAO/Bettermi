import * as React from "react";
import "./inviteFriend.css";
import { CenterLayout } from "../../components/layout";
import { BackButton } from "../../components/button";
import { BlackAlert, displayPopUpMessage } from "../../components/alert";
import { useSelector } from "react-redux";
import { accountId } from "../../redux/account";
import { ShortTitleBar } from "../../components/titleBar";
import { LinkDisplayInput } from "../../components/input";
import { useNavigate } from "react-router-dom";
import SigdaoIcon from "../../components/icon";
import { rewardDetailList } from "../../data/rewardList";
import { LedgerClientFactory } from "@signumjs/core";
import { selectWalletNodeHost } from "../../redux/useLedger";
import { Api } from "@signumjs/core";
import axios from "axios";
import { countReferredUser } from "../../NftSystem/Reward/calculateReferralReward";

interface IInviteFriendProps {}

const InviteFriend: React.FunctionComponent<IInviteFriendProps> = (props) => {
  const navigate = useNavigate();
  const userAccountId = useSelector(accountId);
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger = LedgerClientFactory.createClient({ nodeHost });

  // alert related
  const [alert, setAlert] = React.useState<boolean>(false); // copy alert
  const [alertWarningString, setAlertWarningString] = React.useState<string>("");
  const [copyAlertCount, setCopyAlertCount] = React.useState<number>(0);
  const [referredCount, setReferredCount] = React.useState<number>(0);
  const [isLoading, setLoading] = React.useState<boolean>(true);
  const inviteFriendLink: string = window.location.origin + "/referralCode/" + userAccountId;
  const loadedCheck = React.useRef(false);
  
  React.useEffect(() => {
    if (loadedCheck.current) {
      return;
    }
    loadedCheck.current = true;
    countReferredUser(ledger, userAccountId)
      .then((result) => {
        setReferredCount(result);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  const handleCopyDiscordUsername = (): void => {
    navigator.clipboard.writeText(inviteFriendLink);
    displayPopUpMessage("Copied !");
  };

  const content: JSX.Element = (
    <div className="screen">
      <div className="bettermi-invite-friend-layout">
        <BlackAlert />
        {/* <BackButton /> */}
        <ShortTitleBar title="Invite Friends" />
        <div className="referral-program-banner-container">
          <img src={process.env.PUBLIC_URL + "/img/inviteFriend/Referral-Banner.png"} alt="" className="referral-program-banner" />
        </div>
        <div className="bettermi-invite-friend-layout-below">
          <div className="bettermi-invite-friend-content">
            <div className="invite-friend-description inter-normal-cadet-blue-15px">Copy and share your referral link to all your friends and earn more SIGDAO !</div>
            <div className="invite-friend-copy-invite-link-container">
              <LinkDisplayInput type="text" value={inviteFriendLink} dir="ltr" readOnly className="invite-friend-copy-invite-link inter-bold-white-15px" />
              {/* <div className="invite-friend-copy-invite-link-button">Copy</div> */}
              <img src={process.env.PUBLIC_URL + "/img/profile/file---11690@1x.png"} alt="" className="invite-friend-copy-invite-link-button" onClick={() => handleCopyDiscordUsername()} />
            </div>
            <div className="invite-friend-referral-program-container">
              <div className="inter-bold-royal-blue-15px">REFERRAL OVERVIEW</div>
              <div className="invite-friend-referral-program-description-container">
                <div className="invite-friend-referral-program-description-first-line">
                  <p className="inter-normal-white-14px">You've referred </p>
                  <p className="inter-normal-keppel-14px">{isLoading ? "" : referredCount}</p>
                  <p className="inter-normal-white-14px"> friends !</p>
                </div>
                <div className="invite-friend-sigdao-earn invite-friend-referral-program-description-line">
                  <p className="inter-normal-white-14px">SIGDAO Earned:</p>
                  <div className="invite-friend-referral-program-reward-container">
                    <SigdaoIcon />
                    <div className="inter-semi-bold-keppel-15px">{isLoading ? "" : referredCount * 3}</div>
                  </div>
                </div>
                <div className="invite-friend-referral-program-description-line invite-friend-refer-friends-description">
                  Refer {rewardDetailList[2].requireTimes} friends to unlock Super Connector
                </div>
                <div className="invite-friend-referral-program-description-line">
                  <div className="invite-friend-reward-display">
                    <div className={"rewards-goal"}>
                      <div className="rewards-goal-number inter-semi-bold-keppel-14px">{isLoading ? "" : referredCount}</div>
                      <div className={"rewards-goal-text inter-semi-bold-white-14px"}>/ {rewardDetailList[2].requireTimes}</div>
                    </div>
                  </div>
                  <img src={process.env.PUBLIC_URL + "/img/inviteFriend/icon-arrowsx3.svg"} alt="" className="invite-friend-arrow" onClick={() => navigate("/rewardDetail/3")} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return <CenterLayout bgImg={false} content={content} />;
};

export default InviteFriend;
