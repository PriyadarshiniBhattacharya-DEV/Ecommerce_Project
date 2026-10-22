import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProducts, getCategories } from "../../Services/Api";
import ProductCard from "../../components/ProductCard";
import CategoryCard from "../../components/CategoryCard";
function Dashboard({isLoggedIn}) {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);  
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [displayCategories, setDisplayCategories] = useState([]);
  
  useEffect(() => {
      getProducts().then(setProducts);
      getCategories().then(setCategories);
  }, []);
  
  useEffect(() => {
    if (products.length > 0 && categories.length > 0) {
      generateRandomSelection();
    }
  }, [products, categories]);
  
  const generateRandomSelection = () => {

    const validCategories = categories.filter((category) => {
      const categoryProducts = products.filter(
        (product) => product.category === category.id
      );
      return categoryProducts.length > 0;
    });
    
    if (validCategories.length === 0) return;

    const shuffledCategoriesForFeatured = [...validCategories].sort(() => 0.5 - Math.random());
    const selectedFeaturedCategories = shuffledCategoriesForFeatured.slice(0, 4);

    const featured = selectedFeaturedCategories
      .map((category) => {
        const categoryProducts = products.filter(
          (product) => product.category === category.id
        );

        if (categoryProducts.length === 0) return null;

        const randomIndex = Math.floor(
          Math.random() * categoryProducts.length
        );

        return categoryProducts[randomIndex];
      })
      .filter(Boolean);

    setFeaturedProducts(featured);

    const shuffledCategoriesForDisplay = [...categories].sort(
      () => 0.5 - Math.random()
    );
    setDisplayCategories(shuffledCategoriesForDisplay.slice(0, 4));
  };

  const handleSearch = (e) => {
    if (search.trim() !== "") {
      navigate(`/search/${search}`);
    }
  };
  

  return (
    <div className="container mt-4">

      <div className="mb-4">
        <h2 className="fw-bold">
          Welcome to CakeShop
        </h2>
      </div>

      {/* Search */}

      <div className="input-group">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={handleSearch}
        >
          <i className="bi bi-search"></i>
        </button>
      </div>

      {/* Products */}

      <div className="mt-4">

        <h3 className="mb-4">
          Featured Products
        </h3>
        <div className="container mt-4">
          <div className="row">

            {featuredProducts.map((product) => (
                <div
                    key={product.id}
                    className="col-md-6 col-lg-3 mb-4"
                >
                    <ProductCard product={product} isLoggedIn={isLoggedIn}/>
                </div>
            ))}          

          </div>
        </div>
      </div>

      {/* Categories */}

      <div >

        <h3 className="mb-3">
          Categories
        </h3>
        <button 
            className="btn btn-outline-primary btn-sm ms-auto"
            onClick={() => navigate("/allcategories")}
          >
            View All Categories
          </button>
      <div className="mt-4">
        <div className="row">
              {displayCategories.map((category) => {

                  const categoryProducts = products.filter(
                      (product) => product.categoryId === category.id
                  );

                  const randomProduct =
                      categoryProducts[
                          Math.floor(Math.random() * categoryProducts.length)
                      ];

                  return (
                      <div
                          key={category.id}
                          className="col-md-4 col-lg-3 mb-4"
                      >
                          <CategoryCard
                              category={category}
                              randomProduct={randomProduct}
                          />
                      </div>
                  );

              })}
        </div>
      </div>
      </div>

    </div>
  );
}

export default Dashboard;