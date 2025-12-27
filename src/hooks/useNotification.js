import { useState, useCallback } from 'react';

export const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback(({ type, title, message, onConfirm, onCancel, showCancel = false }) => {
    setNotification({
      type,
      title,
      message,
      onConfirm,
      onCancel,
      showCancel,
      id: Date.now() // Unique ID for each notification
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const showConfirmDialog = useCallback(({ title, message, onConfirm, onCancel }) => {
    showNotification({
      type: 'confirm',
      title,
      message,
      onConfirm: () => {
        onConfirm();
        hideNotification();
      },
      onCancel: () => {
        if (onCancel) onCancel();
        hideNotification();
      },
      showCancel: true
    });
  }, [showNotification, hideNotification]);

  const showSuccess = useCallback(({ title, message }) => {
    showNotification({
      type: 'success',
      title,
      message,
      onConfirm: hideNotification
    });
  }, [showNotification, hideNotification]);

  const showError = useCallback(({ title, message }) => {
    showNotification({
      type: 'error',
      title,
      message,
      onConfirm: hideNotification
    });
  }, [showNotification, hideNotification]);

  const showInfo = useCallback(({ title, message }) => {
    showNotification({
      type: 'info',
      title,
      message,
      onConfirm: hideNotification
    });
  }, [showNotification, hideNotification]);

  return {
    notification,
    showNotification,
    hideNotification,
    showConfirmDialog,
    showSuccess,
    showError,
    showInfo
  };
};
