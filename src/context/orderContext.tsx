'use client';
// userContext.tsx
import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from 'react';

type Order = { id: string };

type OrderContextType = {
    order: Order | null;
    expandCart: boolean;
    setOrder: (order: Order | null) => void;
    clearOrder: () => void;
    updateOrder: (order: Order | null) => void;
    updateExpanded: (expand: boolean) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
    const [order, setOrder] = useState<Order | null>(null);
    const [expandCart, setExpanded] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem('order');
                if (stored) setOrder(JSON.parse(stored));
            } catch (e) {
                console.error('localStorage read failed:', e);
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem('expand');
                if (stored) setExpanded(JSON.parse(stored));
            } catch (e) {
                console.error('localStorage read failed:', e);
            }
        }
    }, []);

    const clearOrder = () => {
        setOrder(null);
        localStorage.removeItem('order');
    };

    const updateOrder = (order: Order | null) => {
        setOrder(order);
        if (typeof window !== 'undefined') {
            try {
                if (order) {
                    localStorage.setItem('order', JSON.stringify(order));
                } else {
                    localStorage.removeItem('order');
                }
            } catch (e) {
                console.error('localStorage write failed:', e);
            }
        }
    };

    const updateExpanded = (expand: boolean) => {
        setExpanded(expand);
        if (typeof window !== 'undefined') {
            try {
                if (expand) {
                    localStorage.setItem('expand', JSON.stringify(expand));
                } else {
                    localStorage.removeItem('expand');
                }
            } catch (e) {
                console.error('localStorage write failed:', e);
            }
        }
    };

    return (
        <OrderContext.Provider
            value={{
                order,
                setOrder,
                clearOrder,
                updateOrder,
                expandCart,
                updateExpanded,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder must be used within a OrderProvider');
    }
    return context;
};
