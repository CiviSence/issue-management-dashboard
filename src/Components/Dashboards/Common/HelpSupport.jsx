import { useState } from "react";
import { useUser } from "../../../Context/ProfileContext";
import AdminSideNav from "../Admin/AdminSideNav";
import StudentSideNav from "../Student/StudentSideNav";
import StaffSideNav from "../Staff/StaffSideNav";
import BottomNav from "../../Templates/BottomNav";

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
            question: "How do I report an issue?",
            answer: "Go to your dashboard or the reported issues page and click on 'Report Issue'. Fill in the details and submit.",
        },
        {
            question: "Can I track the status of my reported issue?",
            answer: "Yes, you can track the status in the 'My Dashboard' or 'Reported Issues' section.",
        },
        {
            question: "How do I change my profile details?",
            answer: "Navigate to your Profile page and click on the 'Edit Profile' button to update your information.",
        },
        {
            question: "Who can see my reported issues?",
            answer: "Your reported issues are visible to the administration and staff. Public issues may be visible to other students depending on the settings.",
        },
    ];

    return (
        <>
            {renderSideNav()}
            <BottomNav />
            <div className="w-full p-4 lg:w-[calc(100vw-15vw)] bg-[#F0EEFF] min-h-screen overflow-y-auto">
                <div className="w-full mx-auto">
                    <div className="bg-violet-500 p-6 rounded-3xl text-white shadow-xl mb-8 relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
                            <p className="text-violet-100">We're here to help you.</p>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    </div>

                    <div className="flex gap-4 mb-6 border-b border-gray-200 pb-1">
                        <button
                            onClick={() => setActiveTab("faq")}
                            className={`pb-3 px-4 font-medium transition ${activeTab === 'faq' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            FAQs
                        </button>
                        <button
                            onClick={() => setActiveTab("contact")}
                            className={`pb-3 px-4 font-medium transition ${activeTab === 'contact' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Contact Support
                        </button>
                    </div>

                    {activeTab === "faq" && (
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-800 text-lg mb-2">{faq.question}</h3>
                                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "contact" && (
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Admin</h3>
                            <p className="text-gray-600 mb-6">If you couldn't find your answer in the FAQs, feel free to reach out to us directly.</p>

                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <input type="text" className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500" placeholder="Briefly describe your issue" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea rows="4" className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500" placeholder="Write your message here..." />
                                </div>
                                <button type="button" className="bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition w-full md:w-auto">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default HelpSupport;
