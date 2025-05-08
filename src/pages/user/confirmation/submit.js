import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ConfirmEmail() {
    const router = useRouter();
    const { confirmation } = router.query;
    const [status, setStatus] = useState('Verifying...');

    useEffect(() => {
        if (confirmation) {
            fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/auth/email-confirmation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ confirmation }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        setStatus('Verification failed. Please try again.');
                    } else {
                        setStatus('Email verified! Redirecting to login...');
                        setTimeout(() => router.push('/login'), 2000);
                    }
                })
                .catch(() => setStatus('An error occurred.'));
        }
    }, [confirmation]);

    return <div>{status}</div>;
}