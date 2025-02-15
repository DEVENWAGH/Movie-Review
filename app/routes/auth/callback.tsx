import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '../../store/hooks';
import { completeAuth } from '../../store/slices/authSlice';

export default function AuthCallback() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const requestToken = localStorage.getItem('request_token');
    if (requestToken) {
      dispatch(completeAuth(requestToken))
        .then(() => {
          navigate('/');
        })
        .catch((error) => {
          console.error('Auth failed:', error);
          navigate('/login');
        });
    }
  }, [dispatch, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-white">Completing authentication...</div>
    </div>
  );
}
