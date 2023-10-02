import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer} from 'recharts';
import './AttendanceList.css';
const AttendanceList = () => {
  const [date, setDate] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0); // State for total employees

  useEffect(() => {
    const presentCount = uniqueStudentsCount;
    const absentCount = totalEmployees-uniqueStudentsCount;

    const data = [
      { name: 'Present', value: presentCount },
      { name: 'Absent', value: absentCount },
    ];

    setChartData(data);
    fetchTotalEmployees();
  }, [attendanceData]);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };
  
  const fetchTotalEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5001/total_employees'); // Adjust URL as needed
      if (response.ok) {
        const data = await response.json();
        setTotalEmployees(data.total_employees);
      } else {
        console.error('Failed to fetch total employees');
      }
    } catch (error) {
      console.error('Error while fetching total employees:', error);
    }
  };
  const handleFetchAttendance = async () => {
    try {
      setError(''); // Clear any previous error
      const response = await fetch(`http://localhost:5001/attendance/${date}`);

      if (response.ok) {
        const data = await response.json(); // Try parsing the response as JSON
        setAttendanceData(data);
      } else {
        console.error('Failed to fetch attendance data');
      }
    } catch (error) {
      console.error('Error while fetching attendance data:', error);
    }
  };

  const uniqueStudentsCount = new Set(attendanceData.map((employee) => employee.name)).size;
  const calculatePercentage = (value, total) => ((value / total) * 100).toFixed(2);
  return (
    <div id="totalcontent">
      <h2 id="date"> Daily Attendance List </h2>
      <div id="list">
        <label htmlFor="dateInput">Enter Date: </label>
        <input
          type="date" // Use type="date" for date picker
          id="dateInput"
          value={date}
          onChange={handleDateChange}
        />
        <button id="fetch" onClick={handleFetchAttendance}>
          Fetch Attendance
        </button>
      </div>
      <div className="horizontal-container">
        <div className="attendance-list">
          {error && <p>{error}</p>}
          <h4>Attendance Data for {date}</h4>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Entry Time</th>
                <th>Exit Time</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((employee, index) => (
                <tr key={index}>
                  <td>{employee.name}</td>
                  <td>{employee.entry_time || 'N/A'}</td>
                  <td>{employee.exit_time || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overview">
          <div className="chart-container">
            <h4 id="texthorizon">Attendance Overview for {date}</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="40%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  labelLine={false}
                >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name === 'Present' ? '#8884d8' : '#82ca9d'} // Use matching colors
                  />
                ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-labels">
              <div className="chart-label present">
                <span>Present-</span>
                <span>{calculatePercentage(uniqueStudentsCount, totalEmployees)}%</span>
              </div>
              <div className="chart-label absent">
                <span>Absent-</span>
                <span>{calculatePercentage(totalEmployees - uniqueStudentsCount, totalEmployees)}%</span>
              </div>
              <p className="texti1">Total Students Present: {uniqueStudentsCount}</p>
              <p className="texti2">Total Number of Employees: {totalEmployees}</p>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default AttendanceList;
