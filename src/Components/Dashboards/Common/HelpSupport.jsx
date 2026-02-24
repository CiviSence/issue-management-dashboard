import { useState, useEffect } from "react";
import { useUser } from "../../../Context/ProfileContext";
import AdminSideNav from "../Admin/AdminSideNav";
import StudentSideNav from "../Student/StudentSideNav";
import StaffSideNav from "../Staff/StaffSideNav";
import BottomNav from "../../Templates/BottomNav";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import ChatBot from "../../Templates/ChatBot";

const FAQItem = ({ question, answer, role }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <div className="flex flex-col gap-1">
          <span className="text-gray-900 font-bold group-hover:text-violet-600 transition-colors text-sm md:text-base">
            {question}
          </span>
          {role && (
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-violet-400">
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
            <p className="pb-5 text-gray-500 text-xs md:text-sm leading-relaxed">
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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: profileData?.name || "",
    email: profileData?.email || "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    if (profileData) {
      setFormData(prev => ({
        ...prev,
        name: profileData.name || "",
        email: profileData.email || ""
      }));
    }
  }, [profileData]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert("Support form is currently offline.");
  };

  const renderSideNav = () => {
    const role = profileData?.role?.toLowerCase();
    if (role === "student") return <StudentSideNav />;
    if (role === "staff") return <StaffSideNav />;
    return <AdminSideNav />;
  };

  const tabs = [
    { id: "faq", label: "FAQs" },
    { id: "contact", label: "Contact" },
    { id: "knowledge", label: "Knowledge" },
    { id: "legal", label: "Legal" }
  ];

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
    }
  ];

  return (
    <>
      {renderSideNav()}
      <BottomNav />
      <div className="flex-1 bg-[#FBFBFF] min-h-screen overflow-y-auto">
        <div className="max-w-[1400px] lg:pl-32 xl:pl-44">
          {/* HEADER */}
          <div className="relative pt-12 pb-24 md:pt-20 md:pb-32 px-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-200/30 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200/20 rounded-full blur-[80px] -ml-20 -mb-20"></div>

            <div className="relative z-10 max-w-4xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-[10px] md:text-xs font-black uppercase tracking-widest mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                </span>
                Support Center
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6"
              >
                How can we <br className="hidden md:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">help you?</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-1.5 bg-white/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/40 shadow-xl shadow-black/5 md:w-fit overflow-x-auto whitespace-nowrap scrollbar-hide no-scrollbar"
              >
                <LayoutGroup>
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-6 md:px-8 py-3 rounded-xl text-xs md:text-sm font-black transition-all duration-300 ${activeTab === tab.id ? "text-violet-600" : "text-gray-500 hover:text-gray-900"
                        }`}
                    >
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-white rounded-xl shadow-lg shadow-violet-100 ring-1 ring-black/[0.03]"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  ))}
                </LayoutGroup>
              </motion.div>
            </div>
          </div>

          <div className="px-6 pb-32 -mt-12 relative z-10 max-w-5xl">
            <AnimatePresence mode="wait">
              {activeTab === "faq" && (
                <motion.div
                  key="faq"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-6 md:p-10 shadow-xl shadow-black/5 border border-white/60">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-violet-600 text-white rounded-xl flex items-center justify-center text-lg shadow-lg shadow-violet-200">
                          <i className="ri-question-line"></i>
                        </div>
                        FAQs
                      </h3>
                      <button className="text-xs font-black text-violet-600 uppercase tracking-widest hover:underline md:block hidden">View All Guides</button>
                    </div>
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6"
                >
                  <div className="md:col-span-12 lg:col-span-8 bg-white/80 backdrop-blur-md rounded-[32px] p-6 md:p-10 lg:p-12 shadow-xl shadow-black/5 border border-white/60 relative overflow-hidden">
                    {/* Overlay for deactivated form */}
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/10 backdrop-blur-[6px]">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white p-8 rounded-[32px] shadow-2xl shadow-black/10 border border-gray-100 text-center max-w-sm mx-auto"
                      >
                        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                          <i className="ri-error-warning-fill"></i>
                        </div>
                        <h4 className="text-xl font-black text-gray-900 mb-2">Service Offline</h4>
                        <p className="text-gray-500 text-sm leading-relaxed mb-8">The support form is temporarily unavailable. Please use the Live Chat for help.</p>
                        <button
                          onClick={() => setIsChatOpen(true)}
                          className="w-full bg-violet-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-violet-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                          Start Live Chat
                        </button>
                      </motion.div>
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 mb-10">Send a message</h3>
                    <div className="space-y-6 opacity-40">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="h-14 bg-gray-100 rounded-2xl w-full"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-14 bg-gray-100 rounded-2xl w-full"></div>
                        </div>
                      </div>
                      <div className="h-14 bg-gray-100 rounded-2xl w-full"></div>
                      <div className="h-32 bg-gray-100 rounded-2xl w-full"></div>
                      <div className="h-14 bg-gray-200 rounded-2xl w-full"></div>
                    </div>
                  </div>

                  <div className="md:col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[32px] p-10 text-white shadow-xl shadow-violet-200 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                      <h4 className="text-xl font-black mb-4 flex items-center gap-3">
                        <i className="ri-chat-voice-line text-2xl"></i>
                        Live Chat
                      </h4>
                      <p className="text-violet-100/80 text-sm font-medium mb-8 leading-relaxed">Our support heroes are ready to help you in real-time. Average wait: &lt; 2 mins.</p>
                      <button
                        onClick={() => setIsChatOpen(true)}
                        className="w-full bg-white text-violet-600 font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                      >
                        Talk to us now
                      </button>
                    </div>

                    <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-black/5 border border-white/60">
                      <h4 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                        <i className="ri-mail-line text-violet-600"></i>
                        Direct Email
                      </h4>
                      <div className="space-y-4">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">General Enquiries</p>
                        <a href="mailto:connect-csm@zohomail.in" className="text-lg font-black text-gray-900 hover:text-violet-600 transition-colors bg-violet-50 px-4 py-3 rounded-xl block truncate">
                          connect-csm@zohomail.in
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "knowledge" && (
                <motion.div
                  key="knowledge"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-6 md:p-12 shadow-xl shadow-black/5 border border-white/60">
                    <div className="max-w-3xl mb-12">
                      <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg shadow-lg shadow-blue-200">
                          <i className="ri-book-3-line"></i>
                        </div>
                        Knowledge Base
                      </h3>
                      <p className="text-gray-500 text-sm md:text-base leading-relaxed">Everything you need to know about navigating the dashboard, reporting issues, and earning points.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                      {[
                        { step: "1", title: "Getting Started", desc: "Complete your profile and verify your account to start reporting issues." },
                        { step: "2", title: "Reporting Issues", desc: "Use the '+ Report' button. Attach clear photos or videos to help staff." },
                        { step: "3", title: "Status Tracking", desc: "Monitor progress in 'My Issues'. Get notified for every update." },
                        { step: "4", title: "Community Rank", desc: "Earn reputation points for every resolved report and climb the ranks." }
                      ].map((card, i) => (
                        <div key={i} className="flex gap-5 p-6 rounded-2xl hover:bg-violet-50/50 transition-colors group">
                          <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center font-black text-violet-600 group-hover:scale-110 transition-transform">
                            {card.step}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1">{card.title}</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-gray-100">
                      <div className="p-8 bg-gray-50/50 rounded-3xl border border-gray-100 group hover:border-violet-200 transition-all flex flex-col justify-between">
                        <div>
                          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-rose-600 text-2xl mb-6">
                            <i className="ri-play-circle-line"></i>
                          </div>
                          <h4 className="text-xl font-black text-gray-900 mb-3">Video Tutorials</h4>
                          <p className="text-sm text-gray-500 mb-8 leading-relaxed">Prefer watching? Check out our quick 60-second guides on YouTube.</p>
                        </div>
                        <button className="w-full text-xs font-black uppercase tracking-widest text-white bg-gray-900 p-4 rounded-xl hover:bg-violet-600 transition-all">
                          Watch Guides
                        </button>
                      </div>

                      <div className="p-8 bg-gray-50/50 rounded-3xl border border-gray-100 group hover:border-violet-200 transition-all flex flex-col justify-between">
                        <div>
                          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 text-2xl mb-6">
                            <i className="ri-team-line"></i>
                          </div>
                          <h4 className="text-xl font-black text-gray-900 mb-3">Community Hub</h4>
                          <p className="text-sm text-gray-500 mb-8 leading-relaxed">Join 2,000+ students and staff discussing platform updates and tips.</p>
                        </div>
                        <a
                          href="https://chat.whatsapp.com/L8FwfWvRuorDu4zqCJ4uJw?mode=gi_t"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full text-xs font-black uppercase tracking-widest text-white bg-gray-900 p-4 rounded-xl hover:bg-violet-600 transition-all text-center block"
                        >
                          Join the Discussion
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "legal" && (
                <motion.div
                  key="legal"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-6 md:p-12 shadow-xl shadow-black/5 border border-white/60">
                    <div className="max-w-2xl mb-12">
                      <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center text-lg">
                          <i className="ri-scales-line"></i>
                        </div>
                        Legal Documentation
                      </h3>
                      <p className="text-gray-500 text-sm md:text-base leading-relaxed">Your privacy and security are our top priorities. Read our policies below.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <a
                        href="/legal/privacy-policy.txt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-8 bg-white rounded-3xl border border-gray-100 hover:border-violet-200 hover:shadow-xl hover:shadow-black/5 transition-all group"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600 text-2xl group-hover:scale-110 transition-transform">
                            <i className="ri-file-shield-line"></i>
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-gray-900">Privacy Policy</h4>
                            <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">TXT Document</p>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
                          <i className="ri-arrow-right-up-line"></i>
                        </div>
                      </a>

                      <a
                        href="/legal/terms-and-conditions.txt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-8 bg-white rounded-3xl border border-gray-100 hover:border-violet-200 hover:shadow-xl hover:shadow-black/5 transition-all group"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600 text-2xl group-hover:scale-110 transition-transform">
                            <i className="ri-scales-3-line"></i>
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-gray-900">Terms & Conditions</h4>
                            <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Legal Agreement</p>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
                          <i className="ri-arrow-right-up-line"></i>
                        </div>
                      </a>
                    </div>

                    <div className="mt-12 p-8 bg-violet-50 rounded-3xl border border-violet-100/50 flex flex-col md:flex-row items-center gap-6">
                      <div className="w-12 h-12 bg-white rounded-xl flex-shrink-0 flex items-center justify-center text-violet-600 shadow-sm ring-1 ring-black/5">
                        <i className="ri-information-line text-xl"></i>
                      </div>
                      <p className="text-sm font-medium text-violet-900/70 text-center md:text-left">
                        Last updated: Feb 24, 2026. By using this platform, you agree to comply with our academic integrity and campus conduct policies.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default HelpSupport;
