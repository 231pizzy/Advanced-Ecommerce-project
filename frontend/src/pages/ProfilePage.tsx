import { useContext, useState } from "react";
import { Button, Dropdown, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { useUpdateProfileMutation } from "../hooks/userHooks";
import { Store } from "../Store";
import { ApiError } from "../types/ApiError";
import { getError } from "../utils";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo!.name);
  const [email, setEmail] = useState(userInfo!.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [admin, setAdmin] = useState(userInfo!.isAdmin);
  console.log(setAdmin);
  const [showDropdown, setShowDropdown] = useState(false);

  const { mutateAsync: updateProfile } = useUpdateProfileMutation();

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      const data = await updateProfile({
        name,
        email,
        password,
      });
      dispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("User updated successfully");
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleAddListingClick = () => {
    // Navigate to the create listing page
    navigate("/create-listing");
  };

  const handleViewAllProducts = () => {
    // Navigate to the create listing page
    navigate("/all-products");
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      {admin ? (
        <div className="mt-3">
          <Dropdown
            show={showDropdown}
            onMouseEnter={toggleDropdown}
            onMouseLeave={toggleDropdown}
          >
            <Dropdown.Toggle
              variant="warning"
              id="dropdown-basic"
              className="border-0 text-white"
            >
              ADMIN FEATURES
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleAddListingClick}>
                Add Product
              </Dropdown.Item>
              <Dropdown.Item href="#">View All Users</Dropdown.Item>
              <Dropdown.Item href="#">View All Orders</Dropdown.Item>
              <Dropdown.Item onClick={handleViewAllProducts}>
                View All Products
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      ) : (
        ""
      )}
      <h1 className="my-3">User Profile</h1>

      <form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit" className="border-0 text-white">
            Update
          </Button>
        </div>
      </form>
    </div>
  );
}
