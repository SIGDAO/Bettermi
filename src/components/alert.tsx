import { Alert } from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";

interface IBlackAlertProps {
  alertWarningString: string;
  copyAlertCount: number;
  setCopyAlertCount: React.Dispatch<React.SetStateAction<number>>;
  alert: boolean;
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

export const displayPopUpMessage = (message: string, setAlertWarningString: React.Dispatch<React.SetStateAction<string>>, setAlert: React.Dispatch<React.SetStateAction<boolean>>, setCopyAlertCount: React.Dispatch<React.SetStateAction<number>>): void => {
  setAlertWarningString(message);
  setAlert(true);
  setCopyAlertCount(1);
};


export const BlackAlert: React.FunctionComponent<IBlackAlertProps> = ({ alertWarningString, copyAlertCount, setCopyAlertCount, alert, setAlert }) => {
  // alert related
  // const [alert, setAlert] = useState<boolean>(false); // copy alert

  // change alert seconds
  // useEffect(() => {
  //   setCopyAlertCount(2);
  //   setAlert(true);
  // }, [alertWarningString]);

  // countdown for alert message show
  useEffect(() => {
    const countdown = () => {
      if (copyAlertCount > 0) {
        setCopyAlertCount((prevCount) => prevCount - 1);
      } else if (copyAlertCount === 0) {
        setAlert(false);
        clearInterval(timer);
      }
    };

    const timer = setInterval(countdown, 1000);

    return () => clearInterval(timer);
  }, [copyAlertCount]);

  return (
    <>
      {alert && (
        <Alert
          className="copied-alert"
          icon={false}
          // icon={<CheckIcon fontSize="inherit" />}
          severity="success"
        >
          {alertWarningString}
        </Alert>
      )}
    </>
  );
};
