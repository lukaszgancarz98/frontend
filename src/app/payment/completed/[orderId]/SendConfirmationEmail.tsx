'use server';

// import { Resend } from "resend";

export default async function sendEmail({ id }: { id: string }) {
    // const api_key = process.env.NEXT_PUBLIC_RESEND_API_KEY;

    // const resend = new Resend(api_key);

    // const data = await resend.emails.send({
    //     from: 'kalistenikazg@theschoolofcalisthenics.pl',
    //     to: 'lgancarz1@wp.pl',
    //     subject: `Zamówienie nr ${id}`,
    //     html: '<div><h1>Dziękujemy za zamówienie</h1><div>Mati wymyśl coś</div></div>'
    // });
    console.log('log:', id);
}
