import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import OnlineStoreNavigationBar from "./OnlineStoreNavigationBar";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import AfterServicesOnlineStore from "./AfterServicesOnlineStore";

export default function Product() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    function getProduct() {
      axios
        .get(`http://localhost:8070/products/getProduct/${id}`)
        .then((res) => {
          setName(res.data.name);
          setPrice(res.data.price);
          setDescription(res.data.description);
          setImageUrl(res.data.imageUrl);
          setCategory(res.data.category);
          setQuantity(res.data.quantity);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getProduct();
  }, [id]);

  const addToCart = () => {
    const product = {
      id,
      name,
      price: Number(price),
      image: `http://localhost:8070${imageUrl}`,
      quantity: 1,
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Item added to cart!");
  };

  return (
    <div className="min-h-screen w-full ">
      <NavigationBar />
      <OnlineStoreNavigationBar />
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Product Details Section */}
        <div className="bg-white overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="flex flex-col">
              <img
                src={`http://localhost:8070${imageUrl}`}
                alt={name}
                className="w-full max-h-120 object-cover rounded-lg"
              />
            </div>

            {/* Product Information */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {name}
                </h1>
                <p className="text-gray-600 text-lg mb-6">{description}</p>
              </div>

              {/* Delivery and Warranty Info */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <img
                    src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-delivery-truck-e-commerce-flaticons-flat-flat-icons.png"
                    alt="Delivery"
                    className="w-10 h-10 mr-3"
                  />
                  <span className="text-emerald-700 text-xl font-semibold">
                    Delivery - Standard 3 To 5 Working Days
                  </span>
                </div>
                <div className="flex items-center">
                  <img
                    src="https://img.icons8.com/office/40/approval.png"
                    alt="Warranty"
                    className="w-10 h-10 mr-3"
                  />
                  <span className="text-emerald-700 text-xl font-semibold">
                    1 Year(s) Manufacturer Warranty
                  </span>
                </div>
              </div>

              {/* Price and Add to Cart */}
              <div className="mt-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Price: LKR {Number(price).toFixed(2)}
                </h2>
                <div className="flex space-x-4">
                  <button
                    onClick={addToCart}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
                  >
                    Add to Cart
                  </button>
                  <Link to={"/cart"}>
                    <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300">
                      Go to Cart
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AfterServicesOnlineStore/>
      <Footer />
    </div>
  );
}
