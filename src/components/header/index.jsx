import React, { useState } from "react";
import { FaHome, FaUser, FaBell, FaClipboardList, FaChartLine, FaDumbbell, FaSearch, FaBars, FaSignOutAlt, FaCog } from "react-icons/fa";
import Inscription from "../inscription/inscit";
import List from "../list/list";
import Notification from "../notification/notification";
import SportMembers from "../sport_list/sport_list" ;
import { Key } from "lucide-react";
import SportPaye from "../sportPayre/sportPay";


const Header = () => {
  const [activePage, setActivePage] = useState("الرئيسية");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const menuItems = [
    { key: "الرئيسية", label: "الرئيسية", icon: FaHome },
    { key: "لوحة التحكم", label: "لوحة التحكم", icon: FaChartLine },
    { key: "تسجيل جديد", label: "تسجيل جديد", icon: FaUser },
    { key: "قائمة العملاء", label: "قائمة العملاء", icon: FaClipboardList },
    { key: "رياضة", label: "الرياضة", icon: FaDumbbell },
    { key: "إشعارات", label: "الإشعارات", icon: FaBell },
  ];

  const renderContent = () => {
    switch (activePage) {
      case "تسجيل جديد":
        return <Inscription />;
      case "قائمة العملاء":
        return <List />;
      case "رياضة":
        return <SportMembers />;
      case "إشعارات":
        return <Notification />;
      case "لوحة التحكم":
        return <SportPaye/>;
      default:
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">الأعضاء الجدد</h3>
              <p className="text-3xl font-bold">128</p>
              <p className="text-sm text-red-100 mt-2">+12% هذا الشهر</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">الإيرادات الشهرية</h3>
              <p className="text-3xl font-bold">9,854€</p>
              <p className="text-sm text-blue-100 mt-2">+8% مقارنة بالشهر الماضي</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">نسبة الاحتفاظ</h3>
              <p className="text-3xl font-bold">92%</p>
              <p className="text-sm text-green-100 mt-2">+3% عن المتوسط</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-zinc-100 rtl">
      <div
        className={`bg-gray-500 text-white transition-all duration-300 flex flex-col ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="p-4 border-b border-zinc-700 flex items-center justify-between bg-gray-500">
          <div className={`flex items-center gap-2 ${isCollapsed ? "hidden" : "block"}`}>
            <FaDumbbell className="h-6 w-6 text-red-500" />
            <h1 className="font-bold text-xl text-white">تطبيق الجيم</h1>
          </div>
          <button
            className="text-white hover:bg-zinc-800 p-2 rounded"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <FaBars />
          </button>
        </div>

        <nav className="flex-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`w-full flex items-center px-4 py-2 mb-2 rounded ${
                  activePage === item.key
                    ? "bg-red-500 text-black hover:bg-red-600"
                    : "text-zinc-900 hover:bg-zinc-80 hover:text-black-90"
                }`}
                onClick={() => setActivePage(item.key)}
              >
                <Icon className={`h-5 w-5 ${!isCollapsed && "ml-2"}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <FaSearch className="absolute right-3 top-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="ابحث..."
                  className="pr-10 pl-4 py-2 w-full rounded-lg border border-gray-200 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <FaBell className="h-5 w-5" />
              </button>
              <div className="relative">
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <FaUser className="h-5 w-5" />
                </button>
                {showDropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                    <div className="px-4 py-2 font-semibold border-b">حسابي</div>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center">
                      <FaUser className="ml-2" /> الملف الشخصي
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center">
                      <FaCog className="ml-2" /> الإعدادات
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-600">
                      <FaSignOutAlt className="ml-2" /> تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-0 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};
export default Header;