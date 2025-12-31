import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  LogOut,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { collection, query, onSnapshot, where } from "firebase/firestore";

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile'da kapalı başlasın
  const [unreadQuotesCount, setUnreadQuotesCount] = useState(0);
  const [newAppointmentsCount, setNewAppointmentsCount] = useState(0);
  
  // Desktop'ta sidebar açık, mobile'da kapalı
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
      description: "Overview and statistics"
    },
    {
      name: "Quotes",
      path: "/admin/quotes",
      icon: FileText,
      description: "Manage quote requests"
    },
    {
      name: "Appointments",
      path: "/admin/appointments",
      icon: Calendar,
      description: "View and manage appointments"
    },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  // Real-time listeners for unread quotes and new appointments
  useEffect(() => {
    // Listen for unread quotes
    let unsubscribeQuotes = () => {};
    
    const setupQuotesListener = () => {
      try {
        const unreadQuotesQuery = query(
          collection(db, "quotes"),
          where("read", "==", false)
        );
        
        unsubscribeQuotes = onSnapshot(
          unreadQuotesQuery,
          (snapshot) => {
            const count = snapshot.docs.filter(doc => {
              const data = doc.data();
              return !data.deleted && !data.archived;
            }).length;
            setUnreadQuotesCount(count);
          },
          (error) => {
            console.log("Where query failed for quotes, using fallback:", error);
            // Fallback: fetch all quotes and filter
            const allQuotesQuery = query(collection(db, "quotes"));
            unsubscribeQuotes = onSnapshot(
              allQuotesQuery,
              (snapshot) => {
                const count = snapshot.docs.filter(doc => {
                  const data = doc.data();
                  return !data.read && !data.deleted && !data.archived;
                }).length;
                setUnreadQuotesCount(count);
              },
              (err) => console.error("Error listening to all quotes:", err)
            );
          }
        );
      } catch (error) {
        // If query creation fails, use fallback directly
        console.log("Query creation failed for quotes, using fallback:", error);
        const allQuotesQuery = query(collection(db, "quotes"));
        unsubscribeQuotes = onSnapshot(
          allQuotesQuery,
          (snapshot) => {
            const count = snapshot.docs.filter(doc => {
              const data = doc.data();
              return !data.read && !data.deleted && !data.archived;
            }).length;
            setUnreadQuotesCount(count);
          },
          (err) => console.error("Error listening to all quotes:", err)
        );
      }
    };

    setupQuotesListener();

    // Listen for new appointments (pending status)
    // Try with where clause first, fallback to all appointments if index missing
    let unsubscribeAppointments = () => {};
    
    const setupAppointmentsListener = () => {
      try {
        const newAppointmentsQuery = query(
          collection(db, "appointments"),
          where("status", "==", "pending")
        );
        
        unsubscribeAppointments = onSnapshot(
          newAppointmentsQuery,
          (snapshot) => {
            setNewAppointmentsCount(snapshot.docs.length);
          },
          (error) => {
            console.log("Where query failed, using fallback:", error);
            // Fallback: fetch all appointments and filter
            const allAppointmentsQuery = query(collection(db, "appointments"));
            unsubscribeAppointments = onSnapshot(
              allAppointmentsQuery,
              (snapshot) => {
                const pendingCount = snapshot.docs.filter(doc => {
                  const data = doc.data();
                  return data.status === "pending";
                }).length;
                setNewAppointmentsCount(pendingCount);
              },
              (err) => console.error("Error listening to all appointments:", err)
            );
          }
        );
      } catch (error) {
        // If query creation fails, use fallback directly
        console.log("Query creation failed, using fallback:", error);
        const allAppointmentsQuery = query(collection(db, "appointments"));
        unsubscribeAppointments = onSnapshot(
          allAppointmentsQuery,
          (snapshot) => {
            const pendingCount = snapshot.docs.filter(doc => {
              const data = doc.data();
              return data.status === "pending";
            }).length;
            setNewAppointmentsCount(pendingCount);
          },
          (err) => console.error("Error listening to all appointments:", err)
        );
      }
    };

    setupAppointmentsListener();

    return () => {
      if (unsubscribeQuotes) {
        unsubscribeQuotes();
      }
      if (unsubscribeAppointments) {
        unsubscribeAppointments();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} 
        ${sidebarOpen ? "w-64" : "w-64 lg:w-20"} 
        bg-white border-r border-gray-200 
        fixed lg:relative h-screen 
        transition-all duration-300 
        z-50 lg:z-40
        flex flex-col
      `}>
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${sidebarOpen ? "" : "justify-center w-full"}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">SolVida Clean</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${active 
                    ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md" 
                    : "text-gray-700 hover:bg-gray-100"
                  }
                `}
                title={sidebarOpen ? "" : item.name}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-white" : "text-gray-500"}`} />
                {sidebarOpen && (
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm">{item.name}</div>
                      <div className={`text-xs ${active ? "text-blue-100" : "text-gray-500"}`}>
                        {item.description}
                      </div>
                    </div>
                    {/* Notification Badge */}
                    {item.path === "/admin/quotes" && unreadQuotesCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {unreadQuotesCount > 99 ? "99+" : unreadQuotesCount}
                      </span>
                    )}
                    {item.path === "/admin/appointments" && newAppointmentsCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {newAppointmentsCount > 99 ? "99+" : newAppointmentsCount}
                      </span>
                    )}
                  </div>
                )}
                {/* Notification badge for collapsed sidebar */}
                {!sidebarOpen && (
                  <>
                    {item.path === "/admin/quotes" && unreadQuotesCount > 0 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadQuotesCount > 9 ? "9+" : unreadQuotesCount}
                      </span>
                    )}
                    {item.path === "/admin/appointments" && newAppointmentsCount > 0 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {newAppointmentsCount > 9 ? "9+" : newAppointmentsCount}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            title={sidebarOpen ? "" : "Logout"}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-semibold text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full lg:transition-all lg:duration-300 lg:ml-0">
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900">SolVida Clean</h1>
          </div>
        </div>
        
        <div className="pt-16 lg:pt-6 p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

