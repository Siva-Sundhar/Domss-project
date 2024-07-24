import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listOfVoucherTypeNames, listOfVoucherTypes } from '../../../services/MasterService';

const VoucherTypeAlter = () => {
  const [voucherTypeName, setVoucherTypeName] = useState('');
  const [voucherTypeNames, setVoucherTypeNames] = useState([]);
  const [voucherTypes, setVoucherTypes] = useState([]);
  const [filteredVoucherNames, setFilteredVoucherNames] = useState([]);
  const [filteredVoucherTypes, setFilteredVoucherTypes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [remainingItemsCount, setRemainingItemsCount] = useState(0);
  const inputRef = useRef(null);
  const selectedRef = useRef(null);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    inputRef.current.focus();

    listOfVoucherTypeNames()
      .then(response => {
        setVoucherTypeNames(response.data);
        setFilteredVoucherNames(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    listOfVoucherTypes()
      .then(response => {
        setVoucherTypes(response.data);
        setFilteredVoucherTypes(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    filterVoucherNames();
  }, [voucherTypeName]);

  useEffect(() => {
    const handleKeyDown = e => {
      const totalItems = filteredVoucherNames.length + filteredVoucherTypes.length + 2; // Create, Back

      if (e.key === 'ArrowDown') {
        if (selectedIndex < totalItems - 1) { // Ensure we don't go beyond the last item
          setSelectedIndex(prevIndex => {
            const newIndex = prevIndex + 1;
            if (newIndex >= 2 && newIndex >= startIndex + ITEMS_PER_PAGE) {
              setStartIndex(prevStartIndex => {
                const newStartIndex = Math.min(filteredVoucherNames.length + filteredVoucherTypes.length - ITEMS_PER_PAGE, prevStartIndex + 1);
                setRemainingItemsCount(filteredVoucherNames.length + filteredVoucherTypes.length - (newStartIndex + ITEMS_PER_PAGE));
                return newStartIndex;
              });
            }
            return newIndex;
          });
        }
      } else if (e.key === 'ArrowUp') {
        if (selectedIndex > 0) { // Ensure we don't go before the "Create" link
          setSelectedIndex(prevIndex => {
            const newIndex = prevIndex - 1;
            if (newIndex >= 2 && newIndex < startIndex) {
              setStartIndex(prevStartIndex => {
                const newStartIndex = Math.max(0, prevStartIndex - 1);
                setRemainingItemsCount(filteredVoucherNames.length + filteredVoucherTypes.length - (newStartIndex + ITEMS_PER_PAGE));
                return newStartIndex;
              });
            }
            return newIndex;
          });
        }
      } else if (e.key === 'Enter') {
        if (selectedIndex === 0) {
          navigate('/create/voucherType');
        } else if (selectedIndex === 1) {
          navigate('/alter');
        } else if (selectedIndex < filteredVoucherNames.length + 2) {
          navigate(`/alterVoucherTypeMaster/${filteredVoucherNames[selectedIndex - 2].voucherTypeName}`);
        } else if (selectedIndex < filteredVoucherNames.length + filteredVoucherTypes.length + 2) {
          navigate(`/displayVoucherType/${filteredVoucherTypes[selectedIndex - filteredVoucherNames.length - 2].voucherType}`);
        }
        e.preventDefault();
      } else if (e.key === 'Escape') {
        navigate('/alter');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredVoucherNames, filteredVoucherTypes, selectedIndex, navigate, startIndex]);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedIndex]);

  const filterVoucherNames = () => {
    if (voucherTypeName === '') {
      setFilteredVoucherNames(voucherTypeNames);
      setFilteredVoucherTypes(voucherTypes);
    } else {
      const filteredNames = voucherTypeNames.filter(vou =>
        vou.voucherTypeName.toLowerCase().includes(voucherTypeName.toLowerCase())
      );

      const filteredTypes = voucherTypes.filter(vou =>
        vou.voucherType.toLowerCase().includes(voucherTypeName.toLowerCase())
      );

      setFilteredVoucherNames(filteredNames);
      setFilteredVoucherTypes(filteredTypes);
    }
    setStartIndex(0);
    setRemainingItemsCount((filteredVoucherNames.length + filteredVoucherTypes.length) - ITEMS_PER_PAGE);
    setSelectedIndex(2); // Reset selection index after filtering
  };

  const displayedVoucherNames = filteredVoucherNames.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const displayedVoucherTypes = filteredVoucherTypes.slice(
    startIndex - Math.max(filteredVoucherNames.length - ITEMS_PER_PAGE, 0),
    startIndex + ITEMS_PER_PAGE - filteredVoucherNames.length
  );

  const totalDisplayedItems = displayedVoucherNames.length + displayedVoucherTypes.length;

  return (
    <>
      <div className="flex justify-evenly" onClick={() => inputRef.current.focus()}>
        <div className="w-[80%] flex h-screen">
          <div className="w-[50%] bg-white"></div>

          <div className="w-[65%] bg-slate-100 flex justify-center items-center flex-col">
            <div className="w-[50%] h-16 flex flex-col justify-center items-center border border-black bg-white border-b-0">
              <p className="text-[13px] font-semibold underline underline-offset-4 decoration-gray-400">
                Voucher Type Alter
              </p>
              <input
                type="text"
                id="voucherTypeName"
                name="voucherTypeName"
                value={voucherTypeName}
                onChange={e => {
                  setVoucherTypeName(e.target.value);
                }}
                ref={inputRef}
                className="w-[250px] ml-2 mt-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                autoComplete="off"
              />
            </div>

            <div className="w-[350px] h-[85vh] border border-gray-600 bg-[#def]">
              <h2 className="p-1 bg-[#2a67b1] text-white text-left text-[14px]">
                List of Voucher Types
              </h2>

              <div className="border border-b-gray-500 w-[347px]">
                <Link
                  tabIndex={0}
                  onFocus={() => setSelectedIndex(0)}
                  className={`block text-center text-[14px] focus:bg-[#FEB941] outline-none ${selectedIndex === 0 ? 'bg-[#FEB941]' : ''}`}
                  to={'/create/voucherType'}
                >
                  <p className="ml-[285px] text-[13px]">Create</p>
                </Link>
                <Link
                  tabIndex={0}
                  onFocus={() => setSelectedIndex(1)}
                  className={`block text-center text-[14px] focus:bg-[#FEB941] outline-none ${selectedIndex === 1 ? 'bg-[#FEB941]' : ''}`}
                  to={'/alter'}
                >
                  <p className="ml-[287px] text-[13px]">Back</p>
                </Link>
              </div>
              <div className='h-[68vh] overflow-hidden'>
                <table className='w-full'>
                  <thead>
                    <tr>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedVoucherNames.map((vou, index) => {
                      const actualIndex = startIndex + index;
                      const linkPath = `/alterVoucherTypeMaster/${vou.voucherTypeName}`;
                      return (
                        <tr
                          key={vou.voucherTypeName}
                          className={selectedIndex === actualIndex + 2 ? 'bg-[#FEB941]' : ''}
                        >
                          <td className="w-[350px]">
                            <Link
                              className="text-[12.5px]"
                              to={linkPath}
                              tabIndex={0}
                              onFocus={() => setSelectedIndex(actualIndex + 2)}
                            >
                              <div className="flex text-left pl-2 capitalize">
                                {vou.voucherTypeName}
                              </div>
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                    {displayedVoucherTypes.map((vou, index) => {
                      const actualIndex = startIndex + displayedVoucherNames.length + index;
                      const linkPath = `/displayVoucherType/${vou.voucherType}`;
                      return (
                        <tr
                          key={vou.voucherType}
                          className={selectedIndex === actualIndex + 2 ? 'bg-[#FEB941]' : ''}
                        >
                          <td className="w-[350px]">
                            <Link
                              className="text-[12.5px]"
                              to={linkPath}
                              tabIndex={0}
                              onFocus={() => setSelectedIndex(actualIndex + 2)}
                            >
                              <div className="flex text-left pl-2 capitalize">
                                {vou.voucherType}
                              </div>
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {totalDisplayedItems > ITEMS_PER_PAGE && (
              <div className="mt-2 w-[350px] h-6 border border-t-0 border-gray-600 bg-[#def1fc] flex justify-end pr-2">
                <p className="text-[12px] text-black">Remaining Items: {remainingItemsCount}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VoucherTypeAlter;
