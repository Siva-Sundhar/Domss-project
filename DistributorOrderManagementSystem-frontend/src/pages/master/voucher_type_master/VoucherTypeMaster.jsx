import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { createNewVoucherTypeMaster } from "../../../services/MasterService";

const VoucherTypeMaster = () => {
  const [voucherTypeName, setVoucherTypeName] = useState("");
  const [voucherType, setVoucherType] = useState("");
  const [methodOfVoucherNumbering, setMethodVoucherNumbering] =
    useState("automatic");
  const [showVoucherNumberingOptions, setShowVoucherNumberingOptions] =
    useState(false);
  const [alterAdditionalNumberingDetails, setAlterAdditionalNumberingDetails] =
    useState("no");
  const [startingNumber, setStartingNumber] = useState(1);
  const [widthOfNumericalPart, setWidthOfNumericalPart] = useState(0);
  const [prefillWithZero, setPrefillWithZero] = useState("no");
  const [restartNumberingApplicationForm, setRestartNumberingApplicationForm] =
    useState("1-Apr-2024");
  const [restartNumberingStartingNumber, setRestartNumberingStartingNumber] =
    useState(1);
  const [restartNumberingPeriodicity, setRestartNumberingPeriodicity] =
    useState("Yearly");
  const [showPeriodicityOptions, setShowPeriodicityOptions] = useState(false);
  const [prefixDetailsApplicationForm, setPrefixDetailsApplicationForm] =
    useState("1-Apr-2024");
  const [prefixDetailsParticulars, setPrefixDetailsParticulars] = useState("");
  const [suffixDetailsApplicationForm, setSuffixDetailsApplicationForm] =
    useState("1-Apr-2024");
  const [suffixDetailsParticulars, setSuffixDetailsParticulars] = useState("");
  const [printingVoucherAfterSaving, setPrintingVoucherAfterSaving] =
    useState("no");
  const [nameOfClass, setNameOfClass] = useState("");
  const [voucherTypeSuggestions, setVoucherTypeSuggestions] = useState("");
  const [filteredVoucherTypeSuggestions, setFilteredVoucherTypeSuggestions] =
    useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSubFormModal, setShowSubFormModal] = useState(false);
  const [voucherTypeFocused, setVoucherTypeFocused] = useState(false);
  const [methodOfVoucherNumberingFocused, setMethodOfVoucherNumberingFocused] =
    useState(false);
  const [
    highlightedSuggestionVoucherType,
    setHighlightedSuggestionVoucherType,
  ] = useState(0);
  const [
    highlightedMethodOfVoucherNumbering,
    setHighlightedMethodOfVoucherNumbering,
  ] = useState(0);

  const inputRefs = useRef({
    voucherTypeName: null,
    voucherType: null,
    methodOfVoucherNumbering: null,
    alterAdditionalNumberingDetails: null,
    startingNumber: null,
    widthOfNumericalPart: null,
    prefillWithZero: null,
    restartNumberingApplicationForm: null,
    restartNumberingStartingNumber: null,
    restartNumberingPeriodicity: null,
    prefixDetailsApplicationForm: null,
    prefixDetailsParticulars: null,
    suffixDetailsApplicationForm: null,
    suffixDetailsParticulars: null,
    printingVoucherAfterSaving: null,
    nameOfClass: null,
  });

  const startingNumberRef = useRef(null);
  const acceptButtonRef = useRef(null);
  const optionsRef = useRef(null);
  const voucherNumberingOptionsRef = useRef(null);
  const subFormSaveButtonRef = useRef(null);
  const subFormCancelButtonRef = useRef(null);
  const yesQuitButtonRef = useRef(null);
  const cancelModalConfirmRef = useRef(null);
  const suggestionVoucherTypeRef = useRef([]);

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

  useEffect(() => {
    if (inputRefs.current.voucherTypeName) {
      inputRefs.current.voucherTypeName.focus();
      pulseCursor(inputRefs.current.voucherTypeName);
    }

    if (showSubFormModal) {
      startingNumberRef.current.focus();
    }

    const fetchVoucherTypeNameSuggestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9080/voucherTypeApi/allVoucherTypes"
        );
        setVoucherTypeSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching voucher type names:", error);
      }
    };

    fetchVoucherTypeNameSuggestions();

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
        saveVoucherTypeMaster(event);
      }
    };

    const handleSubFormShortcuts = (event) => {
      if (showSubFormModal) {
        if (event.ctrlKey && event.key === "s") {
          event.preventDefault();
          if (subFormSaveButtonRef.current) {
            subFormSaveButtonRef.current.click();
          }
        } else if (event.ctrlKey && event.key === "c") {
          event.preventDefault();
          if (subFormCancelButtonRef.current) {
            subFormCancelButtonRef.current.click();
          }
        } else if (event.key === 'ArrowLeft'){
          event.preventDefault();
          subFormSaveButtonRef.current.focus();
        } else if (event.key === 'ArrowRight'){
          event.preventDefault();
          subFormCancelButtonRef.current.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleCtrlA);
    document.addEventListener("keydown", handleSubFormShortcuts);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleCtrlA);
      document.removeEventListener("keydown", handleSubFormShortcuts);
    };
  }, [showSubFormModal]);

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

  const handleFormKeyDown = (event) => {
    const { keyCode, target } = event;

    switch (keyCode) {
      case 13: // Enter key
        event.preventDefault();
        if(target.id === 'voucherTypeName' && !voucherTypeName.trim()){
          // if voucher type is empty, do not proceed to the next input
          return;
        }
        const currentInputIndex = Object.keys(inputRefs.current).findIndex(
          (key) => key === target.id
        );

        if (target.id === "alterAdditionalNumberingDetails") {
          if (
            inputRefs.current.printingVoucherAfterSaving &&
            inputRefs.current.printingVoucherAfterSaving.focus
          ) {
            inputRefs.current.printingVoucherAfterSaving.focus();
            pulseCursor(inputRefs.current.printingVoucherAfterSaving);
          }
        } else if (target.id === "suffixDetailsParticulars") {
          if (
            subFormSaveButtonRef.current &&
            subFormSaveButtonRef.current.focus
          ) {
            subFormSaveButtonRef.current.focus();
          }
        } else if (target.id === "subFormSaveButton") {
          handleSubFormSave();
          if (
            inputRefs.current.printingVoucherAfterSaving &&
            inputRefs.current.printingVoucherAfterSaving.focus
          ) {
            inputRefs.current.printingVoucherAfterSaving.focus();
            pulseCursor(inputRefs.current.printingVoucherAfterSaving);
          }
        } else {
          const nextInputIndex = currentInputIndex + 1;
          if (nextInputIndex < Object.keys(inputRefs.current).length) {
            const nextInputRef = Object.values(inputRefs.current)[
              nextInputIndex
            ];
            if (nextInputRef && nextInputRef.focus) {
              nextInputRef.focus();
              pulseCursor(nextInputRef);
            }
          }
        }
        break;

      case 27: // Escape key
        setShowModal(true);
        break;

      case 8: // Backspace key
        if (
          (target.id !== "voucherTypeName" && target.id !== 'startingNumber') &&
          target.selectionStart === 0 &&
          target.selectionEnd === 0
        ) {
          event.preventDefault();
          if (target.id === "printingVoucherAfterSaving") {
            if (
              inputRefs.current.alterAdditionalNumberingDetails &&
              inputRefs.current.alterAdditionalNumberingDetails.focus
            ) {
              inputRefs.current.alterAdditionalNumberingDetails.focus();
              pulseCursor(inputRefs.current.alterAdditionalNumberingDetails);
            }
          } else {
            const currentInputIndex = Object.keys(inputRefs.current).findIndex(
              (key) => key === target.id
            );
            const prevInputIndex =
              (currentInputIndex - 1 + Object.keys(inputRefs.current).length) %
              Object.keys(inputRefs.current).length;
            const prevInputRef = Object.values(inputRefs.current)[
              prevInputIndex
            ];
            if (prevInputRef && prevInputRef.focus) {
              prevInputRef.focus();
              pulseCursor(prevInputRef);
            }
          }
        }
        break;

      default:
        if (target.id === "alterAdditionalNumberingDetails") {
          if (keyCode === 89 || keyCode === 121) {
            // Y or y
            event.preventDefault();
            setAlterAdditionalNumberingDetails("no");
            setShowSubFormModal(true);
          } else if (keyCode === 78 || keyCode === 110) {
            // N or n
            event.preventDefault();
            setAlterAdditionalNumberingDetails("no");
            const nextInputRef = inputRefs.current.printingVoucherAfterSaving;
            if (nextInputRef && nextInputRef.focus) {
              nextInputRef.focus();
              pulseCursor(nextInputRef);
            }
          }
        } else if (target.id === "printingVoucherAfterSaving") {
          if (keyCode === 89 || keyCode === 121) {
            // Y or y
            event.preventDefault();
            setPrintingVoucherAfterSaving("yes");
          } else if (keyCode === 78 || keyCode === 110) {
            // N or n
            event.preventDefault();
            setPrintingVoucherAfterSaving("no");
          }
        } else if (target.id === "prefillWithZero") {
          if (keyCode === 89 || keyCode === 121) {
            event.preventDefault();
            setPrefillWithZero("yes");
          } else if (keyCode === 78 || keyCode === 110) {
            event.preventDefault();
            setPrefillWithZero("no");
          }
        }
        break;
    }

    // Handle vouchertype input suggestion navigation
    if (target.id === "voucherType") {
      if (keyCode === 40) {
        // Down Arrow
        event.preventDefault();
        setHighlightedSuggestionVoucherType(
          (prevIndex) => (prevIndex + 1) % filteredVoucherTypeSuggestions.length
        );
      } else if (keyCode === 38) {
        // Up Arrow
        event.preventDefault();
        setHighlightedSuggestionVoucherType(
          (prevIndex) =>
            (prevIndex - 1 + filteredVoucherTypeSuggestions.length) %
            filteredVoucherTypeSuggestions.length
        );
      } else if (keyCode === 13 && highlightedSuggestionVoucherType >= 0) {
        event.preventDefault();
        selectVoucherType(
          filteredVoucherTypeSuggestions[highlightedSuggestionVoucherType]
        );
      }
    }
  };

  const handleVoucherTypeChange = (e) => {
    const value = e.target.value;

    setVoucherType(value);

    if (value.trim() !== "") {
      const filteredSuggestions = voucherTypeSuggestions.filter((voucher) =>
        voucher.voucherType.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredVoucherTypeSuggestions(filteredSuggestions);

      const exactMatch = voucherTypeSuggestions.find(
        (voucher) => voucher.voucherType.toLowerCase() === value.toLowerCase()
      );

      if (exactMatch) {
        setVoucherType(exactMatch.voucherType);
      }
    } else {
      setFilteredVoucherTypeSuggestions([]);
      setVoucherType("");
    }
  };

  const selectVoucherType = (voucher) => {
    setVoucherType(voucher.voucherType);
    setFilteredVoucherTypeSuggestions([]);
  };

  const saveVoucherTypeMaster = (e) => {
    e.preventDefault();

    const voucher = {
      voucherTypeName,
      voucherType,
      methodOfVoucherNumbering,
      alterAdditionalNumberingDetails,
      startingNumber,
      widthOfNumericalPart,
      prefillWithZero,
      restartNumberingApplicationForm,
      restartNumberingStartingNumber,
      restartNumberingPeriodicity,
      prefixDetailsApplicationForm,
      prefixDetailsParticulars,
      suffixDetailsApplicationForm,
      suffixDetailsParticulars,
      printingVoucherAfterSaving,
      nameOfClass,
    };

    console.log(voucher);

    createNewVoucherTypeMaster(voucher)
      .then((response) => {
        console.log(response.data);

        navigate('/create');
      })
      .catch((error) => {
        console.error("Error creating voucher type:", error);
      });
  };

  const handleModalClose = () => {
    setShowModal(false);

    if (inputRefs.current.voucherTypeName) {
      inputRefs.current.voucherTypeName.focus();
      pulseCursor(inputRefs.current.voucherTypeName);
    }
  };

  const handleModalConfirm = () => {
    navigate("/create");
  };

  const handleSubFormSave = () => {
    setStartingNumber(startingNumber);
    setWidthOfNumericalPart(widthOfNumericalPart);
    setPrefillWithZero(prefillWithZero);
    setRestartNumberingApplicationForm(restartNumberingApplicationForm);
    setRestartNumberingStartingNumber(restartNumberingStartingNumber);
    setRestartNumberingPeriodicity(restartNumberingPeriodicity);
    setPrefixDetailsApplicationForm(prefixDetailsApplicationForm);
    setPrefixDetailsParticulars(prefixDetailsParticulars);
    setSuffixDetailsApplicationForm(suffixDetailsApplicationForm);
    setSuffixDetailsParticulars(suffixDetailsParticulars);
    setShowSubFormModal(false);

    // After saving, set focus to printingVoucherAfterSaving
    if (
      inputRefs.current.printingVoucherAfterSaving &&
      inputRefs.current.printingVoucherAfterSaving.focus
    ) {
      inputRefs.current.printingVoucherAfterSaving.focus();
      pulseCursor(inputRefs.current.printingVoucherAfterSaving);
    }
  };

  const handleSubFormCancel = () => {
    setStartingNumber(1);
    setWidthOfNumericalPart("");
    setPrefillWithZero("no");
    setRestartNumberingApplicationForm("1-Apr-2024");
    setRestartNumberingStartingNumber(1);
    setRestartNumberingPeriodicity("yearly");
    setPrefixDetailsApplicationForm("1-Apr-2024");
    setPrefixDetailsParticulars("");
    setSuffixDetailsApplicationForm("1-Apr-2024");
    setSuffixDetailsParticulars("");
    setAlterAdditionalNumberingDetails("no");
    setShowSubFormModal(false);
  };

  // Handle outside click to hide options
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setShowPeriodicityOptions(false);
      }
    };

    const handleVoucherNumberingOutsideClick = (e) => {
      if (
        voucherNumberingOptionsRef.current &&
        !voucherNumberingOptionsRef.current.contains(e.target)
      ) {
        setShowVoucherNumberingOptions(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("click", handleVoucherNumberingOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("click", handleVoucherNumberingOutsideClick);
    };
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    setRestartNumberingPeriodicity(e.target.value);
    setShowPeriodicityOptions(true); // Show the periodicity options when input is changed
  };

  // Handle periodicity option click
  const handlePeriodicityClick = (periodicity) => {
    setRestartNumberingPeriodicity(periodicity);
    setShowPeriodicityOptions(false); // Hide the periodicity options after selection
  };

  const periodicityRenderOptions = () => {
    const periodicities = ["Daily", "Monthly", "Never", "Weekly", "Yearly"];
    return periodicities.map((periodicity) => (
      <p
        key={periodicity}
        tabIndex={0}
        onClick={() => handlePeriodicityClick(periodicity)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handlePeriodicityClick(periodicity);
          }
        }}
        className=" h-5 pl-1 text-sm focus:bg-yellow-200 focus:outline-none"
      >
        {periodicity}
      </p>
    ));
  };

  //   handle Voucher numbering input change
  const handleVoucherNumberingInputChange = (e) => {
    setMethodVoucherNumbering(e.target.value);
    setShowVoucherNumberingOptions(true); //Show the voucher numbering options when input is changed
  };

  // Handle periodicity option click
  const handleVoucherNumberingClick = (methodsOfNumbering) => {
    setMethodVoucherNumbering(methodsOfNumbering);
    setShowVoucherNumberingOptions(false); // Hide the voucher numbering options after selection
  };

  const voucherNumberRenderingOptions = () => {
    const methodsOfNumberingDatas = ["Automatic", "Manual"];
    return methodsOfNumberingDatas.map((methodsOfNumbering, index) => (
      <p
        key={methodsOfNumbering}
        tabIndex={0}
        onClick={() => handleVoucherNumberingClick(methodsOfNumbering)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleVoucherNumberingClick(methodsOfNumbering);
          }
        }}
        onMouseEnter={() => handleVoucherNumberingMouseEnter(index)}
        onMouseLeave={handleVoucherNumberingMouseLeave}
        className={`h-5 pl-2 text-sm focus:outline-none text-left ${
          highlightedMethodOfVoucherNumbering === index ? "bg-yellow-200" : ""
        }`}
      >
        {methodsOfNumbering}
      </p>
    ));
  };

  // Function to format date input
  const formatDateInput = (value) => {
    const datePattern = /(\d{1,2})[./-](\d{1,2})[./-](\d{2})/;
    const match = value.match(datePattern);

    if (match) {
      const day = match[1];
      const month = match[2];
      const year = match[3];

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const formattedMonth = months[parseInt(month, 10) - 1];

      if (formattedMonth) {
        return `${day}-${formattedMonth}-20${year}`;
      }
    }

    return value;
  };

  // Handle Date Input Change
  const handleDateInputChange = (e) => {
    const { name, value } = e.target;

    // Format the input value using formatDateInput function
    const formattedValue = formatDateInput(value);

    // Update state based on the input field name
    switch (name) {
      case "restartNumberingApplicationForm":
        setRestartNumberingApplicationForm(formattedValue);
        break;
      case "prefixDetailsApplicationForm":
        setPrefixDetailsApplicationForm(formattedValue);
        break;
      case "suffixDetailsApplicationForm":
        setSuffixDetailsApplicationForm(formattedValue);
        break;
      default:
        break;
    }
  };

  const handleVoucherTypeFocus = (e) => {
    const { id } = e.target;
    if (id === "voucherType") {
      setVoucherTypeFocused(true);
      setFilteredVoucherTypeSuggestions(voucherTypeSuggestions); // show all suggestions when focused
    } else {
      setVoucherTypeFocused(false);
      setFilteredVoucherTypeSuggestions([]); // clear suggestions when other inputs are focused
    }
  };

  const handleMethodOfVoucherNumberingFocus = (e) => {
    setMethodOfVoucherNumberingFocused(true);
    setShowVoucherNumberingOptions(true);
  };

  const handleMethodOfVoucherNumberingBlur = () => {
    setMethodOfVoucherNumberingFocused(false);
    setShowVoucherNumberingOptions(false);
  };

  const handleVoucherNumberingKeyDown = (e) => {
    const methodsOfNumberingDatas = ["Automatic", "Manual"];
    if (e.key === "ArrowDown") {
      setHighlightedMethodOfVoucherNumbering(
        (prev) => (prev + 1) % methodsOfNumberingDatas.length
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedMethodOfVoucherNumbering(
        (prev) =>
          (prev - 1 + methodsOfNumberingDatas.length) %
          methodsOfNumberingDatas.length
      );
    } else if (e.key === "Enter" && highlightedMethodOfVoucherNumbering >= 0) {
      handleVoucherNumberingClick(
        methodsOfNumberingDatas[highlightedMethodOfVoucherNumbering]
      );
    }
  };

  const handleVoucherNumberingMouseEnter = (index) => {
    setHighlightedMethodOfVoucherNumbering(index);
  };

  const handleVoucherNumberingMouseLeave = () => {
    setHighlightedMethodOfVoucherNumbering(0);
  };

  return (
    <>
      <div className="#FFF5E1 w-[90%] h-[95vh]">
        <div className="text-[12px] flex justify-between bg-[#80C4E9]">
          <p className="ml-1 mt-[1px]">Voucher Type Creation</p>
          <span className="cursor-pointer mt-[5px] mr-2">
            <Link to={"/create"}>
              <IoClose />
            </Link>
          </span>
        </div>

        <div className="text-sm border border-slate-500">
          <form>
            <div
              className="w-[100%] h-[10vh] border border-b-slate-500"
              onClick={() => inputRefs.current.voucherTypeName.focus()}
            >
              <label htmlFor="voucherTypeName" className="mr-5 mt-3 ml-1">
                Name
              </label>
              :{" "}
              <input
                type="text"
                id="voucherTypeName"
                name="voucherTypeName"
                value={voucherTypeName}
                onChange={(e) => setVoucherTypeName(e.target.value)}
                onKeyDown={handleFormKeyDown}
                ref={(input) => {
                  inputRefs.current.voucherTypeName = input;
                }}
                className="w-[300px] ml-2 mt-3 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                autoComplete="off"
              />
              
            </div>

            <div className="flex text-sm h-[75vh]">
              <div
                className="general w-[45%] border border-r-slate-500"
                onClick={() => inputRefs.current.voucherType.focus()}
              >
                <p className="underline text-center">General</p>

                <div>
                  <label htmlFor="voucherType" className="mr-[130px] ml-1">
                    Select type of voucher
                  </label>
                  :{" "}
                  <input
                    type="text"
                    id="voucherType"
                    name="voucherType"
                    value={voucherType}
                    onChange={(e) => {
                      setVoucherType(e.target.value);
                      handleVoucherTypeChange(e);
                    }}
                    onKeyDown={handleFormKeyDown}
                    ref={(input) => (inputRefs.current.voucherType = input)}
                    onFocus={handleVoucherTypeFocus}
                    onBlur={() => setVoucherTypeFocused(false)}
                    className="w-[200px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                    autoComplete="off"
                  />
                  {voucherTypeFocused &&
                    filteredVoucherTypeSuggestions.length > 0 && (
                      <div
                        className="bg-[#CAF4FF] w-[18%] h-[85.5vh] border border-gray-500"
                        style={{
                          position: "absolute",
                          top: "18px",
                          left: "983px",
                        }}
                      >
                        <div className="text-left bg-[#003285] text-[13.5px] text-white pl-2">
                          <p>List of Voucher Types</p>
                        </div>

                        <ul className="suggestions w-full h-[20vh] text-left mt-2">
                          {filteredVoucherTypeSuggestions.map(
                            (voucher, index) => (
                              <li
                                key={index}
                                tabIndex={0}
                                onClick={() => selectVoucherType(voucher)}
                                ref={(input) => {
                                  suggestionVoucherTypeRef.current[index] =
                                    input;
                                }}
                                onKeyDown={(e) =>
                                  e.key === "Enter" &&
                                  selectVoucherType(voucher)
                                }
                                className={`pl-2 cursor-pointer text-[12px] ${
                                  highlightedSuggestionVoucherType === index
                                    ? "bg-yellow-200"
                                    : ""
                                }`}
                              >
                                {voucher.voucherType.toUpperCase()}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>

                <div>
                  <label
                    htmlFor="methodOfVoucherNumbering"
                    className="mr-[77.5px] ml-1"
                  >
                    Method of Voucher Numbering
                  </label>
                  :{" "}
                  <input
                    type="text"
                    id="methodOfVoucherNumbering"
                    name="methodOfVoucherNumbering"
                    value={methodOfVoucherNumbering}
                    onChange={(e) => {
                      setMethodVoucherNumbering(e.target.value);
                      handleVoucherNumberingInputChange(e);
                    }}
                    onKeyDown={(e) => {
                      handleFormKeyDown(e);
                      handleVoucherNumberingKeyDown(e);
                    }}
                    ref={(input) =>
                      (inputRefs.current.methodOfVoucherNumbering = input)
                    }
                    onFocus={handleMethodOfVoucherNumberingFocus}
                    onBlur={handleMethodOfVoucherNumberingBlur}
                    className="w-[200px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                    autoComplete="off"
                  />
                  {methodOfVoucherNumberingFocused &&
                    showVoucherNumberingOptions && (
                      <div
                        ref={voucherNumberingOptionsRef}
                        className="w-[13%] border text-left text-sm bg-[#CAF4FF] absolute top-[102px] left-[405px]"
                      >
                        <div className="bg-[#003285] px-2 text-white">
                          <p>Methods of Numbering</p>
                        </div>
                        {voucherNumberRenderingOptions()}
                      </div>
                    )}
                </div>

                <div>
                  <label
                    htmlFor="alterAdditionalNumberingDetails"
                    className="mr-[36px] ml-1"
                  >
                    Set/Alter additional numbering details
                  </label>
                  :{" "}
                  <input
                    type="text"
                    id="alterAdditionalNumberingDetails"
                    name="alterAdditionalNumberingDetails"
                    value={alterAdditionalNumberingDetails}
                    onChange={(e) =>
                      setAlterAdditionalNumberingDetails(e.target.value)
                    }
                    onKeyDown={handleFormKeyDown}
                    ref={(input) =>
                      (inputRefs.current.alterAdditionalNumberingDetails =
                        input)
                    }
                    className="w-[100px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                    autoComplete="off"
                  />
                  {showSubFormModal && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                      <div className="flex items-end justify-center">
                        <div
                          className="fixed inset-0 transition-opacity"
                          aria-hidden="false"
                        >
                          <div className="absolute inset-0 bg-gray-800 opacity-70"></div>
                        </div>

                        <span
                          className="hidden sm:inline-block"
                          aria-hidden="true"
                        >
                          &#8203;
                        </span>

                        <form action="">
                          <div className="inline-block bg-white transform">
                            <div className="mt-2 w-[1100px] h-[93vh] ">
                              <div className="ml-2">
                                <label
                                  htmlFor="startingNumber"
                                  className="mr-14"
                                >
                                  Starting Number
                                </label>
                                :{" "}
                                <input
                                  type="text"
                                  id="startingNumber"
                                  name="startingNumber"
                                  value={startingNumber}
                                  onChange={(e) =>
                                    setStartingNumber(e.target.value)
                                  }
                                  onKeyDown={handleFormKeyDown}
                                  ref={(input) => {
                                    inputRefs.current.startingNumber = input;
                                    startingNumberRef.current = input;
                                  }}
                                  className="w-[80px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                                  autoComplete="off"
                                />
                              </div>

                              <div className="ml-2">
                                <label
                                  htmlFor="widthOfNumericalPart"
                                  className="mr-[11px]"
                                >
                                  Width of Numerical Part
                                </label>
                                :{" "}
                                <input
                                  type="text"
                                  id="widthOfNumericalPart"
                                  name="widthOfNumericalPart"
                                  value={widthOfNumericalPart}
                                  onChange={(e) =>
                                    setWidthOfNumericalPart(e.target.value)
                                  }
                                  onKeyDown={handleFormKeyDown}
                                  ref={(input) =>
                                    (inputRefs.current.widthOfNumericalPart =
                                      input)
                                  }
                                  className="w-[80px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                                  autoComplete="off"
                                />
                              </div>

                              <div className="ml-2">
                                <label
                                  htmlFor="prefillWithZero"
                                  className="mr-[64.5px]"
                                >
                                  Prefil with Zero
                                </label>
                                :{" "}
                                <input
                                  type="text"
                                  id="prefillWithZero"
                                  name="prefillWithZero"
                                  value={prefillWithZero}
                                  onChange={(e) =>
                                    setPrefillWithZero(e.target.value)
                                  }
                                  onKeyDown={handleFormKeyDown}
                                  ref={(input) =>
                                    (inputRefs.current.prefillWithZero = input)
                                  }
                                  className="w-[80px] ml-2 mb-1 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                                  autoComplete="off"
                                />
                              </div>

                              <div className="flex justify-evenly text-center border border-gray-400 w-[99%] h-[83vh] ml-[5px]">
                                <div className="w-[360px] border border-r-slate-400">
                                  <div className="border border-b-slate-400">
                                    <p>Restart Numbering</p>
                                  </div>

                                  <div className="flex justify-evenly border border-b-gray-400">
                                    <p>
                                      Applicable <br />
                                      Form
                                    </p>
                                    <p>
                                      Starting <br />
                                      Number
                                    </p>
                                    <p>Periodicity</p>
                                  </div>

                                  <div className="flex justify-evenly">
                                    <div>
                                      <label htmlFor="restartNumberingApplicationForm"></label>
                                      <input
                                        type="text"
                                        id="restartNumberingApplicationForm"
                                        name="restartNumberingApplicationForm"
                                        value={restartNumberingApplicationForm}
                                        onChange={(e) => {
                                          setRestartNumberingApplicationForm(
                                            e.target.value
                                          );
                                          handleDateInputChange(e);
                                        }}
                                        onKeyDown={handleFormKeyDown}
                                        ref={(input) =>
                                          (inputRefs.current.restartNumberingApplicationForm =
                                            input)
                                        }
                                        className="w-[100px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                                        autoComplete="off"
                                      />
                                    </div>

                                    <div>
                                      <label htmlFor="restartNumberingStartingNumber"></label>
                                      <input
                                        type="text"
                                        id="restartNumberingStartingNumber"
                                        name="restartNumberingStartingNumber"
                                        value={restartNumberingStartingNumber}
                                        onChange={(e) =>
                                          setRestartNumberingStartingNumber(
                                            e.target.value
                                          )
                                        }
                                        onKeyDown={handleFormKeyDown}
                                        ref={(input) =>
                                          (inputRefs.current.restartNumberingStartingNumber =
                                            input)
                                        }
                                        className="w-[70px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                                        autoComplete="off"
                                      />
                                    </div>

                                    <div>
                                      <label htmlFor="restartNumberingPeriodicity"></label>
                                      <input
                                        type="text"
                                        id="restartNumberingPeriodicity"
                                        name="restartNumberingPeriodicity"
                                        value={restartNumberingPeriodicity}
                                        onChange={(e) => {
                                          setRestartNumberingPeriodicity(
                                            e.target.value
                                          );
                                          handleInputChange(e);
                                        }}
                                        onKeyDown={handleFormKeyDown}
                                        ref={(input) =>
                                          (inputRefs.current.restartNumberingPeriodicity =
                                            input)
                                        }
                                        className="w-[100px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                                        autoComplete="off"
                                      />

                                      {showPeriodicityOptions && (
                                        <div
                                          ref={optionsRef}
                                          className="w-[10%] border text-sm bg-[#CAF4FF] absolute top-[70px] left-[365px]"
                                        >
                                          <div className="bg-[#003285] px-5 text-white">
                                            <p>Periodicity</p>
                                          </div>
                                          {periodicityRenderOptions()}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="w-[360px] border border-r-slate-400">
                                  <div className="border border-b-slate-400">
                                    <p>Prefix Details</p>
                                  </div>

                                  <div className="flex justify-evenly border border-b-gray-400">
                                    <p>
                                      Application <br />
                                      Form
                                    </p>
                                    <p>Particulars</p>
                                  </div>

                                  <div className="flex justify-evenly">
                                    <div>
                                      <label htmlFor="prefixDetailsApplicationForm"></label>
                                      <input
                                        type="text"
                                        id="prefixDetailsApplicationForm"
                                        name="prefixDetailsApplicationForm"
                                        value={prefixDetailsApplicationForm}
                                        onChange={(e) => {
                                          setPrefixDetailsApplicationForm(
                                            e.target.value
                                          );
                                          handleDateInputChange(e);
                                        }}
                                        onKeyDown={handleFormKeyDown}
                                        ref={(input) =>
                                          (inputRefs.current.prefixDetailsApplicationForm =
                                            input)
                                        }
                                        className="w-[100px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                                        autoComplete="off"
                                      />
                                    </div>

                                    <div>
                                      <label htmlFor="prefixDetailsParticulars"></label>
                                      <input
                                        type="text"
                                        id="prefixDetailsParticulars"
                                        name="prefixDetailsParticulars"
                                        value={prefixDetailsParticulars}
                                        onChange={(e) =>
                                          setPrefixDetailsParticulars(
                                            e.target.value
                                          )
                                        }
                                        onKeyDown={handleFormKeyDown}
                                        ref={(input) =>
                                          (inputRefs.current.prefixDetailsParticulars =
                                            input)
                                        }
                                        className="w-[100px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                                        autoComplete="off"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <div className="w-[360px] border border-b-slate-400">
                                    <p>Suffix Details</p>
                                  </div>

                                  <div className="flex justify-evenly border border-b-gray-400">
                                    <p>
                                      Application <br />
                                      Form
                                    </p>
                                    <p>Particulars</p>
                                  </div>

                                  <div className="flex justify-evenly">
                                    <div>
                                      <label htmlFor="suffixDetailsApplicationForm"></label>
                                      <input
                                        type="text"
                                        id="suffixDetailsApplicationForm"
                                        name="suffixDetailsApplicationForm"
                                        value={suffixDetailsApplicationForm}
                                        onChange={(e) => {
                                          setSuffixDetailsApplicationForm(
                                            e.target.value
                                          );
                                          handleDateInputChange(e);
                                        }}
                                        onKeyDown={handleFormKeyDown}
                                        ref={(input) =>
                                          (inputRefs.current.suffixDetailsApplicationForm =
                                            input)
                                        }
                                        className="w-[100px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                                        autoComplete="off"
                                      />
                                    </div>

                                    <div>
                                      <label htmlFor="suffixDetailsParticulars"></label>
                                      <input
                                        type="text"
                                        id="suffixDetailsParticulars"
                                        name="suffixDetailsParticulars"
                                        value={suffixDetailsParticulars}
                                        onChange={(e) =>
                                          setSuffixDetailsParticulars(
                                            e.target.value
                                          )
                                        }
                                        onKeyDown={handleFormKeyDown}
                                        ref={(input) =>
                                          (inputRefs.current.suffixDetailsParticulars =
                                            input)
                                        }
                                        className="w-[100px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                                        autoComplete="off"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <input type="button" value={': Save'} onClick={handleSubFormSave} ref={subFormSaveButtonRef} onKeyDown={(e) => {if(e.key === 'Backspace'){e.preventDefault(); if(inputRefs.current.suffixDetailsParticulars && inputRefs.current.suffixDetailsParticulars.focus()){inputRefs.current.suffixDetailsParticulars.focus();}}}} className="text-sm bg-slate-600 hover:bg-slate-800 px-8 py-1 ml-[315px] relative" />
                              <span className="text-sm absolute top-[609px] left-[338px] underline decoration-black" style={{textDecorationThickness: '2px'}}>S</span>
                              
                              <input type="button" value={': Cancel'} onClick={handleSubFormCancel} ref={subFormCancelButtonRef} className="text-sm px-8 py-1 border bg-slate-600 hover:bg-slate-800 ml-[260px] relative" />
                              <span className="text-sm absolute top-[609px] left-[700px] underline decoration-black" style={{textDecorationThickness: '2px'}}>C</span>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="printing w-[30%] border border-r-slate-500"
                onClick={() =>
                  inputRefs.current.printingVoucherAfterSaving.focus()
                }
              >
                <p className="underline text-center">Printing</p>

                <div>
                  <label
                    htmlFor="printingVoucherAfterSaving"
                    className="mr-2 ml-2"
                  >
                    Printing voucher after saving
                  </label>
                  :{" "}
                  <input
                    type="text"
                    id="printingVoucherAfterSaving"
                    name="printingVoucherAfterSaving"
                    value={printingVoucherAfterSaving}
                    onChange={(e) =>
                      setPrintingVoucherAfterSaving(e.target.value)
                    }
                    onKeyDown={handleFormKeyDown}
                    ref={(input) =>
                      (inputRefs.current.printingVoucherAfterSaving = input)
                    }
                    className="w-[100px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div
                className="nameOfClass w-[20%]"
                onClick={() => inputRefs.current.nameOfClass.focus()}
              >
                <p className="underline text-center">Name of Class</p>

                <div className="text-center">
                  <input
                    type="text"
                    id="nameOfClass"
                    name="nameOfClass"
                    value={nameOfClass}
                    onChange={(e) => setNameOfClass(e.target.value)}
                    onKeyDown={handleFormKeyDown}
                    ref={(input) => (inputRefs.current.nameOfClass = input)}
                    className="w-[200px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="">
          <input
            type="button"
            onKeyDown={(e) => {
              if (e.key === "Backspace") {
                e.preventDefault();
                if (
                  inputRefs.current.nameOfClass &&
                  inputRefs.current.nameOfClass.focus
                ) {
                  inputRefs.current.nameOfClass.focus();
                }
              }
            }}
            id="acceptButton"
            value=": Accept" 
            ref={(button) => {
              acceptButtonRef.current = button;
              inputRefs.current.acceptButton = button;
            }}
            onClick={(e) => saveVoucherTypeMaster(e)}
            className="text-sm px-8 py-1 mt-3 border bg-slate-600 hover:bg-slate-800 ml-[100px] relative"
          />

          <span className="text-sm absolute top-[583px] left-[120px] underline decoration-black" style={{ textDecorationThickness: "2px"}}>A</span>

          <Link
            to={"/create"}
            className="border px-11 py-[5px] text-sm bg-slate-600 hover:bg-slate-800  ml-[600px] "
          >
            <span className="border-b-2 border-black">Q</span>: Quit
          </Link>
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
    </>
  );
};

export default VoucherTypeMaster;
