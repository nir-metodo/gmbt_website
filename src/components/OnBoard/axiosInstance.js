import axios from 'axios';
import WebSocketInstance from './WebSocketInstance'; // ✅ Import WebSocket manager

const baseURL = 'https://gambot.azurewebsites.net';

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ RELIABILITY CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // Timeouts (in milliseconds)
  DEFAULT_TIMEOUT: 30000,        // 30 seconds for normal requests
  UPLOAD_TIMEOUT: 120000,        // 2 minutes for file uploads
  LONG_OPERATION_TIMEOUT: 60000, // 1 minute for known long operations
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY_BASE: 1000,        // Base delay for exponential backoff
  RETRY_DELAY_MAX: 10000,        // Max retry delay
  
  // Circuit breaker
  CIRCUIT_THRESHOLD: 5,          // Failures before opening circuit
  CIRCUIT_RESET_TIME: 30000,     // Time before trying again (30 seconds)
};

// ✅ Create axios instance with timeout
const axiosInstance = axios.create({ 
  baseURL,
  timeout: CONFIG.DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'  // ✅ UTF-8 for Hebrew/Arabic support
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ CIRCUIT BREAKER - Prevents hammering a dead server
// ═══════════════════════════════════════════════════════════════════════════════

let circuitState = {
  isOpen: false,
  failures: 0,
  lastFailure: null,
  openedAt: null
};

const checkCircuit = () => {
  if (!circuitState.isOpen) return true;
  
  // Check if enough time has passed to try again
  const timeSinceOpened = Date.now() - circuitState.openedAt;
  if (timeSinceOpened > CONFIG.CIRCUIT_RESET_TIME) {
    console.log('🟡 [Circuit Breaker] Half-open - allowing one request through');
    return true;
  }
  
  console.warn('🔴 [Circuit Breaker] OPEN - Request blocked. Try again in', 
    Math.ceil((CONFIG.CIRCUIT_RESET_TIME - timeSinceOpened) / 1000), 'seconds');
  return false;
};

const reportSuccess = () => {
  if (circuitState.failures > 0 || circuitState.isOpen) {
    circuitState.failures = 0;
    circuitState.isOpen = false;
    circuitState.openedAt = null;
    console.log('🟢 [Circuit Breaker] Closed - Service recovered');
  }
};

const reportFailure = (error) => {
  circuitState.failures++;
  circuitState.lastFailure = Date.now();
  
  // Only open circuit for server errors, not client errors
  const isServerError = !error.response || error.response.status >= 500;
  const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
  const isNetworkError = error.message === 'Network Error';
  
  if ((isServerError || isTimeout || isNetworkError) && circuitState.failures >= CONFIG.CIRCUIT_THRESHOLD) {
    circuitState.isOpen = true;
    circuitState.openedAt = Date.now();
    console.error('🔴 [Circuit Breaker] OPENED - Too many failures:', circuitState.failures);
  }
};

// ✅ Export for health monitoring
export const getCircuitState = () => ({ ...circuitState });

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ RETRY LOGIC - Automatic retry with exponential backoff
// ═══════════════════════════════════════════════════════════════════════════════

const shouldRetry = (error, retryCount) => {
  // Don't retry if max retries exceeded
  if (retryCount >= CONFIG.MAX_RETRIES) return false;
  
  // Don't retry on client errors (4xx except 429)
  if (error.response?.status >= 400 && error.response?.status < 500 && error.response?.status !== 429) {
    return false;
  }
  
  // Retry on timeout, network error, or server error
  const isTimeout = error.code === 'ECONNABORTED';
  const isNetworkError = error.message === 'Network Error';
  const isServerError = !error.response || error.response.status >= 500;
  const isRateLimited = error.response?.status === 429;
  
  return isTimeout || isNetworkError || isServerError || isRateLimited;
};

const getRetryDelay = (retryCount) => {
  // Exponential backoff with jitter
  const exponentialDelay = CONFIG.RETRY_DELAY_BASE * Math.pow(2, retryCount);
  const jitter = Math.random() * 1000;
  return Math.min(exponentialDelay + jitter, CONFIG.RETRY_DELAY_MAX);
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ ENHANCED REQUEST WRAPPER - Use this for critical operations
// ═══════════════════════════════════════════════════════════════════════════════

export const resilientRequest = async (config, options = {}) => {
  const { 
    maxRetries = CONFIG.MAX_RETRIES,
    timeout = CONFIG.DEFAULT_TIMEOUT,
    skipCircuitBreaker = false 
  } = options;
  
  // Check circuit breaker
  if (!skipCircuitBreaker && !checkCircuit()) {
    throw new Error('Service temporarily unavailable. Please try again in a few moments.');
  }
  
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await axiosInstance({
        ...config,
        timeout
      });
      
      reportSuccess();
      return response;
      
    } catch (error) {
      lastError = error;
      reportFailure(error);
      
      if (shouldRetry(error, attempt) && attempt < maxRetries) {
        const delay = getRetryDelay(attempt);
        console.log(`🔄 [Retry] Attempt ${attempt + 1}/${maxRetries} failed. Retrying in ${Math.round(delay)}ms...`);
        await sleep(delay);
      }
    }
  }
  
  // All retries exhausted
  throw lastError;
};

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ HEALTH CHECK - Call before critical operations
// ═══════════════════════════════════════════════════════════════════════════════

export const checkServerHealth = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/Webhooks/health`, {
      timeout: 5000 // Quick 5 second timeout for health check
    });
    return response.status === 200;
  } catch (error) {
    console.warn('⚠️ [Health Check] Server health check failed:', error.message);
    return false;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ USER-FRIENDLY ERROR MESSAGES
// ═══════════════════════════════════════════════════════════════════════════════

export const getErrorMessage = (error) => {
  // Timeout error
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'הפעולה לקחה יותר מדי זמן. אנא נסה שוב.';
  }
  
  // Network error
  if (error.message === 'Network Error') {
    return 'אין חיבור לשרת. אנא בדוק את החיבור לאינטרנט.';
  }
  
  // Circuit breaker open
  if (error.message?.includes('temporarily unavailable')) {
    return 'השירות לא זמין זמנית. אנא נסה שוב בעוד מספר שניות.';
  }
  
  // Server errors
  if (error.response?.status >= 500) {
    return 'שגיאת שרת. הצוות הטכני קיבל התראה. אנא נסה שוב.';
  }
  
  // Rate limiting
  if (error.response?.status === 429) {
    return 'יותר מדי בקשות. אנא המתן מספר שניות ונסה שוב.';
  }
  
  // Auth errors
  if (error.response?.status === 401 || error.response?.status === 403) {
    return 'אין הרשאה לפעולה זו. אנא התחבר מחדש.';
  }
  
  // Try to get error from response
  const responseError = error.response?.data?.message || 
                        error.response?.data?.error ||
                        error.response?.data?.Message;
  if (responseError) {
    return responseError;
  }
  
  // Default message
  return 'אירעה שגיאה. אנא נסה שוב.';
};

let isRefreshing = false;
let failedQueue = [];

// ✅ Force logout utility function (can be imported and used anywhere)
export const forceLogout = (reason = 'Session expired') => {
  console.warn(`⚠️ Force logout triggered: ${reason}`);
  
  // Clear all auth data
  localStorage.removeItem('user');
  sessionStorage.clear();
  
  // Disconnect WebSocket
  try {
    WebSocketInstance.closeAllSockets();
  } catch (err) {
    console.error('Error closing WebSocket:', err);
  }
  
  // Clear axios headers
  delete axiosInstance.defaults.headers.common['Authorization'];
  
  // Redirect to login (avoid redirect loop if already on login page)
  const currentPath = window.location.pathname.toLowerCase();
  if (!currentPath.includes('/login')) {
    window.location.href = '/Login';
  }
};

const processQueue = (error, token = null) => {
  console.log(`🔄 [processQueue] Processing ${failedQueue.length} queued requests`);
  failedQueue.forEach((prom, index) => {
    if (error) {
      console.log(`   ❌ Request ${index + 1}: Rejecting with error`);
      prom.reject(error);
    } else {
      console.log(`   ✅ Request ${index + 1}: Resolving with new token`);
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const refreshAndRetry = async (originalRequest, user) => {
  console.log('🔄 [refreshAndRetry] Called for URL:', originalRequest?.url);
  
  if (originalRequest._retry) {
    console.log('⚠️ [refreshAndRetry] Request already retried, rejecting');
    return Promise.reject(new Error('Already retried'));
  }

  if (isRefreshing) {
    console.log('⏳ [refreshAndRetry] Refresh in progress, adding to queue');
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then(token => {
      console.log('✅ [refreshAndRetry] Got new token from queue, retrying request');
      originalRequest.headers['Authorization'] = 'Bearer ' + token;
      return axiosInstance(originalRequest);
    });
  }

  originalRequest._retry = true;
  isRefreshing = true;
  console.log('🔄 [refreshAndRetry] Starting token refresh...');

  try {
    const res = await axios.post(`${baseURL}/api/Webhooks/refresh-token`, {
      refreshToken: user.refreshToken,
    });

    console.log('✅ [refreshAndRetry] Refresh API response:', res.data);

    if (!res?.data?.IdToken) {
      console.error('❌ [refreshAndRetry] No IdToken in response!');
      throw new Error('Token refresh succeeded but no IdToken returned');
    }

    const newToken = res.data.IdToken;
    const updatedUser = { ...user, authToken: newToken };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    console.log('✅ [refreshAndRetry] Updated localStorage with new token');

    axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
    console.log('✅ [refreshAndRetry] Updated axios default headers');
    
    const queueSize = failedQueue.length;
    processQueue(null, newToken);
    console.log(`✅ [refreshAndRetry] Processed queue with ${queueSize} pending requests`);

    originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
    console.log('🔄 [refreshAndRetry] Retrying original request with new token');
    return axiosInstance(originalRequest);
  } catch (refreshError) {
    console.error('❌ [refreshAndRetry] Token refresh failed:', refreshError);
    processQueue(refreshError, null);
    
    // ✅ Force logout using utility function
    setTimeout(() => {
      forceLogout('Token refresh failed');
    }, 100);

    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
    console.log('✅ [refreshAndRetry] Refresh process completed');
  }
};

// ✅ Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // ✅ Check circuit breaker before making request
    if (!checkCircuit()) {
      return Promise.reject(new Error('Service temporarily unavailable. Please try again in a few moments.'));
    }
    
    // ✅ CRITICAL FIX: If sending FormData, remove Content-Type to let browser set multipart/form-data with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      console.log('📤 [FormData] Removed Content-Type header - browser will set multipart/form-data with boundary');
    }
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.authToken) {
      // Reduced logging for production
      if (process.env.NODE_ENV === 'development') {
        const tokenPreview = user.authToken.substring(0, 20) + '...';
        console.log(`📤 [Request] ${config.method?.toUpperCase()} ${config.url}`);
      }
      config.headers.Authorization = `Bearer ${user.authToken}`;
    }
    
    // ✅ Set dynamic timeout based on operation type
    if (!config.timeout) {
      // File uploads get longer timeout
      if (config.url?.includes('upload') || config.url?.includes('import') || config.data instanceof FormData) {
        config.timeout = CONFIG.UPLOAD_TIMEOUT;
      }
      // Long operations (campaigns, bulk operations)
      else if (config.url?.includes('campaign') || config.url?.includes('bulk') || config.url?.includes('export')) {
        config.timeout = CONFIG.LONG_OPERATION_TIMEOUT;
      }
      // Default timeout
      else {
        config.timeout = CONFIG.DEFAULT_TIMEOUT;
      }
    }
    
    // ✅ Add request timestamp for debugging
    config.metadata = { startTime: Date.now() };
    
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor – Handle expired tokens in success responses
axiosInstance.interceptors.response.use(
  async (response) => {
    // ✅ Report success to circuit breaker
    reportSuccess();
    
    // ✅ Log slow requests for debugging
    const duration = response.config?.metadata?.startTime 
      ? Date.now() - response.config.metadata.startTime 
      : 0;
    if (duration > 5000) {
      console.warn(`⚠️ [Slow Request] ${response.config?.method?.toUpperCase()} ${response.config?.url} took ${duration}ms`);
    }
    
    const user = JSON.parse(localStorage.getItem('user'));
    const data = response?.data;

    const msg = data?.Message || data?.message;

const isDirectMessageExpired =
  typeof msg === 'string' && msg.includes('Firebase ID token expired');
    // const isDirectMessageExpired =
    //   typeof data?.Message === 'string' &&
    //   data.Message.includes('Firebase ID token expired');

 const isArrayMessageExpired = (() => {
  const isAuthError = (str) => {
    if (typeof str !== 'string') return false;
    // ✅ ONLY check for "expired" - NOT "authentication is not available" (different error!)
    return str.includes('Firebase ID token expired');
  };

  if (Array.isArray(data)) {
    const result = data.some((item, index) => {
      if (typeof item === 'string') {
        return isAuthError(item);
      }
      if (typeof item === 'object' && item !== null) {
        // ✅ FIX: Don't log properties - it can corrupt objects
        return isAuthError(item.error) || isAuthError(item.Error);
      }
      return false;
    });
    return result;
  }

  if (typeof data === 'object' && data !== null) {
    return isAuthError(data.error) || isAuthError(data.Error);
  }

  if (typeof data === 'string') {
    return isAuthError(data);
  }

  return false;
})();

    if ((isDirectMessageExpired || isArrayMessageExpired) && user?.refreshToken) {
      console.log('🔴 [Response Interceptor] Detected expired token!');
      console.log('   - isDirectMessageExpired:', isDirectMessageExpired);
      console.log('   - isArrayMessageExpired:', isArrayMessageExpired);
      console.log('   - Response data:', JSON.stringify(data).substring(0, 200));
      const originalRequest = response.config;
      return await refreshAndRetry(originalRequest, user);
    }

    return response;
  },

  // ✅ Response Interceptor – Handle errors including timeouts
  async (error) => {
    // ✅ Report failure to circuit breaker (for server errors and timeouts)
    const isServerError = !error.response || error.response?.status >= 500;
    const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
    const isNetworkError = error.message === 'Network Error';
    
    if (isServerError || isTimeout || isNetworkError) {
      reportFailure(error);
      
      // ✅ Log timeout details
      if (isTimeout) {
        const duration = error.config?.metadata?.startTime 
          ? Date.now() - error.config.metadata.startTime 
          : 0;
        console.error(`⏱️ [Timeout] ${error.config?.method?.toUpperCase()} ${error.config?.url} timed out after ${duration}ms`);
      }
    }
    
    const response = error?.response;
    const originalRequest = response?.config || error?.config;
    const user = JSON.parse(localStorage.getItem('user'));

    const isUnauthorized = response?.status === 401 || response?.status === 403;
    
    // Don't retry if this IS the refresh-token endpoint (prevent infinite loop)
    const isRefreshEndpoint = originalRequest?.url?.includes('/refresh-token');

    // If unauthorized and we have a refresh token, try refreshing (unless it's the refresh endpoint itself)
    if (isUnauthorized && user?.refreshToken && !isRefreshEndpoint) {
      return await refreshAndRetry(originalRequest, user);
    }

    // If unauthorized but no refresh token, OR if the refresh endpoint itself failed, force logout
    if (isUnauthorized && (!user?.refreshToken || isRefreshEndpoint)) {
      console.error('❌ 401/403 error with no refresh token or refresh endpoint failed, logging out user');
      
      // ✅ Force logout using utility function
      setTimeout(() => {
        forceLogout(isRefreshEndpoint ? 'Refresh token invalid' : 'Unauthorized - no valid token');
      }, 100);
    }

    // ✅ Enhance error with user-friendly message
    error.userMessage = getErrorMessage(error);

    return Promise.reject(error);
  }
);

export default axiosInstance;


// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'https://gambot.azurewebsites.net',
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Attach the auth token to every request
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     if (user?.authToken) {
//       config.headers.Authorization = `Bearer ${user.authToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Catch 401 responses and redirect to login
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.data?.error?.includes("Firebase ID token expired")) {
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
