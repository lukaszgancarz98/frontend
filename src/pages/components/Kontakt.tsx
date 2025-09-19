import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { createWorkShopReceiver } from '@/api/workShopApi';
import { isEmpty } from 'lodash';

export default function LoginForm() {
    const saveEmailForNotifications = async (
        e: React.FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const email = formData.get('email') as string;

        if (email) {
            const response = await createWorkShopReceiver({
                id: '',
                email: email,
            });

            if (isEmpty(response.data)) {
                toast.warning('Ten email został już dodany');

                return;
            }

            if (response.isValid) {
                toast.info('Wkrótce się do Ciebie odezwiemy.');
            }
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <Card className="border-0 shadow-none">
                <CardHeader>
                    <CardTitle className="text-xl">
                        Wpisz poniżej swój adres e-mail, a my się do Ciebie
                        odezwiemy.
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        className="w-full flex flex-col items-center gap-5"
                        onSubmit={(e) => saveEmailForNotifications(e)}
                    >
                        <Input
                            className="w-full"
                            placeholder="EMAIL"
                            name="email"
                            type="email"
                            required
                        />
                        <Button
                            type="submit"
                            className="text-3xl bg-blue-300 py-7 px-5 rounded-lg text-black transition-all duration-300 hover:scale-120 hover:bg-blue-500"
                        >
                            Poinformuj mnie
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
