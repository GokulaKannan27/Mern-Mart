import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserTable.css"; // Optional, for styling the table

const UserTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/use")
      .then((response) => {
        const processed = userData(response.data);
        console.log(processed);
        setUsers(processed);
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);
  
  const userData = (user) => {
    
    return user.map(({ email,createdAt}) => ({
      email,
      createdAt,
    }));
     
  };

  return (
    <div className="user-table-container">
      <h2>Registered Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Username / Name</th>
            <th>Email</th>
            <th>Registered On</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id || index}>
              <td  >{index + 1}</td>
              <td data-label="Name" >{user.username || user.name || "N/A"}</td>
              <td data-label="Email" >{user.email}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
