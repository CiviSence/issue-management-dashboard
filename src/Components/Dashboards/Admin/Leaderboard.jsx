import SideNav from "./AdminSideNav";
import BottomNav from "../../Templates/BottomNav";
import Searchbar from "../../Templates/Searchbar";
// import { useUsers } from "../../../Context/UserContext";
import UserCard from "../../Templates/UserCard";
import { useUser } from "../../../Context/ProfileContext";
import AdminSideNav from "./AdminSideNav";
import StudentSideNav from "../Student/StudentSideNav";
import StaffSideNav from "../Staff/StaffSideNav";



  

const Leaderboard = () => {
  const {profileData} = useUser();
    const role = profileData?.role?.toLowerCase();



const renderSideNav = () => {
    if (role === "student") return <StudentSideNav />;
    if (role === "staff") return <StaffSideNav />;
    return <AdminSideNav />; // Default/Admin
  };
  return (
    <>
      {renderSideNav()}
      <BottomNav />
      <div className="pb-20 md:pb-2 min-h-screen w-full p-4 overflow-x-auto">
        <div className="w-full bg-linear-to-r from-[#7E70EB] to-[#5A50A6] p-4 rounded-2xl shadow-lg border border-white/10">
          <div
            className="
      flex
      flex-col
      sm:flex-row
      sm:items-center
      sm:justify-between
      gap-2
    "
          >
            {/* Dashboard Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Top Reporters
            </h1>
            {/* Searchbar */}
            <Searchbar />
          </div>
        </div>
        <div className=" mx-auto mt-2">
          <UserCard />
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
