// src/app/products/[id]/page.js
// Default: Server Component

import { Card, Col, Row, Tag, Button } from 'antd';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const API_URL = "https://course.summitglobal.id/products";

// --- SERVER COMPONENT (Data Fetching) ---
async function getProductDetail(id) {
    try {
        const res = await fetch(API_URL, { cache: 'no-store' }); 
        if (!res.ok) throw new Error("Failed to fetch products");
        
        const data = await res.json();
        
        // --- PERBAIKAN UTAMA: Ekstraksi Data dari Struktur Bersarang (body.data) ---
        let list = [];
        if (data && data.body && Array.isArray(data.body.data)) {
            list = data.body.data;
        } else if (Array.isArray(data)) {
            list = data; 
        }
        
        return list.find(p => String(p.id) === String(id));
    } catch (error) {
        return null;
    }
}

// --- EKSPORT SERVER COMPONENT ---
export default async function ProductDetailPage({ params }) {
    const id = params.id;
    const product = await getProductDetail(id);

    if (!product) {
        notFound();
    }
    
    const isOutOfStock = product.stock === 0;

    return (
        <div style={{ padding: 40 }}>
            <Link href="/products" passHref>
                <Button style={{ marginBottom: 20 }}>&larr; Back to List</Button>
            </Link>

            <Card title={product.name}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={10}>
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            style={{ width: '100%', maxHeight: 400, objectFit: 'contain' }}
                        />
                    </Col>
                    <Col xs={24} md={14}>
                        <h3>{product.name}</h3>
                        <p>
                            <Tag color="blue">{product.category}</Tag>
                            {isOutOfStock ? (
                                <Tag color="red">Out of Stock</Tag>
                            ) : (
                                <Tag color="green">In Stock: {product.stock}</Tag>
                            )}
                        </p>
                        
                        <h2 style={{ color: '#eb2f96' }}>Rp {product.price?.toLocaleString()}</h2>
                        <p>{product.description}</p>
                    </Col>
                </Row>
            </Card>
        </div>
    );
}