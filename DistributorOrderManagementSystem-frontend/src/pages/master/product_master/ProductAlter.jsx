import React, { useEffect, useRef, useState } from "react";
import { listOfProducts } from "../../../services/MasterService";
import { Link, useNavigate } from "react-router-dom";

const ProductAlter = () => {
  const [productCode, setProductCode] = useState("");
  const [product, setProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current.focus();

    listOfProducts()
      .then((response) => {
        setProduct(response.data);
        setFilteredProducts(response.data.slice(0, 20)); // Initially set filteredProducts to the first 15 products
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    filterProduct();
  }, [productCode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const totalItems =
        product.length > 20
          ? filteredProducts.length + 3
          : filteredProducts.length + 2; //+2 for create, back and +1 for dropdown if exists

      if (e.key === "ArrowDown") {
        setSelectedIndex((prevIndex) => (prevIndex + 1) % totalItems);
      } else if (e.key === "ArrowUp") {
        setSelectedIndex(
          (prevIndex) => (prevIndex - 1 + totalItems) % totalItems
        );
        e.preventDefault();
      } else if (e.key === "Enter") {
        if (selectedIndex === 0) {
          navigate("/create/product");
          e.preventDefault();
        } else if (selectedIndex === 1) {
          navigate("/alter");
        } else if (
          product.length > 20 &&
          selectedIndex === filteredProducts.length + 2
        ) {
          dropdownRef.current.focus();
        } else if (filteredProducts[selectedIndex - 2]) {
          navigate(
            `/alterProductMaster/${
              filteredProducts[selectedIndex - 2].productCode
            }`
          ); //Navigate to the selected product
        }
      } else if (e.key === 'Escape'){
        navigate("/alter");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [filteredProducts, selectedIndex, navigate, product.length]);

  const filterProduct = () => {
    let filtered = [];

    if (productCode === "") {
      filtered = product.slice(0, 20); //Reset to show 15 products
    } else {
      filtered = product.filter((prod) =>
        prod.productCode.toLowerCase().includes(productCode.toLowerCase())
      );
      filtered = filtered.slice(0, 20); //Limit to 15 products
    }

    setFilteredProducts(filtered);
    setSelectedIndex(2); //Reset selected index to the first element in the filtered list
  };

  const handleDropdownChange = (e) => {
    const selectedProductCode = e.target.value;
    navigate(`/alterProductMaster/${selectedProductCode}`);
  };

  return (
    <>
      <div className="flex justify-evenly" onClick={() => inputRef.current.focus()}>
        <div className="w-[90%] flex h-screen">
          <div className="w-1/2 bg-white"></div>

          <div className="w-1/2 bg-slate-100 flex justify-center items-center flex-col">
            <div className="w-[50%] h-16 flex flex-col justify-center items-center border border-black bg-white border-b-0 ">
              <p className="text-[13px] font-semibold underline underline-offset-4 decoration-gray-400">
                Product Alter
              </p>
              <input
                type="text"
                id="productCode"
                name="productCode"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                ref={inputRef}
                className="w-[250px] ml-2 mt-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200  focus:border focus:border-blue-500 focus:outline-none"
                autoComplete="off"
              />
            </div>

            <div className="w-[350px] h-[85vh] border border-gray-600 bg-[#def1fc]">
              <h2 className="p-1 bg-[#2a67b1] text-white text-left text-[13px]">
                List of Product
              </h2>
              <table>
                <thead>
                  <tr>
                    <th></th>
                  </tr>
                </thead>
                <div className="border border-b-gray-500 w-[347px]">
                  <Link
                    className={`block text-center text-[13px] ${
                      selectedIndex === 0 ? "bg-[#FEB941]" : ""
                    }`}
                    to={"/create/product"}
                  >
                    <p className="ml-[285px] text-[14px]">Create</p>
                  </Link>
                  <Link
                    className={`block text-center text-[13px] ${
                      selectedIndex === 1 ? "bg-[#FEB941]" : ""
                    }`}
                    to={"/alter"}
                  >
                    <p className="ml-[287px] text-[14px] ">Back</p>
                  </Link>
                </div>
                <tbody>
                  {filteredProducts.map((prod, index) => (
                    <tr
                      key={prod.productCode}
                      className={
                        selectedIndex === index + 2 ? "bg-[#FEB941]" : ""
                      }
                    >
                      <td className="flex text-left text-[13px] pl-2 capitalize">
                        <Link
                          to={`/alterProductMaster/${prod.productCode}`}
                          className="block"
                        >
                          {prod.productCode} - {prod.description}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {product.length > 20 && (
                <div className="mt-2">
                  <label
                    htmlFor="productDropdown"
                    className="block text-center text-[14px] mb-1"
                  ></label>
                  <select
                    name="productDropdown"
                    id="productDropdown"
                    ref={dropdownRef}
                    className={`w-full text-[13px] border border-gray-600 bg-[#BBE9FF] p-1 focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none ${
                      selectedIndex === filteredProducts.length + 2
                    }`}
                    onChange={handleDropdownChange}
                  >
                    <option
                      value=""
                      className="block text-left pl-2 text-[13px]"
                    >
                      Select other Products
                    </option>
                    {product.slice(20).map((prod) => (
                      <option
                        key={prod.productCode}
                        value={prod.productCode}
                        className="block text-left pl-2 text-[13px]"
                      >
                        {prod.productCode} - {prod.description}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductAlter;
