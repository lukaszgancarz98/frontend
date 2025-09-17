import { OrderProvider } from '@/context/orderContext';
import { UserProvider } from '@/context/userContext';
import OrderPage from './OrderPage';

export default async function Page() {
    return (
        <UserProvider>
            <OrderProvider>
                <OrderPage />
            </OrderProvider>
        </UserProvider>
    );
}
