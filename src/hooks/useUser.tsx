import { useMemo, useState } from 'react';
import { loginUser, loginUserGoogle, registerUser } from '@/api/userApi';
import { useUser } from '../context/userContext';
import pkg from 'lodash';
import { jwtDecode } from 'jwt-decode';
import { CredentialResponse } from '@react-oauth/google';
import { useOrder } from '@/context/orderContext';
import { updateOrder } from '@/api/orderApi';

export type User = {
    email: string;
    password?: string;
    name: string;
    surname: string;
};

type UseUserReturnType = {
    loginFn: (
        e: React.FormEvent<HTMLFormElement>,
    ) => Promise<{ email: string } | undefined>;
    registerFn: (
        e: React.FormEvent<HTMLFormElement>,
    ) => Promise<{ email: string } | undefined>;
    googleAuth: (e: CredentialResponse) => void;
    loginError?: string;
    registerError?: string;
    logged: boolean;
    user: User | null;
    clearUser: () => void;
};

type GogleReturnType = {
    email: string;
    given_name: string;
    family_name: string;
};

const { isUndefined } = pkg;

export default function useUserHook(): UseUserReturnType {
    const { user, updateUser, clearUser } = useUser();
    const { order } = useOrder();
    const [registerError, setRegisterError] = useState<string>();
    const [loginError, setLoginError] = useState<string>();

    const logged = useMemo(() => {
        return !!user?.email && !isUndefined(user?.email);
    }, [user]);

    const updateExistingOrder = async (email: string) => {
        await updateOrder({ id: order?.id as string, email: email });
    };

    const loginFn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginError('');
        const form = e.target as HTMLFormElement;
        const email = (form.email as HTMLInputElement).value;
        const password = (form.password as HTMLInputElement).value;

        const res = await loginUser({ email, password });

        if (!res.isValid || !res.data) {
            setLoginError('Nieprawidłowy email lub hasło');
            return;
        }

        updateUser(res.data);

        if (order) {
            await updateExistingOrder(email);
        }

        return { email: res.data.email };
    };

    const registerFn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setRegisterError('');
        const form = e.target as HTMLFormElement;
        const email = (form.email as HTMLInputElement).value;
        const password = (form.password as HTMLInputElement).value;
        const name = (form.name as unknown as HTMLInputElement).value;
        const surname = (form.surname as HTMLInputElement).value;

        const res = await registerUser({ email, password, name, surname });

        if (!res.isValid || !res.data) {
            setRegisterError('Ten email jest używany na innym koncie');
            return;
        }

        if (res.data) {
            if (order) {
                await updateExistingOrder(email);
            }
            updateUser(res.data);
        }

        return { email: res.data.email };
    };

    const googleAuth = async (e: CredentialResponse) => {
        const data = jwtDecode(e?.credential as string) as GogleReturnType;
        const res = await loginUserGoogle({
            email: data.email,
            name: data.given_name,
            surname: data.family_name,
        });

        if (!res.isValid) {
            setRegisterError('Błąd logowania');
            return;
        }

        if (res.data) {
            if (order) {
                await updateExistingOrder(data.email);
            }
            updateUser(res.data);
        }
    };

    return {
        loginFn,
        registerFn,
        googleAuth,
        loginError,
        registerError,
        logged,
        user,
        clearUser,
    };
}
