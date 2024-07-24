import React, { useEffect, useRef, useState } from 'react';
import { listOfExecutives } from '../../../services/MasterService';
import { Link, useNavigate } from 'react-router-dom';

const ExecutiveFilter = () => {
  const [executiveCode, setExecutiveCode] = useState('');
  const [executive, setExecutive] = useState([]);
  const [filteredExecutives, setFilteredExecutives] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [remainingItemsCount, setRemainingItemsCount] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 20;
  useEffect(() => {
    inputRef.current.focus();

    listOfExecutives()
      .then(response => {
        setExecutive(response.data);
        setFilteredExecutives(response.data);
        setRemainingItemsCount(response.data.length - ITEMS_PER_PAGE);
        setSelectedIndex(response.data.length > 0 ? 2 : 0); // set initial focus to the first filtered data
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    filterExecutives();
  }, [executiveCode]);

  useEffect(() => {
    const handleKeyDown = e => {
      const totalItems = filteredExecutives.length + 2; // Create, Back
      if (e.key === 'ArrowDown') {
        if (selectedIndex < totalItems - 1) { // Ensure we don't go beyond the last item
          setSelectedIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % totalItems;
            if (newIndex >= 2 && newIndex - 2 >= startIndex + ITEMS_PER_PAGE) {
              setStartIndex((prevStartIndex) => {
                const newStartIndex = Math.min(filteredExecutives.length - ITEMS_PER_PAGE, prevStartIndex + 1);
                setRemainingItemsCount(filteredExecutives.length - (newStartIndex + ITEMS_PER_PAGE));
                return newStartIndex;
              });
            }
            return newIndex;
          });
        }
      } else if (e.key === 'ArrowUp') {
        if (selectedIndex > 0) { // Ensure we don't go before the "Create" link
          setSelectedIndex((prevIndex) => {
            const newIndex = (prevIndex - 1 + totalItems) % totalItems;
            if (newIndex >= 2 && newIndex - 2 < startIndex) {
              setStartIndex((prevStartIndex) => {
                const newStartIndex = Math.max(0, prevStartIndex - 1);
                setRemainingItemsCount(filteredExecutives.length - (newStartIndex + ITEMS_PER_PAGE));
                return newStartIndex;
              });
            }
            e.preventDefault();
            return newIndex;
          });
        }
      } else if (e.key === 'Enter') {
        if (selectedIndex === 0) {
          navigate('/create/executive');
          e.preventDefault();
        } else if (selectedIndex === 1) {
          navigate('/display');
        } else if (filteredExecutives[selectedIndex - 2]) {
          navigate(`/displayExecutive/${filteredExecutives[selectedIndex - 2].executiveCode}`);
        }
      } else if (e.key === 'Escape') {
        navigate('/display');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredExecutives, selectedIndex, navigate, startIndex]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedIndex]);

  const filterExecutives = () => {
    if (executiveCode === '') {
      setFilteredExecutives(executive);
    } else {
      const filtered = executive.filter(exe =>
        exe.executiveCode.toLowerCase().includes(executiveCode.toLowerCase()),
      );
      setFilteredExecutives(filtered);
    }
    setStartIndex(0);
    setRemainingItemsCount(filteredExecutives.length - ITEMS_PER_PAGE);
    setSelectedIndex(filteredExecutives.length > 0 ? 2 : 0); // Reset selected index to the first element in the filtered list
  };

  const displayedExecutives = filteredExecutives.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <div className="flex justify-evenly" onClick={() => inputRef.current.focus()}>
        <div className="w-[80%] flex h-screen">
          <div className="w-[50%] bg-white"></div>

          <div className="w-[65%] bg-slate-100 flex justify-center items-center flex-col">
            <div className="w-[50%] h-16 flex flex-col justify-center items-center border border-black bg-white border-b-0 ">
              <p className="text-[13px] font-semibold underline underline-offset-4 decoration-gray-400">
                Executive Display
              </p>
              <input
                type="text"
                id="executiveCode"
                name="executiveCode"
                value={executiveCode}
                onChange={e => setExecutiveCode(e.target.value)}
                ref={inputRef}
                className="w-[250px] ml-2 mt-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                autoComplete="off"
              />
            </div>

            <div className="w-[350px] h-[85vh] border border-gray-600 bg-[#def]">
              <h2 className="p-1 bg-[#2a67b1] text-white text-left text-[13px]">
                List of Executives
              </h2>  
                <div className="border border-b-gray-500 w-[347px]">
                  <Link
                    className={`block text-center text-[13px] focus:bg-[#FEB941] outline-none ${
                      selectedIndex === 0 ? 'bg-[#FEB941]' : ''
                    }`}
                    to={'/create/executive'}
                  >
                    <p className="ml-[285px] text-[14px]">Create</p>
                  </Link>
                  <Link
                    className={`block text-center text-[13px] focus:bg-[#FEB941] outline-none ${
                      selectedIndex === 1 ? 'bg-[#FEB941]' : ''
                    }`}
                    to={'/display'}
                  >
                    <p className="ml-[287px] text-[14px]">Back</p>
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
                      {filteredExecutives.map((exe, index) => (
                        <tr
                          key={exe.executiveCode}
                          className={selectedIndex === index + 2 ? 'bg-[#FEB941]' : ''}
                        >
                          <td className="w-[350px]">
                            <Link className="text-[12.5px]" to={`/displayExecutive/${exe.executiveCode}`} tabIndex={0} onFocus={() => setSelectedIndex(index + 2)}>
                              <div className="flex text-left pl-2 capitalize">{exe.executiveCode}</div>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredExecutives.length > ITEMS_PER_PAGE && (
                  <div className="text-left p-2 bg-[#2a67b1]">
                    <p className="text-[13px] text-white">Remaining Items: {remainingItemsCount}</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExecutiveFilter;
