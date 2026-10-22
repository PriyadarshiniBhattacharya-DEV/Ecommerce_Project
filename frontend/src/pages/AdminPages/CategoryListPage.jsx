import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategories, deleteCategory, deleteAllCategoryProducts, searchCategoryByName, searchCategoryById } from "../../Services/Api";
import CategoryCard from "../../components/CategoryCard";

function CategoryListPage({isAdminLoggedIn}) {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("name");
    useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };
  const handleDeleteCategory = async (id) =>{
     try {
      await deleteCategory(id); // Call backend API
      await deleteAllCategoryProducts(id);
      // Remove the deleted item locally to trigger UI re-render instantly
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== id)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
    }
    
  }
  const handleSearchByName = async() =>{
  
        if (!search.trim()) {
          loadCategories();
          return;
        }
        try{
          const response = await searchCategoryByName(search);
          setCategories(response);
  
        }
        catch(error){
          alert("Category does not exist");
          return;
        }
      }
      const handleSearchById = async() =>{
  
        if (!search.trim()) {
          loadCategories();
          return;
        }
        try{
          const response = await searchCategoryById(search);
          setCategories(response);
  
        }
        catch(error){
          alert("Category does not exist");
          return;
        }
      }
      const handleSearch = () =>{
        if(searchType === "id")
            handleSearchById()
        else
            handleSearchByName()
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
                </select>
                <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder={`Search category by ${searchType}...`}
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
            <div className="d-flex justify-content-end mb-3 ms-auto">
                <button
                    className="btn btn-outline-primary ms-auto"
                    onClick={() => navigate("/addCategory")}
                >
                    Add Category
                </button>
            </div>

            <div className="row">

              {categories.map((category) => {

                //   const categoryProducts = products.filter(
                //       (product) => product.categoryId === category.id
                //   );

                //   const randomProduct =
                //       categoryProducts[
                //           Math.floor(Math.random() * categoryProducts.length)
                //       ];

                  return (
                      <div
                          key={category.id}
                          className="col-sm-6 col-md-4 col-lg-3 mb-4"
                      >
                          <CategoryCard
                              category={category}
                              isAdminLoggedIn={isAdminLoggedIn}
                              onDelete={handleDeleteCategory}
                          />
                      </div>
                  );

              })}
        </div>

        </div>
    );
}

export default CategoryListPage;