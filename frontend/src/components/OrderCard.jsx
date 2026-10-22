import { useNavigate } from "react-router-dom";
export default function OrderCard({ order }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/orders/${order.id}`);
  };

  return (
    <div
      className="card mb-3 shadow-sm"
      style={{ cursor: "pointer" }}
      onClick={handleClick}
    >
      <div className="card-body d-flex gap-3">
        <div><span className="text-muted small fw-semibold">
          #{order.id}
        </span></div>
       
        <div className="d-flex flex-wrap gap-3">
          {order.items.map((item) => (
            <div className="d-flex align-items-center gap-2" key={item.id}>
              <img
                src={
                  item.image
                    ? `data:image/jpeg;base64,${item.image}`
                    : item.image
                }
                alt={item.product.name}
                width="40"
                height="40"
                className="rounded object-fit-cover"
                title={item.product.name}
              />
              <span
                className="text-truncate small text-dark"
                title={item.product.name}
                style={{ maxWidth: "100px" }}
              >
                {item.product.name}
              </span>
            </div>
          ))}
        </div>
        <div className="d-flex flex-column align-items-end b-3 ms-auto">
          <span>
              {order.orderDate ? new Date(order.orderDate).toLocaleString() : "N/A"}
          </span>
        </div>
        
        
      </div>
    </div>
  );
}