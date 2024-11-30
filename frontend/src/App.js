import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [inputValue, setInputValue] = useState('');
  const [users, setUsers] = useState([]);
  const [time, setTime] = useState('');
  const [status, setStatus] = useState('');

  // Fetch users from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users`); // GET request to fetch users
        setUsers(response.data); // Update the users state
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, []);

  // Handle Send button click
  const handleSend = async () => {
    const user = users.find((user) => user.number === inputValue); // Find user by number

    if (user) {
      const currentTime = new Date().toLocaleString(); // Get current time

      try {
        // Send PUT request to update inTime and status
        const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/update-intime`, {
          number: inputValue, // Send the user's number to the backend
        });

        const updatedUser = response.data.updatedUser; // Get updated user from response

        // Update the UI with the new inTime and status
        setTime(updatedUser.inTime); // Display the updated inTime
        setStatus(updatedUser.status); // Display the updated status (Present)

        // Update the local users array to reflect the change in the table
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.number === updatedUser.number ? updatedUser : u
          )
        );
      } catch (error) {
        console.error('Error updating inTime:', error);
        setTime('');
        setStatus('Error updating user');
      }
    } else {
      setTime('');
      setStatus('No user found');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      {/* Input Field and Send Button */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter number"
          style={{
            padding: '10px',
            width: 'calc(100% - 100px)',
            marginRight: '10px',
            fontSize: '16px',
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>

      {/* Display Time and Status if number is found */}
      {time && (
        <div style={{ marginBottom: '20px' }}>
          <p><strong>Time:</strong> {time}</p>
          <p><strong>Status:</strong> {status}</p>
        </div>
      )}

      {/* Dashboard Table */}
      <div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>In-time</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.inTime}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
