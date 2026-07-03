import SideNav from "./AdminSideNav";
import BottomNav from "../../Templates/BottomNav";
import TopBar from "../../Templates/TopBar";
import PullToRefresh from "../../Templates/PullToRefresh";
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
      <div className="w-full lg:w-[calc(100vw-15vw)] bg-[#FDFDFF] overflow-x-hidden overflow-y-auto h-screen pb-20" id="leaderboardScroll">
        <TopBar title="Top Reporters" />
        <PullToRefresh scrollContainerId="leaderboardScroll" onRefresh={() => window.location.reload()}>
          <div className="w-full pb-20 md:pb-2 p-2 lg:p-4">
          <div className=" mx-auto mt-2">
            <UserCard />
          </div>
          </div>
        </PullToRefresh>
      </div>
    </>
  );
};

export default Leaderboard;
