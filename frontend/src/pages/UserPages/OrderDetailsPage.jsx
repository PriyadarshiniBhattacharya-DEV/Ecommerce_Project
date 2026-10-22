import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, cancelReturnRequest, updateOrderItemStatus } from "../../Services/Api";
import { STATUS_COLORS } from "../../Utils/StatusUtils";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(orderId).then((data) => {
      setOrder(data);
      setLoading(false);
    });
  }, [orderId]);

  const handleCancelReturn = async (itemId) => {
    try {
      const updatedItem = await cancelReturnRequest(itemId);
      setOrder((prev) => ({
        ...prev,
        items: prev.items.map((i) => (i.id === itemId ? updatedItem : i)),
      }));
    } catch (err) {
      alert("Failed to cancel return request. Please try again.");
    }
  };

  const handleCancelItem = async (itemId) => {
    try {
      const updatedItem = await updateOrderItemStatus(itemId, "CANCELED");
      setOrder((prev) => ({
        ...prev,
        items: prev.items.map((i) => (i.id === itemId ? updatedItem : i)),
      }));
    } catch (err) {
      alert("Failed to cancel item. Please try again.");
    }
  };

  // Helper function to check if the item was delivered within the last 2 days (48 hours)
  const isWithinReturnWindow = (item) => {
    // Use item.deliveredDate if available, otherwise fallback to item.updatedAt or order.orderDate
    const deliveryTimestamp = item.deliveredDate || item.updatedAt || order.orderDate;
    if (!deliveryTimestamp) return false;

    const deliveredTime = new Date(deliveryTimestamp).getTime();
    const currentTime = new Date().getTime();
    
    const differenceInHours = (currentTime - deliveredTime) / (1000 * 60 * 60);
    
    // 2 days = 48 hours
    return differenceInHours <= 48;
  };

  if (loading) {
    return (
      <div className="container py-4 text-center">
        <div className="spinner-border text-secondary" role="status" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-4">
        <p className="text-danger">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => navigate("/orders")}>
        &larr; Back to Orders
      </button>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Order #{order.id}</h5>
        </div>

        <div className="card-body">
          <p className="text-muted mb-3">Date: {order.orderDate ? new Date(order.orderDate).toLocaleString() : "N/A"}</p>

          {order.items.map((item) => {
            const canReturn = item.status === "DELIVERED" && isWithinReturnWindow(item);

            return (
              <div
                key={item.id}
                className="d-flex align-items-center gap-3 border-bottom py-3"
              >
                <img
                  src={
                    item.image?.startsWith("data:")
                      ? item.image
                      : item.image
                      ? `data:image/jpeg;base64,${item.image}`
                      : ""
                  }
                  alt={item.name}
                  width="60"
                  height="60"
                  className="rounded object-fit-cover"
                />

                <div className="flex-grow-1">
                  <p className="mb-1 fw-semibold">{item.name}</p>
                  <p className="mb-1 text-muted small">Qty: {item.quantity}</p>
                  <span className={`badge bg-${STATUS_COLORS[item.status] || "secondary"}`}>
                    {item.status}
                  </span>
                </div>

                <span className="fw-semibold">₹{item.totalPrice}</span>

                {/* Show Return button only if delivered AND within the 2-day window */}
                {canReturn && (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => navigate(`/orders/${order.id}/return/${item.id}`)}
                  >
                    Return
                  </button>
                )}

                {item.status === "ORDER PLACED" && (
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancelItem(item.id)}>
                    Cancel Item
                  </button>
                )}

                {item.status === "RETURN REQUESTED" && (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleCancelReturn(item.id)}
                  >
                    Cancel Return
                  </button>
                )}
              </div>
            );
          })}

          <div className="d-flex justify-content-end mt-3">
            <h5>Total : ₹{order.totalValue?.toFixed(2) || "0.00"}</h5>
          </div>
          <div className="d-flex justify-content-end mt-1"><small>(including tax + delivery fee)</small></div>
        </div>
      </div>
    </div>
  );
}