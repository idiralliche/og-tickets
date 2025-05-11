import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { NotificationContext } from '../context/NotificationContext';
import {
  activateAccount,
  resendActivation,
} from '../services/activationService';

export const useActivation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);
  const [status, setStatus] = useState('pending');
  const [resendLoading, setResendLoading] = useState(false);

  const uid = searchParams.get('uid');
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    const activate = async () => {
      if (!uid || !token) {
        showNotification("Lien d'activation invalide.", 'error');
        setStatus('error');
        return;
      }
      try {
        await activateAccount(uid, token);
        setStatus('success');
        showNotification(
          'Compte activé ! Vous pouvez vous connecter.',
          'success'
        );
        setTimeout(() => navigate('/acces', { replace: true }), 2000);
      } catch (err) {
        const errorMessage = 'Erreur lors de la tentative d’activation';
        console.error(`${errorMessage} :`, err);
        showNotification(errorMessage, 'error');
        setStatus('error');
      }
    };

    activate();
  }, [uid, token, navigate, showNotification]);

  const handleResend = async () => {
    if (!email) return;
    setResendLoading(true);
    try {
      await resendActivation(email);
      showNotification('Lien d’activation renvoyé !', 'success');
    } catch (err) {
      const errorMessage =
        'Erreur lors de la tentative de renvoi du lien d’activation';
      console.error(`${errorMessage} :`, err);
      showNotification(errorMessage, 'error');
    } finally {
      setResendLoading(false);
    }
  };

  return { status, email, resendLoading, handleResend };
};
