import { useEffect, useState } from "react";
import OrderCard from "../../components/OrderCard";
import { getOrdersByUserId } from "../../Services/RealApi";
import { useAuth } from "../../Context/AuthContext";
export default function OrdersPage({isLoggedIn}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const userId = user?.id || user?.userId || storedUser.id || storedUser.userId;
  useEffect(() => {
      getOrdersByUserId(userId).then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className="container py-4 text-center">
        <h2 className="mb-4">My Orders</h2>
        <div className="spinner-border text-secondary" role="status" />
      </div>
    );
  }
  if (!isLoggedIn) {
    return (
      <div className="container py-4">
        <h2 className="mb-4">My Orders</h2>
        <p className="alert alert-info">Please Log In to Access Your orders.</p>
      </div>
    );
  }
  if (orders.length === 0) {
    return (
      <div className="container py-4">
        <h2 className="mb-4">My Orders</h2>
        <p className="alert alert-info">You have no orders yet.</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">My Orders</h2>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}