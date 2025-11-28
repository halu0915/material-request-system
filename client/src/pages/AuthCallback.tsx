import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setToken(token);
      // Redirect after a short delay to allow context to update
      setTimeout(() => {
        navigate('/');
      }, 500);
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">認證中...</div>
    </div>
  );
}

