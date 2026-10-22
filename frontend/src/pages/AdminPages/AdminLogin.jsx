import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkCredentialValidity } from "../../Services/Api";
import { useAuth } from "../../Context/AuthContext"; // Import useAuth

function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin, isAdminLoggedIn } = useAuth(); // Consume admin context actions

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isAdminLoggedIn) {
      alert("Admin is already logged in.");
      navigate("/admindash", { replace: true });
      return;
    }

    const validity = await checkCredentialValidity(formData.email, formData.password, true);
    if (!validity.ok) {
      alert(validity.message);
      return;
    }

    const adminData = validity.admin || { email: formData.email, role: "ADMIN" };
    const token = validity.token || "my_admin_token";

    // Store token, set state, and set expiry (100 minutes)
    loginAdmin(adminData, token, 100);
    navigate("/admindash", { replace: true });
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Admin Login</h2>

        <form onSubmit={handleSubmit} className="form-group">
          <input
            className="form-control"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <br />
          <input
            className="form-control"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <br />
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;