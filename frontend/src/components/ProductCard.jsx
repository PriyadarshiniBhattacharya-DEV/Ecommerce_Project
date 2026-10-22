import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  addToWishlist, 
  removeFromWishlist, 
  isInWishlist, 
  addToCart, 
  getCartItemQuantity, 
  increaseQuantity, 
  decreaseQuantity, 
  removeFromCart
} from "../Services/Api";
import { useAuth } from "../Context/AuthContext"; // Ensure correct path to Context

function ProductCard({ 
  product,
  showWishlist = true, 
  showRemove = false, 
  onRemove, 
  onDelete 
}) {
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [itemQuantity, setItemQuantity] = useState(0);

  const navigate = useNavigate();
  const { user, isLoggedIn, isAdminLoggedIn } = useAuth();

  const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const userId = user?.id || user?.userId || storedUser.id || storedUser.userId;

  useEffect(() => {
  let isMounted = true;

  const verifyWishlist = async () => {
    if (userId && product?.id) {
      const exists = await isInWishlist(userId, product.id);
      if (isMounted) {
        setWishlistAdded(exists);
      }
    }
  };

  verifyWishlist();

  return () => {
    isMounted = false; // Prevents memory leaks if card unmounts during fetch
  };
}, [userId, product?.id]);

  useEffect(() => {
    loadCartItemQuantity();
  }, [userId, product?.id]);

  const loadCartItemQuantity = async () => {
    if (!product || !userId) return;
    try {
      const cartItemQuantity = await getCartItemQuantity(userId, product.id);
      setItemQuantity(cartItemQuantity || 0);
      if (cartItemQuantity > 0) {
        setCartAdded(true);
      } else {
        setCartAdded(false);
      }
    } catch (error) {
      console.error("Failed to load cart quantity:", error);
    }
  };
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      onDelete(product.id);
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
        
        if (onRemove) {
          await onRemove(product.id);
        } else {

          await removeFromWishlist(userId, product.id);
        }
        setWishlistAdded(false);
      } else {
        
        await addToWishlist(userId, product.id);
        setWishlistAdded(true);
      }
    } catch (error) {
      console.error("Failed to toggle wishlist state:", error);
    }
  };


  const handleCart = async () => {
    if (isLoggedIn) {
      try {
        if (itemQuantity === 0) {
          
            setItemQuantity(1);
            setCartAdded(true);


          await addToCart(userId, product.id);
          // Sync with server response
          const quantity = await getCartItemQuantity(userId, product.id);
          setItemQuantity(quantity || 1);
        }
    } catch (error) {
        console.error("Failed to add to cart:", error);
        // Revert state if backend call fails
        setItemQuantity(0);
        setCartAdded(false);
    }
    } else {
      navigate("/login");
    }
  };

  const handleCartItemIncrement = async () => {
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

  const handleCartItemDecrement = async () => {
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

  return (
    <div className="card h-100 shadow-sm overflow-hidden">
      <img
        src={
          product.images
            ? `data:image/jpeg;base64,${product.images}`
            : product.images
        }
        className="card-img-top"
        alt={product.name}
        style={{
          height: "270px",
          objectFit: "cover"
        }}
      />

      <div className="card-body d-flex flex-column justify-content-between p-3">
        <h5 className="card-title">{isAdminLoggedIn ? `${product.name} (#${product.id})` : `${product.name}`}</h5>
        <h6 className="text-success mb-3">₹{product.price}</h6>

        <div className="mt-auto d-grid gap-2">
          <Link
            to={
              isAdminLoggedIn
                ? `/viewProduct/${product.id}/${product.name.toLowerCase().replace(/\s+/g, "-")}`
                : `/product/${product.id}/${product.name.toLowerCase().replace(/\s+/g, "-")}`
            }
            className="btn btn-primary"
          >
            View Details
          </Link>

          {isAdminLoggedIn ? (
            <div className="d-flex gap-2">
              <button
                className="btn btn-warning btn-sm w-50"
                onClick={() => navigate(`/updateProduct/${product.id}/${product.name}`)}
              >
                Edit
              </button>
              <button className="btn btn-danger btn-sm w-50" onClick={handleDelete}>
                Delete
              </button>
            </div>
          ) : (
            showWishlist && (
              <div className="d-flex gap-4 justify-content-center align-items-center">
                <button className="heart-btn" onClick={handleWishlist}>
                  {wishlistAdded? (
                    <i className="bi bi-heart-fill text-danger"></i>
                  ) : (
                    <i className="bi bi-heart text-danger"></i>
                  )}
                </button>

                {itemQuantity > 0 ? (
                  <div className="cartadded-btn d-inline-flex justify-content-center align-items-center flex">
                    <button className="btn btn-sm btn-light" onClick={handleCartItemDecrement}>
                      -
                    </button>
                    <span className="px-3">{itemQuantity}</span>
                    <button className="btn btn-sm btn-light" onClick={handleCartItemIncrement}>
                      +
                    </button>
                  </div>
                ) : (
                  <button className="heart-btn" onClick={handleCart}>
                    🛒
                  </button>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;