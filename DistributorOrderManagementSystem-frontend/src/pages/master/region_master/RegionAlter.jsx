import React, { useEffect, useRef, useState } from 'react';
import { listOfRegions } from '../../../services/MasterService';
import { Link, useNavigate } from 'react-router-dom';


const RegionAlter = () => {
  const [regionMasterId, setRegionMasterId] = useState("");
  const [region, setRegion] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [remainingItemsCount, setRemainingItemsCount] = useState(0);
  const inputRef = useRef(null);
  const selectedRef = useRef(null);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    inputRef.current.focus();

    listOfRegions()
      .then(response => {
        setRegion(response.data);
        setFilteredRegions(response.data);
        setRemainingItemsCount(response.data.length - ITEMS_PER_PAGE);
        setSelectedIndex(response.data.length > 0 ? 2 : 0);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    filterRegions();
  }, [regionMasterId]);

  useEffect(() => {

    const handleKeyDown = (e) => {
      const totalItems = filteredRegions.length + 2; // Create, Back

      if (e.key === 'ArrowDown') {
        if (selectedIndex < totalItems - 1){  // Ensure we don't go beyond the last item
          setSelectedIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % totalItems;
            if (newIndex >= 2 && newIndex - 2 >= startIndex + ITEMS_PER_PAGE){
              setStartIndex((prevStartIndex) => {
                const newStartIndex = Math.min(filteredRegions.length - ITEMS_PER_PAGE, prevStartIndex + 1);
                setRemainingItemsCount(filteredRegions.length - (newStartIndex + ITEMS_PER_PAGE));
                return newStartIndex;
              });
            }
            return newIndex;
          })
        }

      } else if (e.key === "ArrowUp") {
        if (selectedIndex > 0){   // Ensure we don't go before the "Create" link
          setSelectedIndex((prevIndex) => {
            const newIndex = (prevIndex - 1 + totalItems) % totalItems;
            if (newIndex >= 2 && newIndex -2 < startIndex){
              setStartIndex((prevStartIndex) => {
                const newStartIndex = Math.max(0, prevStartIndex - 1);
                setRemainingItemsCount(filteredRegions.length - (newStartIndex + ITEMS_PER_PAGE));
                return newStartIndex;
              })
            }
            e.preventDefault();
            return newIndex;
          })
        }
      } else if (e.key === 'Enter') {
        if (selectedIndex === 0) {
          navigate('/create/region');
          e.preventDefault();
        } else if (selectedIndex === 1) {
          navigate('/alter');
          e.preventDefault();
        } else if (filteredRegions[selectedIndex - 2]) {
          navigate(`/alterRegionMaster/${filteredRegions[selectedIndex - 2].regionMasterId}`);
        }
      } else if (e.key === 'Escape') {
        navigate('/alter');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredRegions, selectedIndex, navigate, startIndex]);

  useEffect(() => {
    if (selectedRef.current){
      selectedRef.current.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }
  },[selectedIndex]);

  const filterRegions = () => {
    let filtered = region.filter((reg) => 
      reg.regionMasterId.toLowerCase().includes(regionMasterId.toLowerCase())
    );

    setFilteredRegions(filtered);
    setStartIndex(0);
    setRemainingItemsCount(filteredRegions.length - ITEMS_PER_PAGE);
    setSelectedIndex(2); // Reset selected index to the first element in the filtered list
  };

  const displayedRegions = filteredRegions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      <div className="flex justify-evenly" onClick={() => inputRef.current.focus()}>
        <div className="w-[80%] flex h-screen">
          <div className="w-[50%] bg-white"></div>

          <div className="w-[65%] bg-slate-100 flex justify-center items-center flex-col">
            <div className="w-[50%] h-16 flex flex-col justify-center items-center border border-black bg-white border-b-0">
              <p className="text-[13px] font-semibold underline underline-offset-4 decoration-gray-400">
                Region Alter
              </p>
              <input
                type="text"
                id="regionMasterId"
                name="regionMasterId"
                value={regionMasterId}
                onChange={e => setRegionMasterId(e.target.value)}
                ref={inputRef}
                className="w-[250px] ml-2 mt-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                autoComplete="off"
              />
            </div>

            <div className="w-[350px] h-[85vh] border border-gray-600 bg-[#def]">
              <h2 className="p-1 bg-[#2a67b1] text-white text-left text-[13px]">
                List of Regions
              </h2>
              <div className="border border-b-gray-500 w-[347px]">
                <Link
                  className={`block text-center text-[13px] focus:bg-[#FEB941] outline-none ${
                    selectedIndex === 0 ? "bg-[#FEB941]" : ""
                  }`}
                  to={"/create/region"}
                >
                  <p className="ml-[285px] text-[13px]">Create</p>
                </Link>
                <Link
                  className={`block text-center text-[13px] focus:bg-[#FEB941] outline-none ${
                    selectedIndex === 1 ? "bg-[#FEB941]" : ""
                  }`}
                  to={"/alter"}
                >
                  <p className="ml-[270px] text-[13px] px-[30px]">Back</p>
                </Link>
              </div>
              <div className='h-[68.5vh] overflow-hidden'>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedRegions.map((reg, index) => (
                      <tr
                        key={reg.regionMasterId}
                        className={selectedIndex === index + 2 ? "bg-[#FEB941]" : ""}
                        ref={selectedIndex === index + 2 + startIndex ? selectedRef : null}
                      >
                        <td className="text-[12.5px] w-full">
                          <Link
                            to={`/alterRegionMaster/${reg.regionMasterId}`}
                            className={`block w-full text-left pl-2 text-[13px] ${selectedIndex === index + 2 + startIndex ? 'bg-[#FEB941]' : ''}`}
                          >
                          {reg.regionMasterId} - {reg.regionName}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredRegions.length > ITEMS_PER_PAGE && (
                <div className='text-left p-2 bg-[#2a67b1]'>
                  <p className='text-white text-[13px]'>Remaining: {remainingItemsCount} regions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegionAlter;
