import { Link, useNavigate } from "react-router-dom";
function CategoryCard({ category, isAdminLoggedIn, onDelete }) {
  const navigate = useNavigate();
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${category.name}?\n\nDeleting this category will delete all the products in this category!`)) {
      onDelete(category.id);
    }
  }
  return (
    <div className="card h-100 shadow-sm overflow-hidden">

      {/* Random Product Image */}
      <img
        src={
          category?.image 
      ? `data:image/jpeg;base64,${category.image}`
      : category.image
        }
        className="card-img-top"
        alt={category.name}
        style={{
          height: "350px",
          objectFit: "cover",
        }}
      />

      <div className="card-body d-flex flex-column">

        <h4 className="card-title text-center">
          {isAdminLoggedIn ? `${category.name} (#${category.id})` : `${category.name}`}
        </h4>

        {/* <h6 className="text-center mb-3">
          {randomProduct ? randomProduct.name : "No Products"}
        </h6> */}

        <Link
          to={isAdminLoggedIn ? `/admincategory/${category.id}` : `/category/${category.id}`}          
          className="btn btn-primary mt-auto mb-2"
        >
          View Products
        </Link>
        {isAdminLoggedIn && (
          <div className="d-flex gap-2">
            <button 
              className="btn btn-warning btn-sm w-50" 
              onClick={() => navigate(`/admincategory/edit/${category.id}`)} // Adjust your edit route as needed
            >
              Edit
            </button>
            <button 
              className="btn btn-danger btn-sm w-50" 
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryCard;