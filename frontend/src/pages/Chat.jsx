import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import { FiSend, FiUser, FiCircle, FiInfo } from 'react-icons/fi';

const Chat = () => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket() || {};
  const { showToast } = useNotifications();
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected contact details
  const initialOtherId = searchParams.get('otherId') || '';
  const [activeContact, setActiveContact] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState(false);

  // Typing indicators states
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const messagesEndRef = useRef(null);

  // Fetch threads/conversations list
  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      setConversations(res.data || []);
      
      // If we have an initialOtherId from URL, find or fetch that contact
      if (initialOtherId && !activeContact) {
        const existing = res.data.find(c => c.user._id === initialOtherId);
        if (existing) {
          setActiveContact(existing.user);
        } else {
          // If no existing thread, fetch user profile to start a new one
          const userRes = await api.get(`/jobs`).catch(() => null); // dummy or just query user
          // For simplicity, find user details from database
          const uRes = await api.get('/candidates/applications').catch(() => null); // mock fetch or direct find
          // Let's resolve contact details from mock company/user list
          const contactUser = await resolveUserDetails(initialOtherId);
          if (contactUser) {
            setActiveContact(contactUser);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching conversations:', err.message);
    } finally {
      setLoadingConv(false);
    }
  };

  const resolveUserDetails = async (id) => {
    // Attempt search user in current lists
    try {
      // Direct user fetch
      const usersRes = await api.get(`/admin/users?search=${id}`).catch(() => null);
      if (usersRes && usersRes.data.users) {
        return usersRes.data.users.find(u => u._id === id);
      }
    } catch (e) {}
    return null;
  };

  useEffect(() => {
    fetchConversations();
  }, [initialOtherId]);

  // Load chat messages when activeContact changes
  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!activeContact) return;
      setLoadingMsg(true);
      try {
        const res = await api.get(`/messages/${activeContact._id}`);
        setMessages(res.data || []);
        
        // Refresh conversations list to clear unread counts
        fetchConversations();
      } catch (err) {
        console.error('Error fetching chat history:', err.message);
      } finally {
        setLoadingMsg(false);
      }
    };
    fetchChatMessages();
  }, [activeContact]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOtherTyping]);

  // WebSocket messages & typing listeners
  useEffect(() => {
    if (socket) {
      socket.on('private_message', (msg) => {
        // If message is from/to current active contact, append it
        if (
          (msg.sender === activeContact?._id && msg.receiver === user._id) ||
          (msg.sender === user._id && msg.receiver === activeContact?._id)
        ) {
          setMessages((prev) => [...prev, msg]);
          // Mark as read in backend
          api.put(`/messages/${activeContact._id}`).catch(() => null);
        }
        
        // Refresh conversations list to show newest preview
        fetchConversations();
      });

      socket.on('typing', ({ senderId }) => {
        if (senderId === activeContact?._id) {
          setIsOtherTyping(true);
        }
      });

      socket.on('stop_typing', ({ senderId }) => {
        if (senderId === activeContact?._id) {
          setIsOtherTyping(false);
        }
      });

      return () => {
        socket.off('private_message');
        socket.off('typing');
        socket.off('stop_typing');
      };
    }
  }, [socket, activeContact, user]);

  // Handle typing state triggers
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    
    if (socket && activeContact) {
      socket.emit('typing', { senderId: user._id, receiverId: activeContact._id });
      
      // Clear old timeout
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      // Set stop typing timeout
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', { senderId: user._id, receiverId: activeContact._id });
      }, 1500);
    }
  };

  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeContact || !socket) return;

    socket.emit('private_message', {
      senderId: user._id,
      receiverId: activeContact._id,
      text: inputText.trim()
    });

    setInputText('');
    
    if (socket) {
      socket.emit('stop_typing', { senderId: user._id, receiverId: activeContact._id });
    }
  };

  const isOnline = (contactId) => {
    return onlineUsers && onlineUsers.includes(contactId);
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
      
      {/* Left panel: Threads list */}
      <div className="w-full md:w-80 flex-shrink-0 glass rounded-3xl border border-slate-205 dark:border-slate-800 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-white">Direct Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850">
          {loadingConv ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(x => <div key={x} className="h-14 rounded-xl glass shimmer"></div>)}
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No chat logs found. Apply to jobs or respond to applicants to start messaging.
            </div>
          ) : (
            conversations.map((conv) => {
              const isSelected = activeContact?._id === conv.user._id;
              const online = isOnline(conv.user._id);

              return (
                <div
                  key={conv.user._id}
                  onClick={() => {
                    setActiveContact(conv.user);
                    // Clear search params
                    setSearchParams({});
                  }}
                  className={`p-4 flex items-center justify-between gap-3 cursor-pointer transition duration-150 ${
                    isSelected 
                      ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-primary' 
                      : 'hover:bg-slate-50/50 dark:hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="relative">
                      <img
                        src={conv.user.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.user.name)}&background=2563EB&color=fff`}
                        alt={conv.user.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-100 dark:border-slate-800"
                      />
                      {online && (
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
                      )}
                    </div>
                    
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {conv.user.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>

                  {conv.unreadCount > 0 && !isSelected && (
                    <span className="px-2 py-0.5 rounded-full bg-primary text-[9px] font-bold text-white">
                      {conv.unreadCount}
                    </span>
                  )}

                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right panel: Chat messages pane */}
      <div className="flex-1 glass rounded-3xl border border-slate-205 dark:border-slate-800 flex flex-col overflow-hidden relative">
        {activeContact ? (
          <>
            {/* Header info */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={activeContact.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeContact.name)}&background=2563EB&color=fff`}
                    alt={activeContact.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-100 dark:border-slate-800"
                  />
                  {isOnline(activeContact._id) && (
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
                  )}
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{activeContact.name}</h3>
                  <span className="text-[9px] font-semibold text-slate-400 capitalize">{activeContact.role}</span>
                </div>
              </div>
            </div>

            {/* Messages body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {loadingMsg ? (
                <div className="flex items-center justify-center h-full">
                  <span className="text-xs text-slate-400">Loading chat logs...</span>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.sender === user._id;
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isOwn
                          ? 'bg-primary text-white rounded-tr-none'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                      }`}>
                        <p>{msg.text}</p>
                        <span className={`text-[8px] mt-1.5 block text-right ${isOwn ? 'text-emerald-100' : 'text-slate-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              
              {/* Typing indicator */}
              {isOtherTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input forms */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow transition disabled:opacity-50 flex items-center justify-center"
              >
                <FiSend />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
            <span className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <FiMessageSquare className="w-8 h-8" />
            </span>
            <h3 className="font-extrabold text-base">Duplex Messenger</h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
              Select an active candidate or recruiter thread from the conversation panel to start exchanging details.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Chat;
