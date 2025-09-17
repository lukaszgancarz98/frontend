import { OrderProvider } from '@/context/orderContext';
import { UserProvider } from '@/context/userContext';
import PaymentCompleted from './PaymentComplete';

export default async function PaymentPage({
    params,
}: {
    params: Promise<{ orderId: string }>;
}) {
    const { orderId } = await params;

    return (
        <OrderProvider>
            <UserProvider>
                <PaymentCompleted id={orderId} />
            </UserProvider>
        </OrderProvider>
    );
}
