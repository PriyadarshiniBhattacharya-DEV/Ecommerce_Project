import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { checkCredentialValidity } from "../../Services/Api";
import { useAuth } from "../../Context/AuthContext";

function LoginPage() {

  
  const navigate = useNavigate();
  const { loginUser, isLoggedIn } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  
  const handleChange = (e) => {
          setFormData({
            ...formData,
            [e.target.name]: e.target.value
          });
  };
  
 
  
  const handleSubmit = async(e) => {
    e.preventDefault();

    if (isLoggedIn) {
        alert("You are already logged in. Please logout first to login again.");
        return;
    }
    const validity = await checkCredentialValidity(formData.email,formData.password, false);
    if(!validity.ok){
      alert(validity.message);
      setError(validity.message);
      return;
    }
    const userData = {
      id: validity.user?.id || validity.userId || validity.id,
      name: validity.user?.name || validity.name || formData.email.split("@")[0],
      email: formData.email
    };
    const token = validity.token || "my_user_token";

    loginUser(userData, token, 1440);
    navigate("/");

  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Login</h2>

        <form onSubmit={handleSubmit} className="form-group">
          {/* <input className="form-control"
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <br></br> */}
          <input className="form-control"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <br></br>
          <input className="form-control"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <br></br>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <div className="register-container-link">
        <p>New user?</p>
        <Link to="/signup"> Create Account </Link>
      </div>
      </div>
      
    </div>
  );
}
export default LoginPage;