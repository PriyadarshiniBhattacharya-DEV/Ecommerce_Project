import { useEffect, useState } from "react";

import ProductCard from "../../components/ProductCard";

import { getWishlist,removeFromWishlist, } from "../../Services/Api";
import { useAuth } from "../../Context/AuthContext";
import { getWishlistProducts } from "../../Services/RealApi";
function WishlistPage() {

  const [wishlist, setWishlist] = useState([]);
  const { user, isLoggedIn } = useAuth();
  const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const userId = user?.id || user?.userId || storedUser.id || storedUser.userId;
  useEffect(() => {
    if(userId)
      loadWishlist();
  }, []);

  const loadWishlist = async () => {

    const products = await getWishlistProducts(userId);

    setWishlist(products);

  };

  const handleRemove = async (id) => {

    const updatedWishlist =
      await removeFromWishlist(userId, id);

    setWishlist(updatedWishlist);

  };

  return (

    <div className="container mt-4">

      <h2 className="mb-4">
        My Wishlist
      </h2>

      {isLoggedIn? (<>{

        wishlist.length === 0 ? (

          <div className="alert alert-info">
            Your wishlist is empty.
          </div>

        ) : (

          <div className="row">

            {

              wishlist.map(product => (

                <div className="col-md-6 col-lg-3 mb-4" key={product.id}>

                  <ProductCard product={product} onRemove={handleRemove} isLoggedIn={isLoggedIn}/>

                </div>

              ))

            }

          </div>

        )

      }</>) : (<><p className="alert alert-info">
            Please Log In to Access Your Wishlist ❤️
          </p></>)}

    </div>

  );

}

export default WishlistPage;