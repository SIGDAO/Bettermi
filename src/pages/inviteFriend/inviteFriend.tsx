import * as React from "react";
import "./inviteFriend.css";
import { CenterLayout } from "../../components/layout";
import { BackButton } from "../../components/button";
import { BlackAlert } from "../../components/alert";
import { useSelector } from "react-redux";
import { accountId } from "../../redux/account";

interface IInviteFriendProps {}

const InviteFriend: React.FunctionComponent<IInviteFriendProps> = (props) => {
  const userAccountId = useSelector(accountId);

  // alert related
  const [alert, setAlert] = React.useState<boolean>(false); // copy alert
  const [alertWarningString, setAlertWarningString] = React.useState<string>("");
  const [copyAlertCount, setCopyAlertCount] = React.useState<number>(0);
  const inviteFriendLink: string = window.location.origin + "/referralCode/" + userAccountId;

  const handleCopyDiscordUsername = (): void => {
    navigator.clipboard.writeText(inviteFriendLink);
    setAlertWarningString("Copied !");
    setAlert(true);
    setCopyAlertCount(1);
  };

  const content: JSX.Element = (
    <div className="screen">
      <div className="bettermi-invite-friend-layout">
        <BlackAlert alertWarningString={alertWarningString} copyAlertCount={copyAlertCount} setCopyAlertCount={setCopyAlertCount} alert={alert} setAlert={setAlert}/>
        <BackButton />
        <div className="invite-friend-icon-description-container">
          <img className="invite-friend-mimi-icon" src={process.env.PUBLIC_URL + "/img/inviteFriend/mimi_gift.png"} alt="" />
          <div className="invite-friend-description-container">
            <div className="inter-semi-bold-white-28px">Invite Friends !</div>
            <div className="invite-friend-description inter-normal-cadet-blue-15px">Copy and share your referral link to all your friends and earn more SIGDAO !</div>
          </div>
        </div>
        <div className="invite-friend-copy-invite-link-container">
          <input type="text" value={inviteFriendLink} readOnly className="invite-friend-copy-invite-link inter-bold-white-15px" />
          {/* <div className="invite-friend-copy-invite-link-button">Copy</div> */}
          <img src={process.env.PUBLIC_URL + "/img/profile/file---11690@1x.png"} alt="" className="invite-friend-copy-invite-link-button" onClick={() => handleCopyDiscordUsername()} />
        </div>
        <div className="invite-friend-referral-program-container">
          <div className="inter-bold-royal-blue-15px">REFERRAL OVERVIEW</div>
          <div className="invite-friend-referral-program-description-container">
            <div className="invite-friend-referral-program-description-first-line">
              <p className="inter-normal-white-14px" >You've referred </p>
              <p className="inter-normal-keppel-14px">03</p>
              <p className="inter-normal-white-14px"> friends !</p>
            </div>
            <div className="invite-friend-sigdao-earn invite-friend-referral-program-description-line">
              <p className="inter-normal-white-14px">SIGDAO Earned:</p>
              <div className="invite-friend-referral-program-reward-container">
                <div className="sigdao-icon-container">
                  <div className="x441-e5x8kp x441"></div>
                  <div className="x442-e5x8kp x442"></div>
                  <img className="x880-e5x8kp x880" src="/img/file---880-1x-png-10@1x.png" alt="880"/>
                </div>
                <div className="inter-semi-bold-keppel-15px">6</div>
              </div>
            </div>
            <div className="invite-friend-referral-program-description-line invite-friend-refer-friends-description">
              Refer 5 friends to unlock Super Connector
            </div>
            <div className="invite-friend-referral-program-description-line">
              <div className="invite-friend-reward-display">
              <div className={"rewards-goal"}>
              <div className="rewards-goal-number inter-semi-bold-keppel-14px">0</div>
              <div className={"rewards-goal-text inter-semi-bold-white-14px"}>/ 3</div>
            </div>

              </div>
              <img src={process.env.PUBLIC_URL + "/img/inviteFriend/icon-arrowsx3.svg"} alt="" className="invite-friend-arrow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return <CenterLayout bgImg={false} content={content} />;
};

export default InviteFriend;
