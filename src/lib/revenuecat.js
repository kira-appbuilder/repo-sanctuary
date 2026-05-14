import Purchases from "@revenuecat/purchases-js";

let isConfigured = false;

// Initialize RevenueCat
export const initializeRevenueCat = async (appUserId = "") => {
  try {
    if (!isConfigured) {
      await Purchases.configure("YOUR_REVENUECAT_API_KEY", appUserId);
      isConfigured = true;
      console.log('RevenueCat configured successfully');
    }
  } catch (error) {
    console.error('RevenueCat configuration error:', error);
  }
};

// Check subscription status
export const checkProEntitlement = async () => {
  try {
    if (!isConfigured) {
      return false;
    }
    
    const customerInfo = await Purchases.getSharedInstance().getCustomerInfo();
    const hasProAccess = customerInfo.entitlements.active["pro"] !== undefined;
    
    return hasProAccess;
  } catch (error) {
    console.error('RevenueCat entitlement check error:', error);
    return false;
  }
};

// Get available offerings/packages
export const getAvailableOfferings = async () => {
  try {
    if (!isConfigured) {
      throw new Error('RevenueCat not configured');
    }
    
    const offerings = await Purchases.getSharedInstance().getOfferings();
    return offerings.current;
  } catch (error) {
    console.error('RevenueCat offerings error:', error);
    return null;
  }
};

// Purchase a package
export const purchaseProPackage = async (rcPackage) => {
  try {
    if (!isConfigured) {
      throw new Error('RevenueCat not configured');
    }
    
    const { customerInfo } = await Purchases.getSharedInstance().purchase({ rcPackage });
    const hasProAccess = customerInfo.entitlements.active["pro"] !== undefined;
    
    return {
      success: true,
      hasProAccess,
      customerInfo
    };
  } catch (error) {
    console.error('Purchase error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Restore purchases
export const restorePurchases = async () => {
  try {
    if (!isConfigured) {
      throw new Error('RevenueCat not configured');
    }
    
    const customerInfo = await Purchases.getSharedInstance().restorePurchases();
    const hasProAccess = customerInfo.entitlements.active["pro"] !== undefined;
    
    return {
      success: true,
      hasProAccess,
      customerInfo
    };
  } catch (error) {
    console.error('Restore purchases error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get customer info
export const getCustomerInfo = async () => {
  try {
    if (!isConfigured) {
      return null;
    }
    
    return await Purchases.getSharedInstance().getCustomerInfo();
  } catch (error) {
    console.error('Get customer info error:', error);
    return null;
  }
};

// Subscription status hook helper
export const createSubscriptionListener = (callback) => {
  if (!isConfigured) {
    return () => {};
  }
  
  const listener = (customerInfo) => {
    const hasProAccess = customerInfo.entitlements.active["pro"] !== undefined;
    callback(hasProAccess, customerInfo);
  };
  
  Purchases.getSharedInstance().addCustomerInfoUpdateListener(listener);
  
  return () => {
    Purchases.getSharedInstance().removeCustomerInfoUpdateListener(listener);
  };
};