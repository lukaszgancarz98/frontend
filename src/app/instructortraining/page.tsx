import { OrderProvider } from '@/context/orderContext';
import InstructorTraining from './InstructorTraining';

export default function Page() {
    return (
        <OrderProvider>
            <InstructorTraining />
        </OrderProvider>
    );
}
