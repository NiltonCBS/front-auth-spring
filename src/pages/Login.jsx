// pages/Login.jsx - Refatorado usando componentes reutilizáveis
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, LogIn } from 'lucide-react';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import PasswordInput from '../components/ui/PasswordInput';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE = 'http://localhost:8080';

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validação de e-mail com regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Digite um e-mail válido.');
      setIsLoading(false);
      return;
    }

    // Validação de senha
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      alert('A senha deve ter pelo menos 6 caracteres, incluindo letras e números.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/despesas');
    } catch (error) {
      alert('Erro ao fazer login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta</h1>
          <p className="text-gray-600">Entre em sua conta para continuar</p>
        </div>

        {/* Login Form */}
        <Card className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <PasswordInput
              id="password"
              label="Senha"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              <div className="flex items-center justify-center">
                <LogIn className="w-5 h-5 mr-2" />
                Entrar
              </div>
            </Button>
          </form>

          <Card.Footer className="text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <button 
                onClick={() => navigate('/register')}
                className="text-green-600 hover:text-green-800 font-medium transition-colors"
              >
                Cadastre-se
              </button>
            </p>
          </Card.Footer>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Ao entrar, você concorda com nossos{' '}
            <button className="text-blue-600 hover:text-blue-800 transition-colors">
              Termos de Uso
            </button>{' '}
            e{' '}
            <button className="text-blue-600 hover:text-blue-800 transition-colors">
              Política de Privacidade
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;