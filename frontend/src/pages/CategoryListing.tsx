import { Col, Row } from "react-bootstrap";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import ProductItem from "../components/ProductItem";
import { Helmet } from "react-helmet-async";
import { useGetAllCategoriesQuery } from "../hooks/productHooks";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import { useParams } from "react-router-dom";
import { Product } from "../types/Product";

export default function CategoryListing() {
  const { category } = useParams();
  console.log(category);
  const {
    data: products,
    isLoading,
    error,
  } = useGetAllCategoriesQuery(category || "");
  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">
      {getError(error as unknown as ApiError)}
    </MessageBox>
  ) : (
    <Row xs={1} md={2} lg={2} className="g-4">
      <Helmet>
        <title>ShopEazy</title>
      </Helmet>
      {products!.map((product: Product) => (
        <Col key={product._id} xs={6} sm={6} md={4} lg={3}>
          <ProductItem product={product} />
        </Col>
      ))}
    </Row>
  );
}
