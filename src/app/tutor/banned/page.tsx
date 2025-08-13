
'use client';

import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BannedPage() {
    const router = useRouter();

    const handleLogout = async () => {
        await auth.signOut();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isTutor');
        localStorage.removeItem('loggedInUser');
        window.dispatchEvent(new Event("storage"));
        router.push('/');
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background text-center p-4">
            <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
            <h1 className="text-2xl font-bold">Account Access Restricted</h1>
            <p className="text-muted-foreground mt-2 max-w-md">
                Your account has been banned due to a violation of our platform policies. For more details, please contact our support team at <a href="mailto:gurukulxconnect@yahoo.com" className="underline text-primary">gurukulxconnect@yahoo.com</a> for further details.
            </p>
            <Button onClick={handleLogout} className="mt-6">Logout</Button>
        </div>
    )
}
