import React from "react";
import { useParams } from "react-router-dom";
import OnlineStoreNavigationBar from "./OnlineStoreNavigationBar";

const products = [
  {
    id: 1,
    name: "Product A",
    price: 29.99,
    image: "https://picsum.photos/150",
  },
  {
    id: 2,
    name: "Puritas Water Purifier Classic (HD-CLASSIC)",
    price: 8900.00,
    image: "https://picsum.photos/150",
  },
  {
    id: 3,
    name: "Product C",
    price: 49.99,
    image: "/assets/img1.jpg",
  },
];

export default function Product() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500 text-xl">Product not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col justify-center bg-white top-15 mt-60">
      <OnlineStoreNavigationBar/>
      <div className="container mx-auto p-4 bg-white rounded-lg mt-40">
        
        <div className="mb-6 top-20">
          <h2 className="text-3xl font-bold">{product.name}</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-4">Product Overview</h2>
              <p className="text-gray-600">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                It has been the industry's standard dummy text ever since the 1500s.
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                It has been the industry's standard dummy text ever since the 1500s.
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                It has been the industry's standard dummy text ever since the 1500s.
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                It has been the industry's standard dummy text ever since the 1500s.
              </p>
            </div>

            <div className="mt-10">
              <div className="flex align-middle text-center divide-y divide-gray-200">
                <div className="flex flex-col justify-center me-3">
                  <img width="40" height="40" src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-delivery-truck-e-commerce-flaticons-flat-flat-icons.png" alt="external-delivery-truck-e-commerce-flaticons-flat-flat-icons"/>
                </div>
                <div className="flex flex-col justify-center">
                  <h1 className="text-emerald-700 text-2xl font-bold">Delivery - Standard 3 To 5 Working Days</h1>
                </div>
              </div>

              <div className="flex align-middle text-center mt-5">
                <div className="flex flex-col justify-center me-3">
                  <img width="40" height="40" src="https://img.icons8.com/office/40/approval.png" alt="approval"/>
                </div>
                <div className="flex flex-col justify-center">
                  <h1 className="text-emerald-700 text-2xl font-bold">1 Years(s) Manufacturer Warranty.</h1>
                </div>
              </div>
            </div>

            <div className="mt-6 text-right">
              <h2 className="text-3xl font-bold">Price: LKR.{product.price.toFixed(2)}</h2>
              <button className="mt-4 px-6 py-3 bg-blue-950 text-white rounded-lg shadow-md hover:bg-blue-800 transition">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div> 

      <div className="container mx-auto p-4 bg-white rounded-lg mt-40">
        
        <table className="w-full border-collapse border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                <th className="p-3 text-left border-b border-gray-300">Specification</th>
                <th className="p-3 text-left border-b border-gray-300">Description</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              <tr className="hover:bg-gray-50">
                <td className="p-3 border-b border-gray-200">The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                <td className="p-3 border-b border-gray-200">Malcolm Lockyer</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 border-b border-gray-200">Witchy Woman</td>
                <td className="p-3 border-b border-gray-200 text-gray-400 italic">N/A</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 border-b border-gray-200">Shining Star</td>
                <td className="p-3 border-b border-gray-200">Earth, Wind, and Fire</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 border-b border-gray-200">Shining Star</td>
                <td className="p-3 border-b border-gray-200">Earth, Wind, and Fire</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 border-b border-gray-200">Shining Star</td>
                <td className="p-3 border-b border-gray-200">Earth, Wind, and Fire</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 border-b border-gray-200">Shining Star</td>
                <td className="p-3 border-b border-gray-200">Earth, Wind, and Fire</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 border-b border-gray-200">Shining Star</td>
                <td className="p-3 border-b border-gray-200">Earth, Wind, and Fire</td>
              </tr>
            </tbody>
          </table>
        
      </div> 

    </div>
  );
}