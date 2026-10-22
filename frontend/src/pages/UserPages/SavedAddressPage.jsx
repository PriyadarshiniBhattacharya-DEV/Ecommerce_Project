import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserAddresses, deleteUserAddress} from "../../Services/RealApi"; 
import { useAuth } from "../../Context/AuthContext";

function SavedAddressPage() {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressStr, setSelectedAddressStr] = useState(null);
    const { user } = useAuth();
    const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    const userId = user?.id || user?.userId || storedUser.id || storedUser.userId;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAddresses = async () => {
            if (!userId) return;
            try {
                const data = await getUserAddresses(userId); // Returns List<String>
                setAddresses(data || []);
            } catch (err) {
                console.error("Failed to fetch saved addresses:", err);
            }
        };
        fetchAddresses();
    }, [userId]);

    const handleSelectAddress = () => {
        if (selectedAddressStr) {
            // Pass the selected address string back to CheckoutPage
            navigate("/checkout", { 
                state: { selectedAddressString: selectedAddressStr } 
            });
        }
    };
    const handleDelete = async (index, e) => {
        e.stopPropagation(); // Prevent radio selection when clicking delete
        try {
            await deleteUserAddress(userId, index);
            
            // Remove locally from state array
            const updatedAddresses = addresses.filter((_, i) => i !== index);
            setAddresses(updatedAddresses);

            // If the deleted address was currently selected, clear selection
            if (selectedAddressStr === addresses[index]) {
                setSelectedAddressStr(null);
            }
        } catch (err) {
            console.error("Failed to delete address:", err);
            alert("Could not delete address. Please try again.");
        }
    };
    return (
        <div className="container mt-4">
            <h3>Select Saved Address</h3>
            {addresses.length === 0 ? (
                <p className="text-muted">No saved addresses found.</p>
            ) : (
                <div className="d-flex flex-column gap-3 my-3">
                    {addresses.map((addrStr, index) => (
                        <div key={index} className="border rounded p-3 position-relative shadow-sm">
                            <button 
                                type="button"
                                className="btn btn-link text-danger p-0 position-absolute top-0 end-0 mt-3 me-3"
                                onClick={(e) => handleDelete(index, e)}
                                title="Delete Address"
                                style={{ 
                                    border: "none", 
                                    background: "transparent",
                                    zIndex: 10
                                }}
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="savedAddressRadio"
                                    id={`address-${index}`}
                                    value={addrStr}
                                    checked={selectedAddressStr === addrStr}
                                    onChange={() => setSelectedAddressStr(addrStr)}
                                />
                                <label className="form-check-label w-100" htmlFor={`address-${index}`}>
                                    <p className="mb-0" style={{ whiteSpace: "pre-line" }}>{addrStr}</p>
                                </label>
                                
                            </div>
                            
                        </div>
                    ))}
                    <button 
                        className="btn btn-primary mt-2" 
                        disabled={!selectedAddressStr} 
                        onClick={handleSelectAddress}
                    >
                        Use this Address
                    </button>
                </div>
            )}
        </div>
    );
}

export default SavedAddressPage;