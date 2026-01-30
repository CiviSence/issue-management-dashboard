import React from 'react'
import SideNav from './Templates/SideNav'
import Searchbar from './Templates/Searchbar'
import IssueCard from './Templates/IssueCard'
import RecentReportsCard from './Templates/RecentReportsCard'
import Chart from './Templates/Chart'
import ProgressChartCard from './Templates/ProgressChartCard'

const Dashboard = () => {
  const issues = [
  { name: "Total Issues", count: 256, description: "All reported issues" , color: "from-[#980101] to-[#FF2C2C]", color2: "bg-[#980101]"},
  { name: "Open Issues", count: 200 , description: "Pending Cases", color: "from-[#F5A623] to-[#F8E71C]" , color2: "bg-[#F5A623]"},
  { name: "In Progress", count: 100, description: "Under Review", color: "from-[#00284B] to-[#0088FF]", color2: "bg-[#00284B]"},
  { name: "Resolved Issues", count: 56, description: "Issues Fixed", color: "from-[#0D4900] to-[#2DF300]", color2: "bg-[#0D4900]"},
];

const recentReports = [
  {
    id: 1,
    issue: "Broken Tap",
    location: "Boys Hostel",
    status: "Open",
    reported: "1 hour ago",
  },
  {
    id: 2,
    issue: "Water Leakage",
    location: "Girls Hostel",
    status: "Open",
    reported: "12 hours ago",
  },
  {
    id: 3,
    issue: "Projector not working",
    location: "Admin Building",
    status: "In Progress",
    reported: "Yesterday",
  },
  {
    id: 4,
    issue: "Broken window",
    location: "Boys Hostel",
    status: "Pending",
    reported: "2 days ago",
  },
  {
    id: 5,
    issue: "Tube light not working",
    location: "Boys Hostel",
    status: "Resolved",
    reported: "3 days ago",
  },
];

const data = [
  { name: "Jan", users: 400 },
  { name: "Feb", users: 300 },
  { name: "Mar", users: 500 },
  { name: "April", users: 100 },
  { name: "May", users: 150 },
  { name: "June", users: 200 },
];


  return (
    <>
    <SideNav/>
    <div className='w-[calc(100vw-15vw)] h-full bg-[#F0EEFF]'>
      <div className="absolute flex justify-end w-full right-0 p-4"><Searchbar/></div>
      <h1 className='text-3xl font-semibold text-[#363434] pt-10 pl-5'>Main Dashboard</h1> 
      <div className='w-full flex flex-wrap flex-1  justify-around mt-5'>
        {issues.map((issue, index) => (<IssueCard key={index} issue={issue} />))}     
      </div>
      <div>
        </div>  
      <div className="mt-10 px-10 flex flex-wrap gap-2">
        <ProgressChartCard/>
         <Chart data={data}/>
        <RecentReportsCard recentReports={recentReports}/>
        
      </div>
     

    </div>
    </>
  )
}

export default Dashboard