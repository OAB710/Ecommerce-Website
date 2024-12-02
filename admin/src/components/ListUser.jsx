import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ListUser = () => {
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/allusers');
      const data = await response.json();
      setAllUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const removeUser = async (id) => {
    try {
      const response = await fetch('http://localhost:4000/removeuser', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers(); // Refresh the user list after removal
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const editUser = (id) => {
    navigate(`/edituser/${id}`);
  };

  return (
    <div className="p-2 box-border bg-white mb-6 rounded-sm w-full mt-4 sm:p-4 sm:m-7">
      <div className="flex justify-between items-center p-5">
        <h4 className="bold-22 uppercase">Users List</h4>
      </div>

      <div className="max-h-[77vh] overflow-auto px-4 text-center">
        <table className="w-full mx-auto">
          <thead>
            <tr className="bg-primary bold-14 sm:regular-22 text-start py-12">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Address</th>
              <th className="p-2">Role</th>
              <th className="p-2">Banned</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user, i) => (
              <tr key={i} className="border-b border-slate-900/20 text-gray-20 p-6 medium-14" style={{ height: '3em' }}>
                <td className="py-4">{user.name}</td>
                <td className="py-4">{user.email}</td>
                <td className="py-4">{user.phone}</td>
                <td className="py-4">{user.address.join(', ')}</td>
                <td className="py-4">{user.role}</td>
                <td className={`py-4 ${user.isBanned ? 'text-red-500' : 'text-green-500'}`}>
                  {user.isBanned ? "Yes" : "No"}
                </td>
                <td className="py-4">
                  <button
                    onClick={() => editUser(user._id)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeUser(user._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListUser;