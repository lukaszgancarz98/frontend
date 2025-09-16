import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export default async function POST() {
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data } = await resend.emails.send({
            from: 'kalistenikazg@gmail.com',
            to: 'lgancarz1@wp.pl',
            subject: 'essunia',
            html: '<h1>No elo</h1?',
        });

        return NextResponse.json({ data });
    } catch (err) {
        return NextResponse.json({ err });
    }
}
