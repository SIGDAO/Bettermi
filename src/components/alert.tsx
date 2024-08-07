import { Alert } from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";

interface IBlackAlertProps {
  alertWarningString?: string;
}

// Create a global state to manage the alert
let globalSetAlert: React.Dispatch<React.SetStateAction<{ show: boolean; message: string }>> | null = null;

export const displayPopUpMessage = (message: string): void => {
  if (globalSetAlert) {
    globalSetAlert({ show: true, message });
  }
};

export const BlackAlert: React.FunctionComponent = () => {
  const [alert, setAlert] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  // Set the global setAlert function
  useEffect(() => {
    globalSetAlert = setAlert;
    return () => {
      globalSetAlert = null;
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (alert.show) {
      timer = setTimeout(() => {
        setAlert({ show: false, message: "" });
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [alert.show]);

  return (
    <>
      {alert.show && (
        <Alert
          className="copied-alert"
          icon={false}
          severity="success"
        >
          {alert.message}
        </Alert>
      )}
    </>
  );
};