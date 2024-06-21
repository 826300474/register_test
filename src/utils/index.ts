import { useState } from 'react';

export type ActionType = 'Create' | 'Read' | 'Update';

export const useModalState = (initialVal: boolean): [boolean, { showModal: () => void, hideModal: () => void }] => {
    const [state, setstate] = useState(initialVal);
  
    const showModal = () => setstate(true);
    const hideModal = () => setstate(false);
  
    return [state, {
      showModal,
      hideModal
    }]
  }