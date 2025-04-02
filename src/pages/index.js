import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import customRedirect from './api/auth/redirect';
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    customRedirect();
    return () => { };
  }, []);

  return <></>;
}
