import React, { useState, useEffect } from 'react';
import { monitor } from '../../../api/user'
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SiteMonitor() {
  const [cpuUsage, setCpuUsage] = useState(0); // CPU使用率
  const [memoryUsage, setMemoryUsage] = useState(0); // 内存使用率
  const [diskUsage, setDiskUsage] = useState(0); // 磁盘使用率
  const [loading, setLoading] = useState(true); // 加载状态


  // 每2秒调用接口更新数据
  useEffect(() => {
    // 初始加载
    const fetchData = async () => {
      const response = await monitor();
      if (response.success) {
        const data = response.data.data;
        //console.log(data);
        setCpuUsage(data.cpuUsage);
        setMemoryUsage(data.memoryUsage);
        setDiskUsage(data.diskUsage);

        setLoading(false);
      } else {
        setErrors(prevErrors => [...prevErrors, response.message]);
        setLoading(false);
      }
    };

    // 初始加载数据
    fetchData();

    // 每2秒更新一次数据
    const interval = setInterval(fetchData, 2000);

    // 清理定时器
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="monitor-content" className="dashboard-content bg-white rounded-lg mt-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">站点监控</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Server Status */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">服务器状态</h2>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              <i className="fas fa-check-circle mr-1"></i> 在线
            </span>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>CPU 使用率</span>
              <span>{loading ? '加载中...' : `${cpuUsage}%`}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${loading ? 0 : cpuUsage}%` }}></div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>内存使用率</span>
              <span>{loading ? '加载中...' : `${memoryUsage}%`}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${loading ? 0 : memoryUsage}%` }}></div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>磁盘使用率</span>
              <span>{loading ? '加载中...' : `${diskUsage}%`}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${loading ? 0 : diskUsage}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SiteMonitor;