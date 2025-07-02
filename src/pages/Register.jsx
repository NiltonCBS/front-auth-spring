// pages/Register.jsx - Refatorado usando componentes reutilizáveis
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, User, UserPlus } from 'lucide-react';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import PasswordInput from '../components/ui/PasswordInput';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    if (!emailRegex.test(email)) {
      alert('Por favor, insira um e-mail válido.');
      setIsLoading(false);
      return;
    }

    if (!passwordRegex.test(password)) {
      alert('A senha deve ter pelo menos 6 caracteres, incluindo letras e números.');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:8080/auth/register', {
        name,
        email,
        password,
      });
      alert('Cadastro realizado com sucesso!');
      navigate('/');
    } catch (error) {
      alert('Erro ao cadastrar usuário.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-4 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Conta</h1>
          <p className="text-gray-600">Preencha os dados para se cadastrar</p>
        </div>

        {/* Register Form */}
        <Card className="p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            <Input
              id="name"
              type="text"
              label="Nome Completo"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
              required
            />

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
              placeholder="Crie uma senha segura"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showRequirements={true}
              required
            />

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              <div className="flex items-center justify-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Criar Conta
              </div>
            </Button>
          </form>

          <Card.Footer className="text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <button 
                onClick={() => navigate('/')}
                className="text-green-600 hover:text-green-800 font-medium transition-colors"
              >
                Faça login
              </button>
            </p>
          </Card.Footer>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Ao se cadastrar, você concorda com nossos{' '}
            <button className="text-green-600 hover:text-green-800 transition-colors">
              Termos de Uso
            </button>{' '}
            e{' '}
            <button className="text-green-600 hover:text-green-800 transition-colors">
              Política de Privacidade
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;