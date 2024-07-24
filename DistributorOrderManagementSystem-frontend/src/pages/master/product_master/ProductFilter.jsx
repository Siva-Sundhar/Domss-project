import { useEffect, useRef, useState } from 'react';
import { listOfProducts } from '../../../services/MasterService';
import { Link, useNavigate } from 'react-router-dom';

const ProductFilter = () => {
  const [productCode, setProductCode] = useState('');
  const [product, setProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [remainingItemsCount, setRemainingItemsCount] = useState(0);
  const inputRef = useRef(null);
  const selectedRef = useRef(null);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    inputRef.current.focus();

    listOfProducts()
      .then(response => {
        setProduct(response.data);
        setFilteredProducts(response.data);
        setRemainingItemsCount(response.data.length - ITEMS_PER_PAGE);
        setSelectedIndex(response.data.length > 0 ? 2 : 0); 
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    filterProducts();
  }, [productCode]);

  useEffect(() => {

    const handleKeyDown = (e) => {
      const totalItems = filteredProducts.length + 2; //+2 for create, back

      if (e.key === "ArrowDown") {
        if (selectedIndex < totalItems - 1){  // Ensure we don't go beyond the last item
          setSelectedIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % totalItems;
            if (newIndex >= 2 && newIndex - 2 >= startIndex + ITEMS_PER_PAGE){
              setStartIndex((prevStartIndex) => {
                const newStartIndex = Math.min(filteredProducts.length - ITEMS_PER_PAGE, prevStartIndex + 1);
                setRemainingItemsCount(filteredProducts.length - (newStartIndex + ITEMS_PER_PAGE));
                return newStartIndex;
              });
            }
            return newIndex;
          })
        }
      } else if (e.key === "ArrowUp") {
        if (selectedIndex > 0){  // Ensure we don't go before the "Create" link
          setSelectedIndex((prevIndex) => {
            const newIndex = (prevIndex - 1 + totalItems) % totalItems;
            if (newIndex >= 2 && newIndex - 2 < startIndex){
              setStartIndex((prevStartIndex) => {
                const newStartIndex = Math.max(0, prevStartIndex - 1);
                setRemainingItemsCount(filteredProducts.length - (newStartIndex + ITEMS_PER_PAGE));
                return newStartIndex;
              })
            }
            e.preventDefault();
            return newIndex;
          })
        }
      } else if (e.key === "Enter") {

        if (selectedIndex === 0) {
          navigate('/create/product');
          e.preventDefault();
        } else if (selectedIndex === 1) {
          navigate('/display');
          e.preventDefault();

        } else if (filteredProducts[selectedIndex - 2]) {
          navigate(`/displayProduct/${filteredProducts[selectedIndex - 2].productCode}`); //Navigate to the selected product
        }
      } else if (e.key === 'Escape') {
        navigate('/display');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredProducts, selectedIndex, navigate, startIndex]);


  useEffect(() => {
    if (selectedRef.current){
      selectedRef.current.scrollIntoView({behavior: 'smooth', block: 'nearest'});

    }
  },[selectedIndex]);

  const filterProducts = () => {
    let filtered = product.filter((prod) => 
    prod.productCode.toLowerCase().includes(productCode.toLowerCase())
    );

    setFilteredProducts(filtered);
    setStartIndex(0);
    setRemainingItemsCount(filtered.length - ITEMS_PER_PAGE);
    setSelectedIndex(2); //Reset selected index to the first element in the filtered list
  };


  const displayedProducts = filteredProducts.slice(
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
                Product Display
              </p>
              <input
                type="text"
                id="productCode"
                name="productCode"
                value={productCode}
                onChange={e => setProductCode(e.target.value)}
                ref={inputRef}
                className="w-[250px] ml-2 mt-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-none"
                autoComplete="off"
              />
            </div>

            <div className="w-[350px] h-[85vh] border border-gray-600 bg-[#def]">

              <h2 className="p-1 bg-[#2a67b1] text-white text-left text-[13px]">
                List of Products
              </h2>
                <div className="border border-b-gray-500 w-[347px]">
                  <Link
                    className={`block text-center text-[13px] focus:bg-[#FEB941] outline-none ${
                      selectedIndex === 0 ? "bg-[#FEB941]" : ""

                    }`}
                    to={'/create/product'}
                  >
                    <p className="ml-[285px] text-[13px]">Create</p>
                  </Link>

                  <Link

                    className={`block text-center text-[13px] focus:bg-[#FEB941] outline-none ${
                      selectedIndex === 1 ? "bg-[#FEB941]" : ""

                    }`}
                    to={'/display'}
                  >
                    <p className="ml-[287px] ">Back</p>
                  </Link>
                </div>

                <div className="h-[68.5vh] overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedProducts.map((prod, index) => (
                        <tr
                          key={prod.productCode}
                          className={
                            selectedIndex === index + 2 + startIndex ? "bg-[#FEB941]" : ""
                          }
                          ref={selectedIndex === index + 2 + startIndex ? selectedRef : null}
                        >
                          <td className="w-full text-[12.5px]">
                            <Link
                              className={`block w-full text-left pl-2 text-[13px] ${selectedIndex === index + 2 + startIndex ? 'bg-[#FEB941]' : ''}`}
                              to={`/displayProduct/${prod.productCode}`}
                            >
                              {prod.productCode} - {prod.description}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredProducts.length > ITEMS_PER_PAGE && (
                <div className='text-left p-2 bg-[#2a67b1]'>
                <p className='text-white text-[13px]'>Remaining: {remainingItemsCount} products</p>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFilter;
