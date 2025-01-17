import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AlterProductMaster = () => {
  const { productCode } = useParams(); // Use productcode for url parameters

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
    stockCategory: null,
    uom: null,
    stockGroup: null,
    standardCost: null,
    sellingPrice: null,
    discount: null,
    acceptButton: null,
  });

  const [unitsSuggestions, setUnitsSuggestions] = useState([]);
  const [filteredUnitsSuggestions, setFilteredUnitsSuggestions] = useState([]);
  const [uomFocused, setUomFocused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [highlightedSuggestionIndex, setHighlightedSuggestionIndex] =
    useState('');

  const acceptButtonRef = useRef(null);
  const yesQuitButtonRef = useRef(null);
  const cancelModalConfirmRef = useRef(null);
  const uomInputRef = useRef(null); // Ref for the uom input field
  const suggestionRefs = useRef([]); // Refs for suggestion items

  const navigate = useNavigate();

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

  const onInputChange = (e) => {
    const { name, value } = e.target;

    // Update the product state with the new value
    setProduct({ ...product, [name]: value });
  };

  const loadProduct = async () => {
    try {
      const result = await axios.get(
        `http://localhost:9080/products/displayProduct/${productCode}`
      );
      setProduct(result.data);
      console.log(result.data);
    } catch (error) {
      console.error("Error fetching the product data:", error);
    }
  };

  useEffect(() => {
    // Focus on the first input element after the component mounts
    const focusAndPulseCursor = () => {
      if (inputRefs.current.productCode) {
        inputRefs.current.productCode.focus();
        pulseCursor(inputRefs.current.productCode);
      }
    }

    setTimeout(focusAndPulseCursor,100);

    loadProduct();

    // Fetch units suggestions
    const fetchUnitSuggestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9080/unitMasterApi/allUnits"
        );
        setUnitsSuggestions(response.data);
        setFilteredUnitsSuggestions(response.data); // Initialize with all suggestions
        // Initialize suggestionRefs for each suggestion item
        suggestionRefs.current = response.data.map(() => React.createRef());
      } catch (error) {
        console.error("Error fetching unit data:", error);
      }
    };

    fetchUnitSuggestions();

    // Add event listener for Ctrl + Q and Esc to go back
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
        acceptButtonRef.current.click();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleCtrlA);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleCtrlA);
    };
  }, [navigate]);

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
        acceptButtonRef.current.focus();
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
      const isStandardCost = target.name === "standardCost";
      const isSellingPrice = target.name === "sellingPrice";
      const isDiscount = target.name === "discount";

      const isEmptyOrZero =
        target.value.trim() === "" ||
        (target.value === "0" &&
          (isStandardCost || isSellingPrice || isDiscount));

      if (isEmptyOrZero) {
        event.preventDefault();
        const prevInputIndex =
          (currentInputIndex - 1 + Object.keys(inputRefs.current).length) %
          Object.keys(inputRefs.current).length;
        const prevInputRef = Object.values(inputRefs.current)[prevInputIndex];
        prevInputRef.focus();
        pulseCursor(prevInputRef);
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

    if (target.id === "uom") {
      if (keyCode === 40) {
        event.preventDefault();
        setHighlightedSuggestionIndex(
          (prevIndex) => (prevIndex + 1) % filteredUnitsSuggestions.length
        );
      } else if (keyCode === 38) {
        event.preventDefault();
        setHighlightedSuggestionIndex(
          (prevIndex) =>
            (prevIndex - 1 + filteredUnitsSuggestions.length) %
            filteredUnitsSuggestions.length
        );
      } else if (keyCode === 13 && highlightedSuggestionIndex >= 0) {
        event.preventDefault();
        selectUnit(filteredUnitsSuggestions[highlightedSuggestionIndex]);
      }
    } else if (keyCode === 46) {
      event.preventDefault();
      setProduct({ ...product, [target.name]: "" });
    }
  };

  const handleUomChange = (e) => {
    const value = e.target.value;
    setProduct({ ...product, uom: value }); // Update the UOM state

    const filteredSuggestions = unitsSuggestions.filter((unit) =>
      unit.productUom.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredUnitsSuggestions(filteredSuggestions); // Update filtered suggestions

    // Update highlighted index based on user input or selection
    let highlightedIndex = -1; // Initialize to -1 for no highlighted suggestion

    // Find the index of the suggestion that exactly matches the input value
    const exactMatchIndex = filteredSuggestions.findIndex(
      (unit) => unit.productUom.toLowerCase() === value.toLowerCase()
    );

    if (exactMatchIndex !== -1) {
      // If there's an exact match, use that index
      highlightedIndex = exactMatchIndex;
    } else if (filteredSuggestions.length > 0) {
      // Otherwise, find the index of the first suggestion that starts with the input value
      highlightedIndex = filteredSuggestions.findIndex((unit) =>
        unit.productUom.toLowerCase().startsWith(value.toLowerCase())
      );
      if (highlightedIndex === -1) {
        // If no match found, default to highlighting the first suggestion
        highlightedIndex = 0;
      }
    }

    setHighlightedSuggestionIndex(highlightedIndex); // Update highlighted index

    // Focus on the suggestion related to the selected productUom
    if (exactMatchIndex !== -1 && suggestionRefs.current[exactMatchIndex]) {
      suggestionRefs.current[exactMatchIndex].focus();
    }
  };

  const selectUnit = (unit) => {
    setProduct({ ...product, uom: unit.uom.toUpperCase() }); // Update the UOM state with the selected unit
    setFilteredUnitsSuggestions([]); // Clear filtered suggestions
  };

  const handleInputFocus = (e) => {
    const { id } = e.target;
    if (id === "uom") {
      setUomFocused(true);
      setFilteredUnitsSuggestions(unitsSuggestions); // Show all suggestions when focused
    } else {
      setUomFocused(false);
      setFilteredUnitsSuggestions([]); // Clear suggestions when other inputs are focused
    }
  };

  const handleInputBlur = (e) => {
    const { id } = e.target;
    if (id === 'uom'){
      setUomFocused(false);
    }
  }

  const handleModalClose = () => {
    setShowModal(false);

    if (inputRefs.current.productCode) {
      inputRefs.current.productCode.focus();
      pulseCursor(inputRefs.current.productCode);
    }
  };

  const handleModalConfirm = () => {
    navigate("/productAlter/filter");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:9080/products/alterProductMaster/${productCode}`,
        {
          ...product,
          standardCost: parseFloat(product.standardCost),
          sellingPrice: parseFloat(product.sellingPrice),
          discount: parseFloat(product.discount),
        }
      );

      navigate('/productAlter/filter');
    } catch (error) {
      console.error("Error updating the product", error);
    }
  };

  return (
    <>
      <div className="w-1/2 border h-[100vh]" onClick={() => inputRefs.current.productCode.focus()}>
      <div className="w-[550px] h-[30px] flex justify-between text-[20px] bg-[#F1E5D1] ml-[750px] mt-10 border border-gray-500 border-b-0">
        <h2 className="ml-[200px]">Product Master</h2>
        <span className="cursor-pointer mt-[5px] mr-2">
          <Link to={"/productAlter/filter"}>
            <IoClose />
          </Link>
        </span>
      </div>

      <div className="w-[550px] h-[35vh] border border-gray-500 ml-[750px]">
        <form onSubmit={onSubmit}>
          <div className="input-ldgr mt-3">
            <label htmlFor="productCode" className="text-sm mr-[53.5px] ml-2">
              Product Code
            </label>
            :{" "}
            <input
              type="text"
              id="productCode"
              name="productCode"
              value={product.productCode}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              ref={(input) => {
                inputRefs.current.productCode = input;
              }}
              className="w-[300px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
              autoComplete="off"
            />
          </div>

          <div className="input-ldgr">
            <label
              htmlFor="description"
              className="text-sm mr-[9.5px] ml-2"
            >
              Product Descriptions
            </label>
            :{" "}
            <input
              type="text"
              id="description"
              name="description"
              value={product.description}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              ref={(input) => (inputRefs.current.description = input)}
              className="w-[300px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
              autoComplete="off"
            />
          </div>

          <div className="input-ldgr">
            <label htmlFor="stockCategory" className="text-sm mr-[30px] ml-2">
              Product Category
            </label>
            :{" "}
            <input
              type="text"
              id="stockCategory"
              name="stockCategory"
              value={product.stockCategory}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              ref={(input) => (inputRefs.current.stockCategory = input)}
              className="w-[300px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
              autoComplete="off"
            />
          </div>

          <div className="input-ldgr">
            <label htmlFor="uom" className="text-sm mr-[55px] ml-2">
              Product UOM
            </label>
            :{" "}
            <input
              type="text"
              id="uom"
              name="uom"
              value={product.uom}
              onChange={handleUomChange}
              onKeyDown={handleKeyDown}
              ref={(input) => {
                inputRefs.current.uom = input;
                uomInputRef.current = input;
              }}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="w-[300px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
              autoComplete="off"
            />
            {uomFocused && filteredUnitsSuggestions.length > 0 && (
              <div className="absolute top-[72px] left-[1031px] text-left bg-[#CAF4FF] w-[20%] h-[550px] border border-gray-500 overflow-y-scroll">
                <div className=" bg-[#003285] text-[13.5px] pl-2 text-white">
                  <p>List Of Uom</p>
                </div>
                <ul className=" bg-[#CAF4FF] mt-5 w-full border border-gray-300 text-[12.5px]">
                  {filteredUnitsSuggestions.map((unit, index) => (
                    <li
                      key={unit.id || index}
                      ref={(input) => (suggestionRefs.current[index] = input)}
                      tabIndex={0}
                      onClick={() => selectUnit(unit)}
                      onMouseDown={() => selectUnit(unit)}
                      onFocus={handleInputFocus}
                      className={`pl-2 cursor-pointer ${
                        highlightedSuggestionIndex === index
                          ? "bg-yellow-300"
                          : ""
                      }`}
                    >
                      {unit.productUom}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="input-ldgr">
            <label htmlFor="stockGroup" className="text-sm mr-[48.5px] ml-2">
              Product Group
            </label>
            :{" "}
            <input
              type="text"
              id="stockGroup"
              name="stockGroup"
              value={product.stockGroup}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              ref={(input) => (inputRefs.current.stockGroup = input)}
              className="w-[300px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
              autoComplete="off"
            />
          </div>

          <div className="input-ldgr">
            <label htmlFor="standardCost" className="text-sm mr-[51px] ml-2">
              Standard Cost
            </label>
            :{" "}
            <input
              type="text"
              id="standardCost"
              name="standardCost"
              value={product.standardCost}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              ref={(input) => (inputRefs.current.standardCost = input)}
              className="w-[150px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
              autoComplete="off"
            />
          </div>

          <div className="input-ldgr">
            <label htmlFor="sellingPrice" className="text-sm mr-[62px] ml-2">
              Selling Price
            </label>
            :{" "}
            <input
              type="text"
              id="sellingPrice"
              name="sellingPrice"
              value={product.sellingPrice}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              ref={(input) => (inputRefs.current.sellingPrice = input)}
              className="w-[150px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
              autoComplete="off"
            />
          </div>

          <div className="input-ldgr">
            <label htmlFor="discount" className="text-sm mr-[87px] ml-2">
              Discount
            </label>
            :{" "}
            <input
              type="text"
              id="discount"
              name="discount"
              value={product.discount}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              ref={(input) => (inputRefs.current.discount = input)}
              className="w-[150px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
              autoComplete="off"
            />
          </div>

          <div className="mt-[300px] ml-[70px]">
            <input
              type="button"
              id="acceptButton"
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  e.preventDefault();
                  if (
                    inputRefs.current.discount &&
                    inputRefs.current.discount.focus
                  ) {
                    inputRefs.current.discount.focus();
                  }
                }
              }}
              value={": Accept"}
              ref={(button) => {
                acceptButtonRef.current = button;
              }}
              onClick={(e) => onSubmit(e)}
              className="text-sm px-8 py-1 bg-slate-600 hover:bg-slate-800 relative"
            />
            <span className="text-sm absolute top-[580px] left-[844px] underline decoration-black" style={{textDecorationThickness: '2px'}}>A</span>
          </div>
        </form>
      </div>

      <div className="mt-[285px] absolute left-[410px]">
        <Link
          to={"/productAlter/filter"}
          className="px-11 py-[5px] text-sm bg-slate-600 hover:bg-slate-800"
        >
          <span className="border-b-2 border-black">Q</span>: Quit
        </Link>
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
    </>
  );
};

export default AlterProductMaster;