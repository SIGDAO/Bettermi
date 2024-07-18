import * as React from "react";
import "./inviteFriend.css";
import { CenterLayout } from "../../components/layout";
import { BackButton } from "../../components/button";
import { BlackAlert } from "../../components/alert";
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
  const [referredCount,setReferredCount] = React.useState<number>(0);
  const [isLoading,setLoading] = React.useState<boolean>(true);
  const inviteFriendLink: string = window.location.origin + "/referralCode/" + userAccountId;
  const loadedCheck = React.useRef(false);
  async function countReferredUser(ledger2:Api,userAccountId:string){
    // ledger2.account
    // .getAccount({ accountId: userAccountId })
    // .then(async (account) => {
    const TokenDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR;
    const accountTransaction = await ledger2.account.getAccountTransactions({accountId:userAccountId});
    console.log("accountTransaction is ",accountTransaction);
    var referredCount = 0;
    accountTransaction.transactions.map((transaction) => {
      const message = transaction.attachment.message
      if(transaction.sender === TokenDistributor && message != null &&message.includes("Congrats! You have referred user")){
        console.log("the message is true ",message);
        referredCount = referredCount + 1;
      }

    })
    console.log("referredCount is",referredCount);
    setReferredCount(referredCount);
    setReferredCount(referredCount);
    setLoading(false);
        
  };
  React.useEffect(() => {
    if (loadedCheck.current) {
      return;
    }
    loadedCheck.current = true;
    countReferredUser(ledger,userAccountId);

  }, []);

  const handleCopyDiscordUsername = (): void => {
    navigator.clipboard.writeText(inviteFriendLink);
    setAlertWarningString("Copied !");
    setAlert(true);
    setCopyAlertCount(1);
  };

  const content: JSX.Element = (
    <div className="screen">
      <div className="bettermi-invite-friend-layout">
        <BlackAlert alertWarningString={alertWarningString} copyAlertCount={copyAlertCount} setCopyAlertCount={setCopyAlertCount} alert={alert} setAlert={setAlert} />
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
                  {
                    isLoading?
                  <p className="inter-normal-keppel-14px"></p>
                  :
                  (
                    <p className="inter-normal-keppel-14px">{referredCount}</p>
                  )

                  }
                  <p className="inter-normal-white-14px"> friends !</p>
                </div>
                <div className="invite-friend-sigdao-earn invite-friend-referral-program-description-line">
                  <p className="inter-normal-white-14px">SIGDAO Earned:</p>
                  <div className="invite-friend-referral-program-reward-container">
                    <SigdaoIcon />
                    {isLoading?
                    <div className="inter-semi-bold-keppel-15px"></div>
                    :
                    (
                      <div className="inter-semi-bold-keppel-15px">{referredCount*3}</div>
                    )
}
                  </div>
                </div>
                <div className="invite-friend-referral-program-description-line invite-friend-refer-friends-description">Refer {rewardDetailList[2].requireTimes} friends to unlock Super Connector</div>
                <div className="invite-friend-referral-program-description-line">
                  <div className="invite-friend-reward-display">
                    <div className={"rewards-goal"}>
                      {
                        isLoading?
                      <div className="rewards-goal-number inter-semi-bold-keppel-14px"></div>
                      :
                      (
                        <div className="rewards-goal-number inter-semi-bold-keppel-14px">{referredCount}</div>
                      )
                      }
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
