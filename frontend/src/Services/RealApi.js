import { BASE_URL } from "../Config";

// User related Api methods
export const authorizeUser = async(formData, userRegistered) =>{
  const url = userRegistered? `${BASE_URL}/api/user/login` : `${BASE_URL}/api/user/signup`;
  const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
  });
  const result = await response.json().catch(()=>({}));
  return {
    ok: response.ok,
    statusText:response.statusText,
    ...result,
  };
}
export const searchUserList = async (searchTerm = "") => {
  try {
    const url = new URL(`${BASE_URL}/api/user/searchUser`);
    url.searchParams.append("searchTerm", searchTerm);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await response.json().catch(() => ({}));

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: Array.isArray(result) ? result : [],
    };
  } catch (error) {
    return {
      ok: false,
      statusText: error.message || "Network Error",
      data: [],
    };
  }
};
export const showUserList=async()=>{
  const list=await fetch(`${BASE_URL}/api/user/users`);
  if (!list) throw new Error("Failed to fetch user list.");
  return list.json();
}
export const checkCredentialValidity = async(email, password, isAdmin) => {
  const url = isAdmin? `${BASE_URL}/api/admin/adminlogin` : `${BASE_URL}/api/user/login`;
  console.log(url);
  const response = await fetch(url, {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({
    email: email,
    password: password,
    }),
  }); 
  const result = await response.json();
 
  console.log("Response:", result);
  //const result = await response.json();
  return {
    ok: response.ok,
    ...result,
  };
};


//wishlist related Api methods
export const isInWishlist = async (userId, productId) => {
  if (!userId || !productId) return false;

  try {
    const res = await fetch(`${BASE_URL}/api/wishlist/userwishlistproducts/${userId}`);
    if (!res.ok) return false;

    const data = await res.json();
    const items = Array.isArray(data) ? data : (data?.items || []);

    // Check against product.id, item.productId, or direct item.id
    return items.some((item) => {
      const idToCheck = item.id || item.product.id || item.product?.id;
      return Number(idToCheck) === Number(productId);
    });
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    return false;
  }
};
export const getWishlist = async (userId) => {
  if (!userId) return;

  const res = await fetch(`${BASE_URL}/api/wishlist/userwishlist/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch wishlist");
  return res.json();
};
export const getWishlistProducts = async (userId) => {
  if (!userId) return;

  const res = await fetch(`${BASE_URL}/api/wishlist/userwishlistproducts/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch wishlist products");
  return res.json();
};

export const addToWishlist = async (userId, productId) => {
  const res = await fetch(`${BASE_URL}/api/wishlist/addwishlist/${userId}/${productId}`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to add to wishlist");
  return res.json();
};

export const removeFromWishlist = async (userId, productId) => {
  if (!userId || !productId) return;

  const res = await fetch(`${BASE_URL}/api/wishlist/removefromwishlist/${userId}/${productId}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to remove from wishlist");
  return res.json();
};


//product related Api methods
export const addProducts = async (productData) => {
  if (!productData) return;

  try {
    const response = await fetch(`${BASE_URL}/api/products/addproduct`, {
      method: "POST",
      body: productData,
    });
     
    if (!response.ok) {
      throw new Error("Failed to add product");
    }
     
    const data = await response.json().catch(()=>({}));
    return data;
  } 
  catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};
export const deleteProducts=async(id)=>{
  const response= await fetch(`${BASE_URL}/api/products/delete/${id}`,{
    method: "DELETE",
  });
  if(!response.ok){
    throw new Error("Failed to delete product");
  }
  return await response.text();
}
export const deleteAllCategoryProducts=async(category)=>{
  const response= await fetch(`${BASE_URL}/api/products/deletecategoryproducts/${category}`,{
    method: "DELETE",
  });
  if(!response.ok){
    throw new Error("Failed to delete products in this category");
  }
  return await response.text();
}

// ...rest of your RealApi.js stays the same (getProducts, getOrders, etc.)
export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/api/products/productlist`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const getProductById = async (id) => {
  if (!id) return;

  const res = await fetch(`${BASE_URL}/api/products/getProduct/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};
export const updateProductById = async (id, productData) => {
  if (!id || !productData) return;

  try {
    const response = await fetch(`${BASE_URL}/api/products/updateProduct/${id}`, {
      method: "PUT",
      body: productData,
    });
     
    if (!response.ok) {
      throw new Error("Failed to update product");
    }
     
    const data = await response.json().catch(()=>({}));
    return data;
  } 
  catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};


export const getProductsByCategory = async (catid) => {
  if (!catid) return;

  const res = await fetch(`${BASE_URL}/api/products/getproductbycategory/${catid}`);
  if (!res.ok) throw new Error("Failed to fetch category products");
  return res.json();
};

export const searchProducts = async (keyword) => {
  const res = await fetch(`${BASE_URL}/api/products/searchbyname/${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error("Failed to search products");
  return res.json();
};

export const searchProductsById = async (keyword) => {
  const res = await fetch(`${BASE_URL}/api/products/searchbyid/${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error("Failed to search products");
  return res.json();
};

export const searchProductsByCategory = async (keyword) => {
  const res = await fetch(`${BASE_URL}/api/products/searchbycategory/${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error("Failed to search products");
  return res.json();
};

export const increaseStock = async (id) => {
  if (!id) return;
  const res = await fetch(`${BASE_URL}/api/products/increaseStock/${id}`, { method: "PUT" });
  if (!res.ok) throw new Error("Failed to increase stock");
  return res.json();
};

export const decreaseStock = async (id) => {
  if (!id) return;

  const res = await fetch(`${BASE_URL}/api/products/decreaseStock/${id}`, { method: "PUT" });
  if (!res.ok) throw new Error("Failed to decrease stock");
  return res.json();
};


//category related methods
export const addCategories = async (categoryData) => {
  if (!categoryData) return;

  try {
    const response = await fetch(`${BASE_URL}/api/category/addcategory`, {
      method: "POST",
      body: categoryData,
    });
     
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to add category");
    }
     
    const data = await response.json().catch(()=>({}));
    return data;
  } 
  catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};
export const deleteCategory = async (id) =>{
  if (!id) return;

  const response= await fetch(`${BASE_URL}/api/category/deletecategory/${id}`,{
    method: "DELETE",
  });
  if(!response.ok){
    throw new Error("Failed to delete category");
  }
  return await response.text();
}

export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/api/category/categoryList`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

export const getCategoryById = async (id) => {
  if (!id) return;

  const res = await fetch(`${BASE_URL}/api/category/getcategory/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};

export const updateCategoryById = async (id, categoryData) => {
  if (!id || !categoryData) return;

  try {
    const response = await fetch(`${BASE_URL}/api/category/updatecategory/${id}`, {
      method: "PUT",
      body: categoryData,
    });
     
    if (!response.ok) {
      throw new Error("Failed to update category");
    }
     
    const data = await response.json().catch(()=>({}));
    return data;
  } 
  catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};
export const searchCategoryByName = async (keyword) => {
  const res = await fetch(`${BASE_URL}/api/category/searchcategorybyname/${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error("Failed to search category");
  return res.json();
};

export const searchCategoryById = async (keyword) => {
  const res = await fetch(`${BASE_URL}/api/category/searchcategorybyid/${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error("Failed to search category");
  return res.json();
};

export const getCart = async () => {
  const res = await fetch(`${BASE_URL}/api/cart`);
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
};
export const getCartProducts = async (userId) => {
  if (!userId) return;

  const res = await fetch(`${BASE_URL}/api/cart/usercartitems/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch wishlist products");
  return res.json();
};

export const addToCart = async (userId, productId) => {
  if (!userId || !productId) {
    throw new Error("Missing userId or productId");
  }
  const res = await fetch(`${BASE_URL}/api/cart/additemtocart/${userId}/${productId}`, {
    method: "POST"
  });
  if (!res.ok) {
    throw new Error("Failed to add product to cart");
  }
  return res.json();
};
export const getCartItemQuantity = async (userId, productId) => {
  if (!userId || !productId) return;

  try {
    const res = await fetch(`${BASE_URL}/api/cart/usercartitem/${userId}/${productId}`);
    if (!res.ok) return 0;
    const text = await res.text();
    if (!text || text.trim() === "") return 0;
    const cartData = JSON.parse(text);
    if (cartData && typeof cartData === "object" && !Array.isArray(cartData) && !cartData.items) {
      const idToCheck = cartData.product.id || cartData.product?.id || cartData.id;
      if (Number(idToCheck) === Number(productId)) {
        return Number(cartData.quantity) || 1;
      }
      return 0;
    }
    const items = Array.isArray(cartData)
      ? cartData
      : Array.isArray(cartData?.items)
      ? cartData.items
      : [];
    const matchedItem = items.find((item) => {
      const idToCheck = item.product.id || item.product?.id || item.id;
      return Number(idToCheck) === Number(productId);
    });
    return matchedItem ? Number(matchedItem.quantity) || 1 : 0;
  } catch (error) {
    console.error("Error fetching cart item quantity:", error);
    return 0;
  }
};
export const getCartTotal = async (userId) => {
  if (!userId) return;

  const res= await fetch(`${BASE_URL}/api/cart/usercartitems/gettotal/${userId}`);
  if (!res.ok) throw new Error("Failed to get cart total");
  return res.json();
};

export const removeFromCart = async (userId, productId) => {
  if (!userId || !productId) return;
  const res = await fetch(`${BASE_URL}/api/cart/removecartitem/${userId}/${productId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to remove product");
  return res.json();
};

export const increaseQuantity = async (userId, productId, newQuantity) => {
  if (!userId || !productId) return;

  const res = await fetch(`${BASE_URL}/api/cart/updatecart/${userId}/${productId}`, { method: "PUT", headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newQuantity)});
  if (!res.ok) throw new Error("Failed to increase quantity");
  return res.json();
};

export const decreaseQuantity = async (userId, productId, newQuantity) => {
  if (!userId || !productId) return;

  const res = await fetch(`${BASE_URL}/api/cart/updatecart/${userId}/${productId}`, { method: "PUT", headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newQuantity)});
  if (!res.ok) throw new Error("Failed to decrease quantity");
  return res.json();
};

export const clearCart = async (userId) => {
  if (!userId) return;

  const res = await fetch(`${BASE_URL}/api/cart/clearcart/${userId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to clear cart: ${res.status}`);
  return;
};

export const saveUserAddress = async (userId, addressString) => {
  if (!userId) return false;

    const response = await fetch(`${BASE_URL}/api/user/updateAddressBook/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "text/plain",
        },
        body: addressString,
    });

    if (!response.ok) {
        throw new Error("Failed to save address");
    }

    return await response.json();
};
export const getUserAddresses = async (userId) => {
  if (!userId ) return;

    const response = await fetch(`${BASE_URL}/api/user/getAddressBook/${userId}`, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch addresses");
    }

    return await response.json(); // Returns array of strings: ["Address 1", "Address 2", ...]
};

export const deleteUserAddress = async (userId, index) => {
  if (!userId) return false;

    const response = await fetch(`${BASE_URL}/api/user/deleteAddress/${userId}/${index}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete address");
    return await response.json();
};
// --- Orders ---
export const getOrders = async () => {
  const res = await fetch(`${BASE_URL}/api/order/getorders`,{
    method:"GET",
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

export const getOrderById = async (id) => {
  if (!id) return;

  const res = await fetch(`${BASE_URL}/api/order/getorder/${id}`);
  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
};

export const getOrdersByUserId = async (userId) => {
  if (!userId) return;

  const res = await fetch(`${BASE_URL}/api/order/getorders/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};
export const createOrder = async (userId, shippingAddress) => {
  if (!userId) return ;

  const res = await fetch(`${BASE_URL}/api/order/addorders/${userId}`, {
    method: "POST",
    headers:{
      "Content-Type":"text/plain",
    },
    
    body: shippingAddress,
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
};

export const updateOrderStatus = async (orderId, newStatus) => {
  if (!orderId) return;

  const res = await fetch(`${BASE_URL}/api/order/updateorderstatus/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ "status":newStatus }),
  });
  if (!res.ok) throw new Error("Failed to update order");
  return res.json();
};
export const updateOrderItemStatus = async (itemId, newStatus) => {
  if (!itemId) return;

  const res = await fetch(`${BASE_URL}/api/order/updateorderitemstatus/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ "status":newStatus }),
  });
  if (!res.ok) throw new Error("Failed to update order item status");
  return res.json();
};
export const submitReturnRequest = async (itemId, returnData) => {
  if (!itemId) return;
  const formData = new FormData();
  formData.append("reason", returnData.reason);
  formData.append("details", returnData.comments);
  returnData.photos.forEach((file) => formData.append("photos", file));

  const res = await fetch(`${BASE_URL}/api/order/returnorderitem/${itemId}`, {
    method: "PUT",
    body: formData, // no Content-Type header — browser sets multipart boundary automatically
  });

  if (!res.ok) throw new Error("Failed to submit return request");
  return res.json();
};
export const cancelReturnRequest = async (itemId) => {
  if (!itemId) return;
  const res = await fetch(`${BASE_URL}/api/order/cancelreturn/${itemId}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to cancel return request");
  return res.json();
};

export const fetchReturnRequest = async (itemId) => {
  if (!itemId) return;
  const res = await fetch(`${BASE_URL}/api/order/getReturnRequest/${itemId}`);
  
  if (!res.ok) throw new Error("Failed to fetch return request");
  return res.json();
}