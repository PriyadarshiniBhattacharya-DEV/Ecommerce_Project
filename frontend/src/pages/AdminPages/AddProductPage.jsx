import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { addProducts, getCategories } from '../../Services/Api.js';

function AddProductPage() {
    const navigate = useNavigate();
    const {categoryId} = useParams();
    useEffect(() => {
        loadCategories();
    }, []);
    const [categories,SetCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        category: categoryId? categoryId : "",
        stock: "",
        image: null
    });
    const loadCategories = async() => {
        try{
            const data = await getCategories();
            SetCategories(data);
        }
        catch (error) {
            console.error("Error loading products:", error);
        }
    }
    const handleChange = (e) => {

        const { name, value, files } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Product:", formData);
        try 
        {
            const dataToSend = new FormData();
            dataToSend.append("name", formData.name);
            dataToSend.append("price", formData.price);
            dataToSend.append("description", formData.description);
            dataToSend.append("category", formData.category);
            dataToSend.append("stock", formData.stock);
            if (formData.image) {
                dataToSend.append("image", formData.image);
            }
            const result = await addProducts(dataToSend);
            if(result && result.ok != false){
                alert("Product added successfully");
                setFormData({name: "", price: "", description: "", category: "", stock: "", image: null});
                navigate(-1)
            }
            else{
                alert("Failed to add product");
                navigate("/addProduct");
            }
            } catch (error) {
            console.error(error);
        }
        // API call will be added later
    };
    const matchedCategory = categories.find(
        (cat) => String(cat.id) === String(categoryId)
    );

    const categoryDisplayName = matchedCategory ? matchedCategory.name : "Loading...";

    return (
        <div className="container py-5">

            <div className="row justify-content-center">

                <div className="col-lg-8 col-md-10">

                    <div className="card shadow-sm border-0">

                        {/* Header */}
                        <div className="card-header bg-dark text-white py-3">
                            <h3 className="mb-0">
                                Add New Product
                            </h3>

                            <small className="text-light">
                                Enter the details of the new product
                            </small>
                        </div>


                        {/* Form */}
                        <div className="card-body p-4">

                            <form onSubmit={handleSubmit} method="POST">

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
                                        placeholder="Enter product name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="row">

                                    {/* Price */}
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
                                                placeholder="Enter price"
                                                min="0"
                                                value={formData.price}
                                                onChange={handleChange}
                                                required
                                            />

                                        </div>

                                    </div>


                                    {/* Stock */}
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
                                            placeholder="Enter stock quantity"
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
                                    {categoryId ? (
                                        <input
                                            type="text"
                                            value={categoryDisplayName}
                                            disabled
                                            className="form-control read-only-input bg-light"
                                        />
                                        ) : (
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

                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                                </option>
                                            ))}

                                        </select>
                                    )}
                                    

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
                                        placeholder="Enter product description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* Image */}
                                <div className="mb-4">

                                    <label
                                        htmlFor="image"
                                        className="form-label fw-semibold"
                                    >
                                        Product Image
                                    </label>

                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={handleChange}
                                    />

                                    <div className="form-text">
                                        Upload a JPG, JPEG, PNG or WEBP image.
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
                                        Add Product
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

export default AddProductPage;