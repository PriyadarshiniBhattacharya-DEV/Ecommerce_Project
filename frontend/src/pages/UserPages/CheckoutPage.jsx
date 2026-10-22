import { useEffect, useState } from "react";
import { getCartTotal } from "../../Services/Api";
import { createOrder, getCartProducts, saveUserAddress } from "../../Services/RealApi";
import { useAuth } from "../../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

function CheckoutPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [error, setError] = useState("");

    const [cart, setCart] = useState(location.state?.cart || []);
    const [cartTotal, setCartTotalValue] = useState(location.state?.total ?? 0);
    
    const [communicationformData, setcommunicationformData] = useState({
        tag: "",
        recievername: "",
        recieverphone: "",
        housename: "",
        areaname: "",
        city: "",
        pincode: "",
        state: "",
    });
    
    const [shippingAddress, setShippingAddress] = useState("");
    const [locationSearchStatus, setlocationSearchStatus] = useState(true);
    const [showDeliveryAddress, setshowDeliveryAddress] = useState(false);
    
    const requiredFields = ["recievername", "recieverphone", "housename", "areaname", "city", "state", "pincode"];
    const { user } = useAuth();
    const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    const userId = user?.id || user?.userId || storedUser.id || storedUser.userId;

    const passedTotal = location.state?.total;

    // Handle if a pre-selected address string was passed back from SavedAddressPage
    useEffect(() => {
        if (location.state?.selectedAddressString) {
            setShippingAddress(location.state.selectedAddressString);
            setshowDeliveryAddress(true);
            try {
                const addrStr = location.state.selectedAddressString;
                const phoneMatch = addrStr.match(/[6-9]\d{9}/);
                const pinMatch = addrStr.match(/\b\d{6}\b/);
                const tagMatch = addrStr.match(/\[(.*?)\]/);

                const pincode = pinMatch ? pinMatch[0] : "";
                const recieverphone = phoneMatch ? phoneMatch[0] : "";
                const tag = tagMatch ? tagMatch[1] : "";

                // 2. Clean up lines/parts for sequential fields
                //const cleaned = addrStr.replace(/,\n/g, ",").replace(/\n/g, ",");
                let parts = addrStr.split("\n").map(p => p.trim()).filter(Boolean);

                // Filter out tag, phone, and pincode from parts list to isolate text fields
                parts = parts.filter(p => 
                    !p.startsWith("[") && 
                    !p.includes(recieverphone)
                );

                // 3. Assign remaining parts logically
                // parts[0] is usually Name, parts[1] is House/Apartment, parts[2] is Area/Village, etc.
                const recievername = parts[0].replace(/,\s*$/, "") || "";

                const localityParts = parts[1].split(",").map(p => p.trim()).filter(Boolean);

                const midPoint = Math.ceil(localityParts.length / 2);
                const housename = localityParts.slice(0, midPoint).join(", ");
                const areaname = localityParts.slice(midPoint,localityParts.length).join(", ");

                let locationParts = null;
                let state = "";
                let city = "";
                if(parts[2].includes(pincode)){
                    locationParts = parts[2].split(",").map(p => p.trim()).filter(Boolean);
                    city = locationParts[0];
                    state = locationParts[1] || "";
                    state = state.replace(pincode, "").replace("-", "").trim();
                }

                setcommunicationformData({
                    tag: tag === "other" || !tag ? "" : tag,
                    recievername,
                    recieverphone,
                    housename,
                    areaname,
                    city,
                    state,
                    pincode
                });
            } catch (parseErr) {
                console.error("Could not parse selected address:", parseErr);
            }
        }
    }, [location.state]);

    const handleChange = (e) => {
        setcommunicationformData({
            ...communicationformData,
            [e.target.name]: e.target.value
        });
    };

    const handlePincodeChange = async (e) => {
        const pincode = e.target.value.replace(/\D/g, "");
        setcommunicationformData(prev => ({ ...prev, pincode }));
        
        if (pincode.length === 6) {
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                const data = await response.json();
                
                if (data[0].Status === "Success" && data[0].PostOffice?.length) {
                    setcommunicationformData(prev => ({
                        ...prev,
                        pincode,
                        city: data[0].PostOffice[0].District,
                        state: data[0].PostOffice[0].State,
                    }));
                    setlocationSearchStatus(true);
                } else {
                    setlocationSearchStatus(false);
                }
            } catch (err) {
                console.error("Pincode lookup failed", err);
            }
        }
    };

    const isValidPhone = (phone) => {
        return phone.length === 10 && /^[6-9]\d{9}$/.test(phone);
    };

    const isFormValid = requiredFields.every(field => communicationformData[field]?.trim() !== "") && isValidPhone(communicationformData.recieverphone);

    useEffect(() => {
        let cancelled = false;
        const validateCart = async () => {
            if (!userId) {
                navigate("/login", { replace: true });
                return;
            }
            try {
                const data = await getCartProducts(userId);
                if (cancelled) return;
                if (!Array.isArray(data) || data.length === 0) {
                    navigate("/cart", { replace: true });
                    return;
                }
                setCart(data);
                if (location.state?.total != null) {
                    setCartTotalValue(Number(location.state.total));
                } else {
                    const totalData = await getCartTotal(userId);
                    if (!cancelled) setCartTotalValue(Number(totalData) || 0);
                }
            } catch (error) {
                console.error("Failed to validate checkout cart:", error);
                if (!cancelled) navigate("/cart", { replace: true });
            }
        };
        validateCart();
        return () => { cancelled = true; };
    }, [userId, navigate, location.state]);

    // Build address string and save to the backend list
    const handleUseThisAddress = async () => {
        try {
            const addressTag = communicationformData.tag ? `[${communicationformData.tag}]` : "other";
            const phnoLine = `+91-${communicationformData.recieverphone}`;
            const addressLine = `${communicationformData.housename}, ${communicationformData.areaname}`;
            const locationLine = `${communicationformData.city}, ${communicationformData.state} - ${communicationformData.pincode}`;
            
            const constructedAddress = [communicationformData.recievername, phnoLine, addressLine, locationLine]
                .filter(Boolean)
                .join(",\n");

            const finalConstructedAddress = [addressTag, constructedAddress]
                .filter(Boolean)
                .join("\n");

            // Save to backend database (adds to List<String>)
            await saveUserAddress(userId, finalConstructedAddress);
            
            setShippingAddress(finalConstructedAddress);
            setshowDeliveryAddress(true);
            setError("");
        } catch (err) {
            console.error("Failed to save address:", err);
            setError("Could not save address. Please try again.");
        }
    };

    const handleOrder = async (userId, finalShippingAddress) => {
        try {
            setError("");
            await createOrder(userId, finalShippingAddress);
            setOrderPlaced(true);
            setTimeout(() => {
                navigate("/");
            }, 3000);
        } catch (error) {
            console.error("Error placing order:", error);
            setError("Failed to place order. Please try again.");
        }
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-center align-items-start">
                <h2 className="mt-3">Yay! Let's Order Your Favs!</h2>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {orderPlaced && <div className="alert alert-success">Order placed successfully! Redirecting...</div>}
            
            <div><h3 className="text-start mt-3">Order Summary</h3></div>
            <div className="card mb-3 shadow-sm">
                <div className="card-body d-flex justify-content-between align-items-center">
                    <div className="d-flex flex-wrap gap-3">
                    {cart.map(item => (
                        <div className="d-flex align-items-center gap-2" key={item.id}>
                        <img
                            src={item.image ? `data:image/jpeg;base64,${item.image}` : item.image}
                            alt={item.name}
                            width="40"
                            height="40"
                            className="rounded object-fit-cover"
                        />
                        <span className="text-truncate small text-dark" style={{ minWidth: "0px" }}>
                            {item.quantity} x {item.name}
                        </span>
                        </div>
                    ))}
                    </div>
                    <span className="text-muted small fw-semibold">
                        Total: ₹{Number(passedTotal || cartTotal).toFixed(2)}
                    </span>
                </div>
            </div>

            <div>
                <h3>Deliver to :</h3>
                <div className="border rounded p-4 shadow-sm">
                    {showDeliveryAddress ? (
                        <div>
                            <div>
                                <div className="text-start" style={{ whiteSpace: "pre-line" }}>{shippingAddress}</div>
                                <button className="btn btn-outline-primary btn-sm d-flex ms-auto mt-2" onClick={() => setshowDeliveryAddress(false)}>Edit / Change Address</button>
                            </div>
                            <button className="btn btn-success w-100 mt-3" onClick={() => handleOrder(userId, shippingAddress)}>Place Order</button>
                        </div>
                    ) : (
                        <div>
                            <form className="form-group" onSubmit={(e) => e.preventDefault()}>
                                <label>Receiver's Name *:</label>
                                <input className="form-control" type="text" name="recievername" value={communicationformData.recievername} placeholder="receiver's name" onChange={handleChange} />
                                <br />
                                <label>Phone *:</label>
                                <input className="form-control" type="text" maxLength="10" name="recieverphone" value={communicationformData.recieverphone} placeholder="10 digit phone no" onChange={handleChange} />
                                <br />
                                <label>House / Apartment *:</label>
                                <input className="form-control" type="text" name="housename" value={communicationformData.housename} placeholder="house / apartment" onChange={handleChange} />
                                <br />
                                <label>Street / Block / Village *:</label>
                                <input className="form-control" type="text" name="areaname" value={communicationformData.areaname} placeholder="street / block / village" onChange={handleChange} />
                                <br />
                                <div className="d-flex gap-3">
                                    <div className="flex-grow-1">
                                        <label>Pincode *</label>
                                        <input className="form-control" type="text" maxLength="6" value={communicationformData.pincode} placeholder="pincode" onChange={handlePincodeChange} />
                                    </div>
                                    <div className="flex-grow-1">
                                        <label>City *</label>
                                        <input className="form-control" type="text" value={communicationformData.city} placeholder="city" onChange={handleChange} disabled={locationSearchStatus} />
                                    </div>
                                    <div className="flex-grow-1">
                                        <label>State *</label>
                                        <input className="form-control" type="text" value={communicationformData.state} placeholder="state" onChange={handleChange} disabled={locationSearchStatus} />
                                    </div>
                                </div>
                                <br />
                                <div className="d-flex gap-3 align-items-center">
                                    <label className="text-nowrap">Save Address as :</label>
                                    <input className="form-control w-50" type="text" name="tag" value={communicationformData.tag} placeholder="home" onChange={handleChange} />
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-outline-secondary rounded-pill px-3" type="button" name="tag" value={"home"} onClick={handleChange}>home</button>
                                        <button className="btn btn-outline-secondary rounded-pill px-3" type="button" name="tag" value={"office"} onClick={handleChange}>office</button>
                                        <button className="btn btn-outline-secondary rounded-pill px-3" type="button" name="tag" value={"others"} onClick={handleChange}>others</button>
                                    </div>
                                </div>
                                <br />
                            </form>
                            <div className="d-flex flex-column gap-3">
                                <button type="button" className="btn btn-primary w-100" onClick={handleUseThisAddress} disabled={!isFormValid}>Use this Address</button>
                                <button type="button" className="btn btn-outline-secondary w-100" onClick={() => navigate("/saved-addresses")}>Select from Addressbook</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;