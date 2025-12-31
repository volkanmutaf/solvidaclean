import { useEffect, useState, useCallback } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { FileText, Calendar, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalQuotes: 0,
    pendingQuotes: 0,
    repliedQuotes: 0,
    appointmentsCreated: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setRefreshing(true);
      
      // Fetch quotes - try with orderBy, fallback without
      let quotes = [];
      try {
        const quotesQuery = query(collection(db, "quotes"), orderBy("timestamp", "desc"));
        const quotesSnapshot = await getDocs(quotesQuery);
        quotes = quotesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("✅ Fetched quotes with orderBy:", quotes.length);
      } catch (err) {
        // If orderBy fails, fetch without ordering
        console.log("⚠️ OrderBy failed for quotes, fetching without order:", err);
        try {
          const quotesQuery = query(collection(db, "quotes"));
          const quotesSnapshot = await getDocs(quotesQuery);
          quotes = quotesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          console.log("✅ Fetched quotes without orderBy:", quotes.length);
          // Sort manually
          quotes.sort((a, b) => {
            const aTime = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : (a.timestamp?.seconds ? a.timestamp.seconds * 1000 : (a.timestamp ? new Date(a.timestamp).getTime() : 0));
            const bTime = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : (b.timestamp?.seconds ? b.timestamp.seconds * 1000 : (b.timestamp ? new Date(b.timestamp).getTime() : 0));
            return bTime - aTime;
          });
        } catch (fetchErr) {
          console.error("❌ Error fetching quotes:", fetchErr);
          quotes = [];
        }
      }

      // Fetch appointments - try with orderBy, fallback without
      let appointments = [];
      try {
        const appointmentsQuery = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        appointments = appointmentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("✅ Fetched appointments with orderBy:", appointments.length);
      } catch (err) {
        // If orderBy fails, fetch without ordering
        console.log("⚠️ OrderBy failed for appointments, fetching without order:", err);
        try {
          const appointmentsQuery = query(collection(db, "appointments"));
          const appointmentsSnapshot = await getDocs(appointmentsQuery);
          appointments = appointmentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          console.log("✅ Fetched appointments without orderBy:", appointments.length);
          // Sort manually
          appointments.sort((a, b) => {
            const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt ? new Date(a.createdAt).getTime() : 0));
            const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt ? new Date(b.createdAt).getTime() : 0));
            return bTime - aTime;
          });
        } catch (fetchErr) {
          console.error("❌ Error fetching appointments:", fetchErr);
          appointments = [];
        }
      }

      // Calculate stats
      const totalQuotes = quotes.length;
      const pendingQuotes = quotes.filter((q) => {
        // Exclude deleted and archived
        if (q.deleted || q.archived) return false;
        // Pending if: not read, OR read but status is not Replied/Appointment Created
        if (!q.read) return true;
        if (q.read && q.status && q.status !== "Replied" && q.status !== "Appointment Created") return true;
        return false;
      }).length;
      const repliedQuotes = quotes.filter((q) => !q.deleted && !q.archived && q.status === "Replied").length;
      const appointmentsCreated = quotes.filter((q) => !q.deleted && !q.archived && q.status === "Appointment Created").length;
      const totalAppointments = appointments.length;
      const pendingAppointments = appointments.filter((a) => a.status === "pending").length;
      const confirmedAppointments = appointments.filter((a) => a.status === "confirmed").length;

      console.log("📊 Stats calculated:", {
        totalQuotes,
        pendingQuotes,
        repliedQuotes,
        appointmentsCreated,
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
      });

      setStats({
        totalQuotes,
        pendingQuotes,
        repliedQuotes,
        appointmentsCreated,
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
      });
    } catch (err) {
      console.error("❌ Error fetching stats:", err);
      console.error("Error details:", err.message, err.stack);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={fetchStats}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        <p className="text-sm sm:text-base text-gray-600">Overview of your quotes and appointments</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Total Quotes */}
        <Link
          to="/admin/quotes"
          className="bg-white rounded-xl shadow border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Quotes</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalQuotes}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </Link>

        {/* Pending Quotes */}
        <Link
          to="/admin/quotes"
          className="bg-white rounded-xl shadow border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Quotes</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingQuotes}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Link>

        {/* Replied Quotes */}
        <Link
          to="/admin/quotes"
          className="bg-white rounded-xl shadow border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Replied</p>
              <p className="text-3xl font-bold text-green-600">{stats.repliedQuotes}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Link>

        {/* Appointments Created */}
        <Link
          to="/admin/quotes"
          className="bg-white rounded-xl shadow border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Appointments Created</p>
              <p className="text-3xl font-bold text-purple-600">{stats.appointmentsCreated}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Link>
      </div>

      {/* Appointments Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Link
          to="/admin/appointments"
          className="bg-white rounded-xl shadow border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Appointments</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalAppointments}</p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </Link>

        <Link
          to="/admin/appointments?filter=pending"
          className="bg-white rounded-xl shadow border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Appointments</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingAppointments}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Link>

        <Link
          to="/admin/appointments?filter=confirmed"
          className="bg-white rounded-xl shadow border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Confirmed</p>
              <p className="text-3xl font-bold text-blue-600">{stats.confirmedAppointments}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Link
            to="/admin/quotes"
            className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">View All Quotes</span>
          </Link>
          <Link
            to="/admin/appointments"
            className="flex items-center gap-3 p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
          >
            <Calendar className="w-5 h-5 text-teal-600" />
            <span className="font-semibold text-gray-900">View Appointments</span>
          </Link>
          <Link
            to="/admin/quotes?filter=unread"
            className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="font-semibold text-gray-900">Pending Quotes</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

