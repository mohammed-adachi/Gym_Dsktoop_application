import React, { useState } from "react";
import { motion } from "framer-motion";
import Inscription from "../inscription/inscit";
import Lists from "../list/list";
import Notification from "../notification/notification";
import SportMembers from "../sport_list/sport_list" ;
import SportPaye from "../sportPayre/sportPay";
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
  User 
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

const Header = () => {
  const [activePage, setActivePage] = useState("الرئيسية");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const menuItems = [
    { key: "الرئيسية", label: "الرئيسية", icon: HomeIcon },
    { key: "لوحة التحكم", label: "لوحة التحكم", icon: LayoutDashboard },
    { key: "تسجيل جديد", label: "تسجيل جديد", icon: Users },
    { key: "قائمة العملاء", label: "قائمة العملاء", icon: List },
    { key: "رياضة", label: "الرياضة", icon: Dumbbell },
    { key: "إشعارات", label: "الإشعارات", icon: Bell },
  ];

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
      case "لوحة التحكم":
        return <SportPaye/>;
      default:
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
              <CardHeader>
                <CardTitle className="text-white">الأعضاء الجدد</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">128</p>
                <p className="text-sm text-red-100 mt-2">+12% هذا الشهر</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="text-white">الإيرادات الشهرية</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">9,854€</p>
                <p className="text-sm text-blue-100 mt-2">+8% مقارنة بالشهر الماضي</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader>
                <CardTitle className="text-white">نسبة الاحتفاظ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">92%</p>
                <p className="text-sm text-green-100 mt-2">+3% عن المتوسط</p>
              </CardContent>
            </Card>
          </motion.div>
        );
    }
  };

  return (      
    <div className="flex h-screen bg-zinc-100 rtl">
      <motion.div
        animate={{ width: isCollapsed ? "80px" : "250px" }}
        className="bg-gray-800 text-white transition-all duration-300 flex flex-col shadow-lg"
      >
        <div className="p-4 border-b border-zinc-700 flex items-center justify-between">
          <div className={`flex items-center gap-2 ${isCollapsed ? "hidden" : "block"}`}>
            <Dumbbell className="h-6 w-6 text-red-500" />
            <h1 className="font-bold text-xl text-white">تطبيق الجيم</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-zinc-700"
          >
            <Menu />
          </Button>
        </div>

        <nav className="flex-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.key}
                variant={activePage === item.key ? "secondary" : "ghost"}
                className="w-full justify-start mb-2"
                onClick={() => setActivePage(item.key)}
              >
                <Icon className={`h-5 w-5 ${!isCollapsed && "ml-2"}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </nav>
      </motion.div>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute right-3 top-3 text-gray-500" />
              <Input 
                placeholder="ابحث..." 
                className="pr-10 pl-4 py-2 w-full rounded-lg border border-gray-200 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>الملف الشخصي</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>الإعدادات</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Header;