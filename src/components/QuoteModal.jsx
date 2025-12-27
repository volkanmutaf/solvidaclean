import React, { useState, useEffect } from "react";
import axios from "axios";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { 
  Clock, 
  CheckCircle, 
  Circle, 
  MailCheck, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Home, 
  Bed, 
  Bath, 
  MessageSquare,
  Send,
  Archive,
  X,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
  MapPin,
  DollarSign,
  FileText,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import { useNotification } from "../hooks/useNotification";
import NotificationModal from "./NotificationModal";

export default function QuoteModal({ quote, onClose, onArchive, onOpenQuote }) {
  const {
    id,
    quoteNumber,
    name,
    email: initialEmail,
    phone,
    service,
    message: initialMessage,
    imageUrls,
    status = "Pending",
    bedrooms,
    bathrooms,
    archived = false,
    timestamp,
  } = quote;

  const [editedEmail, setEditedEmail] = useState(initialEmail);
  const [response, setResponse] = useState("");
  const [sending, setSending] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [fullscreen, setFullscreen] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [isArchived, setIsArchived] = useState(archived);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [previousQuotes, setPreviousQuotes] = useState([]);
  const [previousResponses, setPreviousResponses] = useState([]);
  const [showPreviousQuotes, setShowPreviousQuotes] = useState(false);
  const [showPreviousResponses, setShowPreviousResponses] = useState(false);
  
  const { notification, showConfirmDialog, showSuccess, showError, hideNotification } = useNotification();

  const handleStatusChange = async () => {
    const newStatus = currentStatus === "Pending" ? "Replied" : "Pending";
    setCurrentStatus(newStatus);
    await updateDoc(doc(db, "quotes", id), { status: newStatus });
  };

  const handleSend = async () => {
    if (!response.trim()) {
      showError({
        title: "Validation Error",
        message: "Please enter a price before sending the quote."
      });
      return;
    }

    // Basic price validation (should contain numbers)
    const priceRegex = /[\d.,$€£¥]/;
    if (!priceRegex.test(response)) {
      showError({
        title: "Invalid Price",
        message: "Please enter a valid price (e.g., $150, €200, £99.99)"
      });
      return;
    }

    // Check if we've already sent a response to this customer
    if (previousResponses.length > 0) {
      const previousResponse = previousResponses[0];
      showConfirmDialog({
        title: "Previous Response Found",
        message: `You have already sent a quote response to this customer for Quote #${previousResponse.quoteNumber} (${previousResponse.response || 'No price recorded'}). Do you want to send another response for Quote #${quoteNumber}?`,
        onConfirm: async () => {
          await sendEmail();
        },
        onCancel: () => {
          // User cancelled
        }
      });
      return;
    }

    await sendEmail();
  };

  const sendEmail = async () => {
    setSending(true);
    try {
      // Get website URL (for appointment link)
      const websiteUrl = window.location.origin;

      // Format price - remove $ if user entered it, we'll add it in template
      const cleanPrice = response.trim().replace(/^\$/, '');

      // Send email with template data
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const _res = await axios.post(`${API_URL}/api/send_quote_response`, {
        to: editedEmail,
        subject: `Your Quote #${quoteNumber} - ${service || 'Cleaning Service'}`,
        message: `Your quote for ${service || 'Cleaning Service'} is $${cleanPrice}. Visit ${websiteUrl}/appointment?quote=${quoteNumber} to accept.`, // Plain text fallback
        templateData: {
          customerName: name,
          quoteNumber: quoteNumber,
          serviceType: service && service.toLowerCase().includes('deep') ? 'Professional Cleaning' : (service || "General Cleaning"),
          price: cleanPrice, // Price without $, template will add it
          bedrooms: bedrooms || null,
          bathrooms: bathrooms || null,
          companyName: "SolVida Clean",
          companyPhone: "(617) 202-1372",
          companyEmail: "info@solvidaclean.com",
          companyAddress: "",
          websiteUrl: websiteUrl,
        }
      });

      // Update Firestore with response timestamp and price
      await updateDoc(doc(db, "quotes", id), {
        email: editedEmail,
        status: "Replied",
        response: cleanPrice, // Store the price without $
        price: cleanPrice, // Also store as price field
        responseTimestamp: new Date(),
      });

      setCurrentStatus("Replied");
      showSuccess({
        title: "Quote Sent Successfully",
        message: `Professional quote email with price $${cleanPrice} has been sent to ${editedEmail}`
      });
      
      // Close modal and return to quotes page after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      showError({
        title: "Email Failed",
        message: "Email failed: " + (err.response?.data?.error || err.message)
      });
    } finally {
      setSending(false);
    }
  };

  // State for SMS modal
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [smsCopied, setSmsCopied] = useState(false);

  // Generate SMS content
  const generateSMSContent = () => {
    if (!response.trim()) return "";
    const cleanPrice = response.trim().replace(/^\$/, '');
    const formattedPrice = `$${cleanPrice}`;
    const websiteUrl = window.location.origin;
    const appointmentLink = `${websiteUrl}/appointment?quote=${quoteNumber}`;
    
    return `Hi ${name || 'there'}! Your quote #${quoteNumber} from SolVida Clean: ${formattedPrice} for ${service || 'Cleaning Service'}. Accept: ${appointmentLink} Questions? (617) 202-1372`;
  };

  // Open SMS modal
  const openSMSModal = () => {
    if (!phone) {
      showError({
        title: "No Phone Number",
        message: "Customer phone number is not available for this quote."
      });
      return;
    }
    if (!response.trim()) {
      showError({
        title: "No Price",
        message: "Please enter a price first to preview SMS content."
      });
      return;
    }
    setShowSMSModal(true);
  };

  // Copy SMS content
  const copySMSContent = async () => {
    try {
      await navigator.clipboard.writeText(generateSMSContent());
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

  const handleArchive = async () => {
    showConfirmDialog({
      title: "Archive Quote",
      message: "Are you sure you want to archive this quote?",
      onConfirm: async () => {
        setArchiving(true);
        try {
          await updateDoc(doc(db, "quotes", id), { archived: true });
          setIsArchived(true);
          if (onArchive) onArchive(id);
          showSuccess({
            title: "Quote Archived",
            message: "Quote has been archived successfully."
          });
        } catch (err) {
          showError({
            title: "Archive Failed",
            message: "Failed to archive: " + (err.message || err)
          });
        } finally {
          setArchiving(false);
        }
      }
    });
  };

  const handleCopyQuoteNumber = async () => {
    try {
      await navigator.clipboard.writeText(`${quoteNumber}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = `${quoteNumber}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openImageSlider = (imageUrl, index) => {
    setSelectedImage(imageUrl);
    setSelectedImageIndex(index);
  };

  const closeImageSlider = () => {
    setSelectedImage(null);
    setSelectedImageIndex(0);
  };

  const goToPreviousImage = () => {
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
      const newIndex = selectedImageIndex === 0 ? imageUrls.length - 1 : selectedImageIndex - 1;
      setSelectedImageIndex(newIndex);
      setSelectedImage(imageUrls[newIndex]);
    }
  };

  const goToNextImage = () => {
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
      const newIndex = selectedImageIndex === imageUrls.length - 1 ? 0 : selectedImageIndex + 1;
      setSelectedImageIndex(newIndex);
      setSelectedImage(imageUrls[newIndex]);
    }
  };

  const handleKeyDown = (e) => {
    if (!selectedImage) return;
    
    if (e.key === 'Escape') {
      closeImageSlider();
    } else if (e.key === 'ArrowLeft') {
      goToPreviousImage();
    } else if (e.key === 'ArrowRight') {
      goToNextImage();
    }
  };

  useEffect(() => {
    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedImage, selectedImageIndex]);

  // Check for previous quotes with same email or phone
  useEffect(() => {
    const checkPreviousQuotes = async () => {
      try {
        const emailToCheck = editedEmail || initialEmail;
        let allQuotes = [];

        // Try to fetch by email
        if (emailToCheck) {
          try {
            const emailQuery = query(
              collection(db, "quotes"),
              where("email", "==", emailToCheck)
            );
            const emailSnapshot = await getDocs(emailQuery);
            allQuotes = [...allQuotes, ...emailSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))];
          } catch (err) {
            console.log("Email query failed, trying without where:", err);
            // Fallback: fetch all and filter
            try {
              const allQuotesQuery = query(collection(db, "quotes"));
              const allSnapshot = await getDocs(allQuotesQuery);
              const emailQuotes = allSnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(q => q.email === emailToCheck);
              allQuotes = [...allQuotes, ...emailQuotes];
            } catch (fallbackErr) {
              console.error("Fallback query failed:", fallbackErr);
            }
          }
        }

        // Try to fetch by phone
        if (phone) {
          try {
            const phoneQuery = query(
              collection(db, "quotes"),
              where("phone", "==", phone)
            );
            const phoneSnapshot = await getDocs(phoneQuery);
            allQuotes = [...allQuotes, ...phoneSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))];
          } catch (err) {
            console.log("Phone query failed, trying without where:", err);
            // Fallback: fetch all and filter
            try {
              const allQuotesQuery = query(collection(db, "quotes"));
              const allSnapshot = await getDocs(allQuotesQuery);
              const phoneQuotes = allSnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(q => q.phone === phone);
              allQuotes = [...allQuotes, ...phoneQuotes];
            } catch (fallbackErr) {
              console.error("Fallback query failed:", fallbackErr);
            }
          }
        }

        // Remove duplicates and current quote
        const uniqueQuotes = allQuotes.filter((q, index, self) => 
          index === self.findIndex(t => t.id === q.id) && q.id !== id
        );

        setPreviousQuotes(uniqueQuotes);

        // Check for previous responses (quotes with status "Replied" or "Appointment Created")
        const previousResponsesList = uniqueQuotes.filter(q => 
          q.status === "Replied" || q.status === "Appointment Created"
        );
        setPreviousResponses(previousResponsesList);
      } catch (err) {
        console.error("Error checking previous quotes:", err);
      }
    };

    if (editedEmail || initialEmail || phone) {
      checkPreviousQuotes();
    }
  }, [editedEmail, phone, id, initialEmail]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = () => {
    if (currentStatus === "Replied") {
      return (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md border border-green-400">
            <CheckCircle className="w-3 h-3 mr-1.5" />
            Replied
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-300 shadow-sm">
            <MailCheck className="w-3 h-3 mr-1" />
            Read
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md border border-yellow-300">
            <Clock className="w-3 h-3 mr-1.5" />
            Pending
          </span>
        </div>
      );
    }
  };

  return (
    <div
      className="z-50 font-sans fixed inset-0 flex items-center justify-center transition-all duration-300 bg-black bg-opacity-50 backdrop-blur-sm"
      style={{ animation: "fadeIn 0.3s ease-out" }}
      aria-modal="true"
      role="dialog"
    >
      <style>{`
        @keyframes fadeIn { 
          from { opacity: 0; transform: scale(0.95); } 
          to { opacity: 1; transform: scale(1); } 
        }
        @keyframes slideIn { 
          from { transform: translateY(-20px); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }
        .modal-shadow { 
          box-shadow: 0 20px 60px rgba(0,0,0,0.2), 0 10px 30px rgba(0,0,0,0.1);
        }
        .modal-anim { animation: slideIn 0.3s ease-out; }
        .sticky-header { 
          position: sticky; 
          top: 0; 
          z-index: 10; 
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          backdrop-filter: blur(10px);
        }
        .image-gallery { 
          scrollbar-width: thin; 
          scrollbar-color: #3b82f6 #e2e8f0; 
        }
        .image-gallery::-webkit-scrollbar { height: 6px; }
        .image-gallery::-webkit-scrollbar-track { 
          background: #f1f5f9; 
          border-radius: 3px; 
          border: 1px solid #e2e8f0;
        }
        .image-gallery::-webkit-scrollbar-thumb { 
          background: linear-gradient(135deg, #3b82f6, #1d4ed8); 
          border-radius: 3px; 
          border: 1px solid #1d4ed8;
        }
        .image-gallery::-webkit-scrollbar-thumb:hover { 
          background: linear-gradient(135deg, #2563eb, #1e40af); 
        }
        .section-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.02);
          transition: all 0.3s ease;
        }
        .section-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 15px rgba(59,130,246,0.1), 0 2px 6px rgba(0,0,0,0.05);
          transform: translateY(-1px);
        }
        .input-field {
          background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        .input-field:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.1), 0 2px 8px rgba(59,130,246,0.1);
          transform: translateY(-1px);
        }
      `}</style>
      
      <div
        className={`relative bg-white w-full ${fullscreen ? "h-full p-0" : "max-w-4xl p-0"} rounded-xl modal-shadow modal-anim transition-all duration-300 ${fullscreen ? "" : "scale-100"}`}
        style={{ maxHeight: fullscreen ? '100vh' : '90vh', overflow: 'hidden', border: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}
      >
        {/* Compact Header */}
        <div className="sticky-header flex items-center justify-between border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-0.5">Quote Details</h2>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-500" />
                    {formatDate(timestamp)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="flex items-center gap-1 font-semibold text-blue-600">
                      <DollarSign className="w-3 h-3" />
                      Quote #{quoteNumber}
                    </span>
                    <button
                      onClick={handleCopyQuoteNumber}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200 border border-transparent hover:border-blue-200"
                      title="Copy quote number"
                    >
                      {copied ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isArchived && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md border border-blue-400">
                <Archive className="w-3 h-3 mr-1.5" />
                Archived
              </span>
            )}
            {getStatusBadge()}
            <button
              onClick={() => setFullscreen(!fullscreen)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200"
              title={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-transparent hover:border-red-200"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Compact Scrollable Content */}
        <div className="overflow-y-auto px-6 pb-6 pt-4" style={{ maxHeight: fullscreen ? 'calc(100vh - 0px)' : 'calc(90vh - 72px)' }}>
          
          {/* Compact Customer Information Section */}
          <div className="section-card rounded-lg p-4 mb-4">
            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-3">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <User className="w-4 h-4 text-white" />
              </div>
              Customer Information
            </h3>

            {/* Previous Quotes Warning */}
            {previousQuotes.length > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-yellow-800 mb-1">
                      Previous Quote Request Found
                    </p>
                    <p className="text-xs text-yellow-700 mb-2">
                      This customer ({editedEmail || initialEmail} {phone ? `or ${phone}` : ''}) has previously submitted {previousQuotes.length} quote request(s).
                    </p>
                    <button
                      onClick={() => setShowPreviousQuotes(!showPreviousQuotes)}
                      className="text-xs text-yellow-700 hover:text-yellow-800 underline font-medium"
                    >
                      {showPreviousQuotes ? "Hide" : "Show"} previous quotes ({previousQuotes.length})
                    </button>
                    {showPreviousQuotes && (
                      <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                        {previousQuotes.map((prevQuote) => (
                          <div key={prevQuote.id} className="text-xs bg-white p-2 rounded border border-yellow-200 flex items-center justify-between">
                            <div>
                              <button
                                onClick={() => {
                                  if (onOpenQuote) {
                                    onClose();
                                    setTimeout(() => {
                                      onOpenQuote(prevQuote);
                                    }, 100);
                                  }
                                }}
                                className="font-semibold text-blue-600 hover:text-blue-800 underline"
                              >
                                Quote #{prevQuote.quoteNumber}
                              </button>
                              {prevQuote.timestamp && (
                                <span className="text-gray-600 ml-2">
                                  - {formatDate(prevQuote.timestamp)}
                                </span>
                              )}
                              {prevQuote.status === "Replied" && prevQuote.response && (
                                <span className="text-green-600 ml-2">
                                  (Replied: {prevQuote.response})
                                </span>
                              )}
                              {prevQuote.status === "Appointment Created" && (
                                <span className="text-purple-600 ml-2">
                                  (Appointment Created)
                                </span>
                              )}
                            </div>
                            <FileText className="w-3 h-3 text-blue-500" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Previous Response Warning */}
            {previousResponses.length > 0 && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-orange-800 mb-1">
                      Previous Response Sent
                    </p>
                    <p className="text-xs text-orange-700 mb-2">
                      You have already sent a quote response to this customer.
                    </p>
                    <button
                      onClick={() => setShowPreviousResponses(!showPreviousResponses)}
                      className="text-xs text-orange-700 hover:text-orange-800 underline font-medium"
                    >
                      {showPreviousResponses ? "Hide" : "Show"} previous response(s) ({previousResponses.length})
                    </button>
                    {showPreviousResponses && (
                      <div className="mt-2 space-y-1">
                        {previousResponses.map((prevResponse) => (
                          <div key={prevResponse.id} className="text-xs bg-white p-2 rounded border border-orange-200 flex items-center justify-between">
                            <div>
                              <button
                                onClick={() => {
                                  if (onOpenQuote) {
                                    onClose();
                                    setTimeout(() => {
                                      onOpenQuote(prevResponse);
                                    }, 100);
                                  }
                                }}
                                className="text-blue-600 hover:text-blue-800 underline font-semibold"
                              >
                                Quote #{prevResponse.quoteNumber}
                              </button>
                              {prevResponse.response && (
                                <span className="text-gray-600 ml-2">
                                  - Response: {prevResponse.response}
                                </span>
                              )}
                              {prevResponse.responseTimestamp && (
                                <span className="text-gray-500 ml-2">
                                  ({formatDate(prevResponse.responseTimestamp)})
                                </span>
                              )}
                            </div>
                            <FileText className="w-3 h-3 text-blue-500" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                    <User className="w-3 h-3 text-blue-500" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name || ""}
                    readOnly
                    className="input-field w-full px-3 py-2 rounded-lg text-sm text-gray-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                    <Mail className="w-3 h-3 text-green-500" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="input-field w-full px-3 py-2 rounded-lg text-sm text-gray-900 focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                    <Phone className="w-3 h-3 text-purple-500" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone || ""}
                    readOnly
                    className="input-field w-full px-3 py-2 rounded-lg text-sm text-gray-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                    <Calendar className="w-3 h-3 text-orange-500" />
                    Submission Date
                  </label>
                  <input
                    type="text"
                    value={formatDate(timestamp)}
                    readOnly
                    className="input-field w-full px-3 py-2 rounded-lg text-sm text-gray-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Compact Service Details Section */}
          <div className="section-card rounded-lg p-4 mb-4">
            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-3">
              <div className="p-1.5 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                <Home className="w-4 h-4 text-white" />
              </div>
              Service Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                  <Home className="w-3 h-3 text-green-500" />
                  Service Type
                </label>
                <input
                  type="text"
                  value={service || ""}
                  readOnly
                  className="input-field w-full px-3 py-2 rounded-lg text-sm text-gray-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                  <Bed className="w-3 h-3 text-blue-500" />
                  Bedrooms
                </label>
                <input
                  type="text"
                  value={bedrooms || "—"}
                  readOnly
                  className="input-field w-full px-3 py-2 rounded-lg text-sm text-gray-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                  <Bath className="w-3 h-3 text-teal-500" />
                  Bathrooms
                </label>
                <input
                  type="text"
                  value={bathrooms || "—"}
                  readOnly
                  className="input-field w-full px-3 py-2 rounded-lg text-sm text-gray-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Compact Customer Message Section */}
          <div className="section-card rounded-lg p-4 mb-4">
            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-3">
              <div className="p-1.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              Customer Message
            </h3>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-3 max-h-32 overflow-y-auto">
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{initialMessage}</p>
            </div>
          </div>

          {/* Compact Images Section */}
          {Array.isArray(imageUrls) && imageUrls.length > 0 && (
            <div className="section-card rounded-lg p-4 mb-4">
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-3">
                <div className="p-1.5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                  <ImageIcon className="w-4 h-4 text-white" />
                </div>
                Customer Photos ({imageUrls.length})
              </h3>
              <div className="image-gallery flex gap-2 overflow-x-auto pb-1">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="flex-shrink-0">
                    <img
                      src={url}
                      alt={`Photo ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-300 cursor-pointer hover:scale-105 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
                      onClick={() => openImageSlider(url, idx)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compact Response Section - Price Quote */}
          <div className="section-card rounded-lg p-4 mb-4">
            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-3">
              <div className="p-1.5 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              Quote Price
            </h3>
            <div className="relative">
              <input
                type="text"
                className="input-field w-full px-3 py-3 rounded-lg text-lg text-gray-900 focus:outline-none font-semibold"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Enter price (e.g., 150, 299.99) - $ will be added automatically"
                style={{ fontSize: '18px', fontWeight: '600' }}
              />
              <p className="mt-2 text-xs text-gray-500">
                Enter the total price for this quote (just the number, $ will be added automatically). The customer will receive a professional quote email with this price.
              </p>
            </div>
          </div>

          {/* Compact Action Buttons */}
          <div className="flex flex-col lg:flex-row gap-3 justify-between items-center pt-4 border-t border-gray-200">
            <div className="flex gap-2 w-full lg:w-auto">
              <button
                onClick={handleStatusChange}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Clock className="w-3 h-3" />
                Toggle Status
              </button>
              {!isArchived && (
                <button
                  onClick={handleArchive}
                  disabled={archiving}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 disabled:opacity-60 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Archive className="w-3 h-3" />
                  {archiving ? "Archiving..." : "Archive"}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSend}
                disabled={sending || isArchived}
                className="flex items-center gap-1.5 px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg border border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-20 disabled:opacity-60 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Send className="w-3 h-3" />
                {sending ? "Sending..." : "Send Response"}
              </button>
              {phone && (
                <button
                  onClick={openSMSModal}
                  disabled={sending || isArchived || !response.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg border border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 disabled:opacity-60 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                  title="View SMS content"
                >
                  <MessageSquare className="w-3 h-3" />
                  View SMS
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Compact Lightbox for Images */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
          onClick={closeImageSlider}
          style={{ animation: "fadeIn 0.2s ease-out" }}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Close Button */}
            <button
              onClick={closeImageSlider}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-60 text-white rounded-full hover:bg-opacity-80 transition-all duration-200 border border-white border-opacity-20 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Navigation Buttons */}
            {Array.isArray(imageUrls) && imageUrls.length > 1 && (
              <>
                {/* Previous Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPreviousImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-60 text-white rounded-full hover:bg-opacity-80 transition-all duration-200 border border-white border-opacity-20 z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Next Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-60 text-white rounded-full hover:bg-opacity-80 transition-all duration-200 border border-white border-opacity-20 z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black bg-opacity-60 text-white rounded-full border border-white border-opacity-20 z-10">
                  <span className="text-sm font-medium">
                    {selectedImageIndex + 1} / {imageUrls.length}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Notification Modal */}
      <NotificationModal 
        notification={notification} 
        onClose={hideNotification} 
      />

      {/* SMS Preview Modal */}
      {showSMSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                SMS Content Preview
              </h2>
              <button
                onClick={() => setShowSMSModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">To:</p>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">{phone}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Message:</p>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {generateSMSContent()}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Character count: {generateSMSContent().length} / 160
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Copy this message and send it manually via your preferred SMS service.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSMSModal(false)}
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
