import { OrderProvider } from "@/context/orderContext"
import { UserProvider } from "@/context/userContext"

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <OrderProvider>
        <UserProvider>
          <main>{children}</main>
        </UserProvider>
    </OrderProvider>
  )
}