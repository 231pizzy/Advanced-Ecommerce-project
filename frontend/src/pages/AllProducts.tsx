import {
  Button,
  Col,
  Form,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import { Helmet } from "react-helmet-async";
// import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { ApiError } from "../types/ApiError";
import { getError } from "../utils";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../hooks/productHooks";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function AllProducts() {
  //   const navigate = useNavigate();
  const { data: products, isLoading, error } = useGetProductsQuery();

  const { mutateAsync: deleteProduct } = useDeleteProductMutation();

  const handleListingDelete = async (productId: string) => {
    try {
      const res = await deleteProduct(productId);
      console.log(res);
      toast.success("Product Deleted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(getError(error as ApiError));
    }
  };

  return (
    <div>
      <Helmet>
        <title>All products</title>
      </Helmet>
      <Row className="align-items-center">
        <Col>
          <h1>All Products</h1>
        </Col>
        <Col>
          <Form className="d-flex">
            <InputGroup>
              <FormControl
                type="text"
                name="q"
                id="q"
                placeholder="Search products"
                aria-label="Search shopEazy"
                className="border-2"
                aria-describedby="button-search"
                // onChange={(e) => setQuery(e.target.value)}
              />
              <Button
                variant="outline-primary"
                type="submit"
                id="button-search"
                className="border-0"
              >
                <i className="fas fa-search"></i>
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>
      {isLoading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">
          {getError(error as unknown as ApiError)}
        </MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>BRAND</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th>COUNT IN STOCK</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products!.map((product) => (
              <tr key={product.slug}>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.category}</td>
                <td>₦{product.price.toLocaleString("en-Us")}</td>
                <td>{product.countInStock}</td>
                <td>
                  <Link to={`/update/${product._id}`}>
                    <button className="text-green-700 uppercase">Edit</button>
                  </Link>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => handleListingDelete(product._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
