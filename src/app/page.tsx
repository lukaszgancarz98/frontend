'use client';

import { OrderProvider } from '../context/orderContext';
import { UserProvider } from '../context/userContext';
import Calistenics from './Calistenics';

export default function Kalistenika() {
    return (
        <UserProvider>
            <OrderProvider>
                <Calistenics />
            </OrderProvider>
        </UserProvider>
    );
}
