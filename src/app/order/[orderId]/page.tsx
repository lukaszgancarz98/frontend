import { OrderProvider } from '@/context/orderContext';
import { UserProvider } from '@/context/userContext';
import OrderPage from './OrderPage';

export default async function Page({
    params,
}: {
    params: Promise<{ orderId: string }>;
}) {
    const { orderId } = await params;

    return (
        <UserProvider>
            <OrderProvider>
                <OrderPage orderId={orderId} />
            </OrderProvider>
        </UserProvider>
    );
}
