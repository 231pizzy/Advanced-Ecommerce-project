import { SetStateAction, useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import { Store } from "../Store";
import { countries } from "../countries";
import { toast } from "react-toastify";

export default function ShippingAddressPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [userInfo, navigate]);

  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [phoneNumber, setPhoneNumber] = useState(
    shippingAddress.phoneNumber || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");
  const [price, setPrice] = useState(shippingAddress.price || 0);
  const [isChecked, setIsChecked] = useState(false);

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!isChecked) {
      toast.warn("Please select a shipping option.");
      return;
    }
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullName,
        address,
        city,
        phoneNumber,
        country,
        price,
      },
    });
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({
        fullName,
        address,
        city,
        phoneNumber,
        country,
        price,
      })
    );

    navigate("/payment");
  };

  const handleCheckboxChange = (amount: SetStateAction<number>) => {
    setPrice(amount);
    setIsChecked(true);
  };

  return (
    <div>
      <Helmet>
        <title>Shipping Details</title>
      </Helmet>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="container small-container">
        <h1 className="my-3">Shipping Details</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            >
              <option value="">Select a country</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="shippingCost">
            <Form.Label>Shipping Cost</Form.Label>
            <div>
              <Form.Check
                type="radio"
                name="shippingCost"
                label="Office pickup (₦0)"
                onChange={() => handleCheckboxChange(0)}
              />
              <Form.Check
                type="radio"
                name="shippingCost"
                label="Delivery - Lagos Island (₦2000)"
                onChange={() => handleCheckboxChange(2000)}
              />
              <Form.Check
                type="radio"
                name="shippingCost"
                label="Delivery - Lagos Mainland (₦3000)"
                onChange={() => handleCheckboxChange(3000)}
              />
              <Form.Check
                type="radio"
                name="shippingCost"
                label="Lagos Island Extremes (Epe, Lakowe, Ibeju Lekki, Others) (₦3000)"
                onChange={() => handleCheckboxChange(3000)}
              />
              <Form.Check
                type="radio"
                name="shippingCost"
                label="Delivery Outside Lagos (₦5000)"
                onChange={() => handleCheckboxChange(5000)}
              />
              <Form.Check
                type="radio"
                name="shippingCost"
                label="Delivery Outside Nigeria (₦12,085)"
                onChange={() => handleCheckboxChange(12085)}
              />
            </div>
          </Form.Group>
          <p>
            Selected shipping cost:
            <span className="bg-success text-white p-2"> ₦{price}</span>
          </p>

          <div className="mb-3">
            <Button
              variant="primary"
              type="submit"
              className="border-0 text-white"
            >
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
