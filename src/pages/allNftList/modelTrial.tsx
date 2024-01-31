import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { CustomTextArea } from '../../components/input';
import "./allNftList.css";

interface PopupModalProps {
    level:any;
    isOpen:boolean;
    setIsOpen:(isOpen:boolean) => void;
}
const PopupModal:React.FC<PopupModalProps> = (props) => {
  const {isOpen, setIsOpen,level} = props;
  const [inputAddress, setInputAddress] = React.useState<string>("");
  const [inputValue, setInputValue] = React.useState<string>("");

  const openModal = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <div>
      <Modal isOpen={isOpen} toggle={openModal} >
        <ModalHeader toggle={openModal}>Modal title</ModalHeader>
        <ModalBody>
            <div className = "allNftListModel">
            <CustomTextArea 
                text= {inputAddress} 
                setText={setInputAddress} 
                width={300} 
                height={56} 
                importClassName="nftPrice nftBar-1 nftSearchBar-4"
                activeClassName="nftActiveCard nftBar-1 nftSearchBar-4"
                placeholder="e.g. TS-9DJR-MGA2-VH44-5GMXY"
            />
            <CustomTextArea 
                text= {inputAddress} 
                setText={setInputAddress} 
                width={300} 
                height={56} 
                importClassName="card-number-1 search_bar-1 search_bar-4"
                activeClassName="active-card-number-1 search_bar-1 search_bar-4"
                placeholder="e.g. TS-9DJR-MGA2-VH44-5GMXY"
            />
            </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={openModal}>
            Do Something
          </Button>{' '}
          <Button color="secondary" onClick={openModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default PopupModal;