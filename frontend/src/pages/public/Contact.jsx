import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

const Contact = () => {
  const { showToast } = useNotifications();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    // Simulate support ticket creation
    setTimeout(() => {
      showToast('Support ticket submitted successfully! We will contact you soon.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      
      {/* Contact Details Card */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Contact support</h1>
          <p className="text-sm text-slate-400 mt-2">
            Have questions about company verification or user block actions? Send us a ticket and our admin team will reply within 24 hours.
          </p>
        </div>

        <div className="space-y-4 mt-6">
          <div className="flex items-center gap-4">
            <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FiMail className="w-5 h-5" />
            </span>
            <div>
              <p className="text-xs text-slate-400 font-semibold">Email Us</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">support@careerconnect.dev</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <FiPhone className="w-5 h-5" />
            </span>
            <div>
              <p className="text-xs text-slate-400 font-semibold">Call Support</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">+1 800-555-0199</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <FiMapPin className="w-5 h-5" />
            </span>
            <div>
              <p className="text-xs text-slate-400 font-semibold">Corporate Office</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">100 Tech Plaza, San Francisco, CA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket form */}
      <div className="glass p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold mb-6">Create Support Ticket</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-450 dark:text-slate-400 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-450 dark:text-slate-400 mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. john@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-450 dark:text-slate-400 mb-1.5">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="How can we help?"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-450 dark:text-slate-400 mb-1.5">
              Message Description *
            </label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Provide a detailed description of your request..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-md shadow-primary/20 hover:shadow-primary/30 transition flex items-center justify-center gap-1.5"
          >
            {loading ? 'Submitting...' : <><FiSend /> Submit Ticket</>}
          </button>
        </form>
      </div>

    </div>
  );
};

export default Contact;
