import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useParams, useNavigate } from "react-router-dom";

const DisplayProductMaster = () => {
  const { productCode } = useParams();

  const navigate = useNavigate();

  const [product, setProduct] = useState({
    productCode: "",
    description: "",
    stockCategory: "",
    uom: "",
    stockGroup: "",
    standardCost: "",
    sellingPrice: "",
    discount: "",
  });

  const inputRefs = useRef({
    productCode: null,
    description: null,
    uom: null,
    stockCategory: null,
    stockGroup: null,
    standardCost: null,
    sellingPrice: null,
    discount: null,
    backButton: null,
  });

  const backButtonRef = useRef(null);
  const yesQuitButtonRef = useRef(null);
  const cancelModalConfirmRef = useRef(null);

  const [showModal, setShowModal] = useState(false);

  const pulseCursor = (input) => {
    const value = input.value;
    if (value) {
      input.value = "";
      setTimeout(() => {
        input.value = value.charAt(0).toUpperCase() + value.slice(1);
        input.setSelectionRange(0, 0);
      }, 0);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    setProduct({ ...product, [name]: capitalizedValue });
  };

  useEffect(() => {
    if (inputRefs.current.productCode) {
      inputRefs.current.productCode.focus();
      pulseCursor(inputRefs.current.productCode);
    }

    loadProduct();

    const handleKeyDown = (event) => {
      const { ctrlKey, key } = event;
      if ((ctrlKey && key === "q") || key === "Escape") {
        event.preventDefault();
        setShowModal(true);
      }
    };

    const handleCtrlA = (event) => {
      if (event.ctrlKey && event.key === "a") {
        event.preventDefault();
        backButtonRef.current.click();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleCtrlA);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleCtrlA);
    };
  }, []);

  useEffect(() => {
    if (showModal) {
      yesQuitButtonRef.current.focus();
      const handleModalKeyDown = (event) => {
        if (event.key.toLowerCase() === "y") {
          handleModalConfirm();
        } else if (event.key === "n") {
          handleModalClose();
        } else if (event.key === "ArrowLeft") {
          cancelModalConfirmRef.current.focus();
        } else if (event.key === "ArrowRight") {
          yesQuitButtonRef.current.focus();
        }
      };

      document.addEventListener("keydown", handleModalKeyDown);

      return () => {
        document.removeEventListener("keydown", handleModalKeyDown);
      };
    }
  }, [showModal]);

  const handleKeyDown = (event) => {
    const { keyCode, target } = event;
    const currentInputIndex = Object.keys(inputRefs.current).findIndex(
      (key) => key === target.id
    );

    if (keyCode === 13) {
      event.preventDefault();

      if (currentInputIndex === Object.keys(inputRefs.current).length - 2) {
        backButtonRef.current.focus();
      } else {
        const nextInputRef = Object.values(inputRefs.current)[
          currentInputIndex + 1
        ];
        nextInputRef.focus();
        pulseCursor(nextInputRef);
      }
    } else if (keyCode === 27) {
      setShowModal(true);
    } else if (keyCode === 8 && target.id !== "productCode") {
      event.preventDefault();

      const isEmptyOrZero = target.value.trim() === "" || target.value === "0";

      if (isEmptyOrZero) {
        event.preventDefault();
        const prevInputIndex =
          (currentInputIndex - 1 + Object.keys(inputRefs.current).length) %
          Object.keys(inputRefs.current).length;
        const prevInputRef = Object.values(inputRefs.current)[prevInputIndex];
        prevInputRef.focus();
      } else if (target.selectionStart === 0 && target.selectionEnd === 0) {
        event.preventDefault();
        const prevInputIndex =
          (currentInputIndex - 1 + Object.keys(inputRefs.current).length) %
          Object.keys(inputRefs.current).length;
        const prevInputRef = Object.values(inputRefs.current)[prevInputIndex];
        prevInputRef.focus();
        pulseCursor(prevInputRef);
      }
    }
  };

  const loadProduct = async () => {
    try {
      const result = await axios.get(
        `http://localhost:9080/products/displayProduct/${productCode}`
      );
      setProduct(result.data);
    } catch (error) {
      console.error("Error fetching the product data", error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);

    if (inputRefs.current.productCode) {
      inputRefs.current.productCode.focus();
      pulseCursor(inputRefs.current.productCode);
    }
  };

  const handleModalConfirm = () => {
    navigate("/display/productFilter");
  };

  const handleNavigation = () => {
    navigate("/display/productFilter");
  }

  return (
    <div>
      <div className="flex">
        <div className="w-1/2 h-[100vh] border border-bg-gray-500"></div>

        <div className="w-1/2 border border-bg-gray-500">
          <div className="w-[550px] h-[30px] flex justify-between text-[20px] bg-[#F1E5D1] ml-[80px] mt-10 border border-gray-500 border-b-0">
            <h2 className="ml-[200px]">Product Master</h2>
            <span className="cursor-pointer mt-[5px] mr-2">
              <Link to={'/display/productFilter'}>
                <IoClose /> 
              </Link>
            </span>
          </div>

          <div className="w-[550px] h-[34vh] border border-gray-500 ml-[80px]">
            <form>
              <div className="input-ldgr mt-3">
                <label htmlFor="productCode" className="text-sm ml-2 mr-[59px]">
                  Product Code
                </label>
                :{" "}
                <input
                  type="text"
                  id="productCode"
                  name="productCode"
                  value={product.productCode}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  ref={(input) => {
                    inputRefs.current.productCode = input;
                  }}
                  className="w-[300px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                  autoComplete="off"
                />
              </div>

              <div className="input-ldgr mt-1">
                <label
                  htmlFor="description"
                  className="text-sm mr-[22px] ml-2"
                >
                  Product Description
                </label>
                :{" "}
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  ref={(input) =>
                    (inputRefs.current.description = input)
                  }
                  className="w-[300px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                  autoComplete="off"
                />
              </div>

              <div className="input-ldgr">
                <label htmlFor="uom" className="text-sm mr-[60px] ml-2">
                  Product UOM
                </label>
                :{" "}
                <input
                  type="text"
                  id="uom"
                  name="uom"
                  value={product.uom}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  ref={(input) => (inputRefs.current.uom = input)}
                  className="w-[300px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                  autoComplete="off"
                />
              </div>

              <div className="input-ldgr">
                <label
                  htmlFor="stockCategory"
                  className="text-sm mr-[36px] ml-2"
                >
                  Product Category
                </label>
                :{" "}
                <input
                  type="text"
                  id="stockCategory"
                  name="stockCategory"
                  value={product.stockCategory}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  ref={(input) => (inputRefs.current.stockCategory = input)}
                  className="w-[300px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                  autoComplete="off"
                />
              </div>

              <div className="input-ldgr">
                <label
                  htmlFor="stockGroup"
                  className="text-sm mr-[55px] ml-2"
                >
                  Product Group
                </label>
                :{" "}
                <input
                  type="text"
                  id="stockGroup"
                  name="stockGroup"
                  value={product.stockGroup}
                  onChange={(e) =>
                    setProduct({ ...product, stockGroup: e.target.value })
                  }
                  onKeyDown={handleKeyDown}
                  ref={(input) => (inputRefs.current.stockGroup = input)}
                  className="w-[300px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                  autoComplete="off"
                />
              </div>

              <div className="input-ldgr">
                <label
                  htmlFor="standardCost"
                  className="text-sm mr-[57px] ml-2"
                >
                  Standard Cost
                </label>
                :{" "}
                <input
                  type="text"
                  id="standardCost"
                  name="standardCost"
                  value={product.standardCost}
                  onChange={(e) =>
                    setProduct({ ...product, standardCost: e.target.value })
                  }
                  onKeyDown={handleKeyDown}
                  ref={(input) => (inputRefs.current.standardCost = input)}
                  className="w-[300px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                  autoComplete="off"
                />
              </div>

              <div className="input-ldgr">
                <label
                  htmlFor="sellingPrice"
                  className="text-sm mr-[68px] ml-2"
                >
                  Selling Price
                </label>
                :{" "}
                <input
                  type="text"
                  id="sellingPrice"
                  name="sellingPrice"
                  value={product.sellingPrice}
                  onChange={(e) =>
                    setProduct({ ...product, sellingPrice: e.target.value })
                  }
                  onKeyDown={handleKeyDown}
                  ref={(input) => (inputRefs.current.sellingPrice = input)}
                  className="w-[300px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                  autoComplete="off"
                />
              </div>

              <div className="input-ldgr">
                <label htmlFor="discount" className="text-sm mr-[92.5px] ml-2">
                  Discount
                </label>
                :{" "}
                <input
                  type="text"
                  id="discount"
                  name="discount"
                  value={product.discount}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  ref={(input) => (inputRefs.current.discount = input)}
                  className="w-[300px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                  autoComplete="off"
                />
              </div>
            </form>
          </div>

          <div className="mt-[305px] ml-[270px]">
            <input type="button" id="backButton" ref={(button) => {backButtonRef.current = button; inputRefs.current.backButton = button;}} onKeyDown={(e) => {if (e.key === 'Backspace'){e.preventDefault(); if (inputRefs.current.discount && inputRefs.current.discount.focus){inputRefs.current.discount.focus();}}}} className="px-11 py-[5px] text-sm bg-slate-600 hover:bg-slate-800" value={': Quit'} onClick={handleNavigation} />
            <span className="text-sm underline decoration-black absolute left-[987px] top-[598px]" style={{textDecorationThickness: '2px'}}>Q</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Quit Confirmation
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to quit without saving changes?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  ref={yesQuitButtonRef}
                  onClick={handleModalConfirm}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-slate-600 text-base font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Yes, Quit
                </button>
                <button
                  type="button"
                  ref={cancelModalConfirmRef}
                  onClick={handleModalClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayProductMaster;
