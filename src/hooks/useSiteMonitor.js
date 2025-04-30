import { useState, useEffect } from 'react';
import axios from 'axios';

const useSiteMonitor = () => {
  const [data, setData] = useState({
    memoryUsage: [],
    diskUsage: [],
    responseTime: [],
    loading: true,
    error: null,
  });

  const fetchData = async () => {
    try {
      const [memoryUsage, diskUsage, responseTime] = await Promise.all([
        //axios.get('/api/memoryUsage'),
        //axios.get('/api/diskUsage'),
        //axios.get('/api/responseTime'),
      ]);

      setData({
        memoryUsage: memoryUsage.data,
        diskUsage: diskUsage.data,
        responseTime: responseTime.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      setData((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* useEffect(() => {
  const fetchData = async () => {
    const result = await axios('https://jsonplaceholder.typicode.com/posts'); // API call
    setSiteData(result.data); // set the data to state
  };
  fetchData(); */

  return {
    ...data,
    data,
  };
};

export default useSiteMonitor;
