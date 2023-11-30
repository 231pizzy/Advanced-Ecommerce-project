import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from "../hooks/productHooks";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateProduct() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [, setError] = useState<string | boolean>(false);
  const [imageUploadError, setImageUploadError] = useState<string | boolean>(
    false
  );
  interface InitialFormData {
    rating: number;
    image: string[];
    name: string;
    description: string;
    slug: string;
    brand: string;
    category: string;
    price: number;
    countInStock: number;
    numReviews: number;
  }

  const initialFormData: InitialFormData = {
    image: [],
    name: "",
    description: "",
    slug: "",
    brand: "",
    category: "",
    price: 0,
    countInStock: 0,
    numReviews: 0,
    rating: 0,
  };

  const [formData, setFormData] = useState<InitialFormData>(initialFormData);
  const { productId } = useParams();
  console.log(productId);

  const {
    data: productData,
    isLoading,
    isError,
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = productId
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useGetSingleProductQuery(productId)
    : { data: null, isLoading: false, isError: null };

  console.log(productData);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!isLoading && !isError && productData) {
          const updatedFormData: InitialFormData = {
            image: productData.image,
            name: productData.name,
            description: productData.description,
            slug: productData.slug,
            brand: productData.brand,
            category: productData.category,
            price: productData.price,
            countInStock: productData.countInStock,
            numReviews: productData.numReviews,
            rating: 0,
          };
          setFormData(updatedFormData); // Set updated product data
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [isLoading, isError, productData]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (filesList) {
      const imageFiles = Array.from(filesList) as File[]; // Type assertion to File[]
      setFiles(imageFiles);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.image.length < 6) {
      setUploading(true);
      setImageUploadError(false);
      const promises: Promise<string>[] = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            image: formData.image.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          console.log(error);
          setImageUploadError("Image upload failed (3 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 5 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch((error) => {
              reject(error);
            });
        }
      );
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      image: formData.image.filter((_, i) => i !== index),
    });
  };

  const { mutateAsync: updateProduct } = useUpdateProductMutation();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      if (formData.image.length < 1)
        return setError("You must upload at least one image");
      setLoading(true);
      setError(false);
      let updatedProductData: {
        name: string;
        slug: string;
        image: string[];
        category: string;
        brand: string;
        price: number;
        countInStock: number;
        description: string;
        productId: string;
        rating: number;
        numReviews: number;
      };

      if (productId) {
        // If productId is defined, create updatedProductData
        updatedProductData = {
          name: formData.name,
          slug: formData.slug,
          image: formData.image,
          category: formData.category,
          brand: formData.brand,
          price: formData.price,
          countInStock: formData.countInStock,
          description: formData.description,
          productId, // Ensure productId is defined
          rating: formData.rating ?? 0,
          numReviews: formData.numReviews ?? 0,
        };

        const res = await updateProduct(updatedProductData);
        console.log(res);
        toast.success("Product updated successfully!");
        setLoading(false);
        navigate(`/`);
      } else {
        // Handle the case where productId is undefined
        console.error("Product ID is undefined");
        // Add appropriate handling or error message for when productId is not available
      }
    } catch (err) {
      toast.error(getError(err as ApiError));
      setLoading(false);
    }
  };
  return (
    <Container className="small-container">
      <Helmet>
        <title>Update Product</title>
      </Helmet>
      <h1 className="my-3">Update Product</h1>
      <div className="images-info">
        <p>
          Images:
          <span>Maximum of 5 images</span>
        </p>
      </div>
      <div className="images-info">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <Button
          type="button"
          disabled={uploading}
          onClick={handleImageSubmit}
          className="border-0 text-white"
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
      <p className="text-danger">{imageUploadError && imageUploadError}</p>

      {formData.image.length > 0 &&
        formData.image.map((url, index) => (
          <div key={index} className="p-3 border d-flex align-items-center">
            <img
              src={url}
              alt="listing image"
              className="img-fluid rounded-lg mr-2 mb-2"
              style={{
                maxWidth: "10rem",
                maxHeight: "10rem",
                objectFit: "cover",
              }}
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="delete-button"
            >
              Delete
            </button>
          </div>
        ))}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea" // Use textarea
            value={formData.description}
            onChange={handleInputChange}
            rows={3} // Set number of rows for the textarea
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="slug">
          <Form.Label>Slogan</Form.Label>
          <Form.Control
            type="text"
            value={formData.slug}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="brand">
          <Form.Label>Brand</Form.Label>
          <Form.Control
            type="text"
            value={formData.brand}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            value={formData.category}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            min={1}
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="countInStock">
          <Form.Label>Count In Stock</Form.Label>
          <Form.Control
            type="number"
            min={1}
            value={formData.countInStock}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <div className="mb-3">
          <Button
            type="submit"
            className="border-0 text-white"
            disabled={loading || uploading}
          >
            {loading ? "Updating..." : "Update Product"}
          </Button>
        </div>
      </Form>
    </Container>
  );
}

// const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (formData.imageUrls.length < 1)
//         return setError("You must upload at least one image");
//       setLoading(true);
//       setError(false);
//       const res = await fetch("/api/listings/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...formData,
//         }),
//       });
//       const data = await res.json();
//       setLoading(false);
//       if (data.success === false) {
//         setError(data.message);
//       }
//       //   navigate(`/listing/${data._id}`);
//     } catch (error) {
//       setError(error.message);
//       setLoading(false);
//     }
//   };
