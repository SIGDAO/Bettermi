import React from 'react';

interface PopupModalProps {
  message: string;
}

const PopupModal: React.FC<PopupModalProps> = ({ message }) => {
  return (
    <div className="popup-modal">
      <div className="popup-content">
        <h2>Popup Modal</h2>
        <p>{message}</p>
        <button onClick={() => console.log("closed")}>Close</button>
      </div>
    </div>
  );
};

export default PopupModal;