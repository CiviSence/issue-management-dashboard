import { useState, useEffect } from "react";
import StudentSideNav from "./StudentSideNav";
import BottomNav from "../../Templates/BottomNav";
import Searchbar from "../../Templates/Searchbar";
import UserCard from "../../Templates/UserCard";
import { useIssues } from "../../../Context/IssueContext";
import { useUser } from "../../../Context/ProfileContext";
import { createIssue, getMyIssues } from "../../../Utils/issues";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const StudentDashboard = () => {
    const { profileData } = useUser();
    const [showReportModal, setShowReportModal] = useState(false);
    const [myIssues, setMyIssues] = useState([]);
    const [loadingIssues, setLoadingIssues] = useState(true);

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (profileData?.id) {
            fetchMyIssues();
        }
    }, [profileData]);

    const fetchMyIssues = async () => {
        try {
            setLoadingIssues(true);
            const data = await getMyIssues(profileData.id);
            setMyIssues(data);
        } catch (error) {
            console.error("Failed to fetch my issues", error);
        } finally {
            setLoadingIssues(false);
        }
    };

    const handleReportIssue = async (e) => {
        e.preventDefault();
        if (!title || !description || !location) return alert("Please fill all fields");

        try {
            setIsSubmitting(true);
            await createIssue({
                title,
                description,
                location,
                priority: "medium", // Default
                status: "open"
            });
            setShowReportModal(false);
            setTitle("");
            setDescription("");
            setLocation("");
            fetchMyIssues(); // Refresh list
            alert("Issue reported successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to report issue. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <StudentSideNav />
            <BottomNav />

            <div className="w-full p-4 lg:w-[calc(100vw-15vw)] bg-[#F0EEFF] overflow-y-auto h-screen">
                <div className="w-full bg-violet-600 p-6 rounded-3xl text-white shadow-lg mb-6">
                    <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
                    <p className="text-violet-100">Welcome back! Track your reported issues here.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        {/* Quick Action */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Have a problem?</h2>
                                <p className="text-gray-500">Report a new issue on campus.</p>
                            </div>
                            <button
                                onClick={() => setShowReportModal(true)}
                                className="bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition shadow-lg shadow-violet-200"
                            >
                                + Report Issue
                            </button>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[300px]">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Your Recent Reports</h3>

                            {loadingIssues ? (
                                <Skeleton count={3} height={60} className="mb-2" />
                            ) : myIssues.length > 0 ? (
                                <div className="space-y-3">
                                    {myIssues.map(issue => (
                                        <div key={issue.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center hover:bg-white hover:shadow-md transition">
                                            <div>
                                                <h4 className="font-bold text-gray-800">{issue.title}</h4>
                                                <p className="text-xs text-gray-500">
                                                    Reported by: <span className="font-medium text-gray-700">{issue.user_name}</span> (ID: {issue.user_id?.split('-')[0]}...)
                                                </p>
                                                <p className="text-xs text-gray-500">{new Date(issue.created_at).toLocaleDateString()} • {issue.location_address}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize
                                                ${issue.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                                    issue.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}
                                            `}>
                                                {issue.status?.replace('_', ' ')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    No recent activity found.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <UserCard />

                        <div className="bg-violet-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold mb-1">Campus News</h3>
                                <p className="text-violet-200 text-sm">Stay updated with latest announcements.</p>
                                <div className="mt-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <p className="text-xs">📢 Exam schedule released!</p>
                                </div>
                            </div>
                            {/* Decor */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Issue Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Report New Issue</h2>
                            <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-600">
                                <i className="ri-close-line text-2xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleReportIssue} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
                                <input
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-violet-500"
                                    placeholder="e.g. Broken projector in Room 301"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-violet-500"
                                    placeholder="e.g. Science Block, 3rd Floor"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-violet-500 h-32 resize-none"
                                    placeholder="Describe the issue in detail..."
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowReportModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium disabled:opacity-50"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Report"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentDashboard;
