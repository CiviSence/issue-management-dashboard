import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
    searchVerifiedUsers,
    requestVouch,
    uploadVerificationDocument,
    submitVerificationRequest,
    getReceivedRequests,
    getSentRequests,
    getVerificationStats,
    respondToVerificationRequest
} from "../Utils/verification";
import StudentSideNav from "../Components/Dashboards/Student/StudentSideNav";
import StudentBottomNav from "../Components/Dashboards/Student/StudentBottomNav";

const TrustCenter = () => {
    const [activeTab, setActiveTab] = useState("apply"); // 'apply' or 'requests'
    const [requestTab, setRequestTab] = useState("received"); // 'received' or 'sent'

    // Application States
    const [searchTerm, setSearchTerm] = useState("");
    const [neighbors, setNeighbors] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [requestingVouch, setRequestingVouch] = useState(null);
    const [uploadingDoc, setUploadingDoc] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState("Applying for official verification");

    // Requests & Stats States
    const [stats, setStats] = useState(null);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [respondingId, setRespondingId] = useState(null);

    const fetchData = async () => {
        setLoadingData(true);
        try {
            const results = await Promise.allSettled([
                getVerificationStats(),
                getReceivedRequests(),
                getSentRequests()
            ]);

            // Map results to states, checking if each promise fulfilled
            if (results[0].status === "fulfilled") setStats(results[0].value);
            if (results[1].status === "fulfilled") setReceivedRequests(results[1].value);
            if (results[2].status === "fulfilled") setSentRequests(results[2].value);

            // Log rejected ones for debugging
            results.forEach((res, i) => {
                if (res.status === "rejected") {
                    console.error(`Endpoint ${i} failed:`, res.reason);
                }
            });

        } catch (err) {
            console.error("General Fetch Error:", err);
            toast.error("An unexpected error occurred while loading trust data.");
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleSearch = async () => {
        setLoadingSearch(true);
        try {
            const results = await searchVerifiedUsers(searchTerm);
            setNeighbors(results);
            if (results.length === 0) toast.info("No verified neighbors found.");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoadingSearch(false);
        }
    };

    const handleRequestVouch = async (userId) => {
        setRequestingVouch(userId);
        console.log("Requesting vouch for user ID:", userId, "Type:", typeof userId);
        try {
            await requestVouch(userId);
            toast.success("Vouch request sent successfully!");
            fetchData();
        } catch (err) {
            if (err.message.includes("already pending")) {
                toast.info("You already have a pending request with this user.");
            } else {
                toast.error(err.message);
            }
        } finally {
            setRequestingVouch(null);
        }
    };

    const handleUploadID = async () => {
        if (!selectedFile) return toast.error("Please select a document file");
        setUploadingDoc(true);
        try {
            const uploadRes = await uploadVerificationDocument(selectedFile);
            const savedUrl = uploadRes.url;
            console.log("Document uploaded, received URL:", savedUrl);
            await submitVerificationRequest([savedUrl], message);
            toast.success("Identity verification request submitted!");
            setSelectedFile(null);
            setMessage("Applying for official verification");
            fetchData();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUploadingDoc(false);
        }
    };

    const handleRespond = async (requestId, action) => {
        setRespondingId(requestId);
        try {
            await respondToVerificationRequest(requestId, action);
            toast.success(`Request ${action}ed successfully!`);
            fetchData();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setRespondingId(null);
        }
    };

    return (
        <>
            <StudentSideNav />
            <StudentBottomNav />
            <div className="w-full p-4 lg:p-8 lg:w-[calc(100vw-15vw)] bg-[#F0EEFF] overflow-y-auto h-screen">
                <div className="max-w-4xl mx-auto pb-24 lg:pb-8">
                    <header className="mb-8 font-primary">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Trust Center</h1>
                                <p className="text-gray-600">Secure your community status and manage identity proofs.</p>
                            </div>
                            {stats && (
                                <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-violet-100 hidden sm:block">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-violet-500">Reputation</p>
                                    <p className="text-xl font-black text-violet-900">{stats.vouch_count || 0} Vouches</p>
                                </div>
                            )}
                        </div>
                    </header>

                    {/* Stats Grid */}
                    {stats && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                <p className={`text-sm font-bold uppercase ${stats.status === 'verified' ? 'text-emerald-600' : 'text-amber-500'}`}>
                                    {stats.status || "Unverified"}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Vouch Count</p>
                                <p className="text-sm font-bold text-gray-900">{stats.vouch_count || 0} / 3</p>
                            </div>
                            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Daily Limit</p>
                                <p className="text-sm font-bold text-gray-900">{stats.daily_vouch_limit || 0} left</p>
                            </div>
                            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Trust Score</p>
                                <p className="text-sm font-bold text-violet-600">{(stats.vouch_count || 0) * 33}%</p>
                            </div>
                        </div>
                    )}

                    {/* Tab Navigation */}
                    <div className="flex gap-2 mb-8 bg-white/50 p-1.5 rounded-2xl w-fit border border-white/20 backdrop-blur-sm">
                        <button
                            onClick={() => setActiveTab("apply")}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'apply' ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white'}`}
                        >
                            Apply for Verification
                        </button>
                        <button
                            onClick={() => setActiveTab("requests")}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'requests' ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white'}`}
                        >
                            Manage Requests {receivedRequests.length > 0 && <span className="ml-1 bg-white text-violet-600 px-1.5 rounded-md text-[10px]">{receivedRequests.length}</span>}
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === "apply" ? (
                            <motion.div
                                key="apply"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                            <i className="ri-group-line text-2xl" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Peer Verification</h2>
                                    </div>
                                    <div className="flex gap-2 mb-6">
                                        <input
                                            type="text"
                                            placeholder="Search Neighbors by Reg. Number, Name or Email..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
                                        />
                                        <button
                                            onClick={handleSearch}
                                            disabled={loadingSearch}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {loadingSearch ? <i className="ri-loader-4-line animate-spin" /> : "Search"}
                                        </button>
                                    </div>
                                    <div className="space-y-3 max-h-84 overflow-y-auto pr-1">
                                        {neighbors.map(user => (
                                            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold uppercase">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                                        <p className="text-[10px] text-gray-400">{user.registration_number || user.email}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRequestVouch(user.id)}
                                                    disabled={requestingVouch === user.id}
                                                    className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                                                >
                                                    {requestingVouch === user.id ? "..." : "Request"}
                                                </button>
                                            </div>
                                        ))}
                                        {neighbors.length === 0 && !loadingSearch && (
                                            <p className="text-center text-gray-400 text-xs py-8">Search to find neighbors who can vouch for you</p>
                                        )}
                                    </div>
                                </section>

                                <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                                            <i className="ri-fingerprint-line text-2xl" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Official Verification</h2>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Motivation / Message</label>
                                            <textarea
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Briefly explain why you need verification..."
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 resize-none h-24"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Upload Proof (ID/Document)</label>
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    accept="image/*,.pdf"
                                                />
                                                <div className={`w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all ${selectedFile ? "border-purple-500 bg-purple-50" : "border-gray-200 group-hover:border-purple-300"}`}>
                                                    <i className={`ri-upload-cloud-2-line text-3xl mb-2 ${selectedFile ? "text-purple-600" : "text-gray-400"}`} />
                                                    <p className={`text-xs font-medium ${selectedFile ? "text-purple-700" : "text-gray-500 text-center"}`}>
                                                        {selectedFile ? selectedFile.name : "Click or drag to upload document"}
                                                    </p>
                                                    {selectedFile && (
                                                        <p className="text-[10px] text-purple-500 mt-1">Ready to submit</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleUploadID}
                                            disabled={uploadingDoc || !selectedFile}
                                            className="w-full bg-purple-600 text-white font-bold py-3.5 rounded-2xl hover:bg-purple-700 disabled:opacity-50 transition shadow-lg shadow-purple-100 flex items-center justify-center gap-2"
                                        >
                                            {uploadingDoc ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-send-plane-fill" />}
                                            {uploadingDoc ? "Uploading..." : "Submit Verification Request"}
                                        </button>
                                    </div>
                                </section>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="requests"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[400px]"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setRequestTab("received")}
                                            className={`text-sm font-bold relative pb-1 transition-colors ${requestTab === 'received' ? 'text-violet-600' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            Received
                                            {requestTab === 'received' && <motion.div layoutId="reqUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />}
                                        </button>
                                        <button
                                            onClick={() => setRequestTab("sent")}
                                            className={`text-sm font-bold relative pb-1 transition-colors ${requestTab === 'sent' ? 'text-violet-600' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            My Applications
                                            {requestTab === 'sent' && <motion.div layoutId="reqUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />}
                                        </button>
                                    </div>
                                    <button
                                        onClick={fetchData}
                                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
                                    >
                                        <i className={`ri-refresh-line ${loadingData ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {loadingData ? (
                                        <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                                            <i className="ri-loader-4-line text-4xl animate-spin mb-2" />
                                            <p className="text-sm font-medium">Fetching verification data...</p>
                                        </div>
                                    ) : (requestTab === 'received' ? receivedRequests : sentRequests).length > 0 ? (
                                        (requestTab === 'received' ? receivedRequests : sentRequests).map(req => (
                                            <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg uppercase shadow-sm ${requestTab === 'received' ? 'bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600' : 'bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600'}`}>
                                                        {((requestTab === 'received' ? req.requester_name : req.target_user_name) || "U").charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-bold text-gray-900">{requestTab === 'received' ? req.requester_name : `Request to: ${req.target_user_name || "Admin Review"}`}</h3>
                                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{req.verification_type} Request</p>
                                                        {req.message && (
                                                            <p className="text-xs text-gray-500 mt-1 italic truncate max-w-[200px]">"{req.message}"</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {requestTab === 'received' && req.status === 'pending' ? (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleRespond(req.id, "reject")}
                                                            disabled={respondingId === req.id}
                                                            className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-50"
                                                        >
                                                            Reject
                                                        </button>
                                                        <button
                                                            onClick={() => handleRespond(req.id, "approve")}
                                                            disabled={respondingId === req.id}
                                                            className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-md transition-all flex items-center justify-center gap-2"
                                                        >
                                                            {respondingId === req.id ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-check-line font-black" />}
                                                            Approve
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="text-right">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${req.status === 'approved' || req.status === 'verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : req.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-red-50 text-red-600 border-red-100'
                                                            }`}>
                                                            {req.status}
                                                        </span>
                                                        <p className="text-[9px] text-gray-400 mt-2 uppercase font-bold tracking-tighter">
                                                            {new Date(req.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <i className="ri-inbox-line text-4xl text-gray-200" />
                                            </div>
                                            <h3 className="text-sm font-bold text-gray-900">No {requestTab} requests</h3>
                                            <p className="text-xs text-gray-400 mt-1">Activities related to your verification will appear here.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
};

export default TrustCenter;
