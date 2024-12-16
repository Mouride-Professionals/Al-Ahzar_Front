import autoLogout from './src/autologout';
import { useMockedData as mock } from './src/mock';
import { usePasswordType as password } from './src/password';

export const useAutoLogout = autoLogout;
export const usePasswordType = password;
export const useMockedData = mock;
