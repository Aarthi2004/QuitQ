import React, { createContext, useMemo } from 'react';
import apiClient from '../../services/axiosConfig'; // Ensure this path is correct for your project
import SellerService from './seller.service';

export const SellerServiceContext = createContext(null);

export const SellerServiceProvider = ({ children }) => {
  const sellerService = useMemo(() => new SellerService(apiClient), []);

  return (
    <SellerServiceContext.Provider value={sellerService}>
      {children}
    </SellerServiceContext.Provider>
  );
};