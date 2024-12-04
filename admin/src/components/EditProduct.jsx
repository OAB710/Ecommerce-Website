import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import upload_area from "../assets/upload_area.svg";
import { MdSave, MdAdd, MdRemove } from "react-icons/md";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
    variants: [],
    available: true,
    tags: [], // Initialize tags as an empty array
  });

  useEffect(() => {
    // Fetch product details
    const fetchProductDetails = async () => {
      const response = await fetch(`http://localhost:4000/product/${productId}`);
      const data = await response.json();
      setProductDetails(data);
    };

    fetchProductDetails();
  }, [productId]);

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

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
      variants: [...productDetails.variants, { size: "", color: "", quantity: 0 }],
    });
  };

  const removeVariant = (index) => {
    const updatedVariants = productDetails.variants.filter((_, i) => i !== index);
    setProductDetails({ ...productDetails, variants: updatedVariants });
  };

  const addTag = () => {
    setProductDetails({
      ...productDetails,
      tags: [...productDetails.tags, ""],
    });
  };

  const removeTag = (index) => {
    const updatedTags = productDetails.tags.filter((_, i) => i !== index);
    setProductDetails({ ...productDetails, tags: updatedTags });
  };

  const tagChangeHandler = (index, value) => {
    const updatedTags = [...productDetails.tags];
    updatedTags[index] = value;
    setProductDetails({ ...productDetails, tags: updatedTags });
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ";
  };

  const saveProduct = async () => {
    let responseData;
    let product = productDetails;

    if (image) {
      let formData = new FormData();
      formData.append("product", image);

      await fetch("http://localhost:4000/upload", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      })
        .then((resp) => resp.json())
        .then((data) => (responseData = data));

      if (responseData.success) {
        product.image = responseData.image_url;
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
          alert("Update failed");
        }
      });
  };

  return (
    <div className="p-8 box-border bg-white w-full rounded-sm mt-4 lg:m-7">
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
        {productDetails.tags.map((tag, index) => (
          <div key={index} className="mb-3 flex items-center gap-x-4">
            <input
              value={tag}
              onChange={(e) => tagChangeHandler(index, e.target.value)}
              type="text"
              name={`tag-${index}`}
              placeholder="Tag"
              className="bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md"
            />
            <button onClick={() => removeTag(index)} className="btn_dark_rounded flexCenter gap-x-1">
              <MdRemove />
            </button>
          </div>
        ))}
        <button onClick={addTag} className="btn_dark_rounded flexCenter gap-x-1">
          <MdAdd /> Add Tag
        </button>
      </div>
      <div className="mb-3 flex items-center gap-x-4">
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
      </div>
      <div className="mb-3 flex items-center gap-x-4">
        <img
          src={image ? URL.createObjectURL(image) : productDetails.image || upload_area}
          alt=""
          className="w-20 rounded-sm inline-block"
        />
        <button
          onClick={() => document.getElementById('file-input').click()}
          className="btn_dark_rounded flexCenter gap-x-1"
        >
          Change Image
        </button>
      </div>
      <input
        onChange={imageHandler}
        type="file"
        name="image"
        id="file-input"
        hidden
        className="bg-primary max-w-80 w-full py-3 px-4"
      />
      <button onClick={saveProduct} className="btn_dark_rounded mt-4 flexCenter gap-x-1">
        <MdSave /> Save Product
      </button>
    </div>
  );
};

export default EditProduct;