'use client';
import useCustomRedirect from 'src/lib/auth/redirect';

export default function Home() {
  console.log('Home page');   
  
  useCustomRedirect();
  return <></>;
}