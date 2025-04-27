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
  const [cpuUsage, setCpuUsage] = useState(0); // 设置默认值为0
  const [memoryUsage, setMemoryUsage] = useState(0); // 设置默认值为0
  const [diskUsage, setDiskUsage] = useState(0); // 设置默认值为0
  const [responseTime, setResponseTime] = useState({ avg: 0, max: 0 });
  const [errors, setErrors] = useState([]);
  const [responseTimeHistory, setResponseTimeHistory] = useState([]); // 用于存储响应时间历史数据
  const [loading, setLoading] = useState(true); // 添加加载状态

  // 每五秒钟调用接口更新数据
  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await monitor();
      if (response.success) {
        setCpuUsage(response.data.data.cpuUsage);
        setMemoryUsage(response.data.data.memoryUsage);
        setDiskUsage(response.data.data.diskUsage);
        setResponseTime({
          avg: response.data.data.avgResponseTime,
          max: response.data.data.maxResponseTime,
        });

        // 保存响应时间历史记录
        setResponseTimeHistory(prev => [...prev, response.data.data.avgResponseTime]);
        setLoading(false); // 数据加载完成，设置为false
      } else {
        setErrors(prevErrors => [...prevErrors, response.message]);
        setLoading(false); // 错误发生时也设置为false
      }
    }, 1000);

    // 清理定时器
    return () => clearInterval(interval);
  }, []);

  // 响应时间图表数据
  const chartData = {
    labels: responseTimeHistory.map((_, index) => `数据点 ${index + 1}`),
    datasets: [
      {
        label: '平均响应时间',
        data: responseTimeHistory,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

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

        {/* Response Times */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">响应时间</h2>
          <div className="h-40">
            {/* 绘制响应时间图表 */}
            {loading ? (
              <div className="flex justify-center items-center h-full text-gray-500">加载中...</div>
            ) : (
              <Line data={chartData} />
            )}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>平均: {loading ? '加载中...' : `${responseTime.avg}ms`} <span className="text-green-600">↓2%</span></p>
            <p>最大: {loading ? '加载中...' : `${responseTime.max}ms`} <span className="text-red-600">↑5%</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SiteMonitor;