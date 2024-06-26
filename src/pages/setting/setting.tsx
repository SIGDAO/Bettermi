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
import { GuestConnectWallectButton } from "../../components/button";
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
          <SettingOption title={"Membership"} description={"Discord"} disabled={false} arrow={true} inBettermiPath={false} navigatePath={"https://discord.com/invite/MATW3Dcdcw"} />
          <SettingOption title={"Account ID"} description={userAccountId ?? ""} disabled={isGuest} arrow={true} inBettermiPath={false} navigatePath={ Config.Explorer + "address/" + userAccountId} />
          <SettingOption title={"Wallet"} description={isGuest ? "Connect Wallet" : "XT wallet"} disabled={false} arrow={true} inBettermiPath={true} navigatePath={isGuest ? "/" : undefined } />
          <SettingOption title={"Invite Friends"} description={"Show link"} disabled={isGuest} arrow={true} inBettermiPath={false} />
          <SettingOption title={"Get SIGDAO Token"} description={""} disabled={false} arrow={true} inBettermiPath={false} navigatePath={"https://www.signumswap.com/tokens/5453974739826751020"} />
          <SettingOption title={"NFTs Marketplace"} description={""} disabled={false} arrow={true} inBettermiPath={true} navigatePath={"/allNftList"} />
          <SettingOption title={"Terms of Use"} description={""} disabled={false} arrow={true} inBettermiPath={false} navigatePath={"https://www.bettermi.io/en/termsofservice.html"} />
          <SettingOption title={"Privacy Policy"} description={""} disabled={false} arrow={true} inBettermiPath={false} navigatePath={"https://www.bettermi.io/en/privacypolicy.html"} />
          <SettingOption title={"Help"} description={""} disabled={false} arrow={true} inBettermiPath={false} navigatePath={"https://www.bettermi.io/#content3-gm"} />
          <SettingOption title={"Disable"} description={isGuest ? "" : "0.0.04"} disabled={isGuest} arrow={isGuest} inBettermiPath={false} />
          {isGuest ? (
          <div className="setting-connect-wallet-container">
            <GuestConnectWallectButton height={"56px"} width={"248px"} />
          </div>
        ) : (
          <Button
            className="bottom-controls-7DUKxJ"
            onClick={() => {
              logout();
            }}
          >
            <div className="button_-logout-ChdhUr">
              <div className="button1-GdXCBJ"></div>
              <div className="mintagain-GdXCBJ inter-semi-bold-white-15px">Logout</div>
            </div>
          </Button>
        )}

        </div>
{/* <div className="settings-7DUKxJ settings">
  <div className="cards-azNBHQ">
    <div className="x16185-VD8XDI">
      <div className="x31">
        <div className="membership-nkDCBT inter-normal-white-15px">Community</div>
      </div>
      <Link to="https://discord.com/invite/MATW3Dcdcw" target="_blank" rel="noopener noreferrer">
        <div className="x16184-RJpkbo x16184">
          <div className="discord-sDy3yd inter-normal-white-15px">Discord</div>
        </div>
      </Link>
      <img className="icon-ionic-ios-arrow-forward-inactive" src="img/setting/icon-ionic-ios-arrow-forward-1@1x.png" alt="Icon ionic-ios-arrow-forward" />
      <img className="x15" src="img/setting/file---15@1x.png" alt="15" />
    </div>
    <Link
      to={`https://${process.env.REACT_APP_NETWORK === "Signum" ? "explorer.signum.network/address" : "testnet.explorer.signum.network/address"}/${userAccountId}`}
      target="_blank"
      rel="noopener noreferrer"
      className={isGuest && "disabled-link"}
    >
      <div className="x16186-VD8XDI">
        <div className="x31">
          <div className={`invite-friends-MxX0D6 inter-normal-white-15px ${isGuest && "brightness-0-5"}`}>Account ID</div>
        </div>
        <div className="x16184-QxO6IE x16184">
          <div className="x12345678-lPJi7x inter-normal-white-15px ">{userAccountId}</div>
        </div>
        <img
          className={isGuest ? "icon-ionic-ios-arrow-forward brightness-0-5" : "icon-ionic-ios-arrow-forward"}
          src="img/setting/icon-ionic-ios-arrow-forward-1@1x.png"
          alt="Icon ionic-ios-arrow-forward"
        />
        <img className="x15" src="img/setting/file---15@1x.png" alt="15" />
      </div>
    </Link>

    <div className="x16187-VD8XDI">
      <div className="x31">
        <div className="wallet-HTBhsQ inter-normal-white-15px">Wallet</div>
      </div>
      <div className="x16184-a64QJA x16184">
        {isGuest ? (
          <div onClick={() => navigate("/")} className={"xt-wallet-u2WLwG inter-normal-white-15px"} style={{ cursor: "pointer" }}>
            Connect Wallet
          </div>
        ) : (
          <div className={"xt-wallet-u2WLwG inter-normal-white-15px brightness-0-5"}>XT wallet"</div>
        )}
      </div>
      <img className={isGuest ? "icon-ionic-ios-arrow-forward" : "icon-ionic-ios-arrow-forward-inactive"} src="img/setting/icon-ionic-ios-arrow-forward-1@1x.png" alt="Icon ionic-ios-arrow-forward" />
      <img className="x15" src="img/setting/file---15@1x.png" alt="15" />
    </div>
    <div className="x16189-VD8XDI">
      <div className="x31">
        <div className={isGuest ? "multi-chain-switch-tbbzDm inter-normal-white-15px brightness-0-5" : "multi-chain-switch-tbbzDm inter-normal-white-15px"}>Invite Friends</div>
      </div>
      <div className="x16184-6XzBK0 x16184">
        <div className="sigppnum-qeaPIP inter-normal-white-15px brightness-0-5">Show link</div>
      </div>
      <img className="icon-ionic-ios-arrow-forward-inactive" src="img/setting/icon-ionic-ios-arrow-forward-1@1x.png" alt="Icon ionic-ios-arrow-forward" />
      <img className="x15" src="img/setting/file---15@1x.png" alt="15" />
    </div>
    <div className="x16190-VD8XDI" onClick={() => navigate("/allNftList")}>
      <div className="x31">
        <div className="nf-ts-marketplace-aBwqob inter-normal-white-15px ">NFTs Marketplace</div>
      </div>
      <img className="icon-ionic-ios-arrow-forward" src="img/setting/icon-ionic-ios-arrow-forward-1@1x.png" alt="Icon ionic-ios-arrow-forward" />
      <img className="x15" src="img/setting/file---15@1x.png" alt="15" />
    </div>
    <Link to="https://www.signumswap.com/tokens/5453974739826751020" target="_blank" rel="noopener noreferrer">
      <div className="x16199-VD8XDI">
        <div className="x31">
          <div className="get-sig-dao-token-R3QCCH inter-normal-white-15px ">Get SIGDAO Token</div>
        </div>
        <img className="icon-ionic-ios-arrow-forward" src="img/setting/icon-ionic-ios-arrow-forward-1@1x.png" alt="Icon ionic-ios-arrow-forward" />
        <img className="x15" src="img/setting/file---15@1x.png" alt="15" />
      </div>
    </Link>

    <Link to="https://www.bettermi.io/en/termsofservice.html" target="_blank" rel="noopener noreferrer">
      <div className="x16192-VD8XDI">
        <div className="x31">
          <div className="terms-of-use-vMQ5ls inter-normal-white-15px">Terms of Service</div>
        </div>
        <img className="icon-ionic-ios-arrow-forward" src="img/setting/icon-ionic-ios-arrow-forward-1@1x.png" alt="Icon ionic-ios-arrow-forward" />
        <img className="x15" src="img/setting/file---15@1x.png" alt="15" />
      </div>
    </Link>
    <Link to="https://www.bettermi.io/en/privacypolicy.html" target="_blank" rel="noopener noreferrer">
      <div className="x16193-VD8XDI">
        <div className="x31">
          <div className="privacy-policy-Am8TnD inter-normal-white-15px">Privacy Policy</div>
        </div>
        <img className="icon-ionic-ios-arrow-forward" src="img/setting/icon-ionic-ios-arrow-forward-1@1x.png" alt="Icon ionic-ios-arrow-forward" />
        <img className="x15" src="img/setting/file---15@1x.png" alt="15" />
      </div>
    </Link>
    <Link to="https://www.bettermi.io/#content3-gm" target="_blank" rel="noopener noreferrer">
      <div className="x16223-VD8XDI">
        <div className="x31">
          <div className="help-YkYlbF inter-normal-white-15px">Help</div>
        </div>
        <img className="icon-ionic-ios-arrow-forward " src="img/setting/icon-ionic-ios-arrow-forward-1@1x.png" alt="Icon ionic-ios-arrow-forward" />
        <img className="x15" src="img/setting/file---15@1x.png" alt="15" />
      </div>
    </Link>

    <div className="x16222-VD8XDI">
      <div className="x16184-OCPXoe x16184">
        <div className="x0004-pzNHOH inter-normal-white-15px">{!isGuest && "0.0.04"}</div>
      </div>
      {isGuest && <img className="icon-ionic-ios-arrow-forward-inactive" src="img/setting/icon-ionic-ios-arrow-forward-1@1x.png" alt="Icon ionic-ios-arrow-forward" />}

      <div className="x31">
        <div className={isGuest ? "version-xPcu6a inter-normal-white-15px brightness-0-5" : "version-xPcu6a inter-normal-white-15px"}>{isGuest ? "Disable" : "Version"}</div>
      </div>
    </div>
  </div>
</div> */}

        {/* <div className="settings-xeBDcv settings inter-semi-bold-white-18px">Settings</div> */}
        {/* <a href="javascript:history.back()">
          <div className="icon-arrow-left-7DUKxJ icon-arrow-left">
            <img className="icon-arrow-left-trdL9a icon-arrow-left" src="img/setting/icon-arrow-left-10@1x.png" alt="icon-arrow-left" />
          </div>
        </a> */}
        {/* <a href="bettermidapp-ai-coach.html">
        <div className="ic_sentiment_very_satisfied_24px-7DUKxJ ic_sentiment_very_satisfied_24px">
          <img
            className="ic_sentiment_very_satisfied_24px-FSbIhl ic_sentiment_very_satisfied_24px"
            src="img/setting/ic-sentiment-very-satisfied-24px-1@1x.png"
            alt="ic_sentiment_very_satisfied_24px"
            />
        </div>
      </a> */}
      </div>
    </div>
  );

  return <CenterLayout content={content} bgImg={false} />;
};

export default Setting;
