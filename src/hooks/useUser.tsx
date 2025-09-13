import { useMemo, useState } from 'react';
import { loginUser, loginUserGoogle, registerUser } from '@/api/userApi';
import { useUser } from '../context/userContext';
import pkg from 'lodash';
import { jwtDecode } from 'jwt-decode';
import { CredentialResponse } from '@react-oauth/google';

type UseUserReturnType = {
    loginFn: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    registerFn: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    googleAuth: (e: CredentialResponse) => void;
    loginError?: string;
    registerError?: string;
    logged: boolean;
};

type GogleReturnType = {
    email: string;
    given_name: string;
    family_name: string;
};

const { isUndefined } = pkg;

export default function useUserHook(): UseUserReturnType {
    const { user, updateUser } = useUser();
    const [registerError, setRegisterError] = useState<string>();
    const [loginError, setLoginError] = useState<string>();

    const logged = useMemo(() => {
        return !!user?.email && !isUndefined(user?.email);
    }, [user]);

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

        if (!res.isValid) {
            setRegisterError('Ten email jest używany na innym koncie');
            return;
        }

        if (res.data) {
            updateUser(res.data);
        }
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
    };
}
