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
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Orders from './Orders';
import Produkty from './Produkty';
import { Toaster } from '@/components/ui/sonner';
import WorkShopsPage from './Workshops';

export default function Admin() {
    const [error, setError] = useState('');
    const [logged, setLogged] = useState(false);
    const { orders: ordersData, getOrdersRequest } = useAdmin();
    const { admin, updateAdmin } = useUser();

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [admin]);

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Zamówienia',
            children: (
                <Orders
                    ordersData={ordersData}
                    refreshOrder={getOrdersRequest}
                />
            ),
        },
        { key: '2', label: 'Zarządzanie produktami', children: <Produkty /> },
        { key: '3', label: 'Szkolenia etc', children: <WorkShopsPage /> },
    ];

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
                <div className="p-3">
                    <Tabs defaultActiveKey="1" items={items} />
                    <Toaster position="top-center" richColors />
                </div>
            )}
        </div>
    );
}
