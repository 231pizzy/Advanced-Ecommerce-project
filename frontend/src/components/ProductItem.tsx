import { Button, Card } from "react-bootstrap";
import { Product } from "../types/Product";
import { Link } from "react-router-dom";
// import Rating from "./Rating";
import { useContext } from "react";
import { Store } from "../Store";
import { CartItem } from "../types/Cart";
import { convertProductToCartItem } from "../utils";
import { toast } from "react-toastify";
import { LinkContainer } from "react-router-bootstrap";

function ProductItem({ product }: { product: Product }) {
  const { state, dispatch } = useContext(Store);

  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = (item: CartItem) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.countInStock < quantity) {
      toast.warn("Sorry. Product is out of stock");
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
    toast.success("Product added to the cart");
  };

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img
          src={product.image[0]}
          className="card-img-top"
          alt={product.name}
        />
      </Link>
      <Card.Body>
        <LinkContainer to={`/product/${product.slug}`}>
          <Card.Title className="custom-card-title">{product.name}</Card.Title>
        </LinkContainer>

        {/* <Rating rating={product.rating} numReviews={product.numReviews} /> */}
        <Card.Text>₦{product.price.toLocaleString("en-Us")}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Sold Out
          </Button>
        ) : (
          <Button
            onClick={() => addToCartHandler(convertProductToCartItem(product))}
            className="w-100 text-white border-0"
          >
            Add to cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default ProductItem;
