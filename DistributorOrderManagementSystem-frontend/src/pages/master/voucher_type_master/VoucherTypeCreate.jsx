import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const VoucherTypeCreate = () => {
	const [voucherType, setVoucherType] = useState({
		name: "",
		type: "",
		status: "",
		startingNumber: "",
		widthOfNumerical: "",
		prefillWithZero: "",
		applicableFrom: "",
		periodicity: "",
		prefix: "",
		suffix: "",
	});
	const inputRefs = useRef([])
	const [showModal, setShowModal] = useState(false);
	const navigate = useNavigate();
	const yesQuitButtonRef = useRef(null);
	const cancelModalConfirmRef = useRef(null);
	// const [VoucherNo, setVoucherNo] = useState("")

	// const generateVoucherNo = (voucherType)=>{
	// 	let {prefillWithZero, prefix, suffix, startingNumber, widthOfNumerical} = voucherType;
	// 	startingNumber = startingNumber.toString();

	// 	if(prefillWithZero.toLowerCase() === 'yes' && widthOfNumerical){
	// 		startingNumber = startingNumber.padStart(widthOfNumerical, '0')
	// 	}
	// 	const voucherNo = `${prefix}-${startingNumber}${suffix ? "-" + suffix : ""}`;

    // return voucherNo;

	// }

	const changeHandler = (e) => {
		const { name, value } = e.target;
		setVoucherType({ ...voucherType, [name]: value });
	};
	
	// useEffect(()=>{
	// 	setVoucherNo(generateVoucherNo(voucherType))
	// },[voucherType])
	const handleKeyDown = (e, index)=>{
		const key = e.key;
		if(key === 'Enter'){
			if (e.target.value.trim() !== "") {
				const nextField = index + 1;
				if (nextField < inputRefs.current.length) {
					inputRefs.current[nextField].focus();
				}
			} else {
				e.preventDefault();
			}
		} else if (key === 'Backspace'){
			if (e.target.value.trim() === "") {
				const prevField = index - 1;
				if (prevField >= 0) {
					inputRefs.current[prevField].focus();
				}
			}
		}
	}

	const handleSubmit = async (e) =>{
		
		if(e.key === 'Enter'){
			e.preventDefault();
			const userConfirmed = window.confirm("Do you want confirm VoucherTYpe");
			if(userConfirmed){
			await axios.post("http://localhost:9080/generate/saveVoucher", voucherType);
			console.log(voucherType)
			}
		}
	};

	useEffect(() => {
		const handleModalFunc = event => {
			const {ctrlKey, key} = event;
			if ((ctrlKey && key === 'q') || key === 'Escape') {
				event.preventDefault();
				setShowModal(true);
			}
		};
		
		document.addEventListener('keydown',handleModalFunc);
		return () => document.removeEventListener('keydown',handleModalFunc);
	},[]);

	useEffect(() => {
		if (showModal) {
		  yesQuitButtonRef.current.focus();
		  const handleModalKeyDown = event => {
			if (event.key.toLowerCase() === 'y') {
			  handleModalConfirm();
			} else if (event.key === 'n') {
			  handleModalClose();
			} else if (event.key === 'ArrowLeft') {
			  cancelModalConfirmRef.current.focus();
			} else if (event.key === 'ArrowRight') {
			  yesQuitButtonRef.current.focus();
			}
		  };
	
		  document.addEventListener('keydown', handleModalKeyDown);
	
		  return () => {
			document.removeEventListener('keydown', handleModalKeyDown);
		  };
		}
	  }, [showModal]);

	const handleModalClose = () => {
		setShowModal(false);

	// Check if the inputRefs array has the first input element
	if (inputRefs.current[0]) {
		inputRefs.current[0].focus();
	}
	};

	const handleModalConfirm = () => {
		navigate('/create');
	}
	
	return (
		<>
			<div className="flex justify-evenly">
				<div className=" w-[90%] h-screen">
				<form action="" onSubmit={e => e.preventDefault()}>
					<div className="bg-[#88bee6] w-full h-4 flex justify-between">
						<h1 className="text-[11px] pl-2 font-semibold">
							Voucher Type Creation
						</h1>
						<HiXMark
							className="text-[12px] text-base cursor-pointer"
							onClick={() => navigate("/create")}
						/>
					</div>

					<div className="w-1/2  mt-2 px-1">
						<div className=" flex leading-4">
							<label htmlFor="voucherType" className="w-1/5 text-[13px]">
								Name
							</label>
							<span className="mr-1">:</span>
							<input
								type="text"
								id="voucherType"
								autoCapitalize="words"
								autoComplete="off"
								autoFocus
								onChange={changeHandler}
								name="name"
								onKeyDown={(e) => handleKeyDown(e, 0)}
								value={voucherType.name}
								ref={(input) => (inputRefs.current[0] = input)}
								className="w-1/4 capitalize border border-transparent outline-0 h-[18px] focus:border focus:border-blue-500 focus:bg-amber-100 text-[13px] font-semibold"
							/>
						</div>
						<div>
							<div className=" mt-5 border-t text-[13px] text-center font-semibold w-1/2">
								<h1>General</h1>
							</div>
							<div className=" flex leading-4 mt-2">
								<label htmlFor="voucherType" className="w-2/5 text-[14px]">
									Select type of voucher
								</label>
								<span className="mr-1">:</span>
								<input
									type="text"
									ref={(input) => (inputRefs.current[1] = input)}
									id="voucherType"
									autoCapitalize="words"
									autoComplete="off"
									onChange={changeHandler}
									onKeyDown={(e) => handleKeyDown(e, 1)}
									name="type"
									value={voucherType.type}
									className="w-1/4 capitalize border border-transparent outline-0 h-[18px] focus:border focus:border-blue-500 focus:bg-amber-100 text-[13px] font-semibold"
								/>
							</div>
							<div className=" flex leading-4 mt-1">
								<label htmlFor="voucherType" className="w-2/5 text-[14px]">
									Activate this Voucher Type
								</label>
								<span className="mr-1">:</span>
								<input
									ref={(input) => (inputRefs.current[2] = input)}
									type="text"
									id="voucherType"
									autoCapitalize="words"
									onChange={changeHandler}
									name="status"
									onKeyDown={(e) => handleKeyDown(e, 2)}
									value={voucherType.status}
									autoComplete="off"
									className="w-24 capitalize border border-transparent outline-0 h-[18px] focus:border focus:border-blue-500 focus:bg-amber-100 text-[13px] font-semibold"
								/>
							</div>
							<div>
								<div className="flex leading-4 mt-1">
									<label htmlFor="" className="w-2/5 text-[14px]">
										Starting Number
									</label>
									<span className="mr-1">:</span>
									<input
										ref={(input) => (inputRefs.current[3] = input)}
										type="text"
										onChange={changeHandler}
										autoComplete="off"
										onKeyDown={(e) => handleKeyDown(e, 3)}
										name="startingNumber"
										value={voucherType.startingNumber}
										className="w-24 capitalize border border-transparent outline-0 h-[18px] focus:border focus:border-blue-500 focus:bg-amber-100 text-[13px] font-semibold"
									/>
								</div>
								<div className="flex leading-4 mt-1">
									<label htmlFor="" className="w-2/5 text-[14px]">
										Width of Numerical part
									</label>
									<span className="mr-1">:</span>
									<input
										ref={(input) => (inputRefs.current[4] = input)}
										type="text"
										onChange={changeHandler}
										autoComplete="off"
										onKeyDown={(e) => handleKeyDown(e, 4)}
										name="widthOfNumerical"
										value={voucherType.widthOfNumerical}
										className="w-24 capitalize border border-transparent outline-0 h-[18px] focus:border focus:border-blue-500 focus:bg-amber-100 text-[13px] font-semibold"
									/>
								</div>
								<div className="flex leading-4 mt-1">
									<label htmlFor="" className="w-2/5 text-[14px]">
										Prefill with Zero
									</label>
									<span className="mr-1">:</span>
									<input
										ref={(input) => (inputRefs.current[5] = input)}
										type="text"
										onChange={changeHandler}
										autoComplete="off"
										onKeyDown={(e) => handleKeyDown(e, 5)}
										name="prefillWithZero"
										value={voucherType.prefillWithZero}
										className="w-24 capitalize border border-transparent outline-0 h-[18px] focus:border focus:border-blue-500 focus:bg-amber-100 text-[13px] font-semibold"
									/>
								</div>
								<div className="flex leading-4 mt-1">
									<label htmlFor="" className="w-2/5 text-[14px]">
										Applicable From
									</label>
									<span className="mr-1">:</span>
									<input
										ref={(input) => (inputRefs.current[6] = input)}
										type="text"
										onChange={changeHandler}
										onKeyDown={(e) => handleKeyDown(e, 6)}
										autoComplete="off"
										name="applicableFrom"
										value={voucherType.applicableFrom}
										className="w-24 capitalize border border-transparent outline-0 h-[18px] focus:border focus:border-blue-500 focus:bg-amber-100 text-[13px] font-semibold"
									/>
								</div>
								<div className="flex leading-4 mt-1">
									<label htmlFor="" className="w-2/5 text-[14px]">
										Periodicity
									</label>
									<span className="mr-1">:</span>
									<input
										ref={(input) => (inputRefs.current[7] = input)}
										onKeyDown={(e) => handleKeyDown(e, 7)}
										type="text"
										onChange={changeHandler}
										autoComplete="off"
										name="periodicity"
										value={voucherType.periodicity}
										className="w-24 capitalize border border-transparent outline-0 h-[18px] focus:border focus:border-blue-500 focus:bg-amber-100 text-[13px] font-semibold"
									/>
								</div>
								<div className="flex leading-4 mt-1">
									<label htmlFor="" className="w-2/5 text-[14px]">
										Prefix Particular
									</label>
									<span className="mr-1">:</span>
									<input
										ref={(input) => (inputRefs.current[8] = input)}
										type="text"
										onChange={changeHandler}
										onKeyDown={(e) => handleKeyDown(e, 8)}
										autoComplete="off"
										name="prefix"
										autoCapitalize="words"
										value={voucherType.prefix}
										className="w-24 capitalize border border-transparent outline-0 h-[18px] focus:border focus:border-blue-500 focus:bg-amber-100 text-[13px] font-semibold"
									/>
								</div>
								<div className="flex leading-4 mt-1">
									<label htmlFor="" className="w-2/5 text-[14px]">
										Suffix Particular (optional)
									</label>
									<span className="mr-1">:</span>
									<input
										ref={(input) => (inputRefs.current[9] = input)}
										type="text"
										onChange={changeHandler}
										autoComplete="off"
										name="suffix"
										autoCapitalize="words"
										onKeyDown={(e) => {handleSubmit(e); if (e.key === 'Backspace' && e.target.value === ''){e.preventDefault(); if (inputRefs.current[8] && inputRefs.current[8].focus){
											inputRefs.current[8].focus();
										}}}}
										value={voucherType.suffix}
										className="w-24 capitalize border border-transparent outline-0 h-[18px] focus:border focus:border-blue-500 focus:bg-amber-100 text-[13px] font-semibold"
									/>
								</div>
							</div>
						</div>
					</div>
					</form>
				</div>
				{/* Modal */}
				{showModal && (
					<div className="fixed z-10 inset-0 overflow-y-auto">
						<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
						<div className="fixed inset-0 transition-opacity" aria-hidden="true">
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
								<h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
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
									onClick={handleModalConfirm}
									ref={yesQuitButtonRef}
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
				
				<div className="w-[10%] bg-[#def1fc]"></div>
			</div>
		</>
	);
};
export default VoucherTypeCreate;
