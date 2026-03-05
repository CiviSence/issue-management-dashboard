import { useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { searchVerifiedUsers, requestVouch, uploadID } from "../Utils/verification";
import StudentSideNav from "../Components/Dashboards/Student/StudentSideNav";
import StudentBottomNav from "../Components/Dashboards/Student/StudentBottomNav";

const TrustCenter = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [neighbors, setNeighbors] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [requestingVouch, setRequestingVouch] = useState(null);
    const [uploadingDoc, setUploadingDoc] = useState(false);
    const [docUrl, setDocUrl] = useState("");

    const handleSearch = async () => {
        setLoadingSearch(true);
        try {
            const results = await searchVerifiedUsers();
            const filtered = results.filter(u =>
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setNeighbors(filtered);
            if (filtered.length === 0) toast.info("No verified neighbors found.");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoadingSearch(false);
        }
    };

    const handleRequestVouch = async (userId) => {
        setRequestingVouch(userId);
        try {
            await requestVouch(userId);
            toast.success("Vouch request sent successfully!");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setRequestingVouch(null);
        }
    };

    const handleUploadID = async () => {
        if (!docUrl) return toast.error("Please provide a document URL");
        setUploadingDoc(true);
        try {
            await uploadID(docUrl);
            toast.success("ID submitted for verification!");
            setDocUrl("");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUploadingDoc(false);
        }
    };

    return (
        <>
            <StudentSideNav />
            <StudentBottomNav />
            <div className="w-full p-4 lg:p-8 lg:w-[calc(100vw-15vw)] bg-[#F0EEFF] overflow-y-auto h-screen">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-8 font-primary">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trust Center</h1>
                        <p className="text-gray-600">Complete your identity verification to participate in the community.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    placeholder="Search verified neighbors..."
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
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                {neighbors.map(user => (
                                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRequestVouch(user.id)}
                                            disabled={requestingVouch === user.id}
                                            className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg"
                                        >
                                            {requestingVouch === user.id ? "..." : "Request"}
                                        </button>
                                    </div>
                                ))}
                                {neighbors.length === 0 && !loadingSearch && (
                                    <p className="text-center text-gray-400 text-xs py-4">Search to find neighbors</p>
                                )}
                            </div>
                        </section>

                        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                                    <i className="ri-fingerprint-line text-2xl" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Document Upload</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Document URL</label>
                                    <input
                                        type="text"
                                        placeholder="https://example.com/id.jpg"
                                        value={docUrl}
                                        onChange={(e) => setDocUrl(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
                                    />
                                </div>
                                <button
                                    onClick={handleUploadID}
                                    disabled={uploadingDoc || !docUrl}
                                    className="w-full bg-purple-600 text-white font-semibold py-3 rounded-2xl hover:bg-purple-700 disabled:opacity-50"
                                >
                                    {uploadingDoc ? "Submitting..." : "Upload & Verify"}
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TrustCenter;
