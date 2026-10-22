import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authorizeUser } from "../../Services/RealApi";
import { useAuth } from "../../Context/AuthContext"; // 1. Import useAuth

function Register() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth(); // 2. Consume auth state directly from context

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "" // 3. Added phone field to match input form
  });

  const validEmail = (email) => {
    return emailRegex.test(email);
  };

  const validPassword = (password) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_<>?,.'':{}|<>]/.test(password);
    return (password || "").length >= 8 && hasLetter && hasDigit && hasSpecial;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoggedIn) {
      alert("You are already registered and logged in.");
      return;
    }

    if (!validEmail(formData.email)) {
      alert("Please provide a valid email.");
      return;
    }

    if (!validPassword(formData.password)) {
      alert(
        "Password must contain at least 8 characters, at least one digit, and at least one special character."
      );
      return;
    }

    try {
      // Connects directly to Spring Boot UserController endpoint
      const response = await authorizeUser(formData, false);

      if (response.ok) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        const errorData = await response.json().catch(() => null);
        alert("Registration failed: " + (errorData?.message || response.statusText));
      }
    } catch (error) {
      alert("Could not connect to server. Ensure Spring Boot is running on port 8080.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Create Account</h2>

        <form className="form-group" onSubmit={handleSubmit}>
          <label className="col-sm-10 col-form-label">Enter Your Full Name:</label>
          <br />
          <input
            className="form-control"
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <br />
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
          <input
            className="form-control"
            type="tel"
            maxLength={10}
            name="phone"
            placeholder="10 digit mobile number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <br />
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>

        <div className="register-container-link">
          <p>Already have an account?</p>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;