import { useState } from "react";
import { useUser } from "../../../Context/ProfileContext";
import AdminSideNav from "../Admin/AdminSideNav";
import StudentSideNav from "../Student/StudentSideNav";
import StaffSideNav from "../Staff/StaffSideNav";
import BottomNav from "../../Templates/BottomNav";
import { motion, AnimatePresence } from "framer-motion";

const FAQItem = ({ question, answer, role }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <div className="flex flex-col gap-1">
          <span className="text-gray-800 font-bold group-hover:text-violet-600 transition-colors">
            {question}
          </span>
          {role && (
            <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">
              For: {role}
            </span>
          )}
        </div>
        <i className={`ri-arrow-down-s-line text-xl transition-transform duration-300 ${isOpen ? "rotate-180 text-violet-600" : "text-gray-400"}`}></i>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-gray-500 text-sm leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HelpSupport = () => {
  const { profileData } = useUser();
  const [activeTab, setActiveTab] = useState("faq");

  const renderSideNav = () => {
    const role = profileData?.role?.toLowerCase();
    if (role === "student") return <StudentSideNav />;
    if (role === "staff") return <StaffSideNav />;
    return <AdminSideNav />;
  };

  const faqs = [
    {
      question: "How do I report a new issue?",
      answer: "Navigate to your dashboard and click the '+ Report Issue' button. You can also use the Floating Action Button on mobile.",
      role: "Student"
    },
    {
      question: "Can I edit my report after submission?",
      answer: "Yes, you can edit your reports from the 'Recent Reports' section on your dashboard as long as the status is 'Open'.",
      role: "Student"
    },
    {
      question: "How are my reputation points calculated?",
      answer: "You earn 10 points for every issue you report that gets resolved by the staff.",
      role: "Student"
    },
    {
      question: "How do I assign an issue to a staff member?",
      answer: "Go to 'Reported Issues', click on an issue, and use the 'Assign' dropdown menu to select a staff member.",
      role: "Admin"
    },
    {
      question: "Can I export issue reports in Excel/JSON?",
      answer: "Yes, use the 'Export' button located at the top of the analytics or reported issues page.",
      role: "Admin"
    },
    {
      question: "How do I mark an issue as resolved?",
      answer: "Open the issue details, update the status to 'Resolved', and optionally add a closing comment.",
      role: "Staff"
    },
    {
      question: "What happens if I forget my password?",
      answer: "Click 'Forgot Password' on the login screen and follow the OTP verification steps to reset it.",
      role: "All Roles"
    },
    {
      question: "Is there a limit to attachment file sizes?",
      answer: "Yes, the current limit is 5MB for images and 10MB for video (max 10 seconds).",
      role: "All Roles"
    },
    {
      question: "How do I manage my active sessions?",
      answer: "Navigate to your Profile page. You can view and revoke specific sessions from the 'Active Sessions' card.",
      role: "All Roles"
    },
    {
      question: "How do I contact technical support?",
      answer: "Use the 'Contact Us' tab right here to send us a message or initiate a live chat.",
      role: "All Roles"
    }
  ];

  return (
    <>
      {renderSideNav()}
      <BottomNav />
      <div className="w-full bg-[#F8F9FF] min-h-screen overflow-y-auto">
        <div className="mx-auto max-w-7xl lg:w-[calc(100vw-15vw)]">
          {/* HEADER */}
          <div className="bg-white border-b border-gray-100 shadow-sm px-6 py-10 lg:px-20 lg:py-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-50 rounded-full blur-3xl opacity-60 -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-50 rounded-full blur-3xl opacity-40 -ml-10 -mb-10"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                  Help & Support
                </h1>
                <p className="text-gray-500 font-medium text-lg mt-2">
                  Need some assistance? We've got your back.
                </p>
              </div>
              <div className="flex bg-gray-100/80 p-1 rounded-2xl md:min-w-[400px]">
                {["faq", "contact", "knowledge"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold capitalize transition-all duration-200 ${activeTab === tab
                        ? "bg-white text-violet-600 shadow-sm ring-1 ring-black/5"
                        : "text-gray-500 hover:text-gray-800"
                      }`}
                  >
                    {tab === "faq" ? "FAQs" : tab === "contact" ? "Contact Us" : "Knowledge Base"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-12 pb-32 max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === "faq" && (
                <motion.div
                  key="faq"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                      <i className="ri-question-line text-violet-600"></i>
                      Frequently Asked Questions
                    </h3>
                    <div className="divide-y divide-gray-50">
                      {faqs.map((faq, index) => (
                        <FAQItem key={index} {...faq} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "contact" && (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                  <div className="lg:col-span-2 bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-black text-gray-900 mb-2">Send us a Message</h3>
                    <p className="text-gray-500 mb-8 text-sm">Fill out the form below and we'll get back as soon as possible.</p>

                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Your Name</label>
                          <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-violet-200 transition-all font-medium" defaultValue={profileData?.name} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email ID</label>
                          <input type="email" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-violet-200 transition-all font-medium" defaultValue={profileData?.email} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Subject</label>
                        <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-violet-200 transition-all font-medium" placeholder="E.g. Issue feedback, technical problem..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Message</label>
                        <textarea rows="5" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-violet-200 transition-all font-medium resize-none" placeholder="Describe your concern in detail..."></textarea>
                      </div>
                      <button className="w-full bg-violet-600 text-white font-black py-5 rounded-2xl hover:bg-violet-700 shadow-xl shadow-violet-100 transition-all active:scale-[0.98]">
                        Send Message
                      </button>
                    </form>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-violet-600 rounded-3xl p-8 text-white shadow-xl shadow-violet-200">
                      <h4 className="text-lg font-black mb-4 flex items-center gap-2">
                        <i className="ri-chat-smile-2-line"></i>
                        Live Chat
                      </h4>
                      <p className="text-violet-100 text-sm mb-6 leading-relaxed">Our support team is online! Chat with us for immediate assistance.</p>
                      <button className="w-full bg-white text-violet-600 font-bold py-4 rounded-2xl hover:bg-violet-50 transition-colors">
                        Start Chatting
                      </button>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                      <h4 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                        <i className="ri-feedback-line text-violet-600"></i>
                        Feedback
                      </h4>
                      <p className="text-gray-500 text-sm mb-4">Have suggestions for the platform?</p>
                      <a href="mailto:support@csm.edu" className="text-violet-600 font-bold hover:underline block">
                        support@csm.edu
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "knowledge" && (
                <motion.div
                  key="knowledge"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 text-2xl">
                      <i className="ri-article-line"></i>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">User Guides</h3>
                    <p className="text-gray-500 text-sm mb-6">Detailed documentation on how to use every feature of the dashboard.</p>
                    <button className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2 hover:gap-3 transition-all">
                      Read Docs <i className="ri-arrow-right-line"></i>
                    </button>
                  </div>

                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6 text-2xl">
                      <i className="ri-video-line"></i>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">Video Tutorials</h3>
                    <p className="text-gray-500 text-sm mb-6">Watch step-by-step videos to master issue reporting and management.</p>
                    <button className="text-sm font-black uppercase tracking-widest text-rose-600 flex items-center gap-2 hover:gap-3 transition-all">
                      Watch Videos <i className="ri-arrow-right-line"></i>
                    </button>
                  </div>

                  <div className="md:col-span-2 bg-violet-50 rounded-3xl p-8 lg:p-12 text-center">
                    <h3 className="text-2xl font-black text-violet-900 mb-4">Still searching for answers?</h3>
                    <p className="text-violet-700/70 mb-8 max-w-lg mx-auto">Check out our community forum where power users share tips and tricks.</p>
                    <button className="bg-white text-violet-600 font-black px-8 py-4 rounded-2xl hover:bg-violet-600 hover:text-white transition-all shadow-lg shadow-violet-100">
                      Join the Community
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpSupport;
