// src/app/page.js

import Link from "next/link";
import { Card, Button, Row, Col } from "antd";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

export default function HomePage() {
  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ marginBottom: 10 }}>Selamat Datang di Aplikasi Manajemen Produk</h1>
      <p style={{ marginBottom: 30 }}>
        Pilih menu di bawah untuk melanjutkan:
      </p>

      <Row gutter={16}>
        {/* Menu 1: Dashboard */}
        <Col span={12}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <DashboardOutlined style={{ marginRight: 8 }} /> Dashboard
              </div>
            }
            bordered={false}
            style={{ marginBottom: 16, minHeight: 200 }}
          >
            <p style={{ marginBottom: 20, lineHeight: 1.4 }}>
              Lihat ringkasan statistik produk dan produk unggulan acak.
            </p>
            <Link href="/dashboard">
              <Button
                type="primary"
                icon={<DashboardOutlined />}
                style={{ width: "100%" }}
              >
                Go to Dashboard
              </Button>
            </Link>
          </Card>
        </Col>

        {/* Menu 2: Products */}
        <Col span={12}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <ShoppingCartOutlined style={{ marginRight: 8 }} /> Products List
              </div>
            }
            bordered={false}
            style={{ marginBottom: 16, minHeight: 200 }}
          >
            <p style={{ marginBottom: 20, lineHeight: 1.4 }}>
              Kelola (Tambah, Edit, Hapus) semua daftar produk yang tersedia.
            </p>
            <Link href="/products">
              <Button
                icon={<ShoppingCartOutlined />}
                style={{ width: "100%" }}
              >
                Go to Products List
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
