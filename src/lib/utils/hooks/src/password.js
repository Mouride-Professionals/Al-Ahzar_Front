import { useState } from 'react';

export const usePasswordType = () => {
  const [passwordType, setPasswordType] = useState('password');

  const togglePasswordType = () =>
    setPasswordType((passwordType) =>
      passwordType == 'password' ? 'text' : 'password'
    );

  return {
    passwordType: passwordType,
    passwordTypeToggler: togglePasswordType,
  };
};
