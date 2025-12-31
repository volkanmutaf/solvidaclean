import { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";

import {
  Trash2,
  MailCheck,
  MailX,
  Search,
  RefreshCw,
  AlertTriangle,
  Filter,
  X,
  Download,
  Eye,
  EyeOff,
  ArchiveRestore,
  Archive,
  Reply,
  Clock,
  CheckCircle,
  Circle,
  FileText,
  CheckSquare,
  Square,
  Calendar,
} from "lucide-react";

import QuoteModal from "../../components/QuoteModal";
import { useNotification } from "../../hooks/useNotification";
import NotificationModal from "../../components/NotificationModal";

export default function AdminDashboard() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [filter, setFilter] = useState("all");
  const [archiveView, setArchiveView] = useState(false);
  const [deletedView, setDeletedView] = useState(false);
  const [selectedQuotes, setSelectedQuotes] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  const { notification, showConfirmDialog, showSuccess, showError, hideNotification } = useNotification();

  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "quotes"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuotes(data);
    } catch (err) {
      console.error("Error fetching quotes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchQuotes]);

  // Çoklu seçim fonksiyonları
  const handleSelectQuote = (quoteId) => {
    setSelectedQuotes(prev => 
      prev.includes(quoteId) 
        ? prev.filter(id => id !== quoteId)
        : [...prev, quoteId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedQuotes([]);
      setSelectAll(false);
    } else {
      setSelectedQuotes(filteredAndSortedQuotes.map(q => q.id));
      setSelectAll(true);
    }
  };

  const handleBulkDelete = () => {
    if (selectedQuotes.length === 0) return;
    
    showConfirmDialog({
      title: "Bulk Delete",
      message: `Are you sure you want to delete ${selectedQuotes.length} selected quote(s)? They will be moved to the deleted folder.`,
      onConfirm: async () => {
        try {
          await Promise.all(selectedQuotes.map(id => updateDoc(doc(db, "quotes", id), { deleted: true })));
          setQuotes((prev) => prev.map((q) => selectedQuotes.includes(q.id) ? { ...q, deleted: true } : q));
          setSelectedQuotes([]);
          setSelectAll(false);
          showSuccess({
            title: "Bulk Delete Successful",
            message: `${selectedQuotes.length} quote(s) have been moved to the deleted folder.`
          });
        } catch (err) {
          console.error("Error bulk deleting quotes:", err);
          showError({
            title: "Bulk Delete Failed",
            message: "Failed to delete some quotes. Please try again."
          });
        }
      }
    });
  };

  const handleBulkArchive = () => {
    if (selectedQuotes.length === 0) return;
    
    showConfirmDialog({
      title: "Bulk Archive",
      message: `Are you sure you want to archive ${selectedQuotes.length} selected quote(s)?`,
      onConfirm: async () => {
        try {
          await Promise.all(selectedQuotes.map(id => updateDoc(doc(db, "quotes", id), { archived: true })));
          setQuotes((prev) => prev.map((q) => selectedQuotes.includes(q.id) ? { ...q, archived: true } : q));
          setSelectedQuotes([]);
          setSelectAll(false);
          showSuccess({
            title: "Bulk Archive Successful",
            message: `${selectedQuotes.length} quote(s) have been archived.`
          });
        } catch (err) {
          console.error("Error bulk archiving quotes:", err);
          showError({
            title: "Bulk Archive Failed",
            message: "Failed to archive some quotes. Please try again."
          });
        }
      }
    });
  };

  const handleBulkRestore = () => {
    if (selectedQuotes.length === 0) return;
    
    showConfirmDialog({
      title: "Bulk Restore",
      message: `Are you sure you want to restore ${selectedQuotes.length} selected quote(s)?`,
      onConfirm: async () => {
        try {
          const restorePromises = selectedQuotes.map(id => {
            const updateData = deletedView ? { deleted: false } : { archived: false };
            return updateDoc(doc(db, "quotes", id), updateData);
          });
          
          await Promise.all(restorePromises);
          setQuotes((prev) => prev.map((q) => {
            if (selectedQuotes.includes(q.id)) {
              return deletedView ? { ...q, deleted: false } : { ...q, archived: false };
            }
            return q;
          }));
          setSelectedQuotes([]);
          setSelectAll(false);
          showSuccess({
            title: "Bulk Restore Successful",
            message: `${selectedQuotes.length} quote(s) have been restored.`
          });
        } catch (err) {
          console.error("Error bulk restoring quotes:", err);
          showError({
            title: "Bulk Restore Failed",
            message: "Failed to restore some quotes. Please try again."
          });
        }
      }
    });
  };

  const handleRowClick = async (quote) => {
    setSelectedQuote(quote);
    if (!quote.read) {
      try {
        await updateDoc(doc(db, "quotes", quote.id), { read: true });
        setQuotes((prev) =>
          prev.map((item) =>
            item.id === quote.id ? { ...item, read: true } : item
          )
        );
      } catch (err) {
        console.error("Error marking as read:", err);
      }
    }
  };

  const exportToCSV = () => {
    if (filteredAndSortedQuotes.length === 0) {
      alert("No quotes to export.");
      return;
    }

    const csvData = filteredAndSortedQuotes.map(q => ({
      'Quote Number': q.quoteNumber || 'N/A',
      'Name': q.name || 'N/A',
      'Email': q.email || 'N/A',
      'Phone': q.phone || 'N/A',
      'Date': formatDate(q.timestamp),
      'Time': formatTime(q.timestamp),
      'Status': q.read ? 'Read' : 'Unread',
      'Overdue': isOverdue(q) ? 'Yes' : 'No'
    }));

    const header = Object.keys(csvData[0]).map(key => `"${key}"`).join(',');
    const rows = csvData.map(row => 
      Object.values(row).map(value => 
        `"${String(value).replace(/"/g, '""')}"`
      ).join(',')
    );

    const csvContent = [header, ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quotes-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return "—";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp?.seconds) return "—";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const toggleReadStatus = async (id, currentRead) => {
    try {
      await updateDoc(doc(db, "quotes", id), { read: !currentRead });
      setQuotes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, read: !currentRead } : q))
      );
    } catch (err) {
      console.error("Error updating read status:", err);
    }
  };

  const handleSoftDelete = async (id) => {
    showConfirmDialog({
      title: "Delete Quote",
      message: "Are you sure you want to delete this quote? It will be moved to the deleted folder.",
      onConfirm: async () => {
        try {
          await updateDoc(doc(db, "quotes", id), { deleted: true });
          setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, deleted: true } : q)));
          showSuccess({
            title: "Quote Deleted",
            message: "Quote has been moved to the deleted folder successfully."
          });
        } catch (err) {
          console.error("Error moving to deleted:", err);
          showError({
            title: "Error",
            message: "Failed to delete quote. Please try again."
          });
        }
      }
    });
  };

  const handlePermanentDelete = async (id) => {
    showConfirmDialog({
      title: "⚠️ Permanent Delete Warning",
      message: "Are you sure you want to PERMANENTLY delete this quote? This action cannot be undone and the data will be lost forever.",
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, "quotes", id));
          setQuotes((prev) => prev.filter((q) => q.id !== id));
          showSuccess({
            title: "Quote Permanently Deleted",
            message: "Quote has been permanently deleted from the database."
          });
        } catch (err) {
          console.error("Error permanently deleting quote:", err);
          showError({
            title: "Error",
            message: "Failed to permanently delete quote. Please try again."
          });
        }
      }
    });
  };

  const handleDeleteAll = async () => {
    const deletedQuotes = quotes.filter(q => q.deleted);
    if (deletedQuotes.length === 0) return;
    
    showConfirmDialog({
      title: "⚠️ Delete All Warning",
      message: `Are you sure you want to PERMANENTLY delete all ${deletedQuotes.length} items from the deleted folder? This action cannot be undone and all data will be lost forever.`,
      onConfirm: async () => {
        try {
          await Promise.all(deletedQuotes.map(q => deleteDoc(doc(db, "quotes", q.id))));
          setQuotes((prev) => prev.filter((q) => !q.deleted));
          showSuccess({
            title: "All Items Deleted",
            message: `Successfully deleted ${deletedQuotes.length} items from the deleted folder.`
          });
        } catch (err) {
          console.error("Error deleting all items:", err);
          showError({
            title: "Error",
            message: "Failed to delete all items. Please try again."
          });
        }
      }
    });
  };

  const isOverdue = (quote) => {
    const createdAt = quote.timestamp?.seconds * 1000;
    return createdAt && now - createdAt >= 120 * 60000;
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp?.seconds) return "—";
    const created = timestamp.seconds * 1000;
    const diff = now - created;
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    const remHrs = hrs % 24;
    const remMins = mins % 60;

    if (days > 0) return `${days}d ${remHrs}h ${remMins}m`;
    if (hrs > 0) return `${hrs}h ${remMins}m`;
    return `${mins}m`;
  };

  const getFilteredQuotes = () => {
    let filtered = quotes.filter((q) => {
      if (deletedView) return q.deleted === true;
      if (archiveView) return q.archived === true && !q.deleted;
      return !q.archived && !q.deleted;
    }).filter((q) =>
      [q.quoteNumber || "", q.name || "", q.email || "", q.phone || ""]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    switch (filter) {
      case "unread":
        filtered = filtered.filter((q) => !q.read);
        break;
      case "overdue":
        filtered = filtered.filter((q) => isOverdue(q));
        break;
      case "read":
        filtered = filtered.filter((q) => q.read);
        break;
      default:
        break;
    }
    return filtered;
  };

  const filteredAndSortedQuotes = getFilteredQuotes();

  // Seçim durumunu takip et
  useEffect(() => {
    const allSelected = filteredAndSortedQuotes.length > 0 && 
      filteredAndSortedQuotes.every(q => selectedQuotes.includes(q.id));
    setSelectAll(allSelected);
  }, [selectedQuotes, filteredAndSortedQuotes]);

  const unreadCount = quotes.filter((q) => !q.read).length;
  const overdueCount = quotes.filter((q) => isOverdue(q)).length;
  const readCount = quotes.filter((q) => q.read).length;

  const filterOptions = [
    { value: "all", label: "All", count: quotes.length },
    { value: "unread", label: "Unread", count: unreadCount },
    { value: "overdue", label: "Overdue", count: overdueCount },
    { value: "read", label: "Read", count: readCount },
  ];

  const handleArchiveInList = (id) => {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, archived: true } : q)));
  };

  const handleRestore = async (id) => {
    try {
      await updateDoc(doc(db, "quotes", id), { archived: false });
      setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, archived: false } : q)));
    } catch (err) {
      console.error("Error restoring quote:", err);
    }
  };

  const handleRestoreDeleted = async (id) => {
    try {
      await updateDoc(doc(db, "quotes", id), { deleted: false });
      setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, deleted: false } : q)));
    } catch (err) {
      console.error("Error restoring deleted quote:", err);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Compact Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4">
          <button
            onClick={() => { setArchiveView(false); setDeletedView(false); setFilter("all"); }}
            className={`bg-white rounded-lg shadow-sm border p-2 sm:p-4 flex items-center justify-between transition-all hover:shadow-md ${!archiveView && !deletedView ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div>
              <span className="text-base sm:text-lg font-bold text-blue-700">{quotes.filter(q => !q.archived && !q.deleted).length}</span>
              <p className="text-xs text-gray-500">Active</p>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
            </div>
          </button>
          <button
            onClick={() => { setArchiveView(false); setDeletedView(false); setFilter("overdue"); }}
            className={`bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between transition-all hover:shadow-md ${!archiveView && !deletedView && filter === "overdue" ? 'ring-2 ring-yellow-500' : ''}`}
          >
            <div>
              <span className="text-lg font-bold text-yellow-600">{quotes.filter(q => !q.archived && !q.deleted && isOverdue(q)).length}</span>
              <p className="text-xs text-gray-500">Overdue</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
          </button>
          <button
            onClick={() => { setArchiveView(true); setDeletedView(false); setFilter("all"); }}
            className={`bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between transition-all hover:shadow-md ${archiveView && !deletedView ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div>
              <span className="text-lg font-bold text-blue-500">{quotes.filter(q => q.archived && !q.deleted).length}</span>
              <p className="text-xs text-gray-500">Archived</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Archive className="w-4 h-4 text-blue-600" />
            </div>
          </button>
          <button
            onClick={() => { setArchiveView(false); setDeletedView(true); setFilter("all"); }}
            className={`bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between transition-all hover:shadow-md ${deletedView ? 'ring-2 ring-red-500' : ''}`}
          >
            <div>
              <span className="text-lg font-bold text-red-500">{quotes.filter(q => q.deleted).length}</span>
              <p className="text-xs text-gray-500">Deleted</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-red-600" />
            </div>
          </button>
        </div>

        {/* Header with Search */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-4 sm:p-6 mb-4">
          <div className="flex flex-col gap-4">
            {/* Title and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Quote Requests</h1>
              
              {/* Actions - All on the left */}
              <div className="flex gap-2 flex-wrap text-xs sm:text-sm">
                {/* Bulk Actions */}
                {selectedQuotes.length > 0 && (
                  <div className="flex gap-2 items-center border-r border-gray-300 pr-4">
                    <span className="text-sm text-gray-600">
                      {selectedQuotes.length} selected
                    </span>
                    {!archiveView && !deletedView && (
                      <>
                        <button
                          onClick={handleBulkArchive}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <Archive className="w-4 h-4 mr-2" /> Archive
                        </button>
                        <button
                          onClick={handleBulkDelete}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </button>
                      </>
                    )}
                    {(archiveView || deletedView) && (
                      <button
                        onClick={handleBulkRestore}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700"
                      >
                        <ArchiveRestore className="w-4 h-4 mr-2" /> Restore
                      </button>
                    )}
                  </div>
                )}
                
                {deletedView && (
                  <button
                    onClick={handleDeleteAll}
                    disabled={quotes.filter(q => q.deleted).length === 0}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete All
                  </button>
                )}
                <button
                  onClick={fetchQuotes}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  {loading ? "Loading..." : "Refresh"}
                </button>
                <button
                  onClick={exportToCSV}
                  disabled={filteredAndSortedQuotes.length === 0}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <Download className="w-4 h-4 mr-2" /> Export
                </button>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search quotes..."
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

        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5 mb-4 overflow-x-auto pb-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${filter === option.value ? "bg-blue-100 text-blue-800 border border-blue-300" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {option.label}
              <span className="ml-1.5 bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full text-xs">
                {option.count}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-3" />
              <span className="text-gray-600">Loading quotes...</span>
            </div>
          ) : filteredAndSortedQuotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">📋</div>
              <p className="text-gray-600">
                {search || filter !== "all" ? "No matching quotes found." : "No quotes found."}
              </p>
              {(search || filter !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm border-2 border-gray-300 rounded-lg shadow-sm">
                                 <thead className="bg-gray-200 border-b-2 border-gray-300">
                   <tr>
                     <th className="px-6 py-3 text-center font-semibold text-gray-500 uppercase">
                       <button
                         onClick={handleSelectAll}
                         className="p-1 hover:bg-gray-200 rounded transition-colors"
                       >
                         {selectAll ? (
                           <CheckSquare className="w-4 h-4 text-blue-600" />
                         ) : (
                           <Square className="w-4 h-4 text-gray-400" />
                         )}
                       </button>
                     </th>
                     <th className="px-6 py-3 text-left font-semibold text-gray-500 uppercase">Quote # & Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-500 uppercase">Contact & Phone</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-500 uppercase">Time Ago</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedQuotes.map((q) => (
                                         <tr
                       key={q.id}
                       className={`transition cursor-pointer border-b-2 border-gray-200 ${q.deleted ? "opacity-50" : ""} ${q.status === "Appointment Created" && !q.archived && !q.deleted ? "bg-purple-50 hover:bg-purple-100 border-l-4 border-l-purple-500" : q.status === "Replied" && !q.archived && !q.deleted ? "bg-green-50 hover:bg-green-100 border-l-4 border-l-green-500" : !q.read && !q.archived && !q.deleted ? "bg-blue-100 hover:bg-blue-200 border-l-4 border-l-blue-500" : isOverdue(q) && !q.deleted ? "bg-red-50 hover:bg-red-100 border-l-4 border-l-red-500" : "hover:bg-blue-50 border-l-4 border-l-transparent"}`}
                       onClick={() => !deletedView && handleRowClick(q)}
                     >
                       <td className="px-6 py-4 text-center">
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             handleSelectQuote(q.id);
                           }}
                           className="p-1 hover:bg-gray-200 rounded transition-colors"
                         >
                           {selectedQuotes.includes(q.id) ? (
                             <CheckSquare className="w-4 h-4 text-blue-600" />
                           ) : (
                             <Square className="w-4 h-4 text-gray-400" />
                           )}
                         </button>
                       </td>
                       <td className="px-6 py-4">
                        <div className="font-mono text-blue-700 font-bold">{q.quoteNumber}</div>
                        <div className="text-gray-600 text-xs">{formatDate(q.timestamp)} {formatTime(q.timestamp)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{q.name}</div>
                        <div className="text-gray-500 text-xs">{q.email}</div>
                        <div className="text-gray-500 text-xs">{q.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {q.deleted ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">Deleted</span>
                        ) : q.archived ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">Archived</span>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-1">
                              {!q.read && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                                  <Circle className="w-3 h-3 mr-1 text-blue-600 fill-current" />
                                  New
                                </span>
                              )}
                              
                              {q.read && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                                  <MailCheck className="w-3 h-3 mr-1 text-gray-500" />
                                  Read
                                </span>
                              )}
                              
                              {q.read && q.status !== "Replied" && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                                  <Clock className="w-3 h-3 mr-1 text-yellow-600" />
                                  Pending
                                </span>
                              )}
                              
                              {q.status === "Replied" && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                                  <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                                  Replied
                                </span>
                              )}
                              
                              {q.status === "Appointment Created" && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                                  <Calendar className="w-3 h-3 mr-1 text-purple-600" />
                                  Appointment Created
                                </span>
                              )}
                              
                              {isOverdue(q) && q.status !== "Replied" && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                                  <AlertTriangle className="w-3 h-3 mr-1 text-red-600" />
                                  OVERDUE
                                </span>
                              )}
                            </div>
                            
                            {q.status === "Replied" && q.responseTimestamp && (
                              <div className="text-xs text-gray-500">
                                Replied on {new Date(q.responseTimestamp.seconds * 1000).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                })} at {new Date(q.responseTimestamp.seconds * 1000).toLocaleTimeString('en-US', { 
                                  hour: 'numeric', 
                                  minute: '2-digit',
                                  hour12: true 
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-xs text-gray-600">
                        {getTimeAgo(q.timestamp)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {!archiveView && !deletedView && (
                            <>
                              <button
                                onClick={e => { e.stopPropagation(); toggleReadStatus(q.id, q.read); }}
                                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                                title={q.read ? "Mark as Unread" : "Mark as Read"}
                              >
                                {q.read ? <MailX className="w-4 h-4" /> : <MailCheck className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={e => { e.stopPropagation(); handleArchiveInList(q.id); }}
                                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                                title="Archive"
                              >
                                <Archive className="w-4 h-4" />
                              </button>
                              <button
                                onClick={e => { e.stopPropagation(); handleSoftDelete(q.id); }}
                                className="p-1 rounded-full text-red-600 hover:bg-red-100"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {archiveView && !deletedView && (
                            <>
                              <button
                                onClick={e => { e.stopPropagation(); handleRestore(q.id); }}
                                className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
                                title="Restore"
                              >
                                <ArchiveRestore className="w-4 h-4" />
                              </button>
                              <button
                                onClick={e => { e.stopPropagation(); handleSoftDelete(q.id); }}
                                className="p-1 rounded-full text-red-600 hover:bg-red-100"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {deletedView && (
                            <>
                              <button
                                onClick={e => { e.stopPropagation(); handleRestoreDeleted(q.id); }}
                                className="p-1 rounded-full text-green-600 hover:bg-green-100"
                                title="Restore"
                              >
                                <ArchiveRestore className="w-4 h-4" />
                              </button>
                              <button
                                onClick={e => { e.stopPropagation(); handlePermanentDelete(q.id); }}
                                className="p-1 rounded-full text-red-600 hover:bg-red-100"
                                title="Permanently Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              
              {/* Mobile Card View */}
              <div className="lg:hidden space-y-3">
                {filteredAndSortedQuotes.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => !deletedView && handleRowClick(q)}
                    className={`bg-white rounded-lg border-2 p-4 transition cursor-pointer ${
                      q.deleted ? "opacity-50" : ""
                    } ${
                      q.status === "Appointment Created" && !q.archived && !q.deleted
                        ? "bg-purple-50 border-l-4 border-l-purple-500"
                        : q.status === "Replied" && !q.archived && !q.deleted
                        ? "bg-green-50 border-l-4 border-l-green-500"
                        : !q.read && !q.archived && !q.deleted
                        ? "bg-blue-100 border-l-4 border-l-blue-500"
                        : isOverdue(q) && !q.deleted
                        ? "bg-red-50 border-l-4 border-l-red-500"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="font-mono text-blue-700 font-bold text-sm mb-1">{q.quoteNumber}</div>
                        <div className="text-gray-600 text-xs mb-2">{formatDate(q.timestamp)} {formatTime(q.timestamp)}</div>
                        <div className="font-medium text-gray-900 mb-1">{q.name}</div>
                        <div className="text-gray-500 text-xs mb-1">{q.email}</div>
                        <div className="text-gray-500 text-xs">{q.phone}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectQuote(q.id);
                        }}
                        className="p-1"
                      >
                        {selectedQuotes.includes(q.id) ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {q.deleted ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">Deleted</span>
                      ) : q.archived ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">Archived</span>
                      ) : (
                        <>
                          {!q.read && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                              <Circle className="w-3 h-3 mr-1 text-blue-600 fill-current" />
                              New
                            </span>
                          )}
                          {q.read && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                              <MailCheck className="w-3 h-3 mr-1 text-gray-500" />
                              Read
                            </span>
                          )}
                          {q.status === "Replied" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                              Replied
                            </span>
                          )}
                          {q.status === "Appointment Created" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                              <Calendar className="w-3 h-3 mr-1 text-purple-600" />
                              Appointment
                            </span>
                          )}
                          {isOverdue(q) && q.status !== "Replied" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                              <AlertTriangle className="w-3 h-3 mr-1 text-red-600" />
                              OVERDUE
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-600">{getTimeAgo(q.timestamp)}</div>
                      <div className="flex items-center gap-2">
                        {!archiveView && !deletedView && (
                          <>
                            <button
                              onClick={e => { e.stopPropagation(); toggleReadStatus(q.id, q.read); }}
                              className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100"
                              title={q.read ? "Mark as Unread" : "Mark as Read"}
                            >
                              {q.read ? <MailX className="w-4 h-4" /> : <MailCheck className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); handleArchiveInList(q.id); }}
                              className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100"
                              title="Archive"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); handleSoftDelete(q.id); }}
                              className="p-1.5 rounded-full text-red-600 hover:bg-red-100"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {archiveView && !deletedView && (
                          <>
                            <button
                              onClick={e => { e.stopPropagation(); handleRestore(q.id); }}
                              className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100"
                              title="Restore"
                            >
                              <ArchiveRestore className="w-4 h-4" />
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); handleSoftDelete(q.id); }}
                              className="p-1.5 rounded-full text-red-600 hover:bg-red-100"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {deletedView && (
                          <>
                            <button
                              onClick={e => { e.stopPropagation(); handleRestoreDeleted(q.id); }}
                              className="p-1.5 rounded-full text-green-600 hover:bg-green-100"
                              title="Restore"
                            >
                              <ArchiveRestore className="w-4 h-4" />
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); handlePermanentDelete(q.id); }}
                              className="p-1.5 rounded-full text-red-600 hover:bg-red-100"
                              title="Permanently Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Modal */}
        {selectedQuote && (
          <QuoteModal
            quote={selectedQuote}
            onClose={() => setSelectedQuote(null)}
            onArchive={handleArchiveInList}
            onOpenQuote={(quote) => {
              setSelectedQuote(quote);
            }}
          />
        )}

                 {/* Notification Modal */}
         <NotificationModal 
           notification={notification} 
           onClose={hideNotification} 
         />
      </div>
    </div>
  );
}