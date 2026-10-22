import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, submitReturnRequest } from "../../Services/Api";

const RETURN_REASONS = [
  "Item damaged or defective",
  "Wrong item delivered",
  "Item not as described",
  "Size/fit issue",
  "Changed my mind",
  "Better price found elsewhere",
  "Other",
];

function ReturnRequestPage() {
  const { orderId, itemId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrderById(orderId).then((data) => {
      setOrder(data);
      const foundItem = data?.items.find((i) => String(i.id) === String(itemId));
      setItem(foundItem || null);
      setLoading(false);
    });
  }, [orderId, itemId]);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4); // cap at 4 photos
    setPhotos(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!reason) {
      setError("Please select a reason for the return.");
      return;
    }

    setSubmitting(true);
    try {
      await submitReturnRequest(itemId, {
        reason,
        comments,
        photos, // File objects — MockApi ignores these, RealApi would upload as FormData
      });
      navigate(`/orders/${orderId}`);
    } catch (err) {
      setError("Something went wrong submitting your return. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-4 text-center">
        <div className="spinner-border text-secondary" role="status" />
      </div>
    );
  }

  if (!order || !item) {
    return (
      <div className="container py-4">
        <p className="text-danger">Item not found for this order.</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Return Item</h5>
        </div>

        <div className="card-body">
          <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
            <img
              src={
                  item.image
                    ? `data:image/jpeg;base64,${item.image}`
                    : item.image
                }
              alt={item.name}
              width="60"
              height="60"
              className="rounded object-fit-cover"
            />
            <div>
              <p className="mb-0 fw-semibold">{item.name}</p>
              <p className="mb-0 text-muted small">Order #{order.id}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Reason list */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Reason for return</label>
              {RETURN_REASONS.map((r) => (
                <div className="form-check" key={r}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="returnReason"
                    id={r}
                    value={r}
                    checked={reason === r}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor={r}>
                    {r}
                  </label>
                </div>
              ))}
            </div>

            {/* Comments */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Additional details <span className="text-muted fw-normal">(optional)</span>
              </label>
              <textarea
                className="form-control"
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Tell us more about the issue..."
              />
            </div>

            {/* Photo uploader */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Upload photos <span className="text-muted fw-normal">(optional, up to 4)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="form-control"
                onChange={handlePhotoChange}
              />

              {previews.length > 0 && (
                <div className="d-flex gap-2 mt-3 flex-wrap">
                  {previews.map((src, index) => (
                    <div key={index} className="position-relative">
                      <img
                        src={src}
                        alt={`upload-${index}`}
                        width="80"
                        height="80"
                        className="rounded object-fit-cover border"
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 p-0 px-1"
                        style={{ transform: "translate(30%, -30%)", borderRadius: "50%" }}
                        onClick={() => removePhoto(index)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <button type="submit" className="btn btn-danger" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Return Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default ReturnRequestPage;