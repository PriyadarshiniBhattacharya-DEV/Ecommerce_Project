import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProductCard from "../../components/ProductCard";
import { searchProducts } from "../../Services/Api";

function SearchPage() {
  const { keyword } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSearchResults();
  }, [keyword]);

  const loadSearchResults = async () => {
    try {
      setLoading(true);

      const results = await searchProducts(keyword);

      setProducts(results);
    } catch (err) {
      console.error(err);
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
        Search Results for "{keyword}"
      </h2>

      {products.length === 0 ? (
        <div className="alert alert-warning">
          No products found.
        </div>
      ) : (
        <div className="row">

          {products.map((product) => (
            <div
              key={product.id}
              className="col-md-6 col-lg-3 mb-4"
            >
              <ProductCard product={product} />
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default SearchPage;