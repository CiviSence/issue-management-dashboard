import StaffSideNav from "./StaffSideNav";
import BottomNav from "../../Templates/BottomNav";
import Searchbar from "../../Templates/Searchbar";
import { useIssues } from "../../../Context/IssueContext";

const StaffDashboard = () => {
    const { issues } = useIssues();

    return (
        <>
            <StaffSideNav />
            <BottomNav />

            <div className="w-full p-4 lg:w-[calc(100vw-15vw)] bg-[#F0EEFF] overflow-y-auto h-screen">
                <div className="w-full bg-violet-600 p-6 rounded-3xl text-white shadow-lg mb-6">
                    <h1 className="text-3xl font-bold mb-2">Staff Dashboard</h1>
                    <p className="text-violet-100">Manage your assigned tasks and updates.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm">Pending Tasks</p>
                        <h3 className="text-2xl font-bold text-violet-600">0</h3>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm">In Progress</p>
                        <h3 className="text-2xl font-bold text-blue-600">0</h3>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm">Completed Today</p>
                        <h3 className="text-2xl font-bold text-green-600">0</h3>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm">Efficiency Score</p>
                        <h3 className="text-2xl font-bold text-amber-500">100%</h3>
                    </div>
                </div>

                {/* Task List (Placeholder) */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Your Assigned Issues</h2>
                        <Searchbar />
                    </div>

                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400">
                        No tasks assigned currently.
                    </div>
                </div>
            </div>
        </>
    );
};

export default StaffDashboard;
