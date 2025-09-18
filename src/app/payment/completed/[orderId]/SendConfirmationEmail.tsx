'use server';

import { OrderType, updateOrder } from '@/api/orderApi';
import nodemailer from 'nodemailer';

export default async function sendEmail({ order }: { order: OrderType }) {
    const transporter = nodemailer.createTransport({
        host: 'mail.theschoolofcalisthenics.pl',
        port: 587,
        secure: false,
        auth: { user: 'kontakt@theschoolofcalisthenics.pl', pass: '123456789' },
    });

    const userData = order.orderDetails?.address;

    const formatter = new Intl.DateTimeFormat('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const orderDate = new Date(order.payment_date as string);

    const html = `
        <!doctype html>
        <html lang="pl">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <title>Potwierdzenie zamówienia</title>
            <style>
            body {margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#333;}
            .wrap {max-width:600px;margin:24px auto;background:#fff;border-radius:8px;overflow:hidden;}
            .header {background:#111827;color:#fff;padding:20px;font-size:20px;font-weight:bold;}
            .content {padding:20px;font-size:15px;line-height:1.5;}
            .btn {display:inline-block;margin:12px 0;padding:12px 20px;background:#111827;color:#fff;border-radius:6px;text-decoration:none;}
            .footer {background:#f1f3f5;padding:14px 20px;font-size:13px;color:#666;text-align:center;}
            </style>
        </head>
        <body>
            <div class="wrap">
            <div class="header">Dziękujemy za zakupy!</div>
            <div class="content">
                <p>Cześć ${userData?.name},</p>
                <p>Twoje zamówienie o numerze <strong>${order.id}</strong> zostało przyjęte dnia <strong>${formatter.format(orderDate)}</strong> i jest w trakcie realizacji.</p>
                <p>Wkrótce otrzymasz e-mail z informacją o wysyłce.</p>

                <!-- Przycisk do strony zamówienia -->
                <div style="text-align:center; margin:20px 0;">
                    <a href="https://theschoolofcalisthenics.pl/orders/${order.id}" 
                        style="display:inline-block; padding:14px 24px; background:#0ea5e9; color:#fff; font-weight:bold; text-decoration:none; border-radius:8px; font-size:16px;">
                        Sprawdź swoje zamówienie
                    </a>
                </div>

                <p style="font-size:13px;color:#777;">W razie pytań napisz do nas: kontakt@theschoolofcalisthenics.pl</p>
            </div>
            <div class="footer">
                The School of Calisthenics Shop • ul. Przykładowa 1, 00-000 Miasto
            </div>
            </div>
        </body>
        </html>
    `;

    transporter
        .sendMail({
            from: 'TheSchoolOfCalisthenicsShop <kontakt@theschoolofcalisthenics.pl>',
            to: userData?.email,
            subject: `Zamówienie ${order.id}`,
            html,
        })
        .then(async () => {
            try {
                await updateOrder({ id: order.id, email_send: true });
            } catch {
                console.log('Error');
            }
        })
        .catch(console.log);
}
