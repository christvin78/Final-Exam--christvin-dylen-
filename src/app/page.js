"use client";

import Link from 'next/link';
import { Card, Row, Col, Switch, Space, Typography, Tooltip } from 'antd';
import { DashboardOutlined, ShoppingCartOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useGlobalContext } from './context/GlobalContext';

const { Title } = Typography;

export default function HomePage() {
  const { theme, toggleTheme } = useGlobalContext();

  // HEADER
  const Header = () => (
    <Row justify="space-between" align="middle" style={{ marginBottom: 60 }}>
      <Col>
        <Title level={1} style={{ margin: 0 }}>
          E-Commerce Product Manager 🛒
        </Title>
      </Col>
      <Col>
        <Space size="large">
          <Tooltip
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            placement="bottom"
          >
            <Switch
              checkedChildren={<MoonOutlined style={{ color: '#fff' }} />}
              unCheckedChildren={<SunOutlined style={{ color: '#faad14' }} />}
              checked={theme === 'dark'}
              onChange={toggleTheme}
              size="large"
            />
          </Tooltip>
        </Space>
      </Col>
    </Row>
  );

  return (
    <div
      style={{
        padding: 40,
        maxWidth: 1000,
        margin: "0 auto",
        minHeight: "100vh",
        background: theme === "dark" ? "#0d0d0d" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#000000",
        transition: "all .3s"
      }}
    >
      <Header />

      <Title level={2} style={{ textAlign: 'center', marginBottom: 10 }}>
        Pilih Menu Utama
      </Title>
      <p style={{ marginBottom: 40, textAlign: 'center', opacity: 0.8 }}>
        Selamat datang kembali! Kelola inventaris produk Anda dengan mudah.
      </p>

      <Row gutter={[32, 32]} justify="center">
        {/* Dashboard */}
        <Col xs={24} sm={12}>
          <Link href="/dashboard" passHref>
            <Card
              hoverable
              style={{
                minHeight: 180,
                borderRadius: 16,
                border: "none",
                boxShadow: "none",
                background: theme === "dark" ? "#1b1b1b" : "#f4f4f4",
                transition: "all .25s",
                padding: 10,
              }}
              styles={{ body: { padding: 22 } }}   // ✔ FIX bodyStyle deprecated
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >

              <Card.Meta
                avatar={
                  <DashboardOutlined
                    style={{ fontSize: 44, marginRight: 10, color: "#1890ff" }}
                  />
                }
                title={<Title level={3} style={{ margin: 0, marginTop: 4 }}>Dashboard Overview</Title>}
                description="Lihat ringkasan statistik, total produk, dan produk unggulan acak."
              />
            </Card>
          </Link>
        </Col>

        {/* Products */}
        <Col xs={24} sm={12}>
          <Link href="/products" passHref>
            <Card
              hoverable
              style={{
                minHeight: 180,
                borderRadius: 16,
                border: "none",
                boxShadow: "none",
                background: theme === "dark" ? "#1b1b1b" : "#f4f4f4",
                transition: "all .25s",
                padding: 10,
              }}
              bodyStyle={{ padding: 22 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Card.Meta
                avatar={
                  <ShoppingCartOutlined
                    style={{ fontSize: 44, marginRight: 10, color: "#52c41a" }}
                  />
                }
                title={<Title level={3} style={{ margin: 0, marginTop: 4 }}>Products List</Title>}
                description="Kelola (CRUD), filter, dan lihat detail semua daftar produk."
              />
            </Card>
          </Link>
        </Col>
      </Row>

      <div style={{ textAlign: 'center', marginTop: 80, opacity: 0.6 }}>
        <p>Final Exam Project - Product Management Interface</p>
      </div>
    </div>
  );
}
