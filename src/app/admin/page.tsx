import { UserProvider } from '@/context/userContext';
import Admin from './Admin';

export default function AdminPage() {
    return (
        <UserProvider>
            <Admin />
        </UserProvider>
    );
}
