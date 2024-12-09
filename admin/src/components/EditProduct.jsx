import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdSave, MdAdd, MdRemove } from "react-icons/md";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState({
    name: "",
    category: "women",
    new_price: "",
    old_price: "",
    variants: [],
    available: true,
    tags: "",
    shortDescription: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch product details
    const fetchProductDetails = async () => {
      const response = await fetch(`http://localhost:4000/product/${productId}`);
      const data = await response.json();
      setProductDetails({
        ...data,
        variants: data.variants || [],
        tags: data.tags || "",
      });
    };

    fetchProductDetails();
  }, [productId]);

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const variantChangeHandler = (index, field, value) => {
    const updatedVariants = [...productDetails.variants];
    updatedVariants[index][field] = value;
    setProductDetails({ ...productDetails, variants: updatedVariants });
  };

  const addVariant = () => {
    setProductDetails({
      ...productDetails,
      variants: [...productDetails.variants, { size: "", color: "", quantity: 0, image: null }],
    });
  };

  const removeVariant = (index) => {
    const updatedVariants = productDetails.variants.filter((_, i) => i !== index);
    setProductDetails({ ...productDetails, variants: updatedVariants });
  };

  const variantImageHandler = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedVariants = [...productDetails.variants];
      updatedVariants[index].image = file;
      setProductDetails({ ...productDetails, variants: updatedVariants });
    }
  };

  const saveProduct = async () => {
    const { name, category, new_price, old_price, variants, tags, available, shortDescription } = productDetails;

    // Check if all required fields are filled
    if (!name || !category || !new_price || !old_price || variants.length === 0 || !tags || !shortDescription) {
      setErrorMessage("All fields are required");
      return;
    }

    // Check if new_price and old_price are numbers
    if (isNaN(new_price) || isNaN(old_price)) {
      setErrorMessage("New price and old price must be numbers");
      return;
    }

    // Check if shortDescription is within the character limit
    if (shortDescription.length > 50) {
      setErrorMessage("Short description must be 50 characters or less");
      return;
    }

    let product = productDetails;

    // Upload images for each variant
    for (let i = 0; i < product.variants.length; i++) {
      const variant = product.variants[i];
      if (variant.image instanceof File) {
        let formData = new FormData();
        formData.append("product", variant.image);

        const response = await fetch("http://localhost:4000/upload", {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });
        const data = await response.json();
        if (data.success) {
          variant.image = data.image_url;
        } else {
          setErrorMessage("Failed to upload image for variant");
          return;
        }
      }
    }

    await fetch(`http://localhost:4000/editproduct/${productId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.success) {
          alert("Product updated successfully");
          navigate("/listproduct");
        } else {
          setErrorMessage(data.message);
        }
      });
  };

  return (
    <div className="p-8 box-border bg-white w-full rounded-sm mt-4 lg:m-7">
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Product title:</h4>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here.."
          className="bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md"
        />
      </div>
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Price:</h4>
        <input
          value={productDetails.old_price}
          onChange={changeHandler}
          type="text"
          name="old_price"
          placeholder="Type here.."
          className="bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md"
        />
      </div>
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Offer Price:</h4>
        <input
          value={productDetails.new_price}
          onChange={changeHandler}
          type="text"
          name="new_price"
          placeholder="Type here.."
          className="bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md"
        />
      </div>
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Short Description:</h4>
        <input
          value={productDetails.shortDescription}
          onChange={changeHandler}
          type="text"
          name="shortDescription"
          placeholder="Type here.."
          className="bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md"
        />
      </div>
      <div className="mb-3 flex items-center gap-x-4">
        <h4 className="bold-18 pb-2">Product Category:</h4>
        <select
          name="category"
          className="bg-primary ring-1 ring-slate-900/20 medium-16 rounded-sm outline-none"
          value={productDetails.category}
          onChange={changeHandler}
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Variants:</h4>
        {productDetails.variants.map((variant, index) => (
          <div key={index} className="mb-3 flex items-center gap-x-4">
            <select
              name="size"
              className="bg-primary ring-1 ring-slate-900/20 medium-16 rounded-sm outline-none"
              value={variant.size}
              onChange={(e) => variantChangeHandler(index, "size", e.target.value)}
            >
              <option value="">Select Size</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
              <option value="XXXL">XXXL</option>
            </select>
            <input
              value={variant.color}
              onChange={(e) => variantChangeHandler(index, "color", e.target.value)}
              type="text"
              name="color"
              placeholder="Color"
              className="bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md"
            />
            <input
              value={variant.quantity}
              onChange={(e) => variantChangeHandler(index, "quantity", e.target.value)}
              type="number"
              name="quantity"
              placeholder="Quantity"
              className="bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => variantImageHandler(e, index)}
              className="bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md"
            />
            {variant.image && (
              <img
                src={variant.image instanceof File ? URL.createObjectURL(variant.image) : variant.image}
                alt="Variant"
                className="w-20 rounded-sm"
              />
            )}
            <button onClick={() => removeVariant(index)} className="btn_dark_rounded flexCenter gap-x-1">
              <MdRemove />
            </button>
          </div>
        ))}
        <button onClick={addVariant} className="btn_dark_rounded flexCenter gap-x-1">
          <MdAdd /> Add Variant
        </button>
      </div>
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Tags:</h4>
        <select
          name="tags"
          className="bg-primary ring-1 ring-slate-900/20 medium-16 rounded-sm outline-none"
          value={productDetails.tags}
          onChange={changeHandler}
        >
          <option value="">Select Tag</option>
          <option value="Sport">Sport</option>
          <option value="Casual">Casual</option>
          <option value="Office">Office</option>
          <option value="Party">Party</option>
          <option value="OutDoor">OutDoor</option>
          <option value="Loungewear">Loungewear</option>
          <option value="Sleepwear">Sleepwear</option>
          <option value="Swimwear">Swimwear</option>
          <option value="Lingerie">Lingerie</option>
        </select>
      </div>
      {/* <div className="mb-3 flex items-center gap-x-4">
        <h4 className="bold-18 pb-2">Available:</h4>
        <select
          name="available"
          className="bg-primary ring-1 ring-slate-900/20 medium-16 rounded-sm outline-none"
          value={productDetails.available}
          onChange={(e) => setProductDetails({ ...productDetails, available: e.target.value === "true" })}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div> */}
      <button onClick={saveProduct} className="btn_dark_rounded mt-4 flexCenter gap-x-1">
        <MdSave /> Save Product
      </button>
      {errorMessage && <div className="text-red-500 font-bold mt-4">{errorMessage}</div>}
    </div>
  );
};

export default EditProduct;