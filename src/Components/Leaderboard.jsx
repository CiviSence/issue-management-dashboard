import React, { useState } from "react";
import SideNav from "./Templates/SideNav";
import BottomNav from "./Templates/BottomNav";
import Searchbar from "./Templates/Searchbar";

const Leaderboard = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Sample data matching the image
  const reporters = [
    {
      id: 1,
      name: "Rishav Ranjan",
      issues: 25,
      lastActive: "Today, 09:43",
      avatar: "https://i.pravatar.cc/150?img=11",
      isTop: true,
    },
    {
      id: 2,
      name: "Priyanshu Anand",
      issues: 18,
      lastActive: "Monday, 11:20",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: 3,
      name: "Nikhil Singh",
      issues: 15,
      lastActive: "Monday, 09:43",
      avatar: "https://i.pravatar.cc/150?img=13",
    },
    {
      id: 4,
      name: "user",
      issues: 13,
      lastActive: "Today, 09:43",
      avatar: "https://i.pravatar.cc/150?img=14",
    },
    {
      id: 5,
      name: "user",
      issues: 9,
      lastActive: "Monday, 11:20",
      avatar: "https://i.pravatar.cc/150?img=15",
    },
    {
      id: 6,
      name: "user",
      issues: 9,
      lastActive: "Saturday, 09:43",
      avatar: "https://i.pravatar.cc/150?img=16",
    },
    {
      id: 7,
      name: "user",
      issues: 5,
      lastActive: "Friday, 18:47",
      avatar: "https://i.pravatar.cc/150?img=17",
    },
    {
      id: 8,
      name: "user",
      issues: 3,
      lastActive: "Monday, 11:20",
      avatar: "https://i.pravatar.cc/150?img=18",
    },
    {
      id: 9,
      name: "user",
      issues: 1,
      lastActive: "Saturday, 09:43",
      avatar: "https://i.pravatar.cc/150?img=19",
    },
    {
      id: 10,
      name: "user",
      issues: 1,
      lastActive: "Saturday, 09:43",
      avatar: "https://i.pravatar.cc/150?img=20",
    },
    {
      id: 10,
      name: "user",
      issues: 1,
      lastActive: "Saturday, 09:43",
      avatar: "https://i.pravatar.cc/150?img=20",
    },
    {
      id: 10,
      name: "user",
      issues: 1,
      lastActive: "Saturday, 09:43",
      avatar: "https://i.pravatar.cc/150?img=20",
    },
  ];

  const itemsPerPage = 10;
  const totalPages = Math.ceil(reporters.length / itemsPerPage);
  const currentReporters = reporters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getRankStyle = (rank) => {
    if (rank === 1) return "bg-indigo-600 text-white";
    if (rank === 2) return "bg-indigo-500 text-white";
    if (rank === 3) return "bg-indigo-400 text-white";
    return "bg-gray-100 text-gray-700";
  };

  const getRowStyle = (index) => {
    const rank = (currentPage - 1) * itemsPerPage + index + 1;
    if (rank <= 3) return "bg-indigo-50/50 hover:bg-indigo-100/50";
    return "bg-white hover:bg-gray-50";
  };

  return (
    <>
      <SideNav />
      <BottomNav />
      <div className="min-h-screen w-full  p-4 overflow-x-auto">
        <div className="w-full bg-violet-500 p-4 rounded-2xl">
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
        <div className=" mx-auto">
          {/* Header */}
          <div>
            <p className="text-sm text-gray-500 mt-4">
              Community contributors ranked by issues reported
            </p>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Desktop & Tablet Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-1">Rank</div>
              <div className="col-span-6 sm:col-span-7">Name</div>
              <div className="col-span-4 sm:col-span-3 text-right">
                Total Issues Reported
              </div>
            </div>

            {/* Mobile Header */}
            <div className="sm:hidden px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Leaderboard
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-100">
              {currentReporters.map((reporter, index) => {
                const rank = (currentPage - 1) * itemsPerPage + index + 1;

                return (
                  <div
                    key={reporter.id}
                    className={`group transition-all duration-200 ${getRowStyle(index)}`}
                  >
                    {/* Desktop & Tablet Layout */}
                    <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 items-center">
                      {/* Rank */}
                      <div className="col-span-1">
                        <div
                          className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                        ${getRankStyle(rank)}
                        ${rank === 1 ? "ring-4 ring-indigo-100" : ""}
                      `}
                        >
                          {rank}
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="col-span-6 sm:col-span-7 flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={reporter.avatar}
                            alt={reporter.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                            loading="lazy"
                          />
                          {rank === 1 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
                              👑
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 truncate">
                            {reporter.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Last Reported {reporter.lastActive}
                          </div>
                        </div>
                      </div>

                      {/* Issues Count */}
                      <div className="col-span-4 sm:col-span-3 text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 group-hover:bg-white group-hover:shadow-sm transition-all">
                          {reporter.issues} issues
                        </span>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="sm:hidden px-4 py-4 flex items-center gap-3">
                      {/* Rank */}
                      <div
                        className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                      ${getRankStyle(rank)}
                    `}
                      >
                        {rank}
                      </div>

                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <img
                          src={reporter.avatar}
                          alt={reporter.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                          loading="lazy"
                        />
                        {rank === 1 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
                            👑
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">
                          {reporter.name}
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          Last: {reporter.lastActive}
                        </div>
                        <div className="text-sm font-semibold text-indigo-600">
                          {reporter.issues} issues reported
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-2 flex sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Prev Page
            </button>

            <span className="text-sm text-gray-600 order-first sm:order-none">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              Next Page
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
