"use client";

import Link from "next/link";
import {
  Card,
  Row,
  Col,
  Switch,
  Space,
  Typography,
  Tooltip,
  Divider,
  Badge,
} from "antd";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  SunOutlined,
  MoonOutlined,
  StarFilled,
  CrownFilled,
} from "@ant-design/icons";
import { useGlobalContext } from "./context/GlobalContext";
import { useEffect, useState } from "react";

const { Title } = Typography;

let confettiLib;
if (typeof window !== "undefined") {
  confettiLib = require("canvas-confetti").default;
}

export default function HomePage() {
  const { theme, toggleTheme } = useGlobalContext();
  const [loaded, setLoaded] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastVisited, setLastVisited] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 120);

    const savedClicks = Number(localStorage.getItem("menuClicks") || 0);
    const savedVisit = localStorage.getItem("lastVisited");
    const savedHistory = JSON.parse(localStorage.getItem("menuHistory") || "[]");

    setClickCount(savedClicks);
    setLastVisited(savedVisit);
    setHistory(savedHistory);
  }, []);

  const triggerConfetti = () => {
    if (!confettiLib) return;
    confettiLib({
      particleCount: 85,
      spread: 75,
      startVelocity: 35,
      origin: { y: 0.65 },
    });
  };

  const handleMenuClick = (menu) => {
    const newTotal = clickCount + 1;
    setClickCount(newTotal);
    setLastVisited(menu);

    const updatedHistory = [...history, menu].slice(-5);
    setHistory(updatedHistory);

    localStorage.setItem("menuClicks", newTotal);
    localStorage.setItem("lastVisited", menu);
    localStorage.setItem("menuHistory", JSON.stringify(updatedHistory));

    if (newTotal % 5 === 0) triggerConfetti();
  };

  const isTrending = lastVisited === "Dashboard" || lastVisited === "Products";

  return (
    <div
      style={{
        padding: 40,
        maxWidth: 1050,
        margin: "0 auto",
        minHeight: "100vh",
        background:
          theme === "dark"
            ? "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)"
            : "linear-gradient(135deg, #ffffff 0%, #e9eef3 100%)",
        color: theme === "dark" ? "#ffffff" : "#000000",
        transition: "all .5s ease",
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(20px)",
      }}
    >
      {/* HEADER */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 58 }}>
        <Col>
          <Title level={1} style={{ margin: 0 }}>
            E-Commerce Product Manager 🛒
          </Title>
        </Col>
        <Col>
          <Space size="large">
            <Tooltip
              title={
                theme === "dark"
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
              placement="bottom"
            >
              <Switch
                checkedChildren={<MoonOutlined style={{ color: "#fff" }} />}
                unCheckedChildren={
                  <SunOutlined style={{ color: "#faad14" }} />
                }
                checked={theme === "dark"}
                onChange={toggleTheme}
                size="large"
              />
            </Tooltip>
          </Space>
        </Col>
      </Row>

      {/* TITLE */}
      <Title level={2} style={{ textAlign: "center", marginBottom: 6 }}>
        Pilih Menu Utama
      </Title>
      <p
        style={{
          marginBottom: 28,
          textAlign: "center",
          opacity: 0.8,
          fontSize: 16,
        }}
      >
        Kelola & analisis seluruh data produk Anda dalam satu aplikasi.
      </p>

      <Divider
        style={{
          marginBottom: 42,
          borderColor: theme === "dark" ? "#333" : "#ccc",
        }}
      />

      {/* HIGHLIGHT BOX */}
      <div
        style={{
          margin: "45px auto 5px",
          padding: "22px 30px",
          borderRadius: 18,
          backdropFilter: "blur(8px)",
          background:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.06)"
              : "rgba(0, 0, 0, 0.04)",
          maxWidth: 680,
          transition: "all .3s",
          border:
            theme === "dark"
              ? "1px solid rgba(255,255,255,0.12)"
              : "1px solid rgba(0,0,0,0.09)",
        }}
      >
        <Title level={3} style={{ margin: 0, textAlign: "center" }}>
          <StarFilled style={{ color: "#faad14", marginRight: 6 }} /> Highlight
        </Title>
        <p
          style={{
            textAlign: "center",
            opacity: 0.85,
            marginTop: 6,
            fontSize: 15,
          }}
        >
          Total Menu: <b>2</b> • Klik Menu: <b>{clickCount}</b>
          {lastVisited && (
            <>
              {" "}
              • Terakhir Dibuka:{" "}
              <b style={{ color: "#1890ff" }}>{lastVisited}</b>
            </>
          )}
        </p>

        {history.length > 0 && (
          <p
            style={{
              textAlign: "center",
              opacity: 0.75,
              marginTop: 6,
              fontSize: 14,
            }}
          >
            Riwayat Terakhir:{" "}
            {history.map((h, i) => (
              <span key={i}>
                {h}
                {i < history.length - 1 ? " → " : ""}
              </span>
            ))}
          </p>
        )}

        {isTrending && (
          <p
            style={{
              textAlign: "center",
              marginTop: 10,
              fontSize: 14,
              color: "#fadb14",
            }}
          >
            <CrownFilled style={{ marginRight: 6 }} /> Menu Sedang Populer
          </p>
        )}
      </div>

      {/* MENU BOXES */}
      <Row gutter={[32, 32]} justify="center" style={{ marginTop: 25 }}>
        <Col xs={24} sm={12}>
          <Badge.Ribbon
            text={lastVisited === "Dashboard" ? "Terakhir Dibuka" : null}
            color="blue"
          >
            <Link href="/dashboard" passHref>
              <Card
                hoverable
                onClick={() => handleMenuClick("Dashboard")}
                style={{
                  cursor: "pointer",
                  minHeight: 180,
                  borderRadius: 18,
                  border: "none",
                  boxShadow: "none",
                  background: theme === "dark" ? "#181818" : "#f6f6f6",
                  transition: "all .25s",
                }}
                bodyStyle={{ padding: 26 }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.045)";
                  e.currentTarget.style.boxShadow =
                    "0 0 18px rgba(0, 160, 255, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Card.Meta
                  avatar={
                    <DashboardOutlined
                      style={{ fontSize: 50, marginRight: 10, color: "#1890ff" }}
                    />
                  }
                  title={
                    <Title level={3} style={{ margin: 0, marginTop: 6 }}>
                      Dashboard Overview
                    </Title>
                  }
                  description="Lihat statistik, total produk & data unggulan."
                />
              </Card>
            </Link>
          </Badge.Ribbon>
        </Col>

        <Col xs={24} sm={12}>
          <Badge.Ribbon
            text={lastVisited === "Products" ? "Terakhir Dibuka" : null}
            color="green"
          >
            <Link href="/products" passHref>
              <Card
                hoverable
                onClick={() => handleMenuClick("Products")}
                style={{
                  cursor: "pointer",
                  minHeight: 180,
                  borderRadius: 18,
                  border: "none",
                  boxShadow: "none",
                  background: theme === "dark" ? "#181818" : "#f6f6f6",
                  transition: "all .25s",
                }}
                bodyStyle={{ padding: 26 }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.045)";
                  e.currentTarget.style.boxShadow =
                    "0 0 18px rgba(82, 196, 26, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Card.Meta
                  avatar={
                    <ShoppingCartOutlined
                      style={{
                        fontSize: 50,
                        marginRight: 10,
                        color: "#52c41a",
                      }}
                    />
                  }
                  title={
                    <Title level={3} style={{ margin: 0, marginTop: 6 }}>
                      Products List
                    </Title>
                  }
                  description="CRUD, filter & detail semua produk."
                />
              </Card>
            </Link>
          </Badge.Ribbon>
        </Col>
      </Row>

      {/* FOOTER */}
      <div
        style={{
          textAlign: "center",
          marginTop: 95,
          opacity: 0.6,
          fontSize: 14,
        }}
      >
        <Divider
          style={{
            borderColor: theme === "dark" ? "#333" : "#ccc",
            maxWidth: 260,
            margin: "32px auto",
          }}
        />
        <p>Final Exam Project — Product Management Interface • © 2025</p>
      </div>
    </div>
  );
}
