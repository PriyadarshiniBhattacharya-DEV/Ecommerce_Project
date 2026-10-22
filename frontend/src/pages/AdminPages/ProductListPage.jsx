import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts, increaseStock, decreaseStock, deleteProducts, getCategoryById, searchProducts, searchProductsById, searchProductsByCategory } from "../../Services/Api";

function CategoryCell({ categoryId }) {
    const [categoryName, setCategoryName] = useState("Loading...");
    useEffect(() => {
        let isMounted = true;
        const fetchCategory = async () => {
            try {
                const data = await getCategoryById(categoryId);
                if (isMounted) {
                    setCategoryName(data.name);
                }
            } catch (error) {
                console.error("Error loading category:", error);
                if (isMounted) {
                    setCategoryName("Unknown");
                }
            }
        };

        if (categoryId) {
            fetchCategory();
        } else {
            setCategoryName("N/A");
        }

        return () => {
            isMounted = false;
        };
    }, [categoryId]);

    return <span>{categoryName}</span>;
}
function ProductListPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("name");
    useEffect(() => {
        loadProducts();
    }, []);

    const handleSearchByName = async() =>{

      if (!search.trim()) {
        loadProducts();
        return;
      }
      try{
        const response = await searchProducts(search);
        setProducts(response);

      }
      catch(error){
        alert("Product does not exist");
        return;
      }
    }
    const handleSearchById = async() =>{

      if (!search.trim()) {
        loadProducts();
        return;
      }
      try{
        const response = await searchProductsById(search);
        setProducts(response);

      }
      catch(error){
        alert("Product does not exist");
        return;
      }
    }
    const handleSearchByCategory = async() =>{

      if (!search.trim()) {
        loadProducts();
        return;
      }
     try{
        const response = await searchProductsByCategory(search);
        setProducts(response);

      }
      catch(error){
        alert("Product does not exist");
        return;
      }
    }
    const handleSearch = () =>{
        if(searchType === "id")
            handleSearchById()
        else if(searchType === "category")
            handleSearchByCategory() 
        else
            handleSearchByName()
    }
    const loadProducts = async () => {
        try {
        const data = await getProducts();
        setProducts(data);
        } catch (error) {
        console.error("Error loading products:", error);
        }
    };
    const handleIncreaseStock = async (id) => {

        try {

        const updatedProduct = await increaseStock(id);

        setProducts((prevProducts) =>
            prevProducts.map((product) =>
            product.id === id
                ? updatedProduct
                : product
            )
        );

        } catch (error) {
        console.error("Error increasing stock:", error);
        }
  };


  const handleDecreaseStock = async (id) => {

    try {

      const updatedProduct = await decreaseStock(id);

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id
            ? updatedProduct
            : product
        )
      );

    } catch (error) {
      console.error("Error decreasing stock:", error);
    }
  };
  const handleDelete= async(id)=>{
    if (window.confirm(`Are you sure you want to delete ${products.find((product) => product.id === id)?.name}?`)) {
      try {
            await deleteProducts(id);
            setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }
    
  }
    return (
        
        <div className="mt-4">

            <div className="input-group mt-3 mb-4">
                <select 
                    className="form-select" 
                    style={{ maxWidth: "160px" }}
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}>
                    <option value="name">Name</option>
                    <option value="id">ID</option>
                    <option value="category">Category</option>
                </select>
                <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder={`Search products by ${searchType}...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch()
                        }
                    }}
                />
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => handleSearch()}>
                    <i className="bi bi-search"></i>
                </button>
            </div>
            <div className="d-flex justify-content-end mb-3">
                <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate("/addProduct")}
                >
                    Add Product
                </button>
            </div>
            <div>
                <table className="table table-success table-bordered table-striped text-center align-middle">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Edit</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>

                                <td>{<CategoryCell categoryId={product.category} />}</td>

                                <td>
                                    <div  className="text-start" style={{ whiteSpace: 'pre-line', maxHeight: '50px', overflowY: 'auto'}}>
                                        {product.description}
                                    </div>
                                </td>

                                <td>
                                    <img
                                        src={
                                            product.images
                                                ? product.images.startsWith("data:")
                                                    ? product.images
                                                    : `data:image/jpeg;base64,${product.images}`
                                                : "https://via.placeholder.com/60" // Optional fallback placeholder
                                        }
                                        alt={product.name}
                                        width="60"
                                        height="60"
                                        style={{ objectFit: "cover" }}
                                    />
                                </td>

                                <td>{product.name}</td>

                                <td>{product.price}</td>

                                <td>

                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                            handleDecreaseStock(product.id)
                                            }
                                            disabled={product.stock === 0}
                                        >
                                            −
                                        </button>

                                        <span
                                            className="mx-3 fw-bold"
                                            style={{
                                            minWidth: "25px",
                                            textAlign: "center"
                                            }}
                                        >
                                            {product.stock}
                                        </span>

                                        <button
                                            type="button"
                                            className="btn btn-success btn-sm"
                                            onClick={() =>
                                            handleIncreaseStock(product.id)
                                            }
                                        >
                                            +
                                        </button>
                                    </div>

                                </td>

                                <td>
                                    <div>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => navigate(`/updateProduct/${product.id}/${product.name.toLowerCase().replace(/\s+/g, "-")}`)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm me-2" onClick={() => navigate(`/viewProduct/${product.id}/${product.name.toLowerCase().replace(/\s+/g, "-")}`)}
                                        >
                                            View
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm" onClick={()=>handleDelete(product.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductListPage;