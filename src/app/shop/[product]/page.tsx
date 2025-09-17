import { OrderProvider } from '@/context/orderContext';
import Product from './Product';
import { UserProvider } from '@/context/userContext';

export default async function Page({
    params,
}: {
    params: Promise<{ product: string }>;
}) {
    const { product } = await params;

    return (
        <OrderProvider>
            <UserProvider>
                <Product productId={product} />
            </UserProvider>
        </OrderProvider>
    );
}
