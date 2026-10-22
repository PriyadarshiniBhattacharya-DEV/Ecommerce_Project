import { useNavigate, useLocation } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on the home page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <button
      className="btn btn-outline-secondary mb-3"
      onClick={() => navigate(-1)}
    >
      <i className="bi bi-arrow-left"></i>
    </button>
  );
}

export default BackButton;