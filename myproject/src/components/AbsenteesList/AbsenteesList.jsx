import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AbsenteesList.css';
const AbsenteesList = () => {
  const [absentees, setAbsentees] = useState([]);
  const [date, setDate] = useState('2023-07-28'); // Default date, replace with desired date in 'YYYY-MM-DD' format
  const handleBackClick = () => {
    window.location.reload(); // Reload the page to show the buttons again
  };
  useEffect(() => {
    fetchAbsentees();
  }, [date]);

  const fetchAbsentees = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/absentees/${date}`);
      console.log(response.data);
      setAbsentees(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };
  const uniqueStudentsCount = new Set(absentees.map((employee) => employee.name)).size;
  return (
    <div id="totalcontent">
      <h1>Absentees List</h1>
      <div>
        <label htmlFor="date">Select Date:</label>
        <input type="date" id="datevalue" value={date} onChange={handleDateChange} />
        <p className='texti'>Total Students absent: {uniqueStudentsCount}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {absentees.map((absentee) => (
            <tr key={absentee.name}>
              <td>{absentee.name}</td>
              <td>{absentee.email}</td>
              <td>{absentee.phonenumber}</td>
              <td>{absentee.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AbsenteesList;
