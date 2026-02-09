import StaffSideNav from "./StaffSideNav";
import BottomNav from "../../Templates/BottomNav";
import Searchbar from "../../Templates/Searchbar";
import { useIssues } from "../../../Context/IssueContext";

const AssignedIssues = () => {
    // This would ideally filter issues assigned to the logged-in staff
    const { issues } = useIssues();

    return (
        <>
            <StaffSideNav />
            <BottomNav />

            <div className="w-full p-4 lg:p-8 lg:w-[calc(100vw-15vw)] bg-[#F0EEFF] min-h-screen overflow-y-auto">
                <div className="w-full bg-violet-600 p-6 rounded-3xl text-white shadow-lg mb-6">
                    <h1 className="text-3xl font-bold mb-2">Assigned Tasks</h1>
                    <p className="text-violet-100">Tasks assigned to you for resolution.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Task List</h2>
                        <Searchbar />
                    </div>

                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400">
                        {/* Placeholder logic until backend supports assignment filtering */}
                        No tasks assigned currently.
                    </div>
                </div>
            </div>
        </>
    );
};

export default AssignedIssues;
