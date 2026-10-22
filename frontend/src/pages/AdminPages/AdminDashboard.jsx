import {useNavigate} from "react-router-dom";
import Cakeshop from "../../assets/Cakeshop.jpeg";
function AdminDashboard(){
    const navigate=useNavigate();
    return(
        <div className="admin-dashboard">
            <div className="image bg-light w-100 p-0" style={{backgroundImage:`url(${Cakeshop})`,}}>
                <h2 className="text-white fw-bold">Welcome Admin</h2>
            </div>
            <div className="d-flex justify-content-center align-items-center my-3 row g-4 mb-4">
                
                <div className="col-md-4">
                    <div className="card text-center shadow p-4" style={{cursor:"pointer"}} onClick={()=>navigate("/productlist")}>
                        <h4>Products</h4>
                    </div>
                </div>
                
                {/* <div className="col-md-4">
                    <div className="card text-center shadow p-4" style={{cursor:"pointer"}} onClick={()=>navigate("/users")}>
                        <h4>Feedbacks</h4>
                    </div>
                </div> */}
                <div className="col-md-4">
                    <div className="card text-center shadow p-4" style={{cursor:"pointer"}} onClick={()=>navigate("/admincategory")}>
                        <h4>Categories</h4>
                    </div>
                </div>
                
                {/* <div className="col-md-4">
                    <div className="card text-center shadow p-4" style={{cursor:"pointer"}} onClick={()=>navigate("/sales")}>
                        <h4>Sales Report</h4>
                    </div>
                </div> */}
            </div>
            <div className="d-flex justify-content-center align-items-center my-3 row g-4">
                <div className="col-md-4">
                    <div className="card text-center shadow p-4" style={{cursor:"pointer"}} onClick={()=>navigate("/users")}>
                        <h4>Users</h4>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center shadow p-4" style={{cursor:"pointer"}} onClick={()=>navigate("/adminorders")}>
                        <h4>Orders</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdminDashboard;