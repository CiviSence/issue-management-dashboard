import React from 'react'

const RecentReportsCard = ({ recentReports }) => {
    
  return (
   <div className='bg-white rounded-lg shadow-md p-6 w-[40%]'>
        <h2 className='text-3xl font-bold text-[#363434] mb-5'>Recent Reports</h2>
        <div>
          <table className='w-full text-left'>
            <thead>
              <tr>
                <th className='pb-4'>Issue</th>
                <th className='pb-4'>Location</th>
                <th className='pb-4'>Status</th>
                <th className='pb-4'>Reported</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report) => (
                <tr key={report.id} className='border-t'>
                  <td className='py-4 font-semibold text-xl'>{report.issue}</td>
                  <td className='py-4 text-gray-500'>{report.location}</td>
                  <td className='py-4'>{report.status}</td>
                  <td className='py-4'>{report.reported}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  )
}

export default RecentReportsCard