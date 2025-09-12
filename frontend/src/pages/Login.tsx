import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  // 🔥 FUNCIÓN PARA VALIDAR EMAIL EN TIEMPO REAL
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Formato de email inválido');
      return false;
    }
    setEmailError('');
    return true;
  };

  // 🔥 FUNCIÓN PARA VALIDAR CONTRASEÑA
  const validatePassword = (password: string): boolean => {
    if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // 🔥 FUNCIÓN PARA VALIDAR USERNAME
  const validateUsername = (username: string): boolean => {
    if (!isLogin && username.length < 3) {
      setUsernameError('El usuario debe tener al menos 3 caracteres');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 🔥 VALIDACIONES EN FRONTEND ANTES DE ENVIAR
    let isValid = true;

    if (!validateEmail(email)) {
      isValid = false;
    }
    
    if (!validatePassword(password)) {
      isValid = false;
    }

    if (!isLogin && !validateUsername(username)) {
      isValid = false;
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await signIn(email, password);
        navigate('/', { replace: true });
      } else {
        await signUp(email, password, username);
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 MANEJADORES DE CAMBIO CON VALIDACIÓN EN TIEMPO REAL
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setUsernameError('');
  };

  // 🔥 VALIDAR AL PERDER EL FOCO (BLUR)
  const handleEmailBlur = () => {
    validateEmail(email);
  };

  const handlePasswordBlur = () => {
    validatePassword(password);
  };

  const handleUsernameBlur = () => {
    if (!isLogin) validateUsername(username);
  };

  const toggleLoginMode = () => {
    setIsLogin(!isLogin);
    // 🔥 LIMPIAR ERRORES AL CAMBIAR DE MODO
    setError('');
    setEmailError('');
    setPasswordError('');
    setUsernameError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Ingresa a tu cuenta de Tahitic' 
              : 'Únete a la comunidad de Tahitic'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Input
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={handleUsernameChange}
                  onBlur={handleUsernameBlur}
                  required={!isLogin}
                  disabled={loading}
                  className={usernameError ? 'border-red-500' : ''}
                />
                {usernameError && (
                  <p className="text-red-500 text-sm mt-1">{usernameError}</p>
                )}
              </div>
            )}
            
            <div>
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                required
                disabled={loading}
                className={emailError ? 'border-red-500' : ''}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                required
                disabled={loading}
                minLength={6}
                className={passwordError ? 'border-red-500' : ''}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
              {!isLogin && !passwordError && (
                <p className="text-gray-500 text-sm mt-1">
                  Mínimo 6 caracteres
                </p>
              )}
            </div>
            
            {error && (
              <div className="text-red-600 text-sm p-2 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
            </Button>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={toggleLoginMode}
                className="text-blue-600 hover:underline"
                disabled={loading}
              >
                {isLogin 
                  ? '¿No tienes cuenta? Regístrate aquí' 
                  : '¿Ya tienes cuenta? Inicia sesión'
                }
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O continúa con</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={signInWithGoogle}
              type="button"
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Link 
              to="/" 
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ← Volver al inicio
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};