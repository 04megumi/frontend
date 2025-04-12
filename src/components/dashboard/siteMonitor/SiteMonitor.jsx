import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';



function SiteMonitor({ }) {

  return (
    //Site Monitor Content
    <div id="monitor-content" className="dashboard-content bg-white rounded-lg shadow p-6">
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
              <span>32%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "32%" }}></div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>内存使用率</span>
              <span>58%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "58%" }}></div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>磁盘使用率</span>
              <span>45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
            </div>
          </div>
        </div>

        {/* Response Times */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">响应时间</h2>
          <div className="h-40">
            {/* Placeholder for chart */}
            <div className="flex items-center justify-center h-full bg-gray-100 rounded">
              <p className="text-gray-500">响应时间图表</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>平均: 142ms <span className="text-green-600">↓2%</span></p>
            <p>最大: 356ms <span className="text-red-600">↑5%</span></p>
          </div>
        </div>

        {/* Recent Errors */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">最近错误</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full mr-2">错误</span>
              <div>
                <p className="text-sm font-medium">数据库连接超时</p>
                <p className="text-xs text-gray-500">2分钟前</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full mr-2">警告</span>
              <div>
                <p className="text-sm font-medium">高内存使用</p>
                <p className="text-xs text-gray-500">15分钟前</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full mr-2">警告</span>
              <div>
                <p className="text-sm font-medium">API响应慢</p>
                <p className="text-xs text-gray-500">1小时前</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteMonitor;