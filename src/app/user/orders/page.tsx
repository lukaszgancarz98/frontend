import { OrderProvider } from '@/context/orderContext';
import { UserProvider } from '@/context/userContext';
import UserOrders from './UserOrders';

export default async function Page() {
    return (
        <UserProvider>
            <OrderProvider>
                <UserOrders />
            </OrderProvider>
        </UserProvider>
    );
}
