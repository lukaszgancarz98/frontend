import { UserProvider } from '@/context/userContext';
import Shop from './Shop';
import { OrderProvider } from '@/context/orderContext';

export default function Page() {
    return (
        <UserProvider>
            <OrderProvider>
                <Shop />
            </OrderProvider>
        </UserProvider>
    );
}
