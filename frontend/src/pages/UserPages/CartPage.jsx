import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  getCartItemQuantity,
} from "../../Services/Api";
import { useAuth } from "../../Context/AuthContext";
import { getCartProducts } from "../../Services/RealApi";

function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const userId = user?.id || user?.userId || storedUser.id || storedUser.userId;

  useEffect(() => {
    if (isLoggedIn || userId) {
      loadCart();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, userId]);

  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await getCartProducts(userId);
      setCart(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = async (item) => {
    try {
      await increaseQuantity(userId, item.product.id, item.quantity + 1 );
      await loadCart();
    } catch (error) {
      console.error("Failed to increase quantity:", error);
    }
  };

  const handleDecrease = async (item) => {
    try {
      await decreaseQuantity(userId, item.product.id, item.quantity - 1 );
      await loadCart();
    } catch (error) {
      console.error("Failed to decrease quantity:", error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      // Optimistically filter item out
      setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
      await removeFromCart(userId, productId);
    } catch (error) {
      console.error("Failed to remove item:", error);
      loadCart();
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        
        await clearCart(userId);
        setCart([]);
      } catch (error) {
        console.error("Failed to clear cart:", error);
        await loadCart();
      }
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const gst = subtotal * 0.18;
  const deliveryfee = subtotal > 0 ? subtotal * 0.10 : 0;
  const total = subtotal + gst + deliveryfee;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Shopping Cart</h2>

        {cart.length > 0 && (
          <button
            className="btn btn-outline-danger"
            onClick={handleClearCart}
          >
            Clear Cart
          </button>
        )}
      </div>

      {isLoggedIn || userId ? (
        loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="alert alert-info">Your cart is empty.</div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id || item.product.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={
                              item.image
                                ? `data:image/jpeg;base64,${item.image}`
                                : item.image
                            }
                            alt={item.name}
                            width="80"
                            height="80"
                            className="rounded me-3"
                            style={{ objectFit: "cover" }}
                          />
                          <strong>{item.name}</strong>
                        </div>
                      </td>

                      <td>₹{item.price}</td>

                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleDecrease(item)}
                          >
                            -
                          </button>

                          <button className="btn btn-light btn-sm" disabled>
                            {item.quantity}
                          </button>

                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleIncrease(item)}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td>₹{item.totalPrice}</td>

                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemove(item.product.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card mt-4 shadow-sm">
              <div className="card-body">
                <h4>Order Summary</h4>
                <hr />

                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>GST (18%)</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryfee.toFixed(2)}</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                <button
                  className="btn btn-success w-100 mt-3"
                  onClick={() => navigate("/checkout", { state: { total, cart } })}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )
      ) : (
        <div className="alert alert-info">
          Please Log In to Access Your Cart 🛒
        </div>
      )}
    </div>
  );
}

export default CartPage;