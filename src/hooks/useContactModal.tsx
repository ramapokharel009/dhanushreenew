
import { useState } from 'react';

interface ContactModalData {
  productName?: string;
  productId?: string;
}

export const useContactModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contactData, setContactData] = useState<ContactModalData>({});

  const openModal = (data: ContactModalData = {}) => {
    setContactData(data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setContactData({});
  };

  return {
    isOpen,
    contactData,
    openModal,
    closeModal,
  };
};
