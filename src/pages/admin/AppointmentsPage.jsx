import { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  where,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Filter,
  X,
  Plus,
  Save,
  MessageSquare,
  MapPin,
  Trash2,
} from "lucide-react";
import { useNotification } from "../../hooks/useNotification";
import NotificationModal from "../../components/NotificationModal";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [newSlot, setNewSlot] = useState("");
  const [savingSlots, setSavingSlots] = useState(false);
  
  const [user, loadingAuth] = useAuthState(auth);
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  // Debug: Check auth status
  useEffect(() => {
    console.log("🔐 Auth status:", {
      user: user ? user.email : "Not logged in",
      loading: loadingAuth,
      uid: user?.uid
    });
  }, [user, loadingAuth]);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      let q;
      try {
        q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
      } catch (orderByError) {
        // If orderBy fails (e.g., missing index), fetch without orderBy
        q = query(collection(db, "appointments"));
      }
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Sort manually by createdAt if it exists
      if (data.length > 0 && data.some(item => item.createdAt)) {
        data.sort((a, b) => {
          const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
          const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
          return bTime - aTime;
        });
      }
      
      setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      // Only show error for real errors, not for empty collections or missing indexes
      const errorCode = err.code || err.message || '';
      const isIndexError = errorCode.includes('index') || errorCode.includes('Index');
      const isPermissionError = errorCode === 'permission-denied';
      
      if (!isIndexError && !isPermissionError) {
        // Only show error for real network/connection errors
        showError({
          title: "Error",
          message: "Failed to fetch appointments. Please try again."
        });
      }
      // Set empty array for index/permission issues or if collection doesn't exist yet
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchAppointments();
    fetchTimeSlots();
  }, [fetchAppointments]);

  const fetchTimeSlots = async () => {
    try {
      const slotsDoc = await getDoc(doc(db, "appointmentSettings", "availableSlots"));
      if (slotsDoc.exists()) {
        const data = slotsDoc.data();
        setAvailableSlots(data.slots || []);
      } else {
        // Default slots
        const defaultSlots = [
          "08:00", "09:00", "10:00", "11:00", "12:00",
          "13:00", "14:00", "15:00", "16:00", "17:00",
        ];
        setAvailableSlots(defaultSlots);
        console.log("⚠️ No slots found, using defaults");
        
        // Try to save default slots
        try {
          await setDoc(doc(db, "appointmentSettings", "availableSlots"), {
            slots: defaultSlots,
            createdAt: new Date(),
          });
          console.log("✅ Default slots saved");
        } catch (saveErr) {
          console.error("❌ Error saving default slots:", saveErr);
        }
      }
    } catch (err) {
      console.error("❌ Error fetching time slots:", err);
      console.error("Error code:", err.code);
      console.error("Error message:", err.message);
      
      // Use default slots on error
      const defaultSlots = [
        "08:00", "09:00", "10:00", "11:00", "12:00",
        "13:00", "14:00", "15:00", "16:00", "17:00",
      ];
      setAvailableSlots(defaultSlots);
    }
  };

  const handleAddSlot = () => {
    if (!newSlot || availableSlots.includes(newSlot)) {
      return;
    }
    
    // Validate time format (HH:MM)
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(newSlot)) {
      showError({
        title: "Invalid Time",
        message: "Please enter time in HH:MM format (e.g., 09:00)"
      });
      return;
    }

    const updated = [...availableSlots, newSlot].sort();
    setAvailableSlots(updated);
    setNewSlot("");
  };

  const handleRemoveSlot = (slot) => {
    const updated = availableSlots.filter(s => s !== slot);
    setAvailableSlots(updated);
  };

  const handleSaveSlots = async () => {
    // Check if user is logged in
    if (!user) {
      showError({
        title: "Authentication Required",
        message: "You must be logged in to save time slots. Please refresh the page and log in again."
      });
      return;
    }

    try {
      setSavingSlots(true);
      console.log("💾 Saving time slots:", availableSlots);
      console.log("👤 Current user:", user.email, user.uid);
      
      // Try to save with setDoc
      const settingsRef = doc(db, "appointmentSettings", "availableSlots");
      await setDoc(settingsRef, {
        slots: availableSlots,
        updatedAt: new Date(),
      }, { merge: true });
      
      console.log("✅ Time slots saved successfully");
      showSuccess({
        title: "Success",
        message: "Time slots saved successfully"
      });
      setShowTimeSlots(false);
    } catch (err) {
      console.error("❌ Error saving time slots:", err);
      console.error("Error code:", err.code);
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
      console.error("Current user:", user ? `${user.email} (${user.uid})` : "Not logged in");
      
      // More detailed error message
      let errorMessage = "Failed to save time slots";
      if (err.code === "permission-denied") {
        errorMessage = `Permission denied. User: ${user ? user.email : 'Not logged in'}. Please check Firestore security rules for 'appointmentSettings' collection and make sure you're logged in.`;
      } else if (err.message) {
        errorMessage = `Failed to save: ${err.message}`;
      }
      
      showError({
        title: "Error",
        message: errorMessage
      });
    } finally {
      setSavingSlots(false);
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // SMS Preview Modal State
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [smsContent, setSmsContent] = useState("");
  const [smsCopied, setSmsCopied] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  const [appointmentsForDate, setAppointmentsForDate] = useState([]);

  // Generate SMS content preview
  const generateSMSContent = (appointment) => {
    if (!appointment) return "";

    const formattedDate = new Date(appointment.preferredDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedTime = formatTime(appointment.preferredTime);
    const customerName = appointment.customerName || 'there';
    const quoteText = appointment.quoteNumber ? `Quote: ${appointment.quoteNumber}` : '';

    return `Hi ${customerName}! Your appointment with SolVida Clean has been confirmed for ${formattedDate} at ${formattedTime}. ${quoteText} Questions? Call (617) 202-1372`;
  };

  // Open SMS preview modal
  const openSMSModal = (appointment) => {
    if (!appointment.customerPhone) {
      showError({
        title: "No Phone Number",
        message: "Customer phone number is not available for this appointment."
      });
      return;
    }
    setSelectedAppointment(appointment);
    setSmsContent(generateSMSContent(appointment));
    setShowSMSModal(true);
  };

  // Copy SMS content
  const copySMSContent = async () => {
    try {
      await navigator.clipboard.writeText(smsContent);
      setSmsCopied(true);
      setTimeout(() => setSmsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      showError({
        title: "Copy Failed",
        message: "Failed to copy SMS content to clipboard."
      });
    }
  };

  const updateAppointmentStatus = async (id, newStatus) => {
    try {
      const appointment = appointments.find(apt => apt.id === id);
      if (!appointment) {
        showError({
          title: "Error",
          message: "Appointment not found"
        });
        return;
      }

      // Show confirmation dialog for cancellation
      if (newStatus === "cancelled") {
        const appointmentDateStr = appointment.preferredDate 
          ? (typeof appointment.preferredDate === 'string' 
              ? new Date(appointment.preferredDate).toLocaleDateString() 
              : appointment.preferredDate.toDate 
                ? appointment.preferredDate.toDate().toLocaleDateString() 
                : new Date(appointment.preferredDate).toLocaleDateString())
          : 'N/A';
        
        const confirmMessage = `Are you sure you want to cancel this appointment?\n\nCustomer: ${appointment.customerName}\nDate: ${appointmentDateStr}\nTime: ${appointment.preferredTime || 'N/A'}\n\nA cancellation email will be sent to ${appointment.customerEmail || 'the customer'}.`;
        
        if (!window.confirm(confirmMessage)) {
          return; // User cancelled the confirmation
        }
      }

      await updateDoc(doc(db, "appointments", id), {
        status: newStatus,
        updatedAt: new Date(),
      });
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
      );

      // Send cancellation email if status is "cancelled"
      if (newStatus === "cancelled") {
        // Check if customer has email
        if (!appointment.customerEmail) {
          console.warn("⚠️ Cannot send cancellation email: customer email is missing");
          showError({
            title: "Email Warning",
            message: "Appointment cancelled but customer email is missing. Email could not be sent."
          });
        } else {
          try {
            console.log("📧 Preparing to send cancellation email to:", appointment.customerEmail);
            const websiteUrl = window.location.origin;
            
            const emailPayload = {
              to: appointment.customerEmail,
              templateData: {
                customerName: appointment.customerName || "Valued Customer",
                customerPhone: appointment.customerPhone,
                appointmentDate: appointment.preferredDate,
                appointmentTime: appointment.preferredTime,
                quoteNumber: appointment.quoteNumber || null,
                serviceType: appointment.serviceType || "Cleaning Service",
                companyName: "SolVida Clean",
                companyPhone: "(617) 202-1372",
                companyEmail: "info@solvidaclean.com",
                companyAddress: "",
                websiteUrl: websiteUrl,
              }
            };
            
            console.log("📧 Email payload:", JSON.stringify(emailPayload, null, 2));
            
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await fetch(`${API_URL}/api/send_appointment_cancellation`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(emailPayload)
            });

            console.log("📧 Response status:", response.status, response.statusText);

            if (!response.ok) {
              let errorText;
              try {
                errorText = await response.text();
                console.error("📧 Error response text:", errorText);
                // Try to parse as JSON
                try {
                  const errorJson = JSON.parse(errorText);
                  throw new Error(errorJson.error || errorText || `HTTP error! status: ${response.status}`);
                } catch {
                  throw new Error(errorText || `HTTP error! status: ${response.status}`);
                }
              } catch (parseErr) {
                throw new Error(`Server error: ${response.status} ${response.statusText}. Please check if the server is running on port 3001.`);
              }
            }

            const result = await response.json();
            console.log("📧 Email result:", result);
            
            if (result.success) {
              console.log("✅ Cancellation email sent to:", appointment.customerEmail);
              console.log("📧 Email ID:", result.result?.id);
              
              // Save email log to Firestore
              try {
                await addDoc(collection(db, "emailLogs"), {
                  type: "appointment_cancellation",
                  to: appointment.customerEmail,
                  appointmentId: id,
                  emailId: result.result?.id,
                  status: "sent",
                  createdAt: serverTimestamp(),
                });
                console.log("✅ Email log saved to Firestore");
              } catch (logErr) {
                console.error("⚠️ Failed to save email log:", logErr);
              }
            } else {
              throw new Error(result.error || "Email sending failed");
            }
          } catch (emailErr) {
            console.error("❌ Failed to send cancellation email:", emailErr);
            console.error("❌ Error details:", {
              message: emailErr.message,
              stack: emailErr.stack
            });
            showError({
              title: "Email Warning",
              message: `Appointment cancelled but email failed: ${emailErr.message}. Please check server logs and ensure the server is running on port 3001.`
            });
            // Don't fail the status update if email fails
          }
        }
      }

      // Send confirmation email if status is "confirmed" (SMS is manual now)
      if (newStatus === "confirmed" && appointment.customerEmail) {
        try {
          const websiteUrl = window.location.origin;
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
          const response = await fetch(`${API_URL}/api/send_appointment_confirmation`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: appointment.customerEmail,
              templateData: {
                customerName: appointment.customerName || "Valued Customer",
                customerPhone: appointment.customerPhone,
                appointmentDate: appointment.preferredDate,
                appointmentTime: appointment.preferredTime,
                quoteNumber: appointment.quoteNumber || null,
                serviceType: appointment.serviceType || "Cleaning Service",
                price: appointment.price || null,
                appointmentId: id,
                companyName: "SolVida Clean",
                companyPhone: "(617) 202-1372",
                companyEmail: "info@solvidaclean.com",
                companyAddress: "",
                websiteUrl: websiteUrl,
              }
            })
          });

          if (!response.ok) {
            let errorText;
            try {
              errorText = await response.text();
              // Try to parse as JSON
              try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.error || errorText || `HTTP error! status: ${response.status}`);
              } catch {
                throw new Error(errorText || `HTTP error! status: ${response.status}`);
              }
            } catch (parseErr) {
              throw new Error(`Server error: ${response.status} ${response.statusText}. Please check if the server is running on port 3001.`);
            }
          }

          const result = await response.json();
          if (result.success) {
            console.log("✅ Confirmation email sent to:", appointment.customerEmail);
            console.log("📧 Email ID:", result.result?.id);
            
            // Save email log to Firestore
            try {
              await addDoc(collection(db, "emailLogs"), {
                type: "appointment_confirmation",
                to: appointment.customerEmail,
                appointmentId: id,
                emailId: result.result?.id,
                status: "sent",
                createdAt: serverTimestamp(),
              });
            } catch (logErr) {
              console.error("⚠️ Failed to save email log:", logErr);
            }
          } else {
            throw new Error(result.error || "Email sending failed");
          }
        } catch (emailErr) {
          console.error("⚠️ Failed to send confirmation email:", emailErr);
          showError({
            title: "Email Warning",
            message: `Appointment confirmed but email failed: ${emailErr.message}`
          });
          // Don't fail the status update if email fails
        }
      }

      showSuccess({
        title: "Status Updated",
        message: newStatus === "confirmed" 
          ? `Appointment confirmed and confirmation email sent to ${appointment.customerEmail}`
          : newStatus === "cancelled"
          ? `Appointment cancelled${appointment.customerEmail ? ` and cancellation email sent to ${appointment.customerEmail}` : ''}`
          : `Appointment status updated to ${newStatus}`
      });
    } catch (err) {
      console.error("Error updating appointment:", err);
      showError({
        title: "Error",
        message: "Failed to update appointment status."
      });
    }
  };

  const handleDeleteAppointment = async (id) => {
    const appointment = appointments.find(apt => apt.id === id);
    if (!appointment) {
      showError({
        title: "Error",
        message: "Appointment not found"
      });
      return;
    }

    // Format appointment date for confirmation message
    const appointmentDateStr = appointment.preferredDate 
      ? (typeof appointment.preferredDate === 'string' 
          ? new Date(appointment.preferredDate).toLocaleDateString() 
          : appointment.preferredDate.toDate 
            ? appointment.preferredDate.toDate().toLocaleDateString() 
            : new Date(appointment.preferredDate).toLocaleDateString())
      : 'N/A';

    // Confirm deletion
    if (!window.confirm(`Are you sure you want to permanently delete this appointment?\n\nCustomer: ${appointment.customerName}\nDate: ${appointmentDateStr}\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, "appointments", id));
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
      
      // Update calendar view if appointment was deleted from selected date
      if (selectedCalendarDate) {
        setAppointmentsForDate((prev) => prev.filter((apt) => apt.id !== id));
        // If no appointments left for this date, clear selection
        const remaining = appointments.filter((apt) => apt.id !== id);
        const hasAppointmentsForDate = remaining.some(apt => {
          if (apt.status !== "confirmed") return false;
          const aptDateStr = typeof apt.preferredDate === 'string' 
            ? apt.preferredDate 
            : apt.preferredDate.toDate ? apt.preferredDate.toDate().toISOString().split('T')[0] 
            : new Date(apt.preferredDate).toISOString().split('T')[0];
          return aptDateStr === selectedCalendarDate;
        });
        if (!hasAppointmentsForDate) {
          setSelectedCalendarDate(null);
          setAppointmentsForDate([]);
        }
      }
      
      showSuccess({
        title: "Appointment Deleted",
        message: "Appointment has been permanently deleted."
      });
    } catch (err) {
      console.error("Error deleting appointment:", err);
      showError({
        title: "Error",
        message: "Failed to delete appointment: " + (err.message || "Unknown error")
      });
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "—";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        bgColor: "bg-yellow-100", 
        textColor: "text-yellow-800", 
        borderColor: "border-yellow-200",
        iconColor: "text-yellow-600",
        icon: Clock, 
        label: "Pending" 
      },
      confirmed: { 
        bgColor: "bg-blue-100", 
        textColor: "text-blue-800", 
        borderColor: "border-blue-200",
        iconColor: "text-blue-600",
        icon: CheckCircle, 
        label: "Confirmed" 
      },
      completed: { 
        bgColor: "bg-green-100", 
        textColor: "text-green-800", 
        borderColor: "border-green-200",
        iconColor: "text-green-600",
        icon: CheckCircle, 
        label: "Completed" 
      },
      cancelled: { 
        bgColor: "bg-red-100", 
        textColor: "text-red-800", 
        borderColor: "border-red-200",
        iconColor: "text-red-600",
        icon: XCircle, 
        label: "Cancelled" 
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
        <Icon className={`w-3 h-3 mr-1.5 ${config.iconColor}`} />
        {config.label}
      </span>
    );
  };

  const getFilteredAppointments = () => {
    let filtered = appointments.filter((apt) =>
      [apt.customerName || "", apt.customerEmail || "", apt.quoteNumber || "", apt.customerPhone || ""]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    if (filter !== "all") {
      filtered = filtered.filter((apt) => apt.status === filter);
    }

    return filtered;
  };

  const filteredAppointments = getFilteredAppointments();

  const statusCounts = {
    all: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  // Get confirmed appointments grouped by date
  const getConfirmedDates = () => {
    const confirmedDates = new Set();
    appointments.forEach(apt => {
      if (apt.status === "confirmed" && apt.preferredDate) {
        const dateStr = typeof apt.preferredDate === 'string' 
          ? apt.preferredDate 
          : apt.preferredDate.toDate ? apt.preferredDate.toDate().toISOString().split('T')[0] 
          : new Date(apt.preferredDate).toISOString().split('T')[0];
        confirmedDates.add(dateStr);
      }
    });
    return confirmedDates;
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from first day of week
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // End at last day of week
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    
    return days;
  };

  // Handle calendar date click
  const handleCalendarDateClick = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedCalendarDate(dateStr);
    
    // Find appointments for this date
    const aptsForDate = appointments.filter(apt => {
      if (apt.status !== "confirmed") return false;
      const aptDateStr = typeof apt.preferredDate === 'string' 
        ? apt.preferredDate 
        : apt.preferredDate.toDate ? apt.preferredDate.toDate().toISOString().split('T')[0] 
        : new Date(apt.preferredDate).toISOString().split('T')[0];
      return aptDateStr === dateStr;
    });
    
    setAppointmentsForDate(aptsForDate);
  };

  const confirmedDates = getConfirmedDates();
  const calendarDays = generateCalendarDays();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Appointments</h1>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setShowTimeSlots(!showTimeSlots)}
                  className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 text-xs sm:text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{showTimeSlots ? "Hide" : "Manage"} Time Slots</span>
                  <span className="sm:hidden">Time Slots</span>
                </button>
                <button
                  onClick={fetchAppointments}
                  disabled={loading}
                  className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  {loading ? "Loading..." : "Refresh"}
                </button>
              </div>
            </div>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search appointments..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Time Slots Management */}
        {showTimeSlots && (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Available Time Slots
            </h2>

            {/* Add New Slot */}
            <div className="flex gap-2 mb-6">
              <input
                type="time"
                value={newSlot}
                onChange={(e) => setNewSlot(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="HH:MM"
              />
              <button
                onClick={handleAddSlot}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                Add Slot
              </button>
              <button
                onClick={handleSaveSlots}
                disabled={savingSlots}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {savingSlots ? "Saving..." : "Save"}
              </button>
            </div>

            {/* Slots List */}
            {availableSlots.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No time slots available. Add slots to allow customers to book appointments.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {availableSlots.map((slot) => (
                  <div
                    key={slot}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span className="font-medium text-gray-900">{formatTime(slot)}</span>
                    <button
                      onClick={() => handleRemoveSlot(slot)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowCalendarView(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !showCalendarView
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setShowCalendarView(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showCalendarView
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Calendar View
            </button>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { value: "all", label: "All", count: statusCounts.all },
            { value: "pending", label: "Pending", count: statusCounts.pending },
            { value: "confirmed", label: "Confirmed", count: statusCounts.confirmed },
            { value: "completed", label: "Completed", count: statusCounts.completed },
            { value: "cancelled", label: "Cancelled", count: statusCounts.cancelled },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === option.value
                  ? "bg-blue-100 text-blue-800 border border-blue-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label}
              <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {option.count}
              </span>
            </button>
          ))}
        </div>

        {/* Calendar View */}
        {showCalendarView && (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Appointment Calendar</h2>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
                  {day}
                </div>
              ))}
              {calendarDays.map((date, index) => {
                const dateStr = date.toISOString().split('T')[0];
                const isToday = dateStr === new Date().toISOString().split('T')[0];
                const isCurrentMonth = date.getMonth() === new Date().getMonth();
                const hasConfirmed = confirmedDates.has(dateStr);
                const isSelected = selectedCalendarDate === dateStr;
                
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => hasConfirmed && handleCalendarDateClick(date)}
                    disabled={!hasConfirmed}
                    className={`
                      relative p-3 rounded-lg text-sm font-medium transition-all
                      ${!isCurrentMonth 
                        ? "text-gray-300" 
                        : isSelected
                        ? "bg-blue-600 text-white shadow-md"
                        : isToday
                        ? "bg-blue-50 text-blue-700 border-2 border-blue-300"
                        : hasConfirmed
                        ? "bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                        : "bg-white text-gray-400 cursor-not-allowed"
                      }
                    `}
                  >
                    {date.getDate()}
                    {hasConfirmed && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Selected Date Appointments */}
            {selectedCalendarDate && appointmentsForDate.length > 0 && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Appointments for {new Date(selectedCalendarDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                <div className="space-y-4">
                  {appointmentsForDate.map((apt) => (
                    <div
                      key={apt.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{apt.customerName || 'Unknown'}</h4>
                            {apt.quoteNumber && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {apt.quoteNumber}
                              </span>
                            )}
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{apt.preferredTime || 'Time TBD'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span>{apt.customerEmail || 'No email'}</span>
                            </div>
                            {apt.customerPhone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{apt.customerPhone}</span>
                              </div>
                            )}
                            {apt.serviceAddress && (
                              <div className="flex items-start gap-2 mt-2">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700 font-medium">{apt.serviceAddress}</span>
                              </div>
                            )}
                            {apt.notes && (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <p className="text-xs text-gray-500">Notes:</p>
                                <p className="text-sm text-gray-700">{apt.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          {getStatusBadge(apt.status)}
                          {apt.status === "confirmed" && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, "completed")}
                              className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Complete
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAppointment(apt.id)}
                            className="px-3 py-1.5 bg-gray-600 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-1"
                            title="Delete appointment permanently"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedCalendarDate && appointmentsForDate.length === 0 && (
              <div className="mt-6 border-t border-gray-200 pt-6 text-center text-gray-500">
                No appointments found for this date.
              </div>
            )}
          </div>
        )}

        {/* Appointments Table */}
        {!showCalendarView && (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-3" />
              <span className="text-gray-600">Loading appointments...</span>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {search || filter !== "all" ? "No matching appointments found." : "No appointments found."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase">Quote #</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase">Date & Time</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase">Address</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase">Notes</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{apt.customerName}</div>
                        <div className="text-sm text-gray-500">{apt.customerEmail}</div>
                        {apt.customerPhone && (
                          <div className="text-sm text-gray-500">{apt.customerPhone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {apt.quoteNumber ? (
                          <span className="font-mono text-blue-700 font-semibold">{apt.quoteNumber}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {apt.preferredDate ? (
                          <>
                            <div className="flex items-center gap-2 text-gray-900">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>
                                {typeof apt.preferredDate === 'string' 
                                  ? new Date(apt.preferredDate).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : formatDate(apt.preferredDate)
                                }
                              </span>
                            </div>
                            {apt.preferredTime && (
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{apt.preferredTime}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {apt.serviceAddress ? (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700 max-w-xs">{apt.serviceAddress}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {apt.notes ? (
                          <p className="text-sm text-gray-600 max-w-xs truncate" title={apt.notes}>
                            {apt.notes}
                          </p>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(apt.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          {apt.status === "pending" && (
                            <>
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, "confirmed")}
                                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, "cancelled")}
                                className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {apt.status === "confirmed" && (
                            <>
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, "completed")}
                                className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                              >
                                Complete
                              </button>
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, "cancelled")}
                                className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Cancel
                              </button>
                              {apt.customerPhone && (
                                <button
                                  onClick={() => openSMSModal(apt)}
                                  className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1"
                                  title="View SMS content"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  View SMS
                                </button>
                              )}
                            </>
                          )}
                          {/* Delete button for all statuses */}
                          <button
                            onClick={() => handleDeleteAppointment(apt.id)}
                            className="px-3 py-1.5 bg-gray-600 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-1"
                            title="Delete appointment permanently"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              
              {/* Mobile Card View */}
              <div className="lg:hidden p-4 space-y-4">
                {filteredAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{apt.customerName || 'Unknown'}</h4>
                          {apt.quoteNumber && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {apt.quoteNumber}
                            </span>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          {apt.preferredDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {typeof apt.preferredDate === 'string' 
                                  ? new Date(apt.preferredDate).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : formatDate(apt.preferredDate)
                                }
                              </span>
                            </div>
                          )}
                          {apt.preferredTime && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{apt.preferredTime}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{apt.customerEmail || 'No email'}</span>
                          </div>
                          {apt.customerPhone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{apt.customerPhone}</span>
                            </div>
                          )}
                          {apt.serviceAddress && (
                            <div className="flex items-start gap-2 mt-2">
                              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 font-medium text-xs">{apt.serviceAddress}</span>
                            </div>
                          )}
                          {apt.notes && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <p className="text-xs text-gray-500">Notes:</p>
                              <p className="text-sm text-gray-700">{apt.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col gap-2">
                        {getStatusBadge(apt.status)}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                      {apt.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, "confirmed")}
                            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, "cancelled")}
                            className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {apt.status === "confirmed" && (
                        <>
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, "completed")}
                            className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, "cancelled")}
                            className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Cancel
                          </button>
                          {apt.customerPhone && (
                            <button
                              onClick={() => openSMSModal(apt)}
                              className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1"
                            >
                              <MessageSquare className="w-3 h-3" />
                              SMS
                            </button>
                          )}
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteAppointment(apt.id)}
                        className="px-3 py-1.5 bg-gray-600 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        )}
      </div>

      <NotificationModal 
        notification={notification} 
        onClose={hideNotification} 
      />

      {/* SMS Preview Modal */}
      {showSMSModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                SMS Content Preview
              </h2>
              <button
                onClick={() => {
                  setShowSMSModal(false);
                  setSelectedAppointment(null);
                  setSmsCopied(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">To:</p>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">{selectedAppointment.customerPhone}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Message:</p>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {smsContent}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Character count: {smsContent.length} / 160
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Copy this message and send it manually via your preferred SMS service.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSMSModal(false);
                  setSelectedAppointment(null);
                  setSmsCopied(false);
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={copySMSContent}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                {smsCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Message
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

