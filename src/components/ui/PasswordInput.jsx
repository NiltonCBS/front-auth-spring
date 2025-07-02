import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import Input from './Input';

const PasswordRequirement = ({ label, valid }) => (
  <div className={`flex items-center space-x-1 ${valid ? 'text-green-600' : 'text-gray-400'}`}>
    <span>{valid ? '✅' : '❌'}</span>
    <span>{label}</span>
  </div>
);

const PasswordInput = ({ 
  label = 'Senha',
  showRequirements = false,
  value,
  onChange,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          {...props}
          label={label}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          icon={Lock}
          className="pr-12"
        />
        
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center top-8"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
          )}
        </button>
      </div>
      
      {showRequirements && value && (
        <div className="text-xs mt-2 text-gray-700 space-y-1">
          <PasswordRequirement 
            label="Pelo menos 6 caracteres" 
            valid={value.length >= 6} 
          />
          <PasswordRequirement 
            label="Pelo menos 1 letra" 
            valid={/[A-Za-z]/.test(value)} 
          />
          <PasswordRequirement 
            label="Pelo menos 1 número" 
            valid={/\d/.test(value)} 
          />
        </div>
      )}
    </div>
  );
};

export default PasswordInput;