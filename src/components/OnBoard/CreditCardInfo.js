import React, { useState } from 'react';
import './CreditCardInfo.css';
import { FaCcVisa, FaCcMastercard } from 'react-icons/fa'; // FontAwesome Icons

const CreditCardInfo = ({ handleClose, handleSubmit , onboardData}) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolderName: '',
    expirationDate: '',
    cvv: '',
    cardHolderId: '',  // Added cardHolderId to the state
  });
  console.log(onboardData);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [error, setError] = useState('');
  const [cardNumberError, setCardNumberError] = useState('');
  const [cardTypeError, setCardTypeError] = useState('');
  const [expirationError, setExpirationError] = useState('');
  const [cvvError, setCvvError] = useState('');
  const [cardHolderError, setCardHolderError] = useState('');
  const [cardHolderIdError, setCardHolderIdError] = useState(''); // Added error for cardHolderId

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    value = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Insert space every 4 digits
    setCardDetails((prevState) => ({
      ...prevState,
      cardNumber: value,
    }));
  };

  const handleCardNumberBlur = () => {
    const cardNumber = cardDetails.cardNumber.replace(/\s/g, ''); // Remove spaces for validation
    if (cardNumber.length !== 13 && cardNumber.length !== 16) {
      setCardNumberError('Card number must be 13 or 16 digits.');
      setCardTypeError('');
    } else {
      setCardNumberError('');
      const cardType = validateCardNumber(cardNumber);
      if (!cardType) {
        setCardTypeError('Invalid card number. Only Visa or MasterCard are allowed.');
      } else {
        setCardTypeError('');
      }
    }
  };

  const validateCardNumber = (number) => {
    const visaRegex = /^4\d{12}(\d{3})?$/;
    const masterCardRegex = /^5\d{15}$/;
    if (visaRegex.test(number)) {
      return 'Visa';
    } else if (masterCardRegex.test(number)) {
      return 'MasterCard';
    } else {
      return false;
    }
  };

  const validateExpirationDate = (date) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(date)) {
      return 'Expiration date must be in MM/YY format';
    }
    const currentDate = new Date();
    const [month, year] = date.split('/').map(num => parseInt(num, 10));
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return 'Expiration date is in the past';
    }
    return true;
  };

  const validateCVV = (cvv) => {
    if (cvv.length !== 3 || !/^\d{3}$/.test(cvv)) {
      return 'CVV must be 3 digits long';
    }
    return true;
  };

  const validateCardHolderName = (name) => {
    const regex = /^[A-Za-z\s]+$/;  // Only letters and spaces are allowed
    if (!regex.test(name)) {
      return 'Cardholder name must contain only letters';
    }
    return true;
  };

  const validateCardHolderId = (id) => {
    if (!id || id.length === 0) {
      return 'Cardholder ID is required';
    }
    return true;
  };

  const handleExpirationDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4); // Format MM/YY
    }
    setCardDetails((prevState) => ({
      ...prevState,
      expirationDate: value,
    }));
  };

  const handleCVVChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    setCardDetails((prevState) => ({
      ...prevState,
      cvv: value,
    }));
  };

  const handleExpirationDateBlur = () => {
    const expirationDateValid = validateExpirationDate(cardDetails.expirationDate);
    if (expirationDateValid !== true) {
      setExpirationError(expirationDateValid);
    } else {
      setExpirationError('');
    }
  };

  const handleCVVBlur = () => {
    const cvvValid = validateCVV(cardDetails.cvv);
    if (cvvValid !== true) {
      setCvvError(cvvValid);
    } else {
      setCvvError('');
    }
  };

  const handleCardHolderNameBlur = () => {
    const cardHolderValid = validateCardHolderName(cardDetails.cardHolderName);
    if (cardHolderValid !== true) {
      setCardHolderError(cardHolderValid);
    } else {
      setCardHolderError('');
    }
  };

  const handleCardHolderIdBlur = () => {
    const cardHolderIdValid = validateCardHolderId(cardDetails.cardHolderId);
    if (cardHolderIdValid !== true) {
      setCardHolderIdError(cardHolderIdValid);
    } else {
      setCardHolderIdError('');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');
    setCardNumberError('');
    setCardTypeError('');
    setExpirationError('');
    setCvvError('');
    setCardHolderError('');
    setCardHolderIdError('');  // Reset cardHolderIdError

    if (!termsAgreed) {
      alert("You must agree to the Terms of Payment before proceeding.");
      return;
    }

    const cardType = validateCardNumber(cardDetails.cardNumber.replace(/\s/g, ''));
    if (!cardType) {
      setError('Invalid card number. Only Visa or MasterCard are allowed.');
      return;
    }

    const expirationDateValid = validateExpirationDate(cardDetails.expirationDate);
    if (expirationDateValid !== true) {
      setExpirationError(expirationDateValid);
      return;
    }

    const cvvValid = validateCVV(cardDetails.cvv);
    if (cvvValid !== true) {
      setCvvError(cvvValid);
      return;
    }

    const cardHolderValid = validateCardHolderName(cardDetails.cardHolderName);
    if (cardHolderValid !== true) {
      setCardHolderError(cardHolderValid);
      return;
    }

    const cardHolderIdValid = validateCardHolderId(cardDetails.cardHolderId);
    if (cardHolderIdValid !== true) {
      setCardHolderIdError(cardHolderIdValid);
      return;
    }

    handleSubmit(cardDetails, onboardData);  // Pass onboardData along with cardDetails
  };

  const getCardIcon = () => {
    const firstChar = cardDetails.cardNumber.charAt(0);
    if (firstChar === '4') {
      return <FaCcVisa style={{ color: '#1a73e8', fontSize: '20px' }} />;
    } else if (firstChar === '5') {
      return <FaCcMastercard style={{ color: '#ff5f00', fontSize: '20px' }} />;
    } else {
      return null;
    }
  };

  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Check if all form fields are filled
  const isFormValid = 
    cardDetails.cardNumber.replace(/\s/g, '').length >= 13 && 
    cardDetails.cardHolderName.trim() !== '' &&
    cardDetails.cardHolderId.trim() !== '' &&
    cardDetails.expirationDate.length === 5 &&
    cardDetails.cvv.length === 3 &&
    termsAgreed &&
    !cardNumberError &&
    !cardTypeError &&
    !expirationError &&
    !cvvError &&
    !cardHolderError &&
    !cardHolderIdError;

  return (
    <div className="credit-card-info-modal" onClick={handleCloseModal}>
      <div className="credit-card-info-modal-content">
        <button className="credit-card-info-close-btn" onClick={handleClose}>X</button>
        <h2 className="credit-card-info-modal-header">Enter Credit Card Info</h2>
        <div className="credit-card-info-brand-message">
          <span className="credit-card-info-brand-message-span">
            Only Visa or MasterCard are allowed.
          </span>
          <FaCcVisa style={{ color: '#1a73e8', marginLeft: '8px', fontSize: '20px' }} />
          <FaCcMastercard style={{ color: '#ff5f00', marginLeft: '8px', fontSize: '20px' }} />
        </div>
        <form onSubmit={handleFormSubmit} className="credit-card-info-form">
          <div className="credit-card-info-form-group">
            <label className="credit-card-info-label">Card Number</label>
            <div className="credit-card-info-input-container">
              <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleCardNumberChange}
                onBlur={handleCardNumberBlur}
                placeholder="Enter your card number"
                required
              />
              <span className="credit-card-info-icon">{getCardIcon()}</span>
            </div>
            {cardNumberError && <div className="credit-card-info-error">{cardNumberError}</div>}
            {cardTypeError && <div className="credit-card-info-error">{cardTypeError}</div>}
          </div>

          <div className="credit-card-info-form-group">
            <label className="credit-card-info-label">Cardholder Name</label>
            <input
              type="text"
              name="cardHolderName"
              value={cardDetails.cardHolderName}
              onChange={handleChange}
              onBlur={handleCardHolderNameBlur}
              placeholder="Enter cardholder's name"
              required
            />
            {cardHolderError && <div className="credit-card-info-error">{cardHolderError}</div>}
          </div>

          <div className="credit-card-info-form-group">
            <label className="credit-card-info-label">Cardholder ID</label>
            <input
              type="text"
              name="cardHolderId"
              value={cardDetails.cardHolderId}
              onChange={handleChange}
              onBlur={handleCardHolderIdBlur}
              placeholder="Enter cardholder's ID"
              required
            />
            {cardHolderIdError && <div className="credit-card-info-error">{cardHolderIdError}</div>}
          </div>

          <div className="credit-card-info-form-group-flex">
            <div className="credit-card-info-expiration">
              <label className="credit-card-info-label">Expiration Date</label>
              <input
                type="text"
                name="expirationDate"
                value={cardDetails.expirationDate}
                onChange={handleExpirationDateChange}
                onBlur={handleExpirationDateBlur}
                placeholder="MM/YY"
                maxLength={5}
                required
              />
              {expirationError && <span className="credit-card-info-error">{expirationError}</span>}
            </div>

            <div className="credit-card-info-cvv">
              <label className="credit-card-info-label">CVV</label>
              <input
                type="text"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleCVVChange}
                onBlur={handleCVVBlur}
                placeholder="Enter CVV"
                required
                maxLength={3}
              />
              {cvvError && <span className="credit-card-info-error">{cvvError}</span>}
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className='credit-card-info-form-group'>
            <div className="credit-card-info-form-group-checkbox-conatiner">
              <input
                className='credit-card-info-form-group-checkbox-input'
                type="checkbox"
                id="termsOfPayment"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
              />
              <label className='credit-card-info-checkbox-termofpayments' htmlFor="termsOfPayment">
                I agree to the <a href="/TermOfPayments" target="_blank" rel="noopener noreferrer">Terms of Payments</a>
              </label>
            </div>
          </div>

          {error && <div className="credit-card-info-error">{error}</div>}
          <button 
            className="credit-card-info-submit-btn" 
            type="submit"
            disabled={!isFormValid}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreditCardInfo;
