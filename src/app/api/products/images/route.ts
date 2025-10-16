import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 },
            );
        }

        // Convert to Base64 Data URI
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const dataUri = `data:${file.type};base64,${base64}`;

        // Upload to Cloudinary
        const cloudResult = await cloudinary.uploader.upload(dataUri, {
            folder: `products`,
        });

        // Return full Cloudinary response
        return NextResponse.json(cloudResult);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        // Parse JSON body
        const { publicId } = await req.json();

        if (!publicId) {
            return NextResponse.json(
                { error: 'Missing publicId' },
                { status: 400 },
            );
        }

        // Delete image from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Cloudinary delete failed:', error);
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
