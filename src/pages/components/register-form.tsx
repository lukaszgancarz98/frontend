import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { AlertCircleIcon } from "lucide-react";

interface RegisterFormProps extends React.ComponentProps<'div'> {
    registerFn: (e: React.FormEvent<HTMLFormElement>) => void;
    error: string | undefined;
}

export default function RegisterForm({
    className,
    registerFn,
    error,
    ...props
}: RegisterFormProps) {
    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="border-0 shadow-none">
                <CardHeader>
                    <CardTitle>Rejestracja</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={registerFn}>
                        <div className="flex flex-col gap-6">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircleIcon />
                                    <AlertTitle>{error}</AlertTitle>
                                </Alert>
                            )}
                            <div className="grid gap-3">
                                <Label htmlFor="name">Imię</Label>
                                <Input id="name" type="name" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="surname">Nazwisko</Label>
                                <Input id="surname" type="surname" required />
                            </div>
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
                                <Label htmlFor="password">Hasło</Label>
                                <Input id="password" type="password" required />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full">
                                    Zajerestruj się
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}