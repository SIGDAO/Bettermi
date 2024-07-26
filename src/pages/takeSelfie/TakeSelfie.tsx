import * as React from "react";
import { CenterLayout } from "../../components/layout";
import { useRef, useState, useCallback, useEffect } from "react";

import Webcam from "react-webcam";
import "./TakeSelfie.css";
import { BackButton } from "../../components/button";
import CSS from "csstype";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { profileSlice, selectCurrentIsGuest, selectCurrentIsNewUser, selectCurrentIsSelfie } from "../../redux/profile";
import { store } from "../../redux/reducer";
import { userBMISlice } from "../../redux/userBMI";
import { useGetBMIMutation } from "../../redux/userBMIApi";
import useEnhancedEffect from "@mui/material/utils/useEnhancedEffect";
import { isSelfieRecord, isTodayHaveSelfieRecord } from "../../components/bmiCalculate";
import { accountId } from "../../redux/account";
import { useLedger } from "../../redux/useLedger";
import BorderLinearProgress from "./borderLinearProgress";
import { set } from "immer/dist/internal";
import { BMI } from "../../redux/userBMIApi";
// import {isMobile} from 'react-device-detect';

interface ITakeSelfieProps {}

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const mobileConstraints = {
  // width: 360,
  // height: 480,
  aspectRatio: 1,
  facingMode: "user",
};

const takeSelfieButton: CSS.Properties = {
  background: `url(${process.env.PUBLIC_URL}/img/takeSelfie/icon--take-photo-1@1x.png)`,
  backgroundSize: "cover",
  width: "100px",
  height: "100px",
  // 'position': 'absolute',
  // 'left': 'calc((100% - 100px) / 2)',
  border: "none",
  outline: "none",
  cursor: "pointer",
  // 'top': 'calc(529px - 50px)',
  // 'top': '575px',
};

const convertBase64toJpg = (base64String: string): File => {
  const byteCharacters = atob(base64String.split(",")[1]);

  // Convert the byte string to a Uint8Array
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Create a Blob object from the Uint8Array
  const blob = new Blob([byteArray], { type: "image/jpeg" });

  // Create a File object from the Blob and set the name to be "image.jpg"
  return new File([blob], "image.jpg", { type: "image/jpeg" });
};

const counttime = (setCount) => {
  const incrementInterval = 30000 / 99;
  const timer = setInterval(() => {
    setCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount >= 99) {
        clearInterval(timer);
      }
      return newCount;
    });
  }, incrementInterval);

  return () => {
    clearInterval(timer);
  };
};

// main function
const TakeSelfie: React.FunctionComponent<ITakeSelfieProps> = (props) => {
  const webcamRef = useRef<Webcam>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [bmidata, setbmidata] = useState<any>();
  // const [isLoading, setIsLoading] = useState(false);
  // var navigatePath: string = '/generateBMINFTImport'
  const [navigatePath, setNavigatePath] = useState<string>("/generateBMIDaily");
  const tempAccountId = useSelector(accountId);
  const Ledger2 = useLedger();
  const [count, setCount] = useState(0);
  var [imageSrc, setImageSrc] = useState<string | null | undefined>();
  const isSelfie = useSelector(selectCurrentIsSelfie);
  const isNewUser = useSelector(selectCurrentIsNewUser);
  const [mobileWidth, setMobileWidth] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  var [getBMI, { isLoading, data }] = useGetBMIMutation();
  const isGuest = useSelector(selectCurrentIsGuest);

  const handleResize = () => {
    setMobileWidth(window.innerWidth);

    if (window.innerWidth < 819) return setIsMobile(true);
    setIsMobile(false);
  };

  const handleSetNavigatePath = (): void => {
    if (isGuest) {
      setNavigatePath("/generateBMIDaily");
      return;
    }
    isSelfieRecord(tempAccountId, Ledger2).then((result) => {
      console.log("result is ",result);
      if (!result) {
        setNavigatePath("/generateBMINFTImport");
      }
    });
  };

  const checkifIsSelfie = () => {
    if (isSelfie) return <Navigate to="/home" />;

    return <CenterLayout content={content} bgImg={false} />;
  };


  useEffect(() => {
    if (data && "bmi" in data) {
      const { bmi } = data;

      dispatch(profileSlice.actions.setBMI(bmi.toFixed(1).toString()));

      navigate(navigatePath);
    } else if (data && "error" in data) {
      if ((data as { error: string }).error === "Face not found in Image") {
        navigate("/errorTakeSelfieNoFace");
      }

      if ((data as { error: string }).error === "More than one face found in Image") {
        navigate("/errorTakeSelfieTooManyFace");
      }

    }
  }, [data]);

  // change the navigate path when the user has already create bmi contract
  useEffect(() => {
    handleSetNavigatePath();

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const action: Function = async () => {
      const formData = new FormData();
      if (!imageSrc) {
        navigate(navigatePath);
        return;
      }
      formData.append("file", convertBase64toJpg(imageSrc));
      dispatch(profileSlice.actions.setSelfieImage(imageSrc));
      await getBMI(formData);
    };

    if (imageSrc) {
      // dispatch(profileSlice.actions.setSelfieImage(imageSrc))
      // dispatch(profileSlice.actions.setBMI('25.5'))
      action();
    }
    // navigate(navigatePath)
  }, [imageSrc]);

  useEffect(() => {
    if (isLoading && count === 0) {
      counttime(setCount);
    }
  }, [isLoading]);

  // for mobile
  const webcamContainerStyle: CSS.Properties = {
    zIndex: "1",
    display: "flex",
    position: "relative",
    // 'top': 'calc(190px - 50px)',
    maxHeight: `${mobileWidth}px`,
    justifyContent: "center",
    overflow: "hidden",
    width: isMobile ? `${mobileWidth}px` : "819px",
    marginTop: "50px",
  };

  const mobile = process.env.REACT_APP_MOBILE === "true";
  // const width = process.env.REACT_APP_MOBILE === 'true' ? '390' : '819'
  const width = 819;

  if (mobile) {
    webcamContainerStyle.width = "390px";
    webcamContainerStyle.left = "calc((100% - 390px) / 2)";
    webcamContainerStyle.height = "calc(844px - 230px)";
    webcamContainerStyle.overflow = "hidden";
  }

  const selfieShadow: CSS.Properties = {
    width: isMobile ? `${mobileWidth}px` : "819px",
    // 'width': '819px',
    height: isMobile ? `${mobileWidth}px` : "461px",
    aspectRatio: "inherit",
  };

  // capture the selfie image, and store it in the redux store
  const capture = React.useCallback(() => {
    setImageSrc(webcamRef.current?.getScreenshot());
    // if (imageSrc) {
    //   // dispatch(profileSlice.actions.setSelfieImage(imageSrc))
    //   // dispatch(profileSlice.actions.setBMI('25.5'))
    //   action()
    // }
    // navigate(navigatePath)
  }, [webcamRef]);

  const content: JSX.Element = (
    <div className="selfie-content-container">
      <BackButton customiseBackButtonLink={!isNewUser ? "/home" : ""} />
      {/* <div className="disclaimer inter-normal-white-15px">
      We super care your privacy, your selfie will not be stored
      </div> */}
      <div className="webcam-container" style={webcamContainerStyle}>
        {isLoading ? (
          <div className="loading-container">
            <img src={imageSrc ? imageSrc : undefined} alt="loading" />
          </div>
        ) : (
          <Webcam
            audio={false}
            // height={720}
            screenshotFormat="image/jpeg"
            // width={1280}
            width={isMobile ? mobileWidth : width}
            ref={webcamRef}
            videoConstraints={isMobile ? mobileConstraints : videoConstraints}
          />
        )}
        <div className="selfie-shadow-container" style={selfieShadow}>
          {/* <img src={process.env.PUBLIC_URL+"/img/takeSelfie/Scanning_layer.png"} alt="" className="selfie-shadow" />   */}
        </div>
      </div>
      {isLoading ? (
        <div className="loading-progress-container">
          <div className="disclaimer inter-normal-white-15px">Scaning...</div>
          <div className="animation-containter">
            <div className="percentage-display inter-normal-cape-cod-12px">{count}%</div>
            <BorderLinearProgress variant="determinate" value={count} />
          </div>
        </div>
      ) : (
        <>
          <div className="disclaimer inter-normal-white-15px">
            <h3>❗️❗️Your selfie will NOT be stored, we care about your privacy❗️❗️</h3>
          </div>
          <h3></h3>
          <button style={takeSelfieButton} onClick={capture} />
        </>
      )}
    </div>
  );


  return checkifIsSelfie();
};

export default TakeSelfie;

// useEffect(() => {
//   const getCameraSize = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       const videoElement = webcamRef.current;

//       if (videoElement) {
//         videoElement.srcObject = stream;
//         await videoElement.play();

//         const { videoWidth, videoHeight } = videoElement;

//       }
//     } catch (error) {
//       console.error('Error accessing camera:', error);
//     }
//   };

//   getCameraSize();

//   return () => {
//     const videoElement = webcamRef.current;
//     if (videoElement) {
//       videoElement.srcObject = null;
//     }
//   };
// }, []);
