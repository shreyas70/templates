import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseFetchOptions extends AxiosRequestConfig {
  skip?: boolean;
}

/**
 * Custom hook for data fetching with axios
 * @param url - The URL to fetch data from
 * @param options - Axios request config options
 * @returns Object containing data, loading state, error, and refetch function
 */
function useFetch<T = any>(url: string, options: UseFetchOptions = {}) {
  const { skip = false, ...axiosOptions } = options;
  
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: !skip,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (skip) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await axios(url, {
        ...axiosOptions,
      });
      
      setState({
        data: response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = 
        axiosError.response?.data?.message || 
        axiosError.message || 
        'An error occurred';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
    }
  }, [url, skip, JSON.stringify(axiosOptions)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch,
  };
}

export default useFetch;
