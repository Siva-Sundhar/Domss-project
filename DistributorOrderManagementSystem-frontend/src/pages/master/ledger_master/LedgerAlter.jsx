
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listOfLedgers } from '../../../services/MasterService';



const LedgerAlter = () => {
  const [ledgerCode, setLedgerCode] = useState('');
  const [ledger, setLedger] = useState([]);
  const [filteredLedgers, setFilteredLedgers] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current.focus();

    listOfLedgers()
      .then(response => {
        console.log(response.data);
        setLedger(response.data);
        setFilteredLedgers(response.data.slice(0, 20));
        setSelectedIndex(response.data.length > 0 ? 2 : 0);
        setShowDropdown(response.data.length > 20);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    filterLedgers();
  }, [ledgerCode]);

  useEffect(() => {
    const handleKeyDown = e => {
      const totalItems =
        showDropdown ? filteredLedgers.length + 3 : filteredLedgers.length + 2; // +3 for create, back, and dropdown if it exists
      if (e.key === 'ArrowDown') {
        setSelectedIndex(prevIndex => (prevIndex + 1) % totalItems);
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        setSelectedIndex(prevIndex => (prevIndex - 1 + totalItems) % totalItems);
        e.preventDefault();
      } else if (e.key === 'Enter') {
        if (selectedIndex === 0) {
          navigate('/create/ledger');
          e.preventDefault();
        } else if (selectedIndex === 1) {
          navigate('/alter');
          e.preventDefault();
        } else if (showDropdown && selectedIndex === filteredLedgers.length + 2) {
          dropdownRef.current.focus();
        } else if (filteredLedgers[selectedIndex - 2]) {
          navigate(`/alterLedgerMaster/${filteredLedgers[selectedIndex - 2].ledgerCode}`);
        }
      } else if (e.key === 'Escape') {
        navigate('/alter');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredLedgers, selectedIndex, navigate, showDropdown]);

  const filterLedgers = () => {
    let filtered = [];
    if (ledgerCode === '') {
      filtered = ledger.slice(0, 20); // Reset to show the first 20 elements
    } else {
      filtered = ledger.filter(led =>
        led.ledgerCode.toLowerCase().includes(ledgerCode.toLowerCase()),
      );
      filtered = filtered.slice(0, 20); // Limit to 20 elements
    }
    setFilteredLedgers(filtered);
    setSelectedIndex(2); // Reset selected index to the first element in the filtered list
  };

  const handleDropdownChange = e => {
    const selectedLedgerCode = e.target.value;
    navigate(`/alterLedgerMaster/${selectedLedgerCode}`);
  };

  return (
    <>
      <div className="flex justify-evenly" onClick={() => inputRef.current.focus()}>
        <div className="w-[80%] flex h-screen">
          <div className="w-[50%] bg-white"></div>

          <div className="w-[65%] bg-slate-100 flex justify-center items-center flex-col">
            <div className="w-[50%] h-16 flex flex-col justify-center items-center border border-black bg-white border-b-0 ">
              <p className="text-[13px] font-semibold underline underline-offset-4 decoration-gray-400">
                Ledger Alter
              </p>
              <input
                type="text"
                id="ledgerCode"
                name="ledgerCode"
                value={ledgerCode}
                onChange={e => setLedgerCode(e.target.value)}
                ref={inputRef}
                className="w-[250px] ml-2 mt-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200  focus:border focus:border-blue-500 focus:outline-none"
                autoComplete="off"
              />
            </div>

            <div className="w-[350px] h-[85vh] border border-gray-600 bg-[#def1fc]">
              <h2 className="p-1 bg-[#2a67b1] text-white text-left text-[14px]">List of Ledgers</h2>
              <table>
                <thead>
                  <tr>
                    <th></th>
                  </tr>
                </thead>
                <div className="border border-b-gray-500 w-[347px]">
                  <Link
                    className={`block text-center text-[13px] focus:bg-[#FEB941] outline-none ${
                      selectedIndex === 0 ? 'bg-[#FEB941]' : ''
                    }`}
                    to={'/create/ledger'}
                  >
                    <p className="ml-[285px]">Create</p>
                  </Link>
                  <Link
                    className={`block text-center text-[13px] focus:bg-[#FEB941] outline-none ${
                      selectedIndex === 1 ? 'bg-[#FEB941]' : ''
                    }`}
                    to={'/alter'}
                  >
                    <p className="ml-[287px] ">Back</p>
                  </Link>
                </div>
                <tbody>
                  {filteredLedgers.map((led, index) => (
                    <tr
                      key={led.ledgerCode}
                      className={selectedIndex === index + 2 ? 'bg-[#FEB941]' : ''}
                    >
                      <Link
                        className="block text-left pl-2 text-[13px] focus:bg-[#FEB941] outline-none"
                        to={`/alterLedgerMaster/${led.ledgerCode}`}
                      >
                        <td>
                          {led.ledgerCode} - {led.ledgerName}
                        </td>
                      </Link>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showDropdown && (
                <div className="mt-2">
                  <label
                    htmlFor="ledgerDropDOwn"
                    className="block text-center text-[14px] mb-1"
                  ></label>
                  <select
                    name="ledgerDropDOwn"
                    id="ledgerDropDOwn"
                    ref={dropdownRef}
                    className={`w-full border border-gray-600 bg-[#BBE9FF] p-1 text-[13px] focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none ${
                      selectedIndex === filteredLedgers.length + 2
                    }`}
                    onChange={handleDropdownChange}
                  >
                    <option value="" className="block text-left pl-2 text-[13px]">
                      Select Other Ledgers
                    </option>
                    {ledger.slice(20).map(led => (
                      <option
                        key={led.ledgerCode}
                        value={led.ledgerCode}
                        className="block text-left pl-2 text-[12.5px]"
                      >
                        {led.ledgerCode} - {led.ledgerName}
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

export default LedgerAlter;
