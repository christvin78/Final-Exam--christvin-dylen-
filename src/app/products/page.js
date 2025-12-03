// src/app/products/page.js
"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  InputNumber,
  Tag,
  Select,
  Skeleton,
  message as antdMessage,
  Space,
  Popconfirm,
} from "antd";
import { useGlobalContext } from "../context/GlobalContext";
import { useRouter } from "next/navigation";

const LOCAL_API_URL = "/api/products";

const extractData = (data) => {
  if (data?.body?.data) return data.body.data;
  if (Array.isArray(data)) return data;
  return [];
};

export default function ProductsPage() {
  const router = useRouter();
  const { selectedCategory, setSelectedCategory } = useGlobalContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = antdMessage.useMessage();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(LOCAL_API_URL, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(extractData(data));
      messageApi.success("Daftar produk berhasil dimuat.");
    } catch {
      messageApi.error("Gagal memuat produk.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (values) => {
    const url = editId ? `${LOCAL_API_URL}?id=${editId}` : LOCAL_API_URL;
    const method = editId ? "PUT" : "POST";
    const payload = editId ? { ...values, id: editId } : values;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      messageApi.success(editId ? "Product updated successfully!" : "Product added successfully!");

      form.resetFields();
      setEditId(null);
      setOpen(false);
      fetchProducts();
    } catch {
      messageApi.error("Gagal menyimpan produk.");
    }
  };

  const handleDelete = async (record) => {
    const payload = { ...record, id: record.id, stock: 0 };

    try {
      const res = await fetch(`${LOCAL_API_URL}?id=${record.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      messageApi.success(`Produk '${record.name}' berhasil diset Out of Stock.`);
      fetchProducts();
    } catch {
      messageApi.error("Gagal set stok.");
    }
  };

  // 🔥 SEARCH & FILTER FINAL VERSION
  const filtered = useMemo(() => {
    let list = products;

    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchText.trim()) {
      const s = searchText.toLowerCase().trim();
      list = list.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(s)) ||
          (p.category && p.category.toLowerCase().includes(s)) ||
          (p.description && p.description.toLowerCase().includes(s)) ||
          p.price?.toString().includes(s) ||
          p.stock?.toString().includes(s)
      );
    }

    return list;
  }, [products, selectedCategory, searchText]);

  const cols = [
    {
      title: "Image",
      dataIndex: "image",
      render: (url) => (
        <img src={url} width={60} alt="Product" style={{ objectFit: "cover", borderRadius: 4 }} />
      ),
    },
    { title: "Name", dataIndex: "name", sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: "Category", dataIndex: "category", sorter: (a, b) => a.category.localeCompare(b.category) },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => `Rp ${price?.toLocaleString()}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      render: (stock) => (stock > 0 ? <Tag color="green">{stock}</Tag> : <Tag color="red">Out</Tag>),
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Action",
      key: "action",
      render: (r) => (
        <Space size="small">
          <Button size="small" onClick={() => router.push(`/products/${r.id}`)}>
            Detail
          </Button>
          <Button
            size="small"
            onClick={() => {
              setEditId(r.id);
              setOpen(true);
              form.setFieldsValue(r);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Set Out of Stock"
            description="Yakin set stok jadi 0?"
            onConfirm={() => handleDelete(r)}
            okText="Ya"
            cancelText="Tidak"
          >
            <Button size="small" danger>
              Set Inactive
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 40, maxWidth: 1200, margin: "0 auto" }}>
      {contextHolder}

      <h1>📦 Products List</h1>

      <Space style={{ marginBottom: 20, width: "100%", justifyContent: "space-between" }} wrap>
        <Button
          type="primary"
          onClick={() => {
            setEditId(null);
            setOpen(true);
            form.resetFields();
          }}
        >
          Add Product
        </Button>

        <Space>
          <Input
            placeholder="Search Name / Category / Description / Price / Stock"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 240 }}
            allowClear
          />
          <Select
            placeholder="Filter Category"
            allowClear
            style={{ width: 200 }}
            value={selectedCategory || undefined}
            onChange={(v) => setSelectedCategory(v || "")}
            options={[...new Set(products.map((p) => p.category))].map((c) => ({
              value: c,
              label: c,
            }))}
          />
          <Button onClick={fetchProducts} loading={loading}>
            Refresh
          </Button>
        </Space>
      </Space>

      {loading && products.length === 0 ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : (
        <Table
          dataSource={filtered}
          columns={cols}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
          rowClassName={(record) => (record.stock === 0 ? "out-of-stock-row" : "")}
        />
      )}

      <style jsx global>{`
        .out-of-stock-row {
          background-color: #fff0f6 !important;
        }
        .dark-mode .out-of-stock-row {
          background-color: #4d1e2e !important;
        }
      `}</style>

      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          setEditId(null);
        }}
        onOk={() => form.submit()}
        title={editId ? "Edit Product" : "Add Product"}
        confirmLoading={loading}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Stock" name="stock" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Category" name="category" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Image URL" name="image" rules={[{ required: true, type: "url" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
