import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCategories, getCategories } from '../../Services/Api.js';

function addCategoryPage(){
    const navigate = useNavigate();
    const[formData, setFormData] = useState({
        name: "",
        image: null,
    });
    const handleChange = (e) =>{

        setFormData({
                ...formData,
                [e.target.name]: e.target.type ==="file"? e.target.files[0] : e.target.value
            });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        try 
        {
            const dataToSend = new FormData();
            dataToSend.append("name", formData.name);
            if (formData.image) {
                dataToSend.append("image", formData.image);
            }

            const result = await addCategories(dataToSend);
            if(result && result.ok != false){
                alert("New category added successfully");
                setFormData({ name: "", image: null });
                navigate("/admincategory")
            }
        } 
        catch (error) {
            
            console.error(error);
            alert(error.message);
        }
    };
    return(
        <div className="container py-5">

            <div className="row justify-content-center">

                <div className="col-lg-8 col-md-10">

                    <div className="card shadow-sm border-0">

                        {/* Header */}
                        <div className="card-header bg-dark text-white py-3">
                            <h3 className="mb-0">
                                Add New Category
                            </h3>

                            <small className="text-light">
                                Enter the details of the new category
                            </small>
                        </div>


                        {/* Form */}
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
                                        className="btn btn-outline-secondary" onClick={() => navigate("/admincategory")}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary px-4"
                                    >
                                        Add Category
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
export default addCategoryPage;