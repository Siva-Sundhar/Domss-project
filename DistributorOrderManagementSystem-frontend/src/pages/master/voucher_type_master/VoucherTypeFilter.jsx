import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listOfVoucherTypeNames, listOfVoucherTypes } from '../../../services/MasterService';

const VoucherTypeFilter = () => {
  const [voucherTypeName, setVoucherTypeName] = useState();
  const [voucherTypeNames, setVoucherTypeNames] = useState([]);
  const [voucherTypes, setVoucherTypes] = useState([]);
  const [filteredVoucherNames, setFilteredVoucherNames] = useState([]);
  const [filteredVoucherTypes, setFilteredVoucherTypes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current.focus();

    listOfVoucherTypeNames()
      .then(response => {
        console.log(response.data);
        setVoucherTypeNames(response.data);
        setFilteredVoucherNames(response.data);
        setSelectedIndex(response.data.length > 0 ? 2 : 0);
      })
      .catch(error => {
        console.error(error);
      });

    listOfVoucherTypes()
      .then(response => {
        console.log(response.data);
        setVoucherTypes(response.data);
        setFilteredVoucherTypes(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'ArrowDown') {
        setSelectedIndex(
          prevIndex =>
            (prevIndex + 1) % (filteredVoucherNames.length + filteredVoucherTypes.length + 2),
        );
      } else if (e.key === 'ArrowUp') {
        setSelectedIndex(
          prevIndex =>
            (prevIndex - 1 + filteredVoucherNames.length + filteredVoucherTypes.length + 2) %
            (filteredVoucherNames.length + filteredVoucherTypes.length + 2),
        );
      } else if (e.key === 'Enter') {
        if (selectedIndex === 0) {
          navigate('/create/voucherType');
          e.preventDefault();
        } else if (selectedIndex === 1) {
          navigate('/display');
        } else if (filteredVoucherNames[selectedIndex - 2]) {
          navigate(
            `/displayVoucherTypeName/${filteredVoucherNames[selectedIndex - 2].voucherTypeName}`,
          );
        } else if (filteredVoucherTypes[selectedIndex - filteredVoucherNames.length - 2]) {
          navigate(
            `/displayVoucherType/${
              filteredVoucherTypes[selectedIndex - filteredVoucherNames.length - 2].voucherType
            }`,
          );
        }
      } else if (e.key === 'Escape') {
        navigate('/display');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredVoucherNames, filteredVoucherTypes, selectedIndex, navigate]);

  const filterVoucherNames = () => {
    if (voucherTypeName === '') {
      setFilteredVoucherNames(voucherTypeNames);
      setFilteredVoucherTypes(voucherTypes);
    } else {
      const filteredNames = voucherTypeNames.filter(vou =>
        vou.voucherTypeName.toLowerCase().includes(voucherTypeName.toLowerCase()),
      );

      const filteredTypes = voucherTypes.filter(vou =>
        vou.voucherType.toLowerCase().includes(voucherTypeName.toLowerCase()),
      );

      setFilteredVoucherNames(filteredNames);
      setFilteredVoucherTypes(filteredTypes);
    }
    setSelectedIndex(2); // Reset selection index after filtering
  };

  return (
    <>
      <div className="flex justify-evenly" onClick={() => inputRef.current.focus()}>
        <div className="w-[80%] flex h-screen">
          <div className="w-[50%] bg-white"></div>

          <div className="w-[65%] bg-slate-100 flex justify-center items-center flex-col">
            <div className="w-[50%] h-16 flex flex-col justify-center items-center border border-black bg-white border-b-0">
              <p className="text-[13px] font-semibold underline underline-offset-4 decoration-gray-400">
                Voucher Type Display
              </p>
              <input
                type="text"
                id="voucherTypeName"
                name="voucherTypeName"
                value={voucherTypeName}
                ref={inputRef}
                onChange={e => {
                  setVoucherTypeName(e.target.value);
                  filterVoucherNames();
                }}
                className="w-[250px] ml-2 mt-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200  focus:border focus:border-blue-500 focus:outline-none"
                autoComplete="off"
              />
            </div>

            <div className="w-[350px] h-[85vh] border border-gray-600 bg-[#def1fc]">
              <h2 className="p-1 bg-[#2a67b1] text-white text-left text-[13px]">
                List of Voucher Types
              </h2>

              <div className="border border-b-gray-500 w-[347px]">
                <Link
                  tabIndex={0}
                  onFocus={() => setSelectedIndex(0)}
                  className={`block text-center text-[13px] focus:bg-[#FEB941] outline-none ${
                    selectedIndex === 0 ? 'bg-[#FEB941]' : ''
                  }`}
                  to={'/create/voucherType'}
                >
                  <p className="ml-[285px] ">Create</p>
                </Link>
                <Link
                  tabIndex={0}
                  onFocus={() => setSelectedIndex(1)}
                  className={`block text-center text-[13px] focus:bg-[#FEB941] outline-none ${
                    selectedIndex === 1 ? 'bg-[#FEB941]' : ''
                  }`}
                  to={'/display'}
                >
                  <p className="ml-[287px] ">Back</p>
                </Link>
              </div>

              <table>
                <thead>
                  <tr>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredVoucherNames.map((vou, index) => (
                    <tr
                      key={vou.voucherTypeName}
                      className={selectedIndex === index + 2 ? 'bg-[#FEB941]' : ''}
                    >
                      <td className="w-[350px]">
                        <Link
                          className={`text-[12.5px]`}
                          to={`/displayVoucherTypeName/${vou.voucherTypeName}`}
                          tabIndex={0}
                          onFocus={() => setSelectedIndex(index + 2)}
                        >
                          <div className="flex text-left capitalize pl-2">
                            {vou.voucherTypeName}
                          </div>
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {filteredVoucherTypes.map((vou, index) => (
                    <tr
                      key={vou.voucherType}
                      className={
                        selectedIndex === index + filteredVoucherNames.length + 2
                          ? 'bg-[#FEB941]'
                          : ''
                      }
                    >
                      <td className="w-[350px]">
                        <Link
                          className="text-[12.5px]"
                          to={`/displayVoucherType/${vou.voucherType}`}
                          tabIndex={0}
                          onFocus={() => setSelectedIndex(index + filteredVoucherNames.length + 2)}
                        >
                          <div className="flex text-left capitalize pl-2">{vou.voucherType}</div>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VoucherTypeFilter;
