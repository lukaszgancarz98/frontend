import { BACKEND_URL } from "@/common/constants";
import { ApiResponse } from "./userApi";

type PaymentData = {
    token: string;
}

const url = `${BACKEND_URL}/order`;

export const authorizePayment = async (id: string): Promise<ApiResponse<string>> => {
    try {
        const res = await fetch(`${url}/auth/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const responseData = await res.json();

        if (!res.ok) {
            return {
                data: null,
                isValid: false,
                error: responseData.message || 'Oauth failed',
                status: res.status,
            };
        }

        return { data: responseData.data, isValid: true };
    } catch {
        return {
            data: null,
            isValid: false,
            error: 'Network error or server unreachable',
        };
    }
};

const getClientIp = async () => {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  
  return data.ip;
};
//paymentData: PaymentData, 
export const createOrder = async (id: string) => {
    const clientId = await getClientIp();

    const payload = {
        customerIp: clientId,
        merchantPosId: "495999",
        description: "RTV market",
        currencyCode: "PLN",
        totalAmount: "210000",
        continueUrl: `http://localhost:3000/payment/completed/${id}`,
        products: [
            {
                name: "Wireless Mouse for Laptop",
                unitPrice: "210000",
                quantity: "1",
            },
        ],
        // buyer: {
        //     extCustomerId: "string",
        //     email: "email@email.com",
        //     phone: "+48 225108001",
        //     firstName: "John",
        //     lastName: "Doe",
        //     nin: 123456789,
        //     language: "pl",
        //     delivery: {
        //         street: "string",
        //         postalBox: "string",
        //         postalCode: "string",
        //         city: "string",
        //         name: "string",
        //         recipientName: "string",
        //         recipientEmail: "string",
        //         recipientPhone: "string"
        //     }
        // },
    };
    console.log(payload)
    try {
        const response = await fetch(`${url}/payment/${id}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
            return {
                data: null,
                isValid: false,
                error: responseData.message || 'Oauth failed',
                status: response.status,
            };
        }

        return { data: responseData.data, isValid: true };
    } catch {
        return {
            data: null,
            isValid: false,
            error: 'Network error or server unreachable',
        };
    }
};