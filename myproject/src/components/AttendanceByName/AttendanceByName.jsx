import React, { useState } from 'react';
import './AttendanceByName.css'
const AttendanceByName = () => {
  const [name, setName] = useState('');
  const [attendanceData1, setAttendanceData1] = useState([]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleBackClick = () => {
    window.location.reload(); // Reload the page to show the buttons again
  };
  const handleFetchAttendance = async () => {
    try {
      const response = await fetch(`http://localhost:5001/attendancebyname/${name}`);
      console.log('Response:', response); // Check the response object
      if (response.ok) {
        const data = await response.json();
        setAttendanceData1(data);
      } else {
        console.error('Failed to fetch attendance data');
      }
    } catch (error) {
      console.error('Error while fetching attendance data:', error);
    }
  };

  return (
    <div id="totalcontent">
      <h2>Attendance List for a Name</h2>
      <div>
        <label htmlFor="nameInput">Enter Name:</label>
        <input
          type="text"
          id="nameInput"
          value={name}
          onChange={handleNameChange}
        />
        <button  id="fetch"onClick={handleFetchAttendance}>Fetch Attendance</button>
      </div>
      <div>
        <h3>Attendance Data for {name}</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData1.map((attendance, index) => (
              <tr key={index}>
                <td>{attendance.date}</td>
                <td>{attendance.entry_time || 'N/A'}</td>
                <td>{attendance.exit_time || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceByName;
