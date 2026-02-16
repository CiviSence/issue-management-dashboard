import SideNav from "./AdminSideNav";
import BottomNav from "../../Templates/BottomNav";
import Searchbar from "../../Templates/Searchbar";
// import { useUsers } from "../../../Context/UserContext";
import UserCard from "../../Templates/UserCard";

const Leaderboard = () => {
  return (
    <>
      <SideNav />
      <BottomNav />
      <div className="min-h-screen w-full  p-4 overflow-x-auto">
        <div className="w-full bg-violet-600 p-4 rounded-2xl">
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
            <h1 className="text-2xl sm:text-3xl font-semibold text-white">
              Top Reporters
            </h1>
            {/* Searchbar */}
            <Searchbar />
          </div>
        </div>
        <div className=" mx-auto mt-2 lg:mt-4">
          <UserCard />
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
