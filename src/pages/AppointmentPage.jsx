import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, Calendar, Clock, ArrowLeft, AlertCircle, MapPin, XCircle } from "lucide-react";
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AppointmentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const quoteNumber = searchParams.get("quote");
  const cancelAppointmentId = searchParams.get("cancel");
  
  // Debug: Log URL parameters
  useEffect(() => {
    console.log("🔍 AppointmentPage - URL Parameters:", {
      quoteNumber,
      cancelAppointmentId,
      allParams: Object.fromEntries(searchParams.entries()),
      currentUrl: window.location.href
    });
  }, [quoteNumber, cancelAppointmentId, searchParams]);
  
  const [quoteData, setQuoteData] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingAppointment, setExistingAppointment] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Check if appointment can be cancelled (within 24 hours) - defined before useEffect
  const canCancelAppointment = (appointment) => {
    if (!appointment || !appointment.preferredDate) return false;
    
    const appointmentDate = typeof appointment.preferredDate === 'string' 
      ? new Date(appointment.preferredDate) 
      : appointment.preferredDate.toDate 
        ? appointment.preferredDate.toDate() 
        : new Date(appointment.preferredDate);
    
    const now = new Date();
    const diffTime = appointmentDate.getTime() - now.getTime();
    const diffHours = diffTime / (1000 * 60 * 60);
    
    // Can cancel if appointment is more than 24 hours away
    return diffHours >= 24;
  };

  // Fetch quote data or appointment for cancellation
  useEffect(() => {
    const fetchData = async () => {
      // If cancel link is clicked, fetch appointment directly
      if (cancelAppointmentId) {
        try {
          const appointmentDoc = await getDoc(doc(db, "appointments", cancelAppointmentId));
          if (appointmentDoc.exists()) {
            const appointmentData = {
              id: appointmentDoc.id,
              ...appointmentDoc.data()
            };
            setExistingAppointment(appointmentData);
            
            // Also fetch quote data if quoteNumber exists
            if (appointmentData.quoteNumber) {
              const quotesQuery = query(
                collection(db, "quotes"),
                where("quoteNumber", "==", appointmentData.quoteNumber)
              );
              const quotesSnapshot = await getDocs(quotesQuery);
              if (!quotesSnapshot.empty) {
                const quoteDoc = quotesSnapshot.docs[0];
                setQuoteData({
                  id: quoteDoc.id,
                  ...quoteDoc.data()
                });
              }
            }
            
            // Show cancel confirmation if appointment can be cancelled
            if (canCancelAppointment(appointmentData) && appointmentData.status !== "cancelled") {
              setShowCancelConfirm(true);
            }
          } else {
            setError("Appointment not found");
          }
        } catch (err) {
          console.error("Error fetching appointment:", err);
          setError("Failed to load appointment information");
        } finally {
          setLoadingQuote(false);
        }
        return;
      }

      // Original quote fetching logic
      if (!quoteNumber) {
        if (!cancelAppointmentId) {
          setError("Quote number is required");
        }
        setLoadingQuote(false);
        return;
      }

      try {
        console.log("🔍 Fetching quote with number:", quoteNumber);
        const quotesQuery = query(
          collection(db, "quotes"),
          where("quoteNumber", "==", quoteNumber)
        );
        const quotesSnapshot = await getDocs(quotesQuery);
        
        console.log("📊 Quotes found:", quotesSnapshot.size);
        
        if (quotesSnapshot.empty) {
          console.error("❌ Quote not found in database:", quoteNumber);
          setError(`Quote #${quoteNumber} not found. Please check the quote number and try again.`);
          setLoadingQuote(false);
          return;
        }

        const quoteDoc = quotesSnapshot.docs[0];
        setQuoteData({
          id: quoteDoc.id,
          ...quoteDoc.data()
        });

        // Check if appointment already exists for this quote
        const appointmentsQuery = query(
          collection(db, "appointments"),
          where("quoteNumber", "==", quoteNumber)
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        
        if (!appointmentsSnapshot.empty) {
          const appointmentDoc = appointmentsSnapshot.docs[0];
          const appointmentData = {
            id: appointmentDoc.id,
            ...appointmentDoc.data()
          };
          setExistingAppointment(appointmentData);
        } else {
          // Set default date to today
          const today = new Date();
          today.setDate(today.getDate() + 1); // Start from tomorrow
          setSelectedDate(today.toISOString().split('T')[0]);
        }
      } catch (err) {
        console.error("❌ Error fetching quote:", err);
        console.error("❌ Error details:", {
          message: err.message,
          code: err.code,
          stack: err.stack
        });
        setError(`Failed to load quote information: ${err.message || "Unknown error"}. Please try again or contact support.`);
      } finally {
        setLoadingQuote(false);
      }
    };

    fetchData();
  }, [quoteNumber, cancelAppointmentId]);

  // Fetch available slots and blocked slots
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        // Fetch available slots from admin settings
        const slotsDoc = await getDoc(doc(db, "appointmentSettings", "availableSlots"));
        if (slotsDoc.exists()) {
          const data = slotsDoc.data();
          setAvailableSlots(data.slots || []);
        } else {
          // Default slots if not set
          const defaultSlots = [
            "08:00", "09:00", "10:00", "11:00", "12:00",
            "13:00", "14:00", "15:00", "16:00", "17:00",
          ];
          setAvailableSlots(defaultSlots);
        }

        // Fetch blocked slots (existing appointments)
        if (selectedDate) {
          try {
            // Try with where clause first
            const pendingQuery = query(
              collection(db, "appointments"),
              where("preferredDate", "==", selectedDate),
              where("status", "==", "pending")
            );
            const confirmedQuery = query(
              collection(db, "appointments"),
              where("preferredDate", "==", selectedDate),
              where("status", "==", "confirmed")
            );
            
            const [pendingSnapshot, confirmedSnapshot] = await Promise.all([
              getDocs(pendingQuery),
              getDocs(confirmedQuery)
            ]);
            
            const blocked = [
              ...pendingSnapshot.docs.map(doc => doc.data().preferredTime),
              ...confirmedSnapshot.docs.map(doc => doc.data().preferredTime),
            ].filter(Boolean);
            setBlockedSlots(blocked);
          } catch (err) {
            // Fallback: fetch all appointments for the date
            console.log("Where query failed, using fallback:", err);
            const allAppointmentsQuery = query(
              collection(db, "appointments"),
              where("preferredDate", "==", selectedDate)
            );
            const appointmentsSnapshot = await getDocs(allAppointmentsQuery);
            const blocked = appointmentsSnapshot.docs
              .map(doc => {
                const data = doc.data();
                return (data.status === "pending" || data.status === "confirmed") ? data.preferredTime : null;
              })
              .filter(Boolean);
            setBlockedSlots(blocked);
          }
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
        // Use default slots on error
        setAvailableSlots([
          "08:00", "09:00", "10:00", "11:00", "12:00",
          "13:00", "14:00", "15:00", "16:00", "17:00",
        ]);
      }
    };

    fetchSlots();
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      setError("Please select both date and time");
      return;
    }

    if (!address.trim()) {
      setError("Please enter your service address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Check if slot is still available
      let existingAppointments;
      try {
        const pendingQuery = query(
          collection(db, "appointments"),
          where("preferredDate", "==", selectedDate),
          where("preferredTime", "==", selectedTime),
          where("status", "==", "pending")
        );
        const confirmedQuery = query(
          collection(db, "appointments"),
          where("preferredDate", "==", selectedDate),
          where("preferredTime", "==", selectedTime),
          where("status", "==", "confirmed")
        );
        const [pendingSnapshot, confirmedSnapshot] = await Promise.all([
          getDocs(pendingQuery),
          getDocs(confirmedQuery)
        ]);
        existingAppointments = { 
          empty: pendingSnapshot.empty && confirmedSnapshot.empty,
          docs: [...pendingSnapshot.docs, ...confirmedSnapshot.docs]
        };
      } catch (err) {
        // Fallback: check all appointments
        console.log("Where query failed, using fallback:", err);
        const allQuery = query(
          collection(db, "appointments"),
          where("preferredDate", "==", selectedDate),
          where("preferredTime", "==", selectedTime)
        );
        const snapshot = await getDocs(allQuery);
        existingAppointments = {
          empty: snapshot.docs.filter(doc => {
            const status = doc.data().status;
            return status === "pending" || status === "confirmed";
          }).length === 0,
          docs: snapshot.docs.filter(doc => {
            const status = doc.data().status;
            return status === "pending" || status === "confirmed";
          })
        };
      }
      
      if (!existingAppointments.empty) {
        setError("This time slot is no longer available. Please select another time.");
        setLoading(false);
        return;
      }

      // Create appointment in Firestore
      const appointmentData = {
        quoteNumber: quoteNumber,
        customerName: quoteData.name,
        customerEmail: quoteData.email,
        customerPhone: quoteData.phone || "",
        serviceAddress: address.trim(),
        preferredDate: selectedDate,
        preferredTime: selectedTime,
        notes: notes || "",
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Save appointment to Firestore
      const appointmentRef = await addDoc(collection(db, "appointments"), appointmentData);
      console.log("✅ Appointment created:", appointmentRef.id);

      // Update the quote status
      if (quoteData.id) {
        try {
          await updateDoc(doc(db, "quotes", quoteData.id), {
            status: "Appointment Created",
            appointmentId: appointmentRef.id,
            appointmentCreatedAt: serverTimestamp(),
          });
          console.log("✅ Quote updated with appointment status");
        } catch (quoteError) {
          console.error("Error updating quote:", quoteError);
        }
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Error creating appointment:", err);
      setError(`Failed to create appointment: ${err.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  // Generate calendar days (1 month view)
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + 1); // Start from tomorrow
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getAvailableTimes = () => {
    return availableSlots.filter(slot => !blockedSlots.includes(slot));
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatName = (name) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };


  // Handle appointment cancellation
  const handleCancelAppointment = async () => {
    if (!existingAppointment) return;
    
    if (!canCancelAppointment(existingAppointment)) {
      setError("Appointments can only be cancelled at least 24 hours in advance. Please call us at (617) 202-1372 to cancel.");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this appointment? You will receive a confirmation email.")) {
      return;
    }

    setCancelling(true);
    setError("");

    try {
      // Update appointment status
      await updateDoc(doc(db, "appointments", existingAppointment.id), {
        status: "cancelled",
        updatedAt: serverTimestamp(),
        cancelledAt: serverTimestamp(),
      });

      // Send cancellation email
      const websiteUrl = window.location.origin;
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/send_appointment_cancellation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: existingAppointment.customerEmail,
          templateData: {
            customerName: existingAppointment.customerName || "Valued Customer",
            customerPhone: existingAppointment.customerPhone,
            appointmentDate: existingAppointment.preferredDate,
            appointmentTime: existingAppointment.preferredTime,
            quoteNumber: existingAppointment.quoteNumber || null,
            serviceType: existingAppointment.serviceType || "Cleaning Service",
            companyName: "SolVida Clean",
            companyPhone: "(617) 202-1372",
            companyEmail: "info@solvidaclean.com",
            companyAddress: "",
            websiteUrl: websiteUrl,
          }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to send cancellation email");
      }

      const result = await response.json();
      if (result.success) {
        setExistingAppointment({ ...existingAppointment, status: "cancelled" });
        alert("Your appointment has been cancelled. A confirmation email has been sent to your email address.");
      } else {
        throw new Error(result.error || "Failed to send cancellation email");
      }
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      setError(`Failed to cancel appointment: ${err.message}`);
    } finally {
      setCancelling(false);
    }
  };

  if (loadingQuote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quote information...</p>
        </div>
      </div>
    );
  }

  if (error && !quoteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Show existing appointment if found
  if (existingAppointment && !submitted) {
    const appointmentDate = typeof existingAppointment.preferredDate === 'string' 
      ? new Date(existingAppointment.preferredDate) 
      : existingAppointment.preferredDate.toDate 
        ? existingAppointment.preferredDate.toDate() 
        : new Date(existingAppointment.preferredDate);
    
    const canCancel = canCancelAppointment(existingAppointment);
    const isCancelled = existingAppointment.status === "cancelled";
    const isPending = existingAppointment.status === "pending";
    const isConfirmed = existingAppointment.status === "confirmed";

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Your Appointment
              </h1>
              {quoteNumber && (
                <p className="text-gray-600">
                  Quote #{quoteNumber}
                </p>
              )}
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Date</span>
                </div>
                <p className="text-gray-700">
                  {appointmentDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {existingAppointment.preferredTime && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Time</span>
                  </div>
                  <p className="text-gray-700">{formatTime(existingAppointment.preferredTime)}</p>
                </div>
              )}

              {existingAppointment.serviceAddress && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Address</span>
                  </div>
                  <p className="text-gray-700">{existingAppointment.serviceAddress}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900">Status</span>
                </div>
                <p className={`font-semibold ${
                  isCancelled ? 'text-red-600' :
                  isPending ? 'text-yellow-600' :
                  isConfirmed ? 'text-green-600' :
                  'text-gray-600'
                }`}>
                  {isCancelled ? 'Cancelled' : isPending ? 'Pending' : isConfirmed ? 'Confirmed' : 'Unknown'}
                </p>
              </div>
            </div>

            {!isCancelled && canCancel && (
              <div className="border-t border-gray-200 pt-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> You can cancel this appointment up to 24 hours before the scheduled time.
                  </p>
                </div>
                <button
                  onClick={handleCancelAppointment}
                  disabled={cancelling}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  {cancelling ? "Cancelling..." : "Cancel Appointment"}
                </button>
              </div>
            )}

            {!isCancelled && !canCancel && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This appointment cannot be cancelled online as it is less than 24 hours away. Please call us at <a href="tel:(617) 202-1372" className="font-semibold underline">(617) 202-1372</a> to cancel or reschedule.
                </p>
              </div>
            )}

            {isCancelled && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  This appointment has been cancelled. If you would like to reschedule, please call us at <a href="tel:(617) 202-1372" className="font-semibold underline">(617) 202-1372</a>.
                </p>
              </div>
            )}

            {/* Cancel Confirmation Modal (from email link) */}
            {showCancelConfirm && canCancel && !isCancelled && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
                  <div className="text-center mb-4">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Cancel Appointment?</h2>
                    <p className="text-gray-600 mb-4">
                      Are you sure you want to cancel this appointment? A confirmation email will be sent to your email address.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Date:</strong> {appointmentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Time:</strong> {existingAppointment.preferredTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Keep Appointment
                    </button>
                    <button
                      onClick={() => {
                        setShowCancelConfirm(false);
                        handleCancelAppointment();
                      }}
                      disabled={cancelling}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                    >
                      {cancelling ? "Cancelling..." : "Yes, Cancel"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate("/")}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Appointment Request Received!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for accepting the quote. We have received your appointment request and will contact you shortly to confirm the details.
          </p>
          {quoteNumber && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Quote Number:</span> {quoteNumber}
              </p>
            </div>
          )}
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const calendarDays = generateCalendarDays();
  const availableTimes = getAvailableTimes();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Schedule Your Appointment
          </h1>
          {quoteData && (
            <p className="text-gray-600">
              Quote #{quoteNumber} - {formatName(quoteData.name)}
            </p>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {quoteNumber && quoteData && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Quote #{quoteNumber} Accepted</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Calendar - 1 Month View */}
            <div>
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4">
                <Calendar className="w-5 h-5 text-blue-600" />
                Select Date
              </label>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                {calendarDays.map((date, index) => {
                  const dateStr = formatDate(date);
                  const isSelected = selectedDate === dateStr;
                  const isPast = date < new Date();
                  
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => !isPast && setSelectedDate(dateStr)}
                      disabled={isPast}
                      className={`
                        p-3 rounded-lg text-sm font-medium transition-all
                        ${isSelected 
                          ? "bg-blue-600 text-white shadow-md" 
                          : isPast
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }
                      `}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
              {selectedDate && (
                <p className="text-sm text-gray-600">
                  Selected: <span className="font-semibold">{formatDisplayDate(new Date(selectedDate))}</span>
                </p>
              )}
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Select Time
                </label>
                {availableTimes.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      No available time slots for this date. Please select another date.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`
                          px-4 py-3 rounded-lg text-sm font-medium transition-all
                          ${selectedTime === time
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
                          }
                        `}
                      >
                        {formatTime(time)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Service Address */}
            <div>
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Service Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter the address where cleaning service will be performed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Please provide the complete address including street, city, and zip code
              </p>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Any special instructions or notes..."
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedDate || !selectedTime || !address.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Appointment..." : "Confirm Appointment Request"}
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> After submitting this form, our team will contact you within 24 hours to confirm your appointment details.
          </p>
        </div>
      </div>
    </div>
  );
}
