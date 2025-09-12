import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import {
    CredentialResponse,
    GoogleLogin,
    GoogleOAuthProvider,
} from '@react-oauth/google';
import { CLIENT_ID } from '../../common/constants';

interface LoginFormProps extends React.ComponentProps<'div'> {
    loginFn: (e: React.FormEvent<HTMLFormElement>) => void;
    signupFn: () => void;
    googleAuth: (e: CredentialResponse) => void;
    error: string | undefined;
}

export default function LoginForm({
    className,
    loginFn,
    signupFn,
    googleAuth,
    error,
    ...props
}: LoginFormProps) {
    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="border-0 shadow-none">
                <CardHeader>
                    <CardTitle>Logowanie</CardTitle>
                    <CardDescription>
                        Wpisz poniżej swój adres e-mail, aby zalogować się na
                        swoje konto
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={loginFn}>
                        <div className="flex flex-col gap-6">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircleIcon />
                                    <AlertTitle>{error}</AlertTitle>
                                </Alert>
                            )}
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Hasło</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Zapomniałeś hasła?
                                    </a>
                                </div>
                                <Input id="password" type="password" required />
                            </div>
                            <Button type="submit" className="w-full">
                                Zaloguj się
                            </Button>
                        </div>
                    </form>
                    <div className="pt-3">
                        <GoogleOAuthProvider clientId={CLIENT_ID}>
                            <GoogleLogin
                                width="327px"
                                size="large"
                                onSuccess={(e) => googleAuth(e)}
                                onError={() => console.log('ERROR')}
                            />
                        </GoogleOAuthProvider>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Nie masz konta?{' '}
                        <a
                            href="#"
                            className="underline underline-offset-4"
                            onClick={() => signupFn()}
                        >
                            Zarejestruj się
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
