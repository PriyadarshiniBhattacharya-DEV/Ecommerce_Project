import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategories, getProductById, updateProductById } from "../../Services/Api";

function UpdateProductPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: "",
        image: ""
    });

    const [newImage, setNewImage] = useState(null);
    const [categories, setCategories] = useState([]);

    const loadProduct = async () => {
        try {
        const data = await getProductById(id);
        if (data) {
                setFormData({
                    name: data.name,
                    price: data.price,
                    description: data.description,
                    category: data.category,
                    stock: data.stock,
                    image: data.images
                });
        }
        } catch (error) {
        console.error("Error loading product:", error);
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
        loadProduct();
        loadCategories();
    }, [id]);


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
            const productData = new FormData();
            productData.append("name", formData.name);
            productData.append("price", formData.price);
            productData.append("description", formData.description);
            productData.append("category", formData.category);
            productData.append("stock", formData.stock);

            if (newImage) {
                productData.append("image", newImage);
            }

            await updateProductById(id, productData);

            alert("Product updated successfully!");
            navigate(-1);
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Failed to update product.");
        }

    };


    if (!formData.name) {
        return (
            <div className="container mt-5">
                <h4>Loading product...</h4>
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
                                Update Product
                            </h3>

                            <small>
                                Update the details of the product
                            </small>

                        </div>


                        <div className="card-body p-4">

                            <form onSubmit={handleSubmit}>


                                {/* Product Name */}

                                <div className="mb-3">

                                    <label
                                        htmlFor="name"
                                        className="form-label fw-semibold"
                                    >
                                        Product Name
                                    </label>

                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-control"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* Price and Stock */}

                                <div className="row">

                                    <div className="col-md-6 mb-3">

                                        <label
                                            htmlFor="price"
                                            className="form-label fw-semibold"
                                        >
                                            Price
                                        </label>

                                        <div className="input-group">

                                            <span className="input-group-text">
                                                ₹
                                            </span>

                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                className="form-control"
                                                min="0"
                                                value={formData.price}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>

                                    </div>


                                    <div className="col-md-6 mb-3">

                                        <label
                                            htmlFor="stock"
                                            className="form-label fw-semibold"
                                        >
                                            Stock
                                        </label>

                                        <input
                                            type="number"
                                            id="stock"
                                            name="stock"
                                            className="form-control"
                                            min="0"
                                            value={formData.stock}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>

                                </div>


                                {/* Category */}

                                <div className="mb-3">

                                    <label
                                        htmlFor="category"
                                        className="form-label fw-semibold"
                                    >
                                        Product Category
                                    </label>

                                    <select
                                        id="category"
                                        name="category"
                                        className="form-select"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select category
                                        </option>

                                        {categories.map((category) => (

                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>

                                        ))}

                                    </select>

                                </div>


                                {/* Description */}

                                <div className="mb-3">

                                    <label
                                        htmlFor="description"
                                        className="form-label fw-semibold"
                                    >
                                        Product Description
                                    </label>

                                    <textarea
                                        id="description"
                                        name="description"
                                        className="form-control"
                                        rows="4"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* Existing Image */}

                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Current Product Image
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


                                {/* New Image */}

                                <div className="mb-4">

                                    <label
                                        htmlFor="image"
                                        className="form-label fw-semibold"
                                    >
                                        Change Product Image
                                    </label>

                                    <input
                                        type="file"
                                        id="image"
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
                                        className="btn btn-outline-secondary"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary px-4"
                                    >
                                        Update Product
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

export default UpdateProductPage;