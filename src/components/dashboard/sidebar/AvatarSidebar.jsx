import React, { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

function AvatarSidebar({ collapsed, onSectionChange, userName }) {



  return (
    <div
      className={`sidebar fixed left-0 top-0 bottom-0 w-[280px] bg-white shadow-md transition-transform duration-300 ${collapsed ? '-translate-x-full' : 'translate-x-0'
        }`}
    >
      {/* 用户信息 */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center">
          <img
            src="../../../../public/xiaoba.svg"
            alt="Profile"
            className="w-10 h-10 rounded-full shadow-2xs"
          />
          <div className="ml-3">
            <div class="lh-condensed overflow-hidden d-flex flex-column flex-justify-center ml-2 f5 mr-auto">
              <div class="text-bold">
                <p className="text-sm font-medium text-gray-700">{userName}</p>
              </div>
              <div class="fgColor-muted">
                <div class="Truncate__StyledTruncate-sc-23o1d2-0 cBdrp">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 h-full flex flex-col">
        <div >
          {/* 菜单 */}
          <div className="flex-1 overflow-y-auto">

            {/* Your Profile */}
            <div className="mb-4">
              <div
                className="flex justify-between items-center cursor-pointer group"
                onClick={() => {

                }}
              >
                <span className="font-medium text-gray-700 group-hover:text-blue-600">Your Profile</span>

              </div>
            </div>

            {/* Settings */}
            <div className="mb-4">
              <div
                className="flex justify-between items-center cursor-pointer group"
                onClick={() => {

                }}
              >
                <span className="font-medium text-gray-700 group-hover:text-blue-600">Settings</span>
              </div>
            </div>

            {/* Log Out */}
            <div className="mb-4">
              <div
                className="flex justify-between items-center cursor-pointer group"
                onClick={() => {
                }}
              >
                <span className="font-medium text-gray-700 group-hover:text-blue-600">Log Out</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AvatarSidebar;
