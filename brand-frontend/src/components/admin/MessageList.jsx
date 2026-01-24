import { useState, useMemo, useEffect } from "react";
import { API } from "../../api";
import EmptyState from "../EmptyState";

export default function MessageList({ messages, onUpdate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, read, unread
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const markAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API}/contact/${messageId}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        onUpdate();
      } else {
        const data = await res.json();
        alert("Error: " + (data.error || data.message));
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!confirm("Delete this message?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API}/contact/${messageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("Message deleted successfully!");
        onUpdate();
      } else {
        const data = await res.json();
        alert("Error: " + (data.error || data.message));
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // Filter messages
  const filteredMessages = useMemo(() => {
    return messages.filter(message => {
      const matchesSearch = !searchQuery || 
        message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.message?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "read" && message.read) ||
        (statusFilter === "unread" && !message.read);
      
      return matchesSearch && matchesStatus;
    });
  }, [messages, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const paginatedMessages = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMessages.slice(start, start + itemsPerPage);
  }, [filteredMessages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  return (
    <div className="rounded-xl shadow-md overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h3 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
            Contact Messages ({filteredMessages.length})
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-lg text-sm transition-all duration-300 focus:outline-none"
              style={{
                border: '2px solid var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                minWidth: '200px'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg text-sm transition-all duration-300 focus:outline-none"
              style={{
                border: '2px solid var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="p-12">
          <EmptyState 
            icon="📩"
            title="No Messages Yet"
            description="Contact messages will appear here."
          />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="p-12">
          <EmptyState 
            icon="🔍"
            title="No Messages Found"
            description="Try adjusting your search or filter criteria."
          />
        </div>
      ) : (
        <>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {paginatedMessages.map((message) => (
              <div
                key={message.id}
                className={`p-6 transition-colors`}
                style={{ 
                  backgroundColor: !message.read ? 'var(--secondary)' : 'var(--card)'
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>{message.name}</h4>
                    <p className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.7 }}>{message.email}</p>
                    {message.phone && <p className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.7 }}>{message.phone}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                      {new Date(message.createdAt).toLocaleDateString()}
                    </p>
                    {!message.read && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full font-semibold" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                        New
                      </span>
                    )}
                  </div>
                </div>

                <p className="mb-4 whitespace-pre-wrap" style={{ color: 'var(--foreground)' }}>{message.message}</p>

                <div className="flex gap-2">
                  {!message.read && (
                    <button
                      onClick={() => markAsRead(message.id)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: 'var(--sale-red)', color: 'var(--primary-foreground)' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <div className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredMessages.length)} of {filteredMessages.length} messages
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: currentPage === 1 ? 'transparent' : 'var(--secondary)',
                    color: 'var(--foreground)'
                  }}
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-10 h-10 rounded-lg text-sm font-medium transition-all duration-300"
                        style={{
                          backgroundColor: currentPage === pageNum ? 'var(--primary)' : 'var(--secondary)',
                          color: currentPage === pageNum ? 'var(--primary-foreground)' : 'var(--foreground)'
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: currentPage === totalPages ? 'transparent' : 'var(--secondary)',
                    color: 'var(--foreground)'
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
