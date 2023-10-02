import React, { Fragment, useState } from 'react';
import VideoFeed from './components/Videofeed/Videofeed'
import Register from './components/Register/Register'
import styled from 'styled-components'
function Employee() {
  const [showAttendance, setShowAttendance] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
 

  const MainContainer = styled.main`
    display: flex;
    flex-wrap: wrap;
    background-color:
    justify-content: center;
    margin-top:300px;
    margin-bottom:400px;
  `;
  const AttendanceButton = styled.button`
  font-size: 20px;
  padding: 10px 20px;
  margin-right: 15px;
  margin-left:100px;
  cursor: pointer;
  justify-content: center;
  text-align: center;
  background-color:white;
  color: black;
  border:none;
  border-radius:15px;
  box-shadow: 0px 0px 2px 2px rgb(0,0,0);
  `;

  const RegisterButton = styled.button`
  font-size: 20px;
  padding: 10px 20px;
  margin-right: 15px;
  cursor: pointer;
  justify-content: center;
  text-align: center;
  background-color:white;
  color: black;
  border:none;
  border-radius:15px;
  box-shadow: 0px 0px 2px 2px rgb(0,0,0);
  `;
  const BackButton = styled.button`
  font-size: 20px;
  padding: 10px 20px;
  margin-top: 10px;
  margin-right: 15px;
  margin-left: 1000px;
  cursor: pointer;
  justify-content: center;
  text-align: center;
  background-color:white;
  color: black;
  border:none;
  border-radius:15px;
  box-shadow: 0px 0px 2px 2px rgb(0,0,0);
  `;
  const handleAttendanceClick = () => {
    setShowAttendance(true);
    setShowRegister(false);
    setShowButtons(false);
  };

  const handleRegisterClick = () => {
    setShowAttendance(false);
    setShowRegister(true);
    setShowButtons(false);
  };

  
  const handleBackClick = () => {
    window.location.reload(); // Reload the page to show the buttons again
  };

  return (
    <Fragment>
      <header>
        <BackButton onClick={handleBackClick}>Back</BackButton>
      </header>
      <MainContainer>
        {showAttendance && <VideoFeed />}
        {showRegister && <Register />}
        
        {showButtons && (
        <div className="buttons-container">
          <p> This is Employees Page.Here employees attendance can be recorded with date and time .Also new employees can register themselves here </p>
          <AttendanceButton onClick={handleAttendanceClick}>Attendance</AttendanceButton>
          <RegisterButton onClick={handleRegisterClick}>Register</RegisterButton>
        </div>
        )}
      </MainContainer>
    </Fragment>
  );
}

export default Employee;
