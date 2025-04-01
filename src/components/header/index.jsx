import React, { useState } from "react";
import { motion } from "framer-motion";
import Inscription from "../inscription/inscit";
import Lists from "../list/list";
import Notification from "../notification/notification";
import SportMembers from "../sport_list/sport_list";
import SportPaye from "../sportPayre/sportPay";
import logo from '../../images/logo.jpg'; // Chemin relatif correct depuis le composant

import { 
  Home as HomeIcon, 
  LayoutDashboard, 
  Users, 
  Bell, 
  List, 
  Dumbbell, 
  Search, 
  Menu, 
  LogOut, 
  Settings, 
  User,
  BarChart2,
  DollarSign,
  Activity,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const [activePage, setActivePage] = useState("الرئيسية");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const menuItems = [
    { key: "الرئيسية", label: "الرئيسية", icon: HomeIcon},
    { key: "تسجيل جديد", label: "تسجيل جديد", icon: Users },
    { key: "الاداء", label: "الاداء", icon: LayoutDashboard},
    { key: "قائمة العملاء", label: "قائمة العملاء", icon: List },
    { key: "رياضة", label: "الرياضة", icon: Dumbbell },
    { key: "إشعارات", label: "الإشعارات", icon: Bell},
  ];

  const userData = {
    name: "حميد الغزال",
    role: "مدير النظام",
    avatar: logo// C:\Users\DeLL\GYM\gym_app\src\images\logo.jpg
    //voici path index.jsx C:\Users\DeLL\GYM\gym_app\src\components\header\index.jsx
  };

  const renderContent = () => {
    switch (activePage) {
      case "تسجيل جديد":
        return <Inscription />;
      case "قائمة العملاء":
        return <Lists />;
      case "رياضة":
        return <SportMembers />;
      case "إشعارات":
        return <Notification />;
      case "الاداء":
        return <SportPaye />;
      default:
        return (
          <div className="space-y-6">
            {/* Statistiques */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-[#4361ee] to-[#3a0ca3] text-white hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">الأعضاء الجدد</CardTitle>
                  <Users className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">128</div>
                  <p className="text-xs text-blue-100 mt-1">+12% هذا الشهر</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-[#f72585] to-[#b5179e] text-white hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">الإيرادات</CardTitle>
                  <DollarSign className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">9,854 د.م</div>
                  <p className="text-xs text-pink-100 mt-1">+8% عن الشهر الماضي</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-[#4cc9f0] to-[#4895ef] text-white hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">الاشتراكات</CardTitle>
                  <Activity className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">64</div>
                  <p className="text-xs text-cyan-100 mt-1">+5 اشتراكات جديدة</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-[#f8961e] to-[#f3722c] text-white hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">نسبة الاحتفاظ</CardTitle>
                  <BarChart2 className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-amber-100 mt-1">+3% عن المتوسط</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Graphiques */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <span>النشاط الأخير</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">رسم بياني للنشاط سيظهر هنا</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5 text-red-500" />
                    <span>التوزيع حسب الرياضة</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">رسم بياني للتوزيع سيظهر هنا</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (      
    <div className="flex h-screen bg-gray-50 rtl">
      {/* Sidebar - Partie modifiée */}
      <motion.div
        animate={{ width: isCollapsed ? "100px" : "320px" }}
        className="bg-gradient-to-b from-gray-800 to-gray-900 text-white transition-all duration-300 flex flex-col shadow-xl"
      >
        <div className="p-5 border-b border-gray-700 flex items-center justify-between">
          {!isCollapsed && (
  <motion.div 
    initial={{ opacity: 1 }}
    animate={{ opacity: isCollapsed ? 0 : 1 }}
    className="flex items-center gap-4"
  >
    <img src={logo} alt="GYM PRO Logo" className="h-7 w-7" />
    <h1 className="font-bold text-2xl text-white"> نادي رياضي</h1>
  </motion.div>
)}
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-300 hover:bg-gray-700 hover:text-white h-10 w-10"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>

        <nav className="flex-1 p-5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.key}
                variant={activePage === item.key ? "secondary" : "ghost"}
                className={`w-full justify-start mb-4 transition-all text-lg h-14
                  ${
                    activePage === item.key 
                      ? "bg-gray-700 text-white" 
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  } 
                  ${isCollapsed ? "px-3" : "px-6"}`}
                onClick={() => setActivePage(item.key)}
              >
                <div className="relative flex items-center gap-4">
                  <Icon className={`h-6 w-6 ${!isCollapsed && "ml-2"}`} />
                  {item.notification > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center bg-red-500 text-sm">
                      {item.notification}
                    </Badge>
                  )}
                </div>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isCollapsed ? 0 : 1 }}
                    className="mr-4 text-lg"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className={`p-5 border-t border-gray-700 ${isCollapsed ? "flex justify-center" : ""}`}>
          {isCollapsed ? (
            <Avatar className="h-12 w-12">
              <AvatarImage src={userData.avatar} />
              <AvatarFallback className="bg-red-500 text-xl">حم</AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
  <AvatarImage src={userData.avatar} />
  <AvatarFallback className="bg-red-500 text-xl">حم</AvatarFallback>
</Avatar>
              <div className="flex-1">
                <p className="font-medium text-lg">{userData.name}</p>
                <p className="text-sm text-gray-300">{userData.role}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between h-16">
            <h2 className="text-xl font-semibold text-gray-800">{activePage}</h2>
            
            <div className="flex items-center gap-4">
              <div className="relative w-72">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="ابحث عن الأعضاء أو الإشعارات..." 
                  className="pr-10 pl-4 py-3 text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <Button variant="ghost" size="icon" className="relative h-10 w-10">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500"></span>
              </Button>

              <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-10">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={userData.avatar} />
                      <AvatarFallback className="bg-red-500 text-white text-lg">حم</AvatarFallback>
                    </Avatar>
                    <span className="text-base">{userData.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="text-base">حسابي</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-base">
                    <User className="mr-2 h-5 w-5" />
                    <span>الملف الشخصي</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-base">
                    <Settings className="mr-2 h-5 w-5" />
                    <span>الإعدادات</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600 text-base">
                    <LogOut className="mr-2 h-5 w-5" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Header;