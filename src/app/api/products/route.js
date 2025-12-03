// src/app/api/products/route.js

const EXTERNAL_API_URL = "https://course.summitglobal.id/products";

// Helper untuk semua method selain GET (POST/PUT/DELETE)
async function handleRequest(request, method) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    // Tentukan URL tujuan: dengan ID (untuk PUT) atau tanpa ID (untuk POST/GET massal)
    const targetUrl = id ? `${EXTERNAL_API_URL}?id=${id}` : EXTERNAL_API_URL;
    
    const body = method !== 'GET' ? await request.json() : undefined;

    try {
        const res = await fetch(targetUrl, {
            method: method,
            headers: { 
                "Content-Type": "application/json",
                // Meneruskan headers lain jika diperlukan, tapi ini cukup
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        // Meneruskan status dan body respons dari API eksternal
        const data = await res.json();
        return Response.json(data, { status: res.status });

    } catch (error) {
        console.error(`Error during ${method} request to external API:`, error);
        return Response.json({ message: "Internal server error connecting to external API." }, { status: 500 });
    }
}

// ---------------------------------------------------------------------

export async function GET(request) {
    // Untuk GET, kita bisa langsung fetch tanpa body
    return handleRequest(request, 'GET');
}

export async function POST(request) {
    // Untuk POST (Add Product)
    return handleRequest(request, 'POST');
}

export async function PUT(request) {
    // Untuk PUT (Edit Product atau Set Stock: 0)
    return handleRequest(request, 'PUT');
}

// Catatan: Next.js API Route untuk method lain (DELETE) bisa ditambahkan di sini,
// namun karena aplikasi Anda menggunakan PUT untuk 'delete' (set stock 0), 
// maka PUT sudah mencakup fungsionalitas ini.