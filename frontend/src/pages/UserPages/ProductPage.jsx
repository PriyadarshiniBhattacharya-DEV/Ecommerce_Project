import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  addToCart,
  getCart,
  getCartItemQuantity,
  increaseQuantity,
  decreaseQuantity,
  deleteProducts
} from "../../Services/Api";
import { useAuth } from "../../Context/AuthContext";

function ProductPage({ isLoggedIn: propIsLoggedIn, isAdminLoggedIn }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn: authIsLoggedIn } = useAuth();

  // Unified login & user resolution
  const isLoggedIn = propIsLoggedIn || authIsLoggedIn;
  const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const userId = user?.id || user?.userId || storedUser.id || storedUser.userId;

  const [product, setProduct] = useState(null);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [itemQuantity, setItemQuantity] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id, userId]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await getProductById(id);
      setProduct(data);

      if (userId && data?.id) {
        // Check wishlist status with userId
        const wishlisted = await isInWishlist(userId, data.id);
        setWishlistAdded(Boolean(wishlisted));

        // Check cart status
        const quantity = await getCartItemQuantity(userId, data.id);
        setItemQuantity(quantity || 0);
        setCartAdded(quantity > 0);
      }
    } catch (error) {
      console.error("Error loading product page data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      try {
        await deleteProducts(productId);
        navigate(-1);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleWishlist = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!userId) {
      alert("User ID not found. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      if (wishlistAdded) {
        setWishlistAdded(false);
        await removeFromWishlist(userId, product.id);
      } else {
        setWishlistAdded(true);
        await addToWishlist(userId, product.id);
      }
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
      setWishlistAdded((prev) => !prev);
    }
  };

  const handleCart = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      if (itemQuantity === 0) {
        setItemQuantity(1);
        setCartAdded(true);

        await addToCart(userId, product.id);
        const qty = await getCartItemQuantity(userId, product.id);
        setItemQuantity(qty || 1);
      }
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      setItemQuantity(0);
      setCartAdded(false);
    }
  };

  const handleIncrease = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const nextQuantity = itemQuantity + 1;
    try {
      setItemQuantity(nextQuantity);
      await increaseQuantity(userId, product.id, nextQuantity);
      const quantity = await getCartItemQuantity(userId, product.id);
      if (quantity) setItemQuantity(quantity);
    } catch (error) {
      console.error("Failed to increment cart item:", error);
      
      setItemQuantity((prev) => Math.max(1, prev - 1));
    }
  };

  const handleDecrease = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
          if (itemQuantity > 0) {
            const newQty = itemQuantity - 1;
            setItemQuantity(newQty);
    
            if (newQty === 0) {
              await removeFromCart(userId, product.id);
            }
            else{
              await decreaseQuantity(userId, product.id, newQty);
            }
            const quantity = await getCartItemQuantity(userId, product.id);
            setItemQuantity(quantity || 0);
    
            if (!quantity || quantity === 0) {
              setCartAdded(false);
            }
          }
        } catch (error) {
          console.error("Failed to decrement cart item:", error);
          
          loadCartItemQuantity();
        }
  };

  if (loading || !product) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Product Image */}
        <div className="col-md-6 mb-4">
          <img
            src={
              product.images
                ? `data:image/jpeg;base64,${product.images}`
                : "https://via.placeholder.com/180?text=No+Image"
            }
            className="img-fluid rounded shadow-sm"
            alt={product.name}
            style={{
              width: "100%",
              maxHeight: "500px",
              objectFit: "cover"
            }}
          />
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <h3 className="text-success mt-3">₹ {product.price}</h3>

          <hr />

          <h5>Description</h5>
          <div style={{ whiteSpace: "pre-line" }} className="text-muted mb-4">
            {product.description}
          </div>

          <div className="d-grid gap-3 mt-4">
            {isAdminLoggedIn ? (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-warning w-50"
                  onClick={() => navigate(`/updateProduct/${product.id}/${product.name}`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger w-50"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </div>
            ) : (
              <>
                <button
                  className={
                    wishlistAdded ? "btn btn-danger" : "btn btn-outline-danger"
                  }
                  onClick={handleWishlist}
                >
                  {wishlistAdded ? "♥ Wishlisted" : "❤ Add to Wishlist"}
                </button>

                {itemQuantity > 0 ? (
                  <div className="d-flex align-items-center justify-content-between border rounded p-2 bg-light">
                    <span className="fw-bold text-success ps-2">
                      ✔ In Cart ({itemQuantity})
                    </span>
                    <div className="btn-group">
                      <button
                        className="btn btn-outline-secondary px-3"
                        onClick={handleDecrease}
                      >
                        -
                      </button>
                      <button className="btn btn-light px-3" disabled>
                        {itemQuantity}
                      </button>
                      <button
                        className="btn btn-outline-secondary px-3"
                        onClick={handleIncrease}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : (
                  <button className="btn btn-primary" onClick={handleCart}>
                    🛒 Add to Cart
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;