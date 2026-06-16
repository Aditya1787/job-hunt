import React, { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

const faqData = [
  {
    question: "How does the AI Job Recommendation system work?",
    answer: "Our recommendation engine compares your candidate profile details (such as your skills list, years of experience, and location preference) with the requirements of active job postings. It runs a similarity matching calculation to determine a percentage score and provides a visual breakdown of your skills, experience, and location fit.",
    category: "AI Features"
  },
  {
    question: "How does the Resume Skill Extraction tool parse my profile?",
    answer: "When you upload a PDF copy of your resume in your Candidate Settings, the platform parses the text contents on our backend server using pdf-parse. It identifies known technologies, systems, and soft skills, automatically adding them to your profile. You can review, add, or delete any skills at any time.",
    category: "AI Features"
  },
  {
    question: "Do job postings require approval?",
    answer: "Yes. To prevent spam, scams, and fake opportunities, every single job posted by a company is held in a verification queue. Platform administrators review the posting details and verify company authenticity before approving it. Once approved, the job goes live and becomes visible to candidates.",
    category: "Recruitment"
  },
  {
    question: "How does the messaging system work?",
    answer: "Our messaging system is built using WebSockets (Socket.io) to support instant, real-time communications. Candidates and companies can exchange details, ask questions, or align on interview schedules directly within a dedicated split-pane chat interface.",
    category: "Communication"
  },
  {
    question: "Are there pre-seeded accounts I can use to test the application?",
    answer: "Yes, CareerConnect has three pre-seeded role accounts: Candidate (candidate@demo.com), Company/Recruiter (company@demo.com), and Admin (admin@main.com). The password for all three demo accounts is 'password123'. You can use these credentials to log in and test different interfaces instantly.",
    category: "Testing"
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Frequently Asked Questions</h1>
        <p className="text-slate-400 mt-2 text-sm">
          Everything you need to know about the CareerConnect AI-powered hiring ecosystem.
        </p>
      </div>

      <div className="space-y-4">
        {faqData.map((faq, index) => {
          const isOpen = activeIndex === index;
          return (
            <div
              key={index}
              className="glass rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none transition hover:bg-slate-50/50 dark:hover:bg-slate-900/50"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-primary dark:text-primary-light uppercase tracking-wider">
                    {faq.category}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                    {faq.question}
                  </span>
                </div>
                <span className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex-shrink-0 ml-4">
                  {isOpen ? <FiMinus className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
                </span>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-60 border-t border-slate-100 dark:border-slate-850' : 'max-h-0'
                }`}
              >
                <div className="p-6 text-sm text-slate-600 dark:text-slate-455 bg-slate-50/30 dark:bg-slate-900/10 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;
