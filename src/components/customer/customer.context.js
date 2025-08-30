import React, { createContext, useMemo } from 'react';
import apiClient from '../../services/axiosConfig';
import CustomerService from './customer.service';

export const CustomerServiceContext = createContext(null);

export const CustomerServiceProvider = ({ children }) => {
  const customerService = useMemo(() => new CustomerService(apiClient), []);

  return (
    <CustomerServiceContext.Provider value={customerService}>
      {children}
    </CustomerServiceContext.Provider>
  );
};