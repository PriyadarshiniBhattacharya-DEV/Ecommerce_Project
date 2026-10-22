import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { getProductsByCategory, deleteProducts, getCategoryById } from "../../Services/Api";
function CategoryPage({isAdminLoggedIn}) {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryProducts();
  }, [categoryId]);
  const handleDeleteProduct= async(id)=>{
      try {
          await deleteProducts(id);
          setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      } catch (error) {
          console.error("Error deleting product:", error);
      }
  }
  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);

      const data = await getProductsByCategory(categoryId);

      setProducts(data);
      
      const category = await getCategoryById(categoryId);

      if (category) {
        setCategoryName(category.name);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      
      <h2 className="mb-4">
        {categoryName || "Category"}
      </h2>
      {isAdminLoggedIn && (<div className="d-flex justify-content-end mb-3">
          <button className="btn btn-outline-primary" onClick={() => navigate(`/addProduct/${categoryId}`)}>
                      Add Product
          </button>
        </div>
      )}
      {products.length === 0 ? (
        <div className="alert alert-warning">
          No products available in this category.
        </div>
      ) : (
        <div className="row">

          {products.map((product) => (
            <div
              className="col-md-6 col-lg-3 mb-4"
              key={product.id}
            >
              <ProductCard product={product} isAdminLoggedIn={isAdminLoggedIn} onDelete={handleDeleteProduct}/>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default CategoryPage;