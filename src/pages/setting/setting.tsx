import * as React from "react";
import { CenterLayout } from "../../components/layout";
import "./setting.css";
import { Button } from "reactstrap";
import { useContext } from "react";
import { AppContext } from "../../redux/useContext";
import { GenericExtensionWallet } from "@signumjs/wallets";
import { Link, useNavigate } from "react-router-dom";
import { store } from "../../redux/reducer";
import { accountId } from "../../redux/account";
import { useSelector } from "react-redux";
import { ShortTitleBar } from "../../components/titleBar";
import { selectCurrentIsGuest } from "../../redux/profile";
import { GuestConnectWallectButton, PurpleButton } from "../../components/button";
import SettingOption from "./settingOption";
import { Config } from "../../redux/config";
interface ISettingProps {}

const Setting: React.FunctionComponent<ISettingProps> = (props) => {
  const { appName, Wallet, Ledger } = useContext(AppContext);
  const userAccountId = useSelector(accountId);
  const navigate = useNavigate();
  const isGuest = useSelector(selectCurrentIsGuest);
  const logout = () => {
    store.dispatch({ type: "USER_LOGOUT" });
    Wallet.Extension = new GenericExtensionWallet();

    navigate("/");
  };

  const content: JSX.Element = (
    <div className="screen">
      <div className="bettermidapp-settings-1">
        {/* <a href="bettermidapp-profile-edit-1.html"><img className="bg-7DUKxJ" src="img/setting/bg-9@1x.png" alt="BG" /> </a> */}
        <ShortTitleBar title="Settings" transparent={true} />
        <div className="settings-7DUKxJ settings">
          <div className="setting-option-content">
            <SettingOption title={"Membership"} description={"Discord"} disabled={false} arrow={true} inBettermiPath={false} navigatePath={"https://discord.com/invite/MATW3Dcdcw"} />
            <SettingOption title={"Account ID"} description={userAccountId ?? ""} disabled={isGuest} arrow={true} inBettermiPath={false} navigatePath={Config.Explorer + "address/" + userAccountId} />
            <SettingOption title={"Wallet"} description={isGuest ? "Connect Wallet" : "XT wallet"} disabled={false} arrow={true} inBettermiPath={true} navigatePath={isGuest ? "/" : undefined} />
            <SettingOption title={"Invite Friends"} description={"Show link"} disabled={isGuest} arrow={true} inBettermiPath={true} navigatePath={"/inviteFriend"} />
            <SettingOption title={"Get SIGDAO Token"} description={""} disabled={false} arrow={true} inBettermiPath={false} navigatePath={"https://www.signumswap.com/tokens/5453974739826751020"} />
            <SettingOption title={"NFTs Marketplace"} description={""} disabled={false} arrow={true} inBettermiPath={true} navigatePath={"/allNftList"} />
            <SettingOption title={"Terms of Service"} description={""} disabled={false} arrow={true} inBettermiPath={false} navigatePath={"https://www.bettermi.io/en/termsofservice.html"} />
            <SettingOption title={"Privacy Policy"} description={""} disabled={false} arrow={true} inBettermiPath={false} navigatePath={"https://www.bettermi.io/en/privacypolicy.html"} />
            <SettingOption title={"Help"} description={""} disabled={false} arrow={true} inBettermiPath={false} navigatePath={"https://www.bettermi.io/#content3-gm"} />
            <SettingOption title={"Disable"} description={""} disabled={true} arrow={isGuest} inBettermiPath={false} isBorderShow={false} />
            <SettingOption title={"Version"} description={"1.2.0.1"} disabled={false} arrow={false} inBettermiPath={true} isBorderShow={false} />
          </div>
          {isGuest ? (
            <div className="setting-button-container">
              <GuestConnectWallectButton height={"56px"} width={"248px"} />
            </div>
          ) : (
            <div className="setting-button-container">
              <PurpleButton text={"Logout"} action={() => logout()} height={"56px"} width={"248px"} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return <CenterLayout content={content} bgImg={false} />;
};

export default Setting;
