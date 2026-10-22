import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, isAdminLoggedIn, setIsAdminLoggedIn}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("currentUser");
    navigate("/login");
    window.location.reload();
  };
  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminTokenExpiry"); // also clear this if you added expiry tracking
    setIsAdminLoggedIn(false);
    navigate("/adminlogin", { replace: true });   // ← manual logout goes here now
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container">
        <div
          style={{ width: "60px" }}
          className="d-flex justify-content-center">
          {(location.pathname !== "/") && (location.pathname !== "/admindash") && (
            <button
              className="btn text-white p-0"
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left fs-6"></i>
            </button>
          )}
        </div>
        {/* Logo */}
        <Link className="navbar-brand fw-bold ms-3 mb-0" to="/">
          🍰 CakeShop
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="offcanvas offcanvas-start text-bg-dark" tabIndex="-1" id="navbarNav" aria-labelledby="navbarNavLabel">
          <div className="offcanvas-header border-bottom border-secondary">
            <h5 className="offcanvas-title" id="navbarNavLabel">
              🍰 CakeShop Menu
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          {/* Left Side */}
          <div className="offcanvas-body">
            <ul className="navbar-nav me-auto">
              {!isAdminLoggedIn?(
                <>
              <li className="nav-item">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    Dashboard
                </NavLink>              
              </li>

              <li className="nav-item">
                <NavLink
                    to="/wishlist"
                    end
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    ❤️ Wishlist
                </NavLink>              
              </li>

              <li className="nav-item">
                <NavLink
                    to="/cart"
                    end
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    🛒 Cart
                </NavLink>              

              </li>
              <li className="nav-item mb-3">
                <NavLink
                    to="/orders"
                    end
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    Orders
                </NavLink>              

              </li>
              </>
              ): 
              (<>
                <li className="nav-item">
                  <NavLink
                      to="/admindash"
                      end
                      className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                      Dashboard
                  </NavLink>              
                </li>
              </>)}
            </ul>

            {/* Right Side */}
            <ul className="navbar-nav ms-auto">

              {!isLoggedIn && !isAdminLoggedIn ? 
                (
                    <>
                      <li className="nav-item">
                        <Link className="btn btn-outline-light me-2 mb-2 mb-lg-0" to="/adminlogin">
                          Admin Login
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="btn btn-outline-light me-2 mb-2 mb-lg-0" to="/login">
                          Login
                        </Link>
                      </li>

                      <li className="nav-item">
                        <Link className="btn btn-warning me-2" to="/signup">
                          Register
                        </Link>
                      </li>
                    </>
                ) : 
                (
                  <>
                    {isAdminLoggedIn? (<><li className="nav-item">
                      <button
                        className="btn btn-danger"
                        onClick={handleAdminLogout}>
                        Logout
                      </button>
                    </li></>) : (<><li className="nav-item">
                      <button
                        className="btn btn-danger"
                        onClick={handleLogout}>
                        Logout
                      </button>
                    </li></>)}
                  </>
                )
              }

            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;