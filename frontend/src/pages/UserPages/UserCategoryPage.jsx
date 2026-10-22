import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategories } from "../../Services/Api";
import CategoryCard from "../../components/CategoryCard";

function UserCategoryPage({isAdminLoggedIn}) {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
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
  
    return (
        <div className="mt-4">

            
            <div className="row">

              {categories.map((category) => {

                  return (
                      <div
                          key={category.id}
                          className="col-sm-6 col-md-4 col-lg-3 mb-4"
                      >
                          <CategoryCard
                              category={category}
                              isAdminLoggedIn={isAdminLoggedIn}
                          />
                      </div>
                  );

              })}
        </div>

        </div>
    );
}

export default UserCategoryPage;