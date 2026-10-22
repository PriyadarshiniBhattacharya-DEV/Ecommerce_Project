import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { STATUS_COLORS } from "../../Utils/StatusUtils";
import { getOrders } from "../../Services/Api";

function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default to "ALL" so all orders show up when the page loads
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchOrderId, setSearchOrderId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Synchronized with computed statuses below
  const statusList = [
    "ALL",
    "NEW ORDER",
    "PROCESSING",
    "RETURN REQUESTED",
    "FULFILLED",
    "CANCELED"
  ];

  // Helper function to compute order status dynamically based on its items
  const getComputedOrderStatus = (order) => {
    const items = order.items || [];
    if (items.length === 0) {
      return (order.orderStatus || order.status || "NEW ORDER").toUpperCase();
    }

    const statuses = items.map((item) => (item.status || "").trim().toUpperCase());

    // 1. If all items are cancelled
    if (statuses.every((s) => s === "CANCELLED" || s === "CANCELED")) {
      return "CANCELED";
    }

    // 2. If all items are order placed / new order
    if (statuses.every((s) => s === "ORDER PLACED" || s === "NEW ORDER")) {
      return "NEW ORDER";
    }

    // 3. If any item has a return request
    const hasReturnRequest = statuses.some((s) => 
      s === "RETURN REQUESTED" || 
      s === "CHECKING RETURN REQUEST" || 
      s === "RETURN REQUEST APPROVED" ||
      s === "RETURN IN PROGRESS"
    );
    if (hasReturnRequest) {
      return "RETURN REQUESTED";
    }

    // 4. If all items are delivered or return processed
    if (statuses.every((s) => s === "DELIVERED" || s === "RETURN PROCESSED" || s === "RETURN REQUEST DISMISSED")) {
      return "FULFILLED";
    }

    // 5. Otherwise, mix or items in progress
    return "PROCESSING";
  };

  // 1. Client-side filtering by computed status and search query
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchOrderId.trim() === "" ||
      order.id.toString().toLowerCase().includes(searchOrderId.trim().toLowerCase());

    const computedStatus = getComputedOrderStatus(order);
    const matchesStatus =
      selectedStatus === "ALL" || computedStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // 2. Sort filtered orders to show the most recent orders at the top
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    return new Date(b.orderDate) - new Date(a.orderDate);
  });

  return (
    <div className="container mt-4">
      {/* Search Bar & Status Selector Header */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="input-group">
            <select
              className="form-select border-end-0 bg-light fw-bold text-secondary"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ maxWidth: "200px", fontSize: "1rem" }}
            >
              {statusList.map((statusKey) => (
                <option key={statusKey} value={statusKey}>
                  {statusKey}
                </option>
              ))}
            </select>

            <input
              type="number"
              className="form-control form-control-lg"
              placeholder="Search by Order ID..."
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              style={{ fontSize: "1rem" }}
            />

            <button
              className="btn btn-outline-secondary px-4 bg-white text-muted border"
              type="button"
              onClick={() => setSearchOrderId("")}
            >
              <i className="bi bi-search">clear</i>
            </button>
          </div>
        </div>
      </div>

      {/* Top Action Row */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="text-muted fw-bold">
          Showing {sortedOrders.length}{" "}
          {sortedOrders.length === 1 ? "order" : "orders"}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="table-responsive">
        <table className="table table-success table-bordered table-striped text-center align-middle">
          <thead>
            <tr>
              <th style={{ width: "6%" }}>ID</th>
              <th style={{ width: "8%" }}>User ID</th>
              <th style={{ width: "18%" }}>Image</th>
              <th style={{ width: "10%" }}>Total Price</th>
              <th style={{ width: "15%" }}>Order Date</th>
              <th style={{ width: "22%" }}>Shipping Address</th>
              <th style={{ width: "12%" }}>Status</th>
              <th style={{ width: "9%", textAlign: "center" }}>Show/Edit</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  Loading orders...
                </td>
              </tr>
            ) : sortedOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted">
                  No orders found matching criteria.
                </td>
              </tr>
            ) : (
              sortedOrders.map((order) => {
                const computedStatus = getComputedOrderStatus(order);
                const badgeColor = STATUS_COLORS[computedStatus] || "secondary";

                return (
                  <tr key={order.id}>
                    <td className="fw-bold">#{order.id}</td>
                    <td>{order.user?.id || order.userId || "N/A"}</td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap justify-content-center">
                        {order.items?.map((item, idx) => (
                          <img
                            key={idx}
                            src={
                              item.image?.startsWith("data:")
                                ? item.image
                                : item.image
                                ? `data:image/jpeg;base64,${item.image}`
                                : ""
                            }
                            alt={item.product?.name || "Product"}
                            width="45"
                            height="45"
                            className="rounded border"
                            style={{ objectFit: "cover" }}
                          />
                        ))}
                      </div>
                    </td>
                    <td>${(order.totalValue || order.totalPrice || 0).toFixed(2)}</td>
                    <td>
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>{order.shippingAddress}</td>
                    <td>
                      <span className={`badge bg-${badgeColor}`}>
                        {computedStatus}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm px-3"
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrderPage;