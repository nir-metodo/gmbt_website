// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import CreditCardInfo from "./CreditCardInfo";
// import "./Payment.css";
// import { FaCcVisa, FaCcMastercard } from 'react-icons/fa'; // FontAwesome Icons
// import { IoIosCheckmarkCircleOutline } from "react-icons/io";
// import { MdOutlinePayment } from "react-icons/md";
// import Swal from 'sweetalert2';
// import LoadingOverlay from './LoadingOverlay'; // Adjust the path if needed

// const Payment = ({ plan, hasSim, nextStep, prevStep, userEmail, organizationPhoneNumber, companyInfo, forwardingPhoneNumber, paymentCycle }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [showModal, setShowModal] = useState(false); // Control modal visibility
//   const [cardDetails, setCardDetails] = useState(null);
//   const [onboardData, setOnboardData] = useState({}); // Initialize as an empty object to avoid overwriting

//   // Mapping Prices
//   const planPrices = {
//     Basic: 199,
//     Premium: 399,
//     Enterprise: 1199,
//   };

//   const simPrice = paymentCycle === "monthly" ?  35 : 35*12;

//   // Calculate Total Price Correctly
//   useEffect(() => {
//     const basePlanPrice = planPrices[translatePlanName(plan)] || 0;
//     const simCharge = !hasSim ? simPrice : 0;
  
//     // If the payment cycle is yearly, apply 10% discount and calculate yearly price
//     if (paymentCycle === "yearly") {
//       const yearlyPrice =Math.floor(basePlanPrice * 0.9) * 12; // Apply discount to yearly plan
//       setTotalAmount(Math.floor(yearlyPrice) + simCharge); // Round down the yearly price
//     } else {
//       setTotalAmount(Math.floor(basePlanPrice) + simCharge); // Monthly price
//     }
//   }, [plan, hasSim, paymentCycle]); // Add paymentCycle to the dependency array

//   const translatePlanName = (planName) => {
//     switch (planName) {
//       case "בסיס":
//         return "Basic";
//       case "פרימיום":
//         return "Premium";
//       case "ארגונים":
//         return "Enterprise";
//       default:
//         return planName;  // If no match, return the original name
//     }
//   };
//   console.log(totalAmount);
//   console.log(planPrices[translatePlanName(plan)]);
//   // Construct onboardData once all necessary information is available
//   useEffect(() => {
    
//     if (plan && companyInfo && organizationPhoneNumber) {
//       const basePlanPrice = planPrices[translatePlanName(plan)] || 0;
//       const yearlyPrice = Math.floor(basePlanPrice * 0.9) * 12; // Apply discount to yearly plan
//       console.log(yearlyPrice);
//     // Calculate price based on payment cycle
//     const calculatedPlanPrice = paymentCycle === "yearly"
//       ? yearlyPrice // Apply 10% discount for yearly
//       : basePlanPrice;
//       const data = {
//         plan: translatePlanName(plan),
//         forwardingPhoneNumber: forwardingPhoneNumber,
//         totalAmount,
//         payEach : paymentCycle,
//         planPrice : calculatedPlanPrice,
//         // planPrice: planPrices[translatePlanName(plan)] || 0,
//         customerEmail: companyInfo.contactEmail,
//         companyInfo: {
//           companyName: companyInfo.companyName,
//           organizationName: companyInfo.organizationName,
//           companyUrl: companyInfo.companyUrl,
//           companyPhoneNumber: companyInfo.contactPhoneNumber,
//           companyId: companyInfo.idNumber,
//           timezone: companyInfo.timezone,
//         },
//         contactInfo: {
//           contactFullName: companyInfo.contactFullName,
//           contactEmail: companyInfo.contactEmail,
//           contactPhoneNumber: companyInfo.contactPhoneNumber,
//         },
//         simInfo: {
//           hasSim,
//           selectedSimNumber: !hasSim ? organizationPhoneNumber.replace('+', '') : '',
//           simNumberEntered: organizationPhoneNumber.replace('+', ''),
//         },
//       };
//       setOnboardData(data); // Merge new data with the existing onboardData
//     }
//   }, [plan, hasSim, companyInfo, organizationPhoneNumber, totalAmount, userEmail, forwardingPhoneNumber]);

//   const handleModalClose = () => setShowModal(false);
//   const handleModalOpen = () => setShowModal(true);

//   const handleSubmit = async (cardDetails, onboardData) => {
//     setCardDetails(cardDetails);
//     setShowModal(false); // Close modal after submission

//     // Merge the card details into onboardData before sending to backend
//     const dataToSubmit = { ...onboardData, cardDetails };
//     setIsLoading(true); // Start loading

//     try {
//       const response = await axios.post("/api/Webhooks/createNewSubscription", dataToSubmit);
//       if (response.data.creditCardResponse?.message === "Success") {
//         alert("Payment Successful!");
//         nextStep(); // Go to next step after payment
//       } else {
//         nextStep();
//       }
//     } catch (error) {
//       console.error("Payment Error:", error);
//       nextStep();
//     } finally {
//       setIsLoading(false); // Stop loading
//     }
//   };

//   const handleNextStep = () => {
//     nextStep();
//   };

//   return (
//     <div className="payment-container">
//       <LoadingOverlay loading={isLoading}></LoadingOverlay>
//       <h2 className="payment-container-header">סיכום תשלום</h2>

//       <p className="payment-container-plan-info">
//         <IoIosCheckmarkCircleOutline className="checkmark-icon" />
//         <strong>התכנית הנבחרת:</strong> <u>{plan}</u>
//       </p>
//       <p className="payment-container-plan-info">
//         <IoIosCheckmarkCircleOutline className="checkmark-icon" />
//         <strong>עלות התכנית:</strong>
//         <span className="plan-price-info">
//           {paymentCycle === "yearly"
//     ? Math.floor(planPrices[translatePlanName(plan)] * 0.9) // Apply 10% discount to yearly price
//     : planPrices[translatePlanName(plan)]}₪ {"לחודש"}
//         </span>
//       </p>
//       {!hasSim && (
//         <p className="payment-container-sim-price">
//           <IoIosCheckmarkCircleOutline className="checkmark-icon" />
//           <strong>עלות סים:</strong> <span>{simPrice}₪</span> לחודש.
//         </p>
//       )}
//       <p className="payment-container-total-amount">
//         <IoIosCheckmarkCircleOutline className="checkmark-icon" />
//         <strong> <u>סה"כ לתשלום:</u></strong> {totalAmount}₪ {paymentCycle === "monthly" ? "לחודש" : "לשנה"}.
//       </p>
//       <p className="payment-vat-disclaimer">
//        המחירים המוצגים לא כוללים מע"מ*
//       </p>

//       <button className="payment-container-purchase-btn" onClick={handleModalOpen}>
//         <span>הזנת פרטי תשלום</span>
//         <MdOutlinePayment className="payment-icon" />
//       </button>

//       {showModal && (
//         <CreditCardInfo
//           handleClose={handleModalClose}
//           handleSubmit={handleSubmit} // Send the function
//           onboardData={onboardData} // Send onboard data
//         />
//       )}

//       <div className="payment-container-button-container">
//       <button className="payment-container-next-button" onClick={handleNextStep}>הבא</button>
//         <button className="payment-container-prev-button" onClick={prevStep}>
//           הקודם
//         </button>

//       </div>
//     </div>
//   );
// };

// export default Payment;
