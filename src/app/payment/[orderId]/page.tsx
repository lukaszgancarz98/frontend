import { OrderProvider } from "@/context/orderContext";
import { UserProvider } from "@/context/userContext";
import Payment from "./Payment";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <OrderProvider>
      <UserProvider>
        <Payment orderId={orderId} />
      </UserProvider>
    </OrderProvider>
  );
}
