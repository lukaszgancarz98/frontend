'use client';

import { AlertCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { loginAdminUser } from '../../api/userApi';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '../../context/userContext';
import { useAdmin } from '../../hooks/useAdmin';

export default function Admin() {
    const [error, setError] = useState('');
    const [logged, setLogged] = useState(false);
    const { orders: ordersData } = useAdmin();
    const { admin, updateAdmin } = useUser()

    const loginFn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const email = (form.email as HTMLInputElement).value;
        const password = (form.password as HTMLInputElement).value;
        const response = await loginAdminUser({ email, password });
        if (response.isValid) {
            updateAdmin(true);
            setLogged(true);
            setError('');
        } else if (!response.isValid && response.error) {
            setError(response.error);
        }
    };

    useEffect(() => {
        if (admin && !logged) {
            setLogged(true);
        }
    }, [admin]);

    return (
        <div className="h-screen w-screen">
            {!logged ? (
                <div className="flex flex-col justify-center items-center w-full h-full">
                    <form onSubmit={loginFn}>
                        <div className="flex flex-col gap-6">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircleIcon />
                                    <AlertTitle>{error}</AlertTitle>
                                </Alert>
                            )}
                            <div className="grid gap-3">
                                <Label htmlFor="email">Login</Label>
                                <Input id="email" type="text" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="password">Hasło</Label>
                                <Input id="password" type="password" required />
                            </div>
                            <Button type="submit" className="w-full">
                                Zaloguj się
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="flex flex-row h-full items-center justify-evenly">
                    <div className="relative w-[30%] border-2 h-[90%] flex flex-col items-center">
                        <div>Zamówienia nie opłacone (klient klika)</div>
                        {ordersData.new.map((order) => (
                            <div key={order.id + order.price}>
                                <div>{order.id}</div>
                            </div>
                        ))}
                    </div>
                    <div className="w-[30%] border-2 h-[90%] flex flex-col items-center">
                        <div>Zamówienia opłacone</div>
                        {ordersData.paid.map((order, index) => (
                            <div key={order.id + index}>{order.id}</div>
                        ))}
                    </div>
                    <div className="w-[30%] border-2 h-[90%] flex flex-col items-center">
                        <div>Zamówienia zrealizowane</div>
                        {ordersData.finalized.map((order) => (
                            <div key={order.id}>{order.id}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
