import * as React from "react";
import { CustomInput, CustomTextArea, RandomGenNameInput } from "../../components/input";
import { Dispatch, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { profileSlice, selectCurrentIsNewUser } from "../../redux/profile";
import { UpdateUserDescription } from "../../NftSystem/updateUserNftStorage";
import { Api } from "@signumjs/core";
import { DeeplinkableWallet, GenericExtensionWallet } from "@signumjs/wallets";
import { BackButton, PurpleButton } from "../../components/button";
import { accountPublicKey } from "../../redux/account";
import { displayPopUpMessage } from "../../components/alert";

interface IEditProfilePopUpWindowProps {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
  isBackButton: boolean;
  setIsBackButton: Dispatch<React.SetStateAction<boolean>>;
  fetchDescription: string;
  fetchName: string;
  fetchAboutYourself: string;
  fetchDiscordUsername: string;
  ledger2: Api;
  userAccountId: string;
  Wallet: {
    Extension: GenericExtensionWallet;
    Deeplink: DeeplinkableWallet;
  };
}

const EditProfilePopUpWindow: React.FunctionComponent<IEditProfilePopUpWindowProps> = (props) => {
  const {
    isOpen,
    setIsOpen,
    isBackButton,
    setIsBackButton,
    fetchDescription,
    fetchName,
    fetchAboutYourself,
    fetchDiscordUsername,
    ledger2,
    userAccountId,
    Wallet,
  } = props;
  const dispatch = useDispatch();

  const userAccountpublicKey = useSelector(accountPublicKey);

  const [name, setName] = useState<string>("");
  const [aboutYourselfText, setAboutYourselfText] = useState<string>("");
  const [descriptionText, setDescriptionText] = useState<string>("");
  const [discordUsernameText, setDiscordUsernameText] = useState<string>("");
  const [isShowStar, setIsShowStar] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isNewUser = useSelector(selectCurrentIsNewUser);

  const uploadToChain = async () => {
    // upload the changed user info to chain
    try {
      const waitingToBeChangedDescription = await ledger2.account.getAccount({
        accountId: userAccountId,
      });
      let newDes = {};
      newDes = Object.assign(newDes, { vs: 1 });
      newDes = Object.assign(newDes, { nm: name });
      newDes = Object.assign(newDes, { ds: aboutYourselfText });
      newDes = Object.assign(newDes, { hp: descriptionText });
      newDes = Object.assign(newDes, { sc: discordUsernameText });
      await UpdateUserDescription(ledger2, newDes, userAccountId, userAccountpublicKey, Wallet, name);
    } catch (e: any) {
      console.log(e);
      throw new Error("Failed to update user information to chain. \nPlease try again.");
    }
  };

  const handleSave = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    if (name.length === 0 || aboutYourselfText.length === 0 || descriptionText.length === 0 || discordUsernameText.length === 0) {
      setIsShowStar(true);
      displayPopUpMessage("Please fill in all the column !");
      setIsLoading(false);
      return;
    }

    if (name === fetchName && aboutYourselfText === fetchAboutYourself && descriptionText === fetchDescription && discordUsernameText === fetchDiscordUsername) {
      setIsOpen((prev) => !prev);
      setIsBackButton(true);
      setIsLoading(false);
      return;
    }

    uploadToChain()
      .then(() => {
        dispatch(profileSlice.actions.setUsername(name));
        dispatch(profileSlice.actions.setAboutYourself(aboutYourselfText));
        dispatch(profileSlice.actions.setDescription(descriptionText));
        dispatch(profileSlice.actions.setDiscordUsername(discordUsernameText));
        setIsOpen((prev) => !prev);
        setIsBackButton(true);
        setIsLoading(false);

        if (isNewUser)  {
          dispatch(profileSlice.actions.setIsNewUser(false));
        }
      })
      .catch((e) => {
        setIsLoading(false);
        displayPopUpMessage(e.message);
      });

  };

  // get the fetch value to useState
  useEffect(() => {
    setName(fetchName);
    setAboutYourselfText(fetchAboutYourself);
    setDescriptionText(fetchDescription);
    setDiscordUsernameText(fetchDiscordUsername);
  }, [fetchName, fetchAboutYourself, fetchDescription, fetchDiscordUsername]);

  return (
    <>
      {isOpen && (
        <div className="hidden-content">
          {/* {isBackButton && <BackButton/>} */}
          <div className="edit-profile">
            {isBackButton && (
              <div className="icon-arrow-left-popup-container" onClick={() => setIsOpen((prev) => !prev)}>
                <img className="icon-arrow-left-popup-image" src={`${process.env.PUBLIC_URL}/img/profile/icon-arrow-left-1@1x.png`} alt="icon-arrow-left" />
              </div>
            )}
            <div className="edit-profile-popup-window-container inter-bold-royal-blue-15px">
              <div className="edit-profile-popup-window-title-container ">
                <img className="ic_edit-1-content" src={`${process.env.PUBLIC_URL}/img/profile/ic-edit-1@1x.png`} alt="" />
                <div className="inter-semi-bold-white-18px">Edit Profile</div>
              </div>
              <div className="edit-profile-popup-window-content">
                <div className="edit-profile-popup-window-input-container">
                  <div className="edit-profile-popup-window-input-title">PICK A USERNAME</div>
                  <RandomGenNameInput
                    name={name}
                    setName={setName}
                    width={300}
                    // ref={(el) => (inputRefs.current[0] = el)}
                  />
                </div>
                <div className="edit-profile-popup-window-input-container">
                  <div className="edit-profile-popup-window-input-title">ABOUT YOURSELF</div>
                  <CustomTextArea
                    importClassName="inter-semi-bold-keppel-15px"
                    text={aboutYourselfText}
                    setText={setAboutYourselfText}
                    width={300}
                    placeholder="♉️  |  29  |  PERSONAL TRAINER"
                    // ref={(el) => (inputRefs.current[1] = el)}
                  />
                </div>
                <div className="edit-profile-popup-window-input-container">
                  <div className="edit-profile-popup-window-input-title">DESCRIPTION TO FRIENDS</div>
                  <CustomTextArea
                    importClassName="inter-normal-white-15px"
                    text={descriptionText}
                    setText={setDescriptionText}
                    width={300}
                    placeholder="I'm a positive person. I love to travel and eat."
                    // ref={(el) => (inputRefs.current[2] = el)}
                  />
                </div>
                <div className="edit-profile-popup-window-input-container">
                  <div className="edit-profile-popup-window-input-title">DISCORD USERNAME</div>
                  <CustomInput
                    importClassName={"inter-normal-white-15px"}
                    text={discordUsernameText}
                    setText={setDiscordUsernameText}
                    width={300}
                    placeholder="Signum#1234"
                    // ref={(el) => (inputRefs.current[3] = el)}
                  />
                </div>
              </div>
              {/* <div className="button_save" onClick={() => handleSave()}>
                <div className="continue-1 inter-semi-bold-white-15px">Done!</div>
              </div> */}
              <div className="edit-profile-save-container">
                <PurpleButton text="Done!" action={() => handleSave()} height="56px" width="248px" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfilePopUpWindow;
