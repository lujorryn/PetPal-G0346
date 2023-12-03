import { useEffect, useRef } from 'react';
import styles from './Modal.module.css';

function Modal({ closeModal, children }) {
  const modalRef = useRef(null)

  useEffect(() => {
    const listener = window.addEventListener('click', e => {
      if (modalRef.current && modalRef.current === e.target) closeModal()
    })
  
    return () => {
      window.removeEventListener('click', listener)
    }
  }, [closeModal])
  

  useEffect(() => {
    const listener = window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    return () => {
      window.removeEventListener('click', listener);
    };
  }, [closeModal]);

  return (
    <div className={styles.wrapper} ref={modalRef}>
      {children}
    </div>
  );
}

export default Modal;
