import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";

const DisplayExecutiveMaster = () => {
  const { executiveCode } = useParams();

  const [executive, setExecutive] = useState({
    executiveCode: "",
    executiveMaster: "",
    dateOfJoin: "",
    mobileNo: "",
    emailId: "",
    status: "",
  });

  const inputRefs = useRef({
    executiveCode: null,
    executiveMaster: null,
    dateOfJoin: null,
    mobileNo: null,
    emailId: null,
    status: null,
    backButton: null,
  });

  const backButtonRef = useRef(null);
  const yesQuitButtonRef = useRef(null);
  const cancelModalConfirmRef = useRef(null);

  const [showModal, setShowModal] = useState(false);

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
    const focusAndPulseCursor = () => {
      if (inputRefs.current.executiveCode) {
        inputRefs.current.executiveCode.focus();
        pulseCursor(inputRefs.current.executiveCode);
      }
    }

    setTimeout(focusAndPulseCursor,100);

    loadExecutive();

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
    } else if (keyCode === 8 && target.id !== "executiveCode") {
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

  const loadExecutive = async () => {
    try {
      const result = await axios.get(
        `http://localhost:9080/executiveMasterApi/displayExecutive/${executiveCode}`
      );
      setExecutive(result.data);
    } catch (error) {
      console.error("Error fetching the executive data", error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);

    if (inputRefs.current.executiveCode) {
      inputRefs.current.executiveCode.focus();
      pulseCursor(inputRefs.current.executiveCode);
    }
  };

  const handleModalConfirm = () => {
    navigate("/display/executiveFilter");
  };

  const handleNavigation = () => {
    navigate("/display/executiveFilter");
  }

  return (
    <div>
      <div className="flex">
        <div className="w-1/2 h-[100vh] border border-bg-gray-500"></div>

        <div className="w-1/2 border border-bg-gray-500">
          <div className="w-[550px] h-[30px] flex justify-between text-[20px] bg-[#F1E5D1] ml-[80px] mt-10 border border-gray-500 border-b-0">
            <h2 className="ml-[200px]">Executive Master</h2>
            <span className="cursor-pointer mt-[5px] mr-2">
              <Link to={'/display/executiveFilter'}>
                <IoClose />
              </Link>
            </span>
          </div>

          <div className="w-[550px] h-[30vh] border border-gray-500 ml-[80px] ">
            <form>
              <div className="input-ldgr mt-3">
                <label
                  htmlFor="executiveCode"
                  className="text-sm ml-2 mr-[49px]"
                >
                  Executive Code
                </label>
                :{" "}
                <input
                  type="text"
                  id="executiveCode"
                  name="executiveCode"
                  value={executive.executiveCode}
                  onKeyDown={handleKeyDown}
                  ref={(input) => {
                    inputRefs.current.executiveCode = input;
                  }}
                  className="w-[300px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                  readOnly
                  autoComplete="off"
                />
              </div>

              <div className="input-ldgr mt-1">
                <label
                  htmlFor="executiveMaster"
                  className="text-sm mr-[39.5px] ml-2"
                >
                  Executive Master
                </label>
                :{" "}
                <input
                  type="text"
                  id="executiveMaster"
                  name="executiveMaster"
                  value={executive.executiveMaster}
                  onKeyDown={handleKeyDown}
                  ref={(input) => (inputRefs.current.executiveMaster = input)}
                  className="w-[300px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                  readOnly
                  autoComplete="off"
                />
              </div>

              <div className="input-ldgr">
                <label htmlFor="dateOfJoin" className="text-sm mr-[69px] ml-2">
                  Date Of Join
                </label>
                :{" "}
                <input
                  type="text"
                  id="dateOfJoin"
                  name="dateOfJoin"
                  value={executive.dateOfJoin}
                  onKeyDown={handleKeyDown}
                  ref={(input) => (inputRefs.current.dateOfJoin = input)}
                  className="w-[300px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                  readOnly
                  autoComplete="off"
                />
              </div>

              <div className="input-ldgr">
                <label htmlFor="mobileNo" className="text-sm mr-[83.5px] ml-2">
                  Mobile No
                </label>
                :{" "}
                <input
                  type="text"
                  id="mobileNo"
                  name="mobileNo"
                  value={executive.mobileNo}
                  onKeyDown={handleKeyDown}
                  ref={(input) => (inputRefs.current.mobileNo = input)}
                  className="w-[300px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                  readOnly
                  autoComplete="off"
                />
              </div>

              <div className="input-ldgr">
                <label htmlFor="emailId" className="text-sm mr-[97.5px] ml-2">
                  Email Id
                </label>
                :{" "}
                <input
                  type="text"
                  id="emailId"
                  name="emailId"
                  value={executive.emailId}
                  onKeyDown={handleKeyDown}
                  ref={(input) => (inputRefs.current.emailId = input)}
                  className="w-[300px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                  readOnly
                  autoComplete="off"
                />
              </div>

              <div className="input-ldgr">
                <label htmlFor="status" className="text-sm mr-[106.5px] ml-2">
                  Status
                </label>
                :{" "}
                <input
                  type="text"
                  id="status"
                  name="status"
                  value={executive.status}
                  onKeyDown={handleKeyDown}
                  ref={(input) => (inputRefs.current.status = input)}
                  className="w-[300px] ml-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                  readOnly
                  autoComplete="off"
                />
              </div>
            </form>
          </div>

          <div className="mt-[330px] ml-[270px]">
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

export default DisplayExecutiveMaster;
