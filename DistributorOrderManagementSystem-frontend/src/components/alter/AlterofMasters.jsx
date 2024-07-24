import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AlterofMasters = () => {
  const regionRef = useRef(null);
  const executiveRef = useRef(null);
  const distributorRef = useRef(null);
  const productRef = useRef(null);
  const godownRef = useRef(null);
  const voucherTypeRef = useRef(null);
  const ledgerRef = useRef(null);
  const backButtonRef = useRef(null);

  const links = [
    voucherTypeRef,
    ledgerRef,
    regionRef,
    executiveRef,
    distributorRef,
    productRef,
    godownRef,
    backButtonRef,
  ];
  const location = useLocation();

  useEffect(() => {
    // Unique session storage key for alterofMasters
    const sessionKey = 'alterOfMastersFocusIndex';
    const savedFocusIndex = sessionStorage.getItem(sessionKey);
    if (savedFocusIndex != null) {
      const index = parseInt(savedFocusIndex, 10);
      if (links[index]?.current) {
        links[index].current.focus();
      }
    } else {
      // Default focus on voucherTypeRef if no saved index
      if (voucherTypeRef.current) {
        voucherTypeRef.current.focus();
      }
    }
  }, [location]);

  const handleKeyDown = event => {
    const currentIndex = links.findIndex(link => link.current === document.activeElement);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % links.length;
      sessionStorage.setItem('alterOfMastersFocusIndex', nextIndex);
      links[nextIndex].current.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = (currentIndex - 1 + links.length) % links.length;
      sessionStorage.setItem('alterOfMastersFocusIndex', prevIndex);
      links[prevIndex].current.focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      if (backButtonRef.current) {
        backButtonRef.current.click();
      }
    }
  };

  const handleMouseDown = event => {
    // Check if the clicked element is one of the links
    if (!links.some(link => link.current === event.target)) {
      event.preventDefault();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [links]);

  return (
    <>
      <div className="flex justify-evenly">
        <div className="w-[80%] flex h-screen">
          <div className="w-[50%] bg-white"></div>

          <div className="w-[65%] bg-slate-100 flex justify-center items-center flex-col">
            <div className="w-[300px] h-96 border border-blue-400 text-sm bg-[#def] mt-[94px] ml-[2px]">
              <h2 className="text-white bg-[#2a67b1] px-20">Alter of Masters</h2>

              <ul>
                <li className="py-3 ml-20 text-[10px] text-[#2a67b1]">
                  <h2>DOMSS MASTER</h2>
                </li>

                <Link
                  to="/voucherTypeAlter/filter"
                  ref={voucherTypeRef}
                  className="block outline-none focus:bg-yellow-500 mb-[2px]"
                >
                  <li className="w-full pl-20">Voucher Type Master</li>
                </Link>

                <Link
                  to="/ledgerAlter/filter"
                  ref={ledgerRef}
                  className="block outline-none focus:bg-yellow-500 mb-[2px]"
                >
                  <li className="w-full pl-20">Ledger Master</li>
                </Link>

                <Link
                  to="/regionAlter/filter"
                  ref={regionRef}
                  className="block outline-none focus:bg-yellow-500 mb-[2px]"
                >
                  <li className="w-full pl-20">Region Master</li>
                </Link>

                <Link
                  to="/executiveAlter/filter"
                  ref={executiveRef}
                  className="block outline-none focus:bg-yellow-500 mb-[2px]"
                >
                  <li className="w-full pl-20">Executive Master</li>
                </Link>

                <Link
                  to="/distributorAlter/filter"
                  ref={distributorRef}
                  className="block outline-none focus:bg-yellow-500 mb-[2px]"
                >
                  <li className="w-full pl-20">Distributor Master</li>
                </Link>

                <Link
                  to="/productAlter/filter"
                  ref={productRef}
                  className="block outline-none focus:bg-yellow-500 mb-[2px]"
                >
                  <li className="w-full pl-20">Product Master</li>
                </Link>

                <Link
                  to="/godownAlter/filter"
                  ref={godownRef}
                  className="block outline-none focus:bg-yellow-500 mb-[2px]"
                >
                  <li className="w-full pl-20">Godown Master</li>
                </Link>
              </ul>
            </div>

            <div className="mt-[70px]">
              <Link
                to="/"
                ref={backButtonRef}
                className="border px-11 py-[5px] text-sm bg-slate-600 hover:bg-slate-800"
              >
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlterofMasters;
