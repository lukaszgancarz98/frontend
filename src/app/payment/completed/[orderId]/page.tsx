import { OrderProvider } from '@/context/orderContext';
import { UserProvider } from '@/context/userContext';

export default async function PaymentPage({
    params,
}: {
    params: Promise<{ orderId: string }>;
}) {
    const { orderId } = await params;

    return (
        <OrderProvider>
            <UserProvider>
                <div>{orderId}</div>
            </UserProvider>
        </OrderProvider>
    );
}
