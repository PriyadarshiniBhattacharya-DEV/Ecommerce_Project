import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Products(){
    //const [card, setCard] = useState("");
    const navigate = useNavigate();

    const viewProduct = async (e) => {
        const response = await fetch(`http://localhost:8080/products`);

        const products = await response.json();

        navigate("`/products`", {state: products});

    };

    return(
        <>
        <div className="card" style={{width: "18rem"}}>
            <img className="card-img-top" src="vite.svg" alt="Card image cap"></img>
            <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" className="btn btn-primary">Add to cart</a>
                <a href="products" className="btn btn-primary" onClick={viewProduct}>View</a>

            </div>
        </div>
        </>
    );
}
export default Products;