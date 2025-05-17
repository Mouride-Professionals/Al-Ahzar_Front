'use client';
import useCustomRedirect from 'src/lib/auth/redirect';
import Loading from './dashboard/loading';

export default function Home() {

  useCustomRedirect();
  return (
    <Loading />
  )
}