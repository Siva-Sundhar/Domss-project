
import { useEffect, useRef, useState } from "react";
import axios from "axios";
const VoucherCreation = () => {


	const [voucherType] = useState("Order Booking");
	const [distributorName, setDistributorName] = useState("");
	const [voucherNo, setVoucherNo] = useState("");
	const [vDate, setVDate] = useState("");
	const [distributorCode, setDistributorCode] = useState("");
	const [tableData, setTableData] = useState([
		{
			category: "",
			code: "",
			description: "",
			orderQty: "",
			uom: "",
			approvedQuantity: "",
			rate: "",
			discount: "",
			amount: ""
		},
	]);
	const [createdBy, setCreatedBy] = useState("")
	const [approvedBy, setApprovedBy] = useState("")
	const [narration, setNarration] = useState("");

	const [category] = useState([
		"Cream",
		"Hair Cream",
		"Body Splash",
		"Perfume",
		"Jelly",
		"Lotion",
		"Powder",
		"Luxury Perfume",
		"Soap",
	]);
	const [distributorData, setDistributorData] = useState([]);
	const [productData, setProductData] = useState([]);
	const [prodFilter, setProdFilter] = useState([]);
	const [showDistributor, setShowDistributor] = useState(false)
	const [showProdList, setShowProdList] = useState(false);
	const [showList, setShowList] = useState(false);
	const [filteredOption, setFilteredOption] = useState(category);
	const [selectIndexCat, setSelectIndexCat] = useState(0);
	const [selectIndexProd, setSelectIndexProd] = useState(0);
	const [selectIndex, setSelectIndex] = useState(0);
	const [selectIndexDist, setSelectIndexDist] = useState(0);
	const [focusedRow, setFofusedRow] = useState(null);
	const [total, setTotal] = useState("")

	const inputRefs = useRef([]);
	const listRefs = useRef([]);
	const tableRefs = useRef([])

	const filterDisplay = tableData.length > 1 ? ["♦ End of List",...filteredOption] : filteredOption;

	useEffect(() => {
		loadCategory();
		loadRegion();
	}, []);

	const loadCategory = async () => {
		const response = await axios.get("http://localhost:9080/products/allProducts");
		setProductData(response.data);
		console.log(productData);
	};

	const loadRegion = async ()=>{
		const response = await axios.get("http://localhost:9080/ledgerMasterApi/allLedgers")

		setDistributorData(response.data);
	}

	useEffect(() => {
		if (selectIndex >= 0 && listRefs.current[selectIndex]) {
			listRefs.current[selectIndex].scrollIntoView({
				behavior: "auto",
				block: "end",
				inline: "nearest"
			});
			
		}else if(selectIndexDist >= 0 && listRefs.current[selectIndexDist]){
			listRefs.current[selectIndexDist].scrollIntoView({
				behavior: "auto",
				block: "end",
				inline: "nearest"
				});
		}
	}, [selectIndex, selectIndexDist]);

	const handleFilter = (item) => {
		const filteredData = productData.filter(
			(prod) => prod.stockGroup.toLowerCase() === item.toLowerCase()
		);

		setProdFilter(filteredData);
	};

	const handleSelect = (property, item, rowIndex) => {
		const newTableData = [...tableData];
		if (property === "category") {
			newTableData[rowIndex][property] = item;
			newTableData[rowIndex].code = "";
			newTableData[rowIndex].description = "";
			newTableData[rowIndex].uom = "";
			newTableData[rowIndex].orderQty="";
			newTableData[rowIndex].rate = "";
			newTableData[rowIndex].discount = "";
			newTableData[rowIndex].approvedQuantity = "";
			newTableData[rowIndex].amount = "";
			setTableData(newTableData);
			setShowList(false);
			if(item !=="♦ End of List"){
				handleFilter(item);
				setShowProdList(true);	
			}		
			
		} else if (property === "code") {
			const option = item;
			newTableData[rowIndex].code = option.productCode;
			newTableData[rowIndex].description = option.description;
			newTableData[rowIndex].uom = option.uom;
			newTableData[rowIndex].rate = parseFloat(option.sellingPrice).toFixed(2);
			newTableData[rowIndex].discount = parseFloat(option.discount).toFixed(2);
			setTableData(newTableData);
			setShowProdList(false);
		}
	};

	const handleDistributorSelect = (e)=>{
		if(selectIndexDist < distributorData.length){
			if(e.key === "ArrowUp" && selectIndexDist > 0){
				setSelectIndexDist((prev) => prev - 1);
			} else if(e.key === "ArrowDown" && selectIndexDist < distributorData.length - 1){
				setSelectIndexDist((prev) => prev + 1);
			} else if(e.key === "Enter" && selectIndexDist >= 0){
				handleDistributor(distributorData[selectIndexDist]);
				setShowDistributor(false)
				tableRefs.current[0].focus();
			}
		}
	}
	
	const handleDistributor = (item)=>{
		setDistributorName(item.ledgerName)
		setDistributorCode(item.ledgerCode)
	}

	const handleTotal = (e, index) => {
		const { value } = e.target;
		if (value) {
			const total = parseFloat(value * tableData[index].rate).toFixed(2);
			const discount = parseFloat(
				(total * tableData[index].discount) / 100
			).toFixed(2);
			const price = parseFloat(total - discount).toFixed(2);
			tableData[index].amount = price;
			setTableData([...tableData]);
		}
	};

	const handleKeySelect = (e, rowIndex, options, property) => {
		
		if (selectIndex < options.length) {
			if (e.key === "ArrowUp" && selectIndex > 0) {
				if (property === "category") {
					setSelectIndexCat((prev) => prev - 1);
					setSelectIndex((prev) => prev - 1);
				} else {
					setSelectIndexProd((prev) => prev - 1);
					setSelectIndex((prev) => prev - 1);
				}
			} else if (e.key === "ArrowDown" && selectIndex < options.length - 1) {
				if (property === "category") {
					setSelectIndexCat((prev) => prev + 1);
					setSelectIndex((prev) => prev + 1);
				} else {
					setSelectIndexProd((prev) => prev + 1);
					setSelectIndex((prev) => prev + 1);
				}
			} else if (e.key === "Enter" && selectIndexCat >= 0) {
				e.preventDefault();
					handleSelect(property, options[selectIndex], rowIndex);
					if(property === 'category' && tableData[rowIndex].category === "♦ End of List"){
						inputRefs.current[3].focus()
						
					} else {
						tableRefs.current[rowIndex * 10 + (property === 'category' ? 1 : 2)]?.focus();
					}
			} else if (e.key === "Tab") {
				e.preventDefault();
			}
		} else {
			setSelectIndex(0);
		}
	};

	const handleFocus = (property, index) => {
		if (property === "category") {
			setSelectIndex(selectIndexCat)
			setShowList(true);
			setFofusedRow(index)
		}
		if (property === "code") {
			setSelectIndex(selectIndexProd);
			setShowProdList(true);
			setFofusedRow(index)
		}

	};

	const handleChange = (e, index) => {
		const { name, value } = e.target;
		const list = [...tableData];
		list[index][name] = value;
		setTableData(list);
		if (name === "category") {
			const filteredList = category.filter((item) =>
				item.toLowerCase().includes(e.target.value.toLowerCase())
			);
			setFilteredOption(filteredList);
		}
		if (name === "code" && list[index].category) {
			const filteredList = productData.filter(
				(item) =>
					item.productCode
						.toLowerCase()
						.includes(e.target.value.toLowerCase()) &&
					item.stockGroup === list[index].category
			);
			setProdFilter(filteredList);
		}
		
	};

	const handleBlur = (e, index) => {
		const { name, value } = e.target;
		const list = [...tableData];
		if (name === "orderQty" || name === "approvedQuantity") {
			if (!isNaN(value) && value !== "") {
				list[index][name] = parseFloat(value).toFixed(2);
			}
		}
		setTableData(list);
	};

	const handleKeyPress = (e, rowIndex, colIndex, isTable) => {
		if (e.key === "Enter" && e.target.value.trim() !== "") {
			e.preventDefault();

			if (isTable) {
				const nextField = rowIndex * 10 + colIndex + 1;
				if (
					nextField < tableRefs.current.length &&
					tableRefs.current[nextField]
				) {
					
					tableRefs.current[nextField].focus();
					
				} else {
					if (rowIndex === tableData.length - 1) addRow();
					else {
						tableRefs.current[(rowIndex + 1) * 10].focus();
					}
				}
			} else {
				const fieldIndex = rowIndex + 1;
				if (fieldIndex < inputRefs.current.length) {
						inputRefs.current[fieldIndex]?.focus();
					
				}
			}
		}
	};

	const addRow = () => {
		setTableData((prevData) => [
			...prevData,
			{
				category: "",
				code: "",
				description: "",
				orderQty: "",
				uom: "",
				approvedQuantity: "",
				rate: "",
				discount: "",
				amount: "",
			},
		]);
		setTimeout(()=>{
			const newRowIndex = tableData.length;
			tableRefs.current[ newRowIndex * 10].focus();
			setFilteredOption(category)

		},0)
	};
	
	const convertDateFormat = (dateString) => {
		const formattedDate = dateString.replace(/[./]/g, "-");

		const parts = formattedDate.split("-");
		const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");

		return `${year}-${month}-${day}`;
	};

	const handleSubmit = async () => {
		const voucherDate = convertDateFormat(vDate)
		const orderItems = tableData.filter((item)=>{
			return item.category !== "♦ End of List" 
		}
			
		)
		try {
			// Prepare data to send to the server
			const formData = {
				voucherType,
				voucherNo,
				distributorName,
				voucherDate,
				distributorCode,
				createdBy,
				approvedBy,
				narration,
				orderItems
			};
			// Handle response if needed
			await axios.post("http://localhost:9080/orders/booking", formData);
			console.log(formData)
		} catch (error) {
			
			console.error("Error:", error);
		}
	};

	const handleKeyDown = (e)=>{

		if(e.key === 'Enter'){
			e.preventDefault();
			if(e.target.value !== ""){
				const userConfirmed = window.confirm("Do you want confirm order");
				if(userConfirmed)
					handleSubmit();
			}
		}
	}
	return (
		<>
			<form
				className=" h-screen relative bg-[#f3ffe9]"
				onSubmit={(e)=>e.preventDefault()}
			>
				<div className="flex justify-between ">
					<div className="flex leading-4 py-2 px-1">
						<label htmlFor="voucherType" className="w-28 text-[14px] ">
						Voucher Type
						</label>
						<div className="mr-0.5">:</div>

						<div className="w-72 h-[18px] pl-0.5 font-semibold text-[13px] border border-fuchsia-700 outline-0 bg-transparent">
							{voucherType}
						</div>
					</div>
					<div className="flex leading-4 py-2 ">
						<label htmlFor="vno" className="w-32 text-[14px]">
							Voucher No
						</label>
						<div className="mr-0.5">:</div>
						<input
							ref={(el) => (inputRefs.current[0] = el)}
							autoComplete="off"
							onChange={(e) => setVoucherNo(e.target.value)}
							name="voucherNo"
							value={voucherNo}
							type="text"
							id="vno"
							onKeyDown={(e) => handleKeyPress(e, 0, null, false)}
							className=" w-2/3 border border-fuchsia-700 h-[18px] focus:bg-[#fee8af] focus:border-blue-500 text-[13px] pl-0.5 bg-transparent outline-0 font-semibold"
						/>
					</div>
					<div className="flex leading-4 py-2 px-1">
						<label htmlFor="vdate" className="w-[100px] text-[14px]">
							Voucher Date
						</label>
						<div className="mr-0.5">:</div>
						<input
							ref={(el) => (inputRefs.current[1] = el)}
							id="vdate"
							autoComplete="off"
							name="vDate"
							onChange={(e) => setVDate(e.target.value)}
							onKeyDown={(e) => handleKeyPress(e, 1, null, false)}
							value={vDate}
							placeholder="DD-MM-YYYY"
							type="text"
							className="w-24 border border-fuchsia-700 h-[18px] focus:bg-[#fee8af] focus:border-blue-500 text-[13px] pl-0.5 bg-transparent outline-0 font-semibold"
						/>
					</div>
				</div>

				<div className="flex justify-between mb-3">
					<div className="flex leading-4 px-1">
						<label htmlFor="dn" className="w-28 text-[14px]">
							Ditributor Name
						</label>
						<div className="mr-0.5">:</div>
						<input
							ref={(el) => (inputRefs.current[2] = el)}
							autoComplete="off"
							onChange={(e) => setDistributorName(e.target.value)}
							value={distributorName}
							type="text"
							onFocus={() => setShowDistributor(true)}
							onBlur={() => setShowDistributor(false)}
							id="dn"
							onKeyDown={handleDistributorSelect}
							className="w-72 border border-fuchsia-700 h-[18px] focus:bg-[#fee8af] focus:border-blue-500 text-[13px] pl-0.5 bg-transparent outline-0 font-semibold"
						/>
						{showDistributor && (
							<div className="absolute top-0 right-0 bg-[#def1fc] w-[350px] z-10 h-[560px] overflow-y-scroll">
								<ul onMouseDown={(e) => e.preventDefault()} tabIndex="-1">
									<h1 className="bg-[#2a67b1] text-white pl-2 text-sm sticky top-0">
										List of Distributors
									</h1>
									{distributorData.map((item, index) => (
										<li
											key={index}
											tabIndex="0"
											className={`pl-2 cursor-pointer text-sm ${
												selectIndexDist === index ? "bg-[#ff9a00]" : ""
											}`}
											onClick={() => {
												handleDistributor(item);
												tableRefs.current[0].focus();
											}}
											ref={(el) => (listRefs.current[index] = el)}
										>
											<>
												{item.ledgerCode} - {item.ledgerName}
											</>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
					<div className="leading-4 hidden">
						<label htmlFor="gm" className="w-32 text-[14px]">
							Godown Master
						</label>
						<div className="mr-0.5">:</div>
						<input
							autoComplete="off"
							name="gmaster"
							// value={GodownMaster}
							type="text"
							id="gm"
							className=" w-2/3 border border-fuchsia-700 h-[18px] focus:bg-[#fee8af] focus:border-blue-500 text-[13px] pl-0.5 bg-transparent outline-0 font-semibold"
						/>
					</div>
					<div className="flex leading-4 px-1">
						<label htmlFor="dc" className="w-[100px] text-[14px]">
							Ditributor Code
						</label>
						<div className="mr-0.5">:</div>

						<span className="w-24 border border-fuchsia-700 h-[18px] focus:bg-[#fee8af] focus:border-blue-500 text-[13px] pl-0.5 bg-transparent outline-0 font-semibold">
							{distributorCode}
						</span>
					</div>
				</div>
				
				<div className="h-[78vh] w-full overflow-y-scroll pl-1 border">
					<table className="border-collapse border border-slate-300 ">
						<thead className=" bg-[#F9F3CC] text-[13px] border border-slate-300 font-semibold sticky top-0">
							<tr className="h-[17px] leading-4 border border-slate-300">
								<td className="w-[60px] text-center border border-slate-300">
									S.No
								</td>
								<td className="w-[120px] text-center border border-slate-300">
									Product Category
								</td>
								<td className="w-[100px] text-center border border-slate-300">
									Product Code
								</td>
								<td className="w-[500px] text-center border border-slate-300">
									Product Description
								</td>
								<td className="w-[80px] text-center border border-slate-300">
									Order Qty
								</td>
								<td className="w-[50px] text-center border border-slate-300">
									Uom
								</td>
								<td className="w-[96px] text-center border border-slate-300">
									Aprd Qty
								</td>
								<td className="w-[87px] text-center border border-slate-300">
									Rate
								</td>
								<td className="w-[60px] text-center border border-slate-300">
									Disct %
								</td>
								<td className="w-[100px] text-center border border-slate-300">
									Amount
								</td>
							</tr>
						</thead>
						<tbody>
							{tableData.map((data, rowIndex) => (
								<tr key={data.id} className=" text-[13px] h-[17px] leading-4">
									<td className="w-[60px] text-center border border-slate-300 bg-white">
										{rowIndex + 1}
									</td>
									<td className="w-[120px] text-left border border-slate-300 bg-white ">
										<input
											autoComplete="off"
											type="text"
											name="category"
											value={data.category}
											onChange={(e) => handleChange(e, rowIndex)}
											onKeyDown={(e) =>
												handleKeySelect(e, rowIndex, filterDisplay, "category")
											}
											onFocus={() => handleFocus("category", rowIndex)}
											onBlur={() => setShowList(false)}
											ref={(input) =>
												(tableRefs.current[rowIndex * 10 + 0] = input)
											}
											className="w-full outline-0 pl-0.5"
										/>
										{showList && (
											<div className="absolute bg-[#def1fc] w-48 top-[84px] right-2 text-left h-52">
												<h1 className="bg-[#2a67b1] text-white pl-2">
													List of Category
												</h1>
												<ul
													className=""
													tabIndex="-1"
													onMouseDown={(e) => e.preventDefault()}
												>
													{filterDisplay.map((cat, catIndex) => (
														<li
															tabIndex="0"
															key={catIndex}
															onClick={() => {
																handleSelect("category", cat, focusedRow);
																tableRefs.current[focusedRow * 10 + 1].focus();
																setSelectIndexCat(catIndex);
															}}
															ref={(el) => (listRefs.current[catIndex] = el)}
															className={`cursor-pointer ${
																selectIndex === catIndex ? "bg-[#ff9a00]" : ""
															} pl-1  text-[13px]`}
														>
															{cat}
														</li>
													))}
												</ul>
											</div>
										)}
									</td>
									<td className="w-[100px] text-center border border-slate-300 bg-white">
										<input
											autoComplete="off"
											type="text"
											name="code"
											value={data.code}
											onChange={(e) => handleChange(e, rowIndex)}
											onFocus={() => handleFocus("code", rowIndex)}
											onBlur={() => setShowProdList(false)}
											onKeyDown={(e) =>
												handleKeySelect(e, rowIndex, prodFilter, "code")
											}
											ref={(input) =>
												(tableRefs.current[rowIndex * 10 + 1] = input)
											}
											className="w-full outline-0 text-center"
										/>
										{showProdList && (
											<div className="absolute bg-[#def1fc] w-96 top-[84px] right-2 text-left h-[450px] overflow-y-scroll">
												<h1 className="bg-[#2a67b1] text-white pl-2 sticky top-0">
													List of Porduct
												</h1>
												<ul
													className=""
													tabIndex="-1"
													onMouseDown={(e) => e.preventDefault()}
												>
													{prodFilter.map((prod, prodIndex) => (
														<li
															tabIndex="0"
															key={prodIndex}
															onClick={() =>{
																handleSelect("code", prod, focusedRow)
																tableRefs.current[focusedRow * 10 + 2].focus();
															}
															}
															ref={(el) => (listRefs.current[prodIndex] = el)}
															className={`cursor-pointer ${
																selectIndex === prodIndex ? "bg-[#ff9a00]" : ""
															} pl-1  text-[13px]  border-b border-[#fff]`}
														>
															<>
																<>{prod.productCode} </>
															</>
															<>
																<span className="ml-1">
																	- {prod.description}
																</span>
															</>
														</li>
													))}
												</ul>
											</div>
										)}
									</td>
									<td className="w-[500px] pl-0.5 text-left border border-slate-300 bg-white">
										{data.description}
									</td>
									<td className="w-[80px] text-center border border-slate-300 bg-white">
										<input
											autoComplete="off"
											type="text"
											name="orderQty"
											value={data.orderQty}
											onChange={(e) => handleChange(e, rowIndex)}
											onBlur={(e) => {
												handleBlur(e, rowIndex);
											}}
											onKeyDown={(e) => handleKeyPress(e, rowIndex, 2, true)}
											ref={(input) =>
												(tableRefs.current[rowIndex * 10 + 2] = input)
											}
											className="w-full outline-0 text-right pr-0.5"
										/>
									</td>
									<td className="w-[50px] text-center border border-slate-300 bg-white ">
										{data.uom}
									</td>
									<td className="w-[96px] text-center border border-slate-300 bg-white">
										<input
											autoComplete="off"
											type="text"
											name="approvedQuantity"
											step="0.01"
											value={data.approvedQuantity}
											onChange={(e) => handleChange(e, rowIndex)}
											ref={(input) =>
												(tableRefs.current[rowIndex * 10 + 3] = input)
											}
											onKeyDown={(e) => handleKeyPress(e, rowIndex, 3, true)}
											onBlur={(e) => {
												handleTotal(e, rowIndex);
												handleBlur(e, rowIndex);
											}}
											className="w-full outline-0 text-right pr-0.5"
										/>
									</td>
									<td className="w-[87px] text-right pr-0.5 border border-slate-300 bg-white">
										{data.rate}
									</td>
									<td className="w-[60px] text-right pr-0.5 border border-slate-300 bg-white">
										{data.discount ? `${data.discount} %` : ""}
									</td>
									<td className="w-[100px] text-right pr-0.5 border border-slate-300 bg-white">
										{data.amount
											? Intl.NumberFormat("en-NG", {
													style: "currency",
													currency: "NGN",
													minimumFractionDigits: 2,
											})
													.formatToParts(data.amount)
													.map(({ type, value }) =>
														type === "currency" ? `${value} ` : value
													)
													.join("")
											: ""}
									</td>
								</tr>
							))}
							<tr>
								
							</tr>
						</tbody>
					</table>
				</div>

				<div className="w-full flex">
				<div className="w-3/4"></div>
				<div className="w-1/4 border-b-2">Total:</div>
				</div>
				<div className=" px-1 flex text-[14px] mt-3 w-full justify-between">
					<div className="w-[600px] flex justify-between ">
						<div className="flex leading-4 mb-1 w-[300px]">
							<label htmlFor="" className="w-[30%]">
								Created By
							</label>
							<span className="mr-0.5">:</span>
							<input
								autoComplete="off"
								name="createdBy"
								onChange={(e) => setCreatedBy(e.target.value)}
								value={createdBy}
								type="text"
								ref={(el) => (inputRefs.current[3] = el)}
								onKeyDown={(e) =>
									e.key === "Enter" &&
									e.target.value !== "" &&
									inputRefs.current[3].focus()
								}
								className="w-[65%] border border-fuchsia-700 h-[18px] focus:bg-[#fee8af] focus:border-blue-500 text-[13px] pl-0.5 bg-transparent outline-0 font-semibold"
							/>
						</div>

						<div className="flex leading-4 w-[300px]">
							<label htmlFor="" className="w-[30%]">
								Approved By
							</label>
							<span className="mr-0.5">:</span>
							<input
								autoComplete="off"
								name="approvedBy"
								onChange={(e) => setApprovedBy(e.target.value)}
								value={approvedBy}
								type="text"
								ref={(el) => (inputRefs.current[4] = el)}
								onKeyDown={(e) =>
									e.key === "Enter" &&
									e.target.value !== "" &&
									inputRefs.current[4].focus()
								}
								className="w-[65%] border border-fuchsia-700 h-[18px] focus:bg-[#fee8af] focus:border-blue-500 text-[13px] pl-0.5 bg-transparent outline-0 font-semibold"
							/>
						</div>
					</div>

					<div className="w-[550px] ">
					
						<div className="flex leading-4 ">
							<label htmlFor="" className="w-[11%]">
								Narration
							</label>
							<span className="mr-0.5">:</span>
							<input
								autoComplete="off"
								name="narration"
								value={narration}
								onChange={(e) => setNarration(e.target.value)}
								onFocus={(e)=>e.target.setSelectionRange(e.target.value.length, e.target.value.length,)}
								maxLength={75}
								type="text"
								onKeyDown={handleKeyDown}
								ref={(el) => (inputRefs.current[5] = el)}
								className="w-[89%] border border-fuchsia-700 h-[18px] focus:bg-[#fee8af] resize-none focus:border-blue-500 text-[13px] pl-0.5 bg-transparent outline-0 font-semibold"
							/>
						</div>
					</div>
				</div>
				
			</form>
		</>
	);
};

export default VoucherCreation;
