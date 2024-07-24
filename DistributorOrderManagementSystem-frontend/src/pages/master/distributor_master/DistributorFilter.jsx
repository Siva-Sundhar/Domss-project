import React, { useEffect, useRef, useState } from 'react';
import { listOfDistributors } from '../../../services/MasterService';
import { Link, useNavigate } from 'react-router-dom';

const DistributorFilter = () => {
  const [distributorCode, setDistributorCode] = useState('');
  const [distributor, setDistributor] = useState([]);
  const [filteredDistributors, setFilteredDistributors] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [remainingItemsCount, setRemainingItemsCount] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    inputRef.current.focus();

    listOfDistributors()
      .then(response => {
        setDistributor(response.data);
        setFilteredDistributors(response.data);
        setRemainingItemsCount(response.data.length - ITEMS_PER_PAGE);
        setSelectedIndex(response.data.length > 0 ? 2 : 0);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    filterDistributors();
  }, [distributorCode]);

  useEffect(() => {
    const handleKeyDown = e => {
      const totalItems = filteredDistributors.length + 2; // +2 for create and back
      if (e.key === 'ArrowDown') {
        if (selectedIndex < totalItems - 1){  // Ensure we don't go beyond the last item
          setSelectedIndex((prevIndex) =>{
            const newIndex = (prevIndex + 1) % totalItems;
            if (newIndex >= 2 && newIndex - 2 >= startIndex + ITEMS_PER_PAGE){
              setStartIndex((prevStartIndex) => {
                const newStartIndex = Math.min(filteredDistributors.length - ITEMS_PER_PAGE, prevStartIndex + 1);
                setRemainingItemsCount(filteredDistributors.length - (newStartIndex + ITEMS_PER_PAGE));
                return newStartIndex;
              })
            }
            return newIndex;
          })
        }
      } else if (e.key === 'ArrowUp') {
        if (selectedIndex > 0) {  // Ensure we don't go before the "Create" link
          setSelectedIndex((prevIndex) =>{
            const newIndex = (prevIndex - 1 + totalItems) % totalItems;
            if (newIndex <= 2 && newIndex - 2 < startIndex){
              setStartIndex((prevStartIndex) => {
                const newStartIndex = Math.max(0, prevStartIndex - 1);
                setRemainingItemsCount(filteredDistributors.length - (newStartIndex + ITEMS_PER_PAGE));
                return newStartIndex;
              })
            }
            e.preventDefault();
            return newIndex;
          })
        }
      } else if (e.key === 'Enter') {
        if (selectedIndex === 0) {
          navigate('/create/distributor');
          e.preventDefault();
        } else if (selectedIndex === 1) {
          navigate('/display');
        } else if (filteredDistributors[selectedIndex - 2]) {
          navigate(
            `/displayDistributor/${filteredDistributors[selectedIndex - 2].distributorCode}`,
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
  }, [filteredDistributors, selectedIndex, navigate, startIndex]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedIndex]);

  const filterDistributors = () => {
    if (distributorCode === '') {
      setFilteredDistributors(distributor);
    } else {
      const filtered = distributor.filter(dis =>
        dis.distributorCode.toLowerCase().includes(distributorCode.toLowerCase()),
      );
      setFilteredDistributors(filtered);
    }
    setStartIndex(0);
    setRemainingItemsCount(filteredDistributors.length - ITEMS_PER_PAGE);
    setSelectedIndex(filteredDistributors.length > 0 ? 2 : 0); // Reset selected index to the first element in the filtered list
  };

  const displayedDistributors = filteredDistributors.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      <div className="flex justify-evenly" onClick={() => inputRef.current.focus()}>
        <div className="w-[80%] flex h-screen">
          <div className="w-[50%] bg-white"></div>

          <div className="w-[65%] bg-slate-100 flex justify-center items-center flex-col">
            <div className="w-[50%] h-16 flex flex-col justify-center items-center border border-black bg-white border-b-0 ">
              <p className="text-[13px] font-semibold underline underline-offset-4 decoration-gray-400">
                Distributor Display
              </p>
              <input
                type="text"
                id="executiveCode"
                name="executiveCode"
                value={distributorCode}
                onChange={e => setDistributorCode(e.target.value)}
                ref={inputRef}
                className="w-[250px] ml-2 mt-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200  focus:border focus:border-blue-500 focus:outline-none"
                autoComplete="off"
              />
            </div>

            <div className="w-[350px] h-[85vh] border border-gray-600 bg-[#def]">
              <h2 className="p-1 bg-[#2a67b1] text-white text-left text-[13px]">
                List of Distributor
              </h2>
                <div className="border border-b-gray-500 w-[347px]">
                  <Link
                    className={`block text-center text-[13px] focus:bg-[#FEB941] outline-none ${
                      selectedIndex === 0 ? 'bg-[#FEB941]' : ''
                    }`}
                    to={'/create/distributor'}
                  >
                    <p className="ml-[285px] text-[14px]">Create</p>
                  </Link>
                  <Link
                    className={`block text-center text-[13px] focus:bg-[#FEB941] outline-none ${
                      selectedIndex === 1 ? 'bg-[#FEB941]' : ''
                    }`}
                    to={'/display'}
                  >
                    <p className="ml-[287px] text-[14px] ">Back</p>
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
                      {displayedDistributors.map((dis, index) => (
                        <tr
                          key={dis.distributorCode}
                          className={selectedIndex === index + 2 ? 'bg-[#FEB941]' : ''}
                        >
                          <td className="w-[350px]">
                            <Link className="text-[12.5px]" to={`/displayDistributor/${dis.distributorCode}`} tabIndex={0} onFocus={() => setSelectedIndex(index + 2)}>
                              <div className='flex text-left pl-2 capitalize'>{dis.distributorCode}</div>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredDistributors.length > ITEMS_PER_PAGE && (
                  <div className='text-left p-2 bg-[#2a67b1]'>
                    <p className='text-[13px] text-white'>Remaining: {remainingItemsCount} distributors</p>
                  </div>
                )} 
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DistributorFilter;
