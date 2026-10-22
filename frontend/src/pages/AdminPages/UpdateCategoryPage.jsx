import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategories, getCategoryById } from "../../Services/Api";
import { updateCategoryById } from "../../Services/Api";

function UpdateCategoryPage() {

    const { categoryid } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        image: ""
    });

    const [newImage, setNewImage] = useState(null);
    const [categories, setCategories] = useState([]);

    const loadCategoryById = async () => {
        try {
        const data = await getCategoryById(categoryid);
        if (data) {
                setFormData({
                    name: data.name,
                    image: data.image
                });
        }
        } catch (error) {
        console.error("Error loading category:", error);
        }
    };
    const loadCategories = async () => {
        try {
        const data = await getCategories();
        setCategories(data);
        } catch (error) {
        console.error("Error loading categories:", error);
        }
    };
    // Load existing product and categories
    useEffect(() => {
        loadCategoryById();
        loadCategories();
    }, [categoryid]);


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (file) {
            setNewImage(file);
        }

    };


    const handleSubmit = async(e) => {

        e.preventDefault();

        try {
            const categoryData = new FormData();
            categoryData.append("name", formData.name);

            if (newImage) {
                categoryData.append("image", newImage);
            }

            await updateCategoryById(categoryid, categoryData);

            alert("category updated successfully!");
            navigate(-1);
        } catch (error) {
            console.error("Error updating category:", error);
            alert("Failed to update category.");
        }

    };


    if (!formData.name) {
        return (
            <div className="container mt-5">
                <h4>Loading Category...</h4>
            </div>
        );
    }


    return (

        <div className="container py-5">

            <div className="row justify-content-center">

                <div className="col-lg-8 col-md-10">

                    <div className="card shadow-sm border-0">

                        {/* Header */}

                        <div className="card-header bg-dark text-white py-3">

                            <h3 className="mb-0">
                                Update Category
                            </h3>

                            <small>
                                Update the details of the Category
                            </small>

                        </div>


                        <div className="card-body p-4">

                            <form onSubmit={handleSubmit} method="POST">

                                <div className="mb-3">

                                    <label
                                        htmlFor="name"
                                        className="form-label fw-semibold"
                                    >
                                        Category Name
                                    </label>

                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-control"
                                        placeholder="Enter Category name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Current Category Image
                                    </label>

                                    <div>
                                        <img
                                            src={
                                                newImage
                                                    ? URL.createObjectURL(newImage)
                                                    : formData.image
                                                    ? formData.image.startsWith("data:")
                                                        ? formData.image
                                                        : `data:image/jpeg;base64,${formData.image}`
                                                    : "https://via.placeholder.com/180?text=No+Image"
                                            }
                                            alt={formData.name}
                                            style={{
                                                width: "180px",
                                                height: "180px",
                                                objectFit: "cover",
                                                borderRadius: "8px"
                                            }}
                                        />
                                    </div>

                                </div>
                                {/* Image */}
                                <div className="mb-4">

                                    <label
                                        htmlFor="image"
                                        className="form-label fw-semibold"
                                    >
                                        Category Image
                                    </label>

                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />

                                    <div className="form-text">
                                        Leave empty to keep the current image.
                                    </div>

                                </div>


                                {/* Buttons */}
                                <div className="d-flex justify-content-end gap-2">

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary" onClick={() => navigate("/admincategory")}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary px-4"
                                    >
                                        Update Category
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default UpdateCategoryPage;