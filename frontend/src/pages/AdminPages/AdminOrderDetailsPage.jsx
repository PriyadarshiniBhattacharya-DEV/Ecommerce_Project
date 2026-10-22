import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { STATUS_COLORS } from "../../Utils/StatusUtils";
import { getOrderById, updateOrderStatus, updateOrderItemStatus } from "../../Services/Api";
import { fetchReturnRequest } from "../../Services/RealApi";

// Define the logical forward-only order flow
const STATUS_SEQUENCE = [
  "ORDER PLACED",
  "SHIPPED",
  "ON THE WAY",
  "DELIVERED",
  "CANCELED"
];

const RETURN_STATUSES = [
  "RETURN REQUESTED",
  "CHECKING RETURN REQUEST",
  "RETURN REQUEST APPROVED",
  "RETURN REQUEST DISMISSED",
  "RETURN IN PROGRESS",
  "RETURN PROCESSED"
];

function AdminOrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [itemStatuses, setItemStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState(null);

  // State to track expanded return details and fetched data per item ID
  const [expandedReturns, setExpandedReturns] = useState({}); 
  const [returnDetails, setReturnDetails] = useState({});     
  const [loadingReturns, setLoadingReturns] = useState({});   

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const data = await getOrderById(orderId);
      setOrder(data);
      setOrderStatus(data.orderStatus || data.status || "");
      
      const initialItemStatuses = {};
      data.items?.forEach((item) => {
        initialItemStatuses[item.id] = item.status || "ORDER PLACED";
      });
      setItemStatuses(initialItemStatuses);
    } catch (err) {
      console.error("Failed to load order details:", err);
    } finally {
      setLoading(false);
    }
  };

  // Robust validation for forward-only flow and return branching
  const isValidNextStatus = (currentStatus, targetStatus) => {
    if (currentStatus === targetStatus) return true;

    // Terminal states cannot be changed
    if (["CANCELED", "RETURN PROCESSED", "RETURN REQUEST DISMISSED"].includes(currentStatus)) {
      return false;
    }

    // Check normal sequence
    let currIdx = STATUS_SEQUENCE.indexOf(currentStatus);
    let targetIdx = STATUS_SEQUENCE.indexOf(targetStatus);
    if (currIdx !== -1 && targetIdx !== -1) {
      return targetIdx >= currIdx;
    }

    // Check return sequence with strict branching rules
    currIdx = RETURN_STATUSES.indexOf(currentStatus);
    targetIdx = RETURN_STATUSES.indexOf(targetStatus);
    if (currIdx !== -1 && targetIdx !== -1) {
      // If current is APPROVED, cannot go back to DISMISSED
      if (currentStatus === "RETURN REQUEST APPROVED" && targetStatus === "RETURN REQUEST DISMISSED") {
        return false;
      }
      return targetIdx >= currIdx;
    }

    // Allow switching from normal flow into return flow
    if (currIdx === -1 && targetIdx !== -1) return true;

    return true;
  };

  const handleItemStatusUpdate = async (itemId, currentItemStatus, targetStatusOverride) => {
    const newStatus = targetStatusOverride || itemStatuses[itemId];
    
    if (!isValidNextStatus(currentItemStatus, newStatus)) {
      alert("You cannot revert an item status back to a previous status!");
      return;
    }

    setUpdatingItemId(itemId);
    try {
      await updateOrderItemStatus(itemId, newStatus);
      const refreshedOrder = await getOrderById(orderId);
      setOrder(refreshedOrder);

      // Sync itemStatuses state with the newly fetched order data so dropdowns update correctly
      const updatedItemStatuses = {};
      refreshedOrder.items?.forEach((item) => {
        updatedItemStatuses[item.id] = item.status || "ORDER PLACED";
      });
      setItemStatuses(updatedItemStatuses);

      alert(`Item #${itemId} status updated to ${newStatus}!`);
    } catch (err) {
      console.error("Failed to update item status:", err);
      alert("Failed to update item status.");
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Toggle show/hide return request details and fetch if missing
  const toggleReturnDetails = async (itemId) => {
    const isCurrentlyExpanded = !!expandedReturns[itemId];
    
    setExpandedReturns((prev) => ({
      ...prev,
      [itemId]: !isCurrentlyExpanded,
    }));

    if (!isCurrentlyExpanded && !returnDetails[itemId]) {
      setLoadingReturns((prev) => ({ ...prev, [itemId]: true }));
      try {
        const data = await fetchReturnRequest(itemId);
        setReturnDetails((prev) => ({ ...prev, [itemId]: data }));
      } catch (err) {
        console.error(`Failed to fetch return request for item #${itemId}:`, err);
      } finally {
        setLoadingReturns((prev) => ({ ...prev, [itemId]: false }));
      }
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h4>Loading order details...</h4>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mt-5 text-center">
        <h4>Order not found.</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Order Details #{order.id}</h3>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
          Back to Orders
        </button>
      </div>

      <div className="row g-4 mb-4">
        {/* Customer Information Panel */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header bg-primary text-white fw-bold">
              Customer Information
            </div>
            <div className="card-body">
              <p className="mb-2"><strong>User ID:</strong> #{order.user?.id || order.userId || "N/A"}</p>
              <p className="mb-2"><strong>Name:</strong> {order.user?.name || "N/A"}</p>
              <p className="mb-2"><strong>Email:</strong> {order.user?.email || "N/A"}</p>
              <p className="mb-2"><strong>Contact:</strong> {order.user?.phone || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Order Info Panel */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header bg-dark text-white fw-bold">
              Order Status & Shipping
            </div>
            <div className="card-body">
              <p className="mb-2"><strong>Order Date:</strong> {order.orderDate ? new Date(order.orderDate).toLocaleString() : "N/A"}</p>
              <p className="mb-2"><strong>Shipping Address:</strong> {order.shippingAddress}</p>
              <p className="mb-3"><strong>Total Value:</strong> ${(order.totalValue || order.totalPrice || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Products Itemized Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-secondary text-white fw-bold">
          Ordered Items & Individual Status Management
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-center">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "10%" }}>Image</th>
                  <th style={{ width: "25%" }}>Product Name</th>
                  <th style={{ width: "12%" }}>Price</th>
                  <th style={{ width: "10%" }}>Quantity</th>
                  <th style={{ width: "13%" }}>Subtotal</th>
                  <th style={{ width: "30%" }}>Item Status / Action</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item) => {
                  const itemImg = item.image?.startsWith("data:")
                    ? item.image
                    : item.image
                    ? `data:image/jpeg;base64,${item.image}`
                    : "";

                  const currentItemSt = item.status || "ORDER PLACED";
                  const hasReturn = RETURN_STATUSES.includes(currentItemSt) || item.returnRequested || item.status === "RETURN REQUESTED";
                  const isExpanded = !!expandedReturns[item.id];
                  const isReturnResolved = ["RETURN REQUEST APPROVED", "RETURN REQUEST DISMISSED", "RETURN PROCESSED"].includes(currentItemSt);

                  return (
                    <React.Fragment key={item.id}>
                      <tr>
                        <td>
                          <img
                            src={itemImg}
                            alt={item.product?.name || "Product"}
                            width="50"
                            height="50"
                            className="rounded border"
                            style={{ objectFit: "cover" }}
                          />
                        </td>
                        <td className="fw-bold text-start">
                          {item.product?.name || item.productName || "N/A"}
                          {hasReturn && (
                            <div className="mt-2">
                              <button
                                className="btn btn-sm btn-outline-info py-0 px-2"
                                style={{ fontSize: "0.75rem" }}
                                onClick={() => toggleReturnDetails(item.id)}
                              >
                                {isExpanded ? "Hide Return Request" : "Show Return Request"}
                              </button>
                            </div>
                          )}
                        </td>
                        <td>${(item.price || 0).toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                        <td>
                          <div className="input-group input-group-sm">
                            <select
                              className="form-select"
                              value={itemStatuses[item.id] || currentItemSt}
                              onChange={(e) =>
                                setItemStatuses({
                                  ...itemStatuses,
                                  [item.id]: e.target.value,
                                })
                              }
                            >
                              {Object.keys(STATUS_COLORS)
                                .filter((statusOption) => {
                                  if (statusOption === "CANCELED") return false;

                                  const isReturnOption = RETURN_STATUSES.includes(statusOption);
                                  const isCurrentInReturnFlow = RETURN_STATUSES.includes(currentItemSt);

                                  if (isCurrentInReturnFlow) {
                                    return isReturnOption;
                                  } else {
                                    return !isReturnOption;
                                  }
                                })
                                .map((statusOption) => {
                                  const isDisabled = !isValidNextStatus(currentItemSt, statusOption);
                                  return (
                                    <option key={statusOption} value={statusOption} disabled={isDisabled}>
                                      {statusOption} {isDisabled ? " (Locked)" : ""}
                                    </option>
                                  );
                                })}
                            </select>
                            <button
                              className="btn btn-outline-primary"
                              type="button"
                              onClick={() => handleItemStatusUpdate(item.id, currentItemSt)}
                              disabled={updatingItemId === item.id}
                            >
                              {updatingItemId === item.id ? "Saving..." : "Update"}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Collapsible Return Request Details Row */}
                      {hasReturn && isExpanded && (
                        <tr>
                          <td colSpan="6" className="bg-light p-3 text-start">
                            <div className="border rounded p-3 bg-white shadow-sm">
                              <h6 className="fw-bold text-danger mb-2">Return Request Details</h6>
                              {loadingReturns[item.id] ? (
                                <p className="text-muted small mb-0">Loading return info...</p>
                              ) : returnDetails[item.id] ? (
                                (() => {
                                  const rawData = 
                                    returnDetails[item.id].reason || 
                                    returnDetails[item.id].details || 
                                    returnDetails[item.id].description || 
                                    returnDetails[item.id].returnReason ||
                                    "";

                                  if (typeof rawData !== "string") {
                                    return <p className="text-muted small">Invalid return data format.</p>;
                                  }

                                  const imageParts = returnDetails[item.id].photos.split(",");
                                  const images = [];

                                  imageParts.forEach((part) => {
                                    const trimmed = part.trim();
                                    const isBase64Image = 
                                      trimmed.startsWith("data:image") || 
                                      (trimmed.length > 80 && !trimmed.includes(" ") && /^[A-Za-z0-9+/=]+$/.test(trimmed));

                                    if (isBase64Image) {
                                      const imgSrc = trimmed.startsWith("data:") 
                                        ? trimmed 
                                        : `data:image/jpeg;base64,${trimmed}`;
                                      images.push(imgSrc);
                                    }
                                  });

                                  return (
                                    <div>
                                      <p className="mb-2"><strong>Reason:</strong> {returnDetails[item.id].reason}</p>
                                      <p className="mb-2"><strong>Details:</strong> {returnDetails[item.id].details}</p>
                                      <p className="mb-2"><strong>Requested At:</strong> {returnDetails[item.id].returnRequestDate ? new Date(returnDetails[item.id].returnRequestDate).toLocaleString() : "N/A"}</p>
                                      
                                      {images.length > 0 && (
                                        <div className="mb-3">
                                          <strong className="d-block mb-1">Attached Images ({images.length}):</strong>
                                          <div className="d-flex gap-2 flex-wrap">
                                            {images.map((imgSrc, idx) => (
                                              <a key={idx} href={imgSrc} target="_blank" rel="noopener noreferrer">
                                                <img
                                                  src={imgSrc}
                                                  alt={`Return Evidence ${idx + 1}`}
                                                  width="70"
                                                  height="70"
                                                  className="rounded border shadow-sm"
                                                  style={{ objectFit: "cover" }}
                                                />
                                              </a>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Conditional Rendering: Show buttons ONLY if not yet resolved, otherwise show resolution status badge */}
                                      {!isReturnResolved ? (
                                        <div className="mt-3 d-flex gap-2">
                                          <button
                                            className="btn btn-success btn-sm"
                                            disabled={updatingItemId === item.id}
                                            onClick={() => handleItemStatusUpdate(item.id, currentItemSt, "RETURN REQUEST APPROVED")}
                                          >
                                            Accept Return Request
                                          </button>
                                          <button
                                            className="btn btn-danger btn-sm"
                                            disabled={updatingItemId === item.id}
                                            onClick={() => handleItemStatusUpdate(item.id, currentItemSt, "RETURN REQUEST DISMISSED")}
                                          >
                                            Dismiss Return Request
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="mt-3">
                                          <span className={`badge bg-${currentItemSt.includes("APPROVED") ? "success" : "danger"} px-3 py-2`} style={{ fontSize: "0.9rem" }}>
                                            Request Status: {currentItemSt}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()
                              ) : (
                                <p className="text-muted small mb-0">No additional details found or failed to load.</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetailsPage;