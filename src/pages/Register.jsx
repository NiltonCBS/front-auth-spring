import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react';

const PasswordRequirement = ({ label, valid }) => (
  <div className={`flex items-center space-x-1 ${valid ? 'text-green-600' : 'text-gray-400'}`}>
    <span>{valid ? '✅' : '❌'}</span>
    <span>{label}</span>
  </div>
);


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
<div className="space-y-2">
  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
    Senha
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Lock className="h-5 w-5 text-gray-400" />
    </div>
    <input
      id="password"
      type={showPassword ? 'text' : 'password'}
      placeholder="Crie uma senha segura"
      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    <button
      type="button"
      className="absolute inset-y-0 right-0 pr-3 flex items-center"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? (
        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
      ) : (
        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
      )}
    </button>
  </div>

  {/* Password Requirements */}
  <div className="text-xs mt-2 text-gray-700 space-y-1">
    <PasswordRequirement label="Pelo menos 6 caracteres" valid={password.length >= 6} />
    <PasswordRequirement label="Pelo menos 1 letra" valid={/[A-Za-z]/.test(password)} />
    <PasswordRequirement label="Pelo menos 1 número" valid={/\d/.test(password)} />
  </div>
</div>


           

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              onClick={handleRegister}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Cadastrando...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Criar Conta
                </div>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Já tem uma conta?{' '}
              <button 
                onClick={() => navigate('/')}
                className="text-green-600 hover:text-green-800 font-medium transition-colors"
              >
                Faça login
              </button>
            </p>
          </div>
        </div>

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