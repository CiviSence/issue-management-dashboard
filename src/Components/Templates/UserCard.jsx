import React from 'react'


const recentUsers = [
  { id: 1, name: 'John Doe', email: 'john@college.edu', role: 'student', status: 'active', joined: '2 days ago' },
  { id: 2, name: 'Jane Smith', email: 'jane@college.edu', role: 'student', status: 'active', joined: '3 days ago' },
  { id: 3, name: 'Mike Johnson', email: 'mike@college.edu', role: 'staff', status: 'active', joined: '1 week ago' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@college.edu', role: 'student', status: 'pending', joined: '1 day ago' },
];

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};


const UserCard = () => {
  return (
   <div className="overflow-x-auto bg-white rounded-xl  p-4 pb-10 w-full">
      <div className="flex flex-row items-center justify-between">
                <div className="text-lg font-semibold">Users</div>
                
              </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">User</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Joined</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                                <div className="bg-[#243b8c] text-white text-xs">
                                  {getInitials(user.name)}
                                </div>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="capitalize text-sm">{user.role}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">{user.joined}</td>
                          <td className="py-3 px-4">
                            
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
  )
}

export default UserCard