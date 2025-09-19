import { Order } from '@/hooks/useAdmin';

export type OrderProps = {
    ordersData: { new: Order[]; paid: Order[]; finalized: Order[] };
};

export default function Orders({ ordersData }: OrderProps) {
    return (
        <div className="flex flex-row h-full items-center justify-evenly">
            <div className="relative w-[30%] border-2 h-[90%] flex flex-col items-center">
                <div>Zamówienia nie opłacone (klient klika)</div>
                {ordersData.new.map((order) => (
                    <div key={order.id + order.price}>
                        <div>{order.id}</div>
                    </div>
                ))}
            </div>
            <div className="w-[30%] border-2 h-[90%] flex flex-col items-center">
                <div>Zamówienia opłacone</div>
                {ordersData.paid.map((order, index) => (
                    <div key={order.id + index}>{order.id}</div>
                ))}
            </div>
            <div className="w-[30%] border-2 h-[90%] flex flex-col items-center">
                <div>Zamówienia zrealizowane</div>
                {ordersData.finalized.map((order) => (
                    <div key={order.id}>{order.id}</div>
                ))}
            </div>
        </div>
    );
}
