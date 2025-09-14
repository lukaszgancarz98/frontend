import { OrderProvider } from '@/context/orderContext';
import { UserProvider } from '@/context/userContext';
import WorkShopPage from './WorkShopPage';

export default async function WorkShopsPage({
    params,
}: {
    params: Promise<{ product: string }>;
}) {
    const { product } = await params;

    return (
        <OrderProvider>
            <UserProvider>
                <WorkShopPage productId={product} />
            </UserProvider>
        </OrderProvider>
    );
}
