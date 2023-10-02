import React, { Fragment, useState } from 'react';
import './App.css'
import VideoFeed from './components/Videofeed/Videofeed'
import Register from './components/Register/Register'
import styled from 'styled-components'
import AttendanceList from './components/AttendanceList/AttendanceList';
import AbsenteesList from './components/AbsenteesList/AbsenteesList';
import AttendanceByName from './components/AttendanceByName/AttendanceByName';
function Main() {
  const [showAttendance, setShowAttendance] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [showAttendanceList, setShowAttendanceList]= useState(false);
  const [showAbsenteesList, setShowAbsenteesList]= useState(false);
  const [showAttendanceByName, setShowAttendanceByName]= useState(false);
  const TitleOne = styled.h1`
    margin-top: 30px;
    font-size: 50px;
    line-height: 1;
    font-weight: bold;
    color: #013087;
    text-align: center;
  `;

  const MainContainer = styled.main`
    display: flex;
    flex-wrap: wrap;
    background-color:
    justify-content: center;
  `;
  const AttendanceButton = styled.button`
  font-size: 20px;
  padding: 10px 20px;
  margin-right: 15px;
  cursor: pointer;
  justify-content: center;
  text-align: center;
  background-color:#0a0a23;
  color: #fff;
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
  background-color:#0a0a23;
  color: #fff;
  border:none;
  border-radius:15px;
  box-shadow: 0px 0px 2px 2px rgb(0,0,0);
  `;
  const AttendanceListButton = styled.button`
  font-size: 20px;
  padding: 10px 20px;
  margin-right: 15px;
  cursor: pointer;
  justify-content: center;
  text-align: center;
  background-color:#0a0a23;
  color: #fff;
  border:none;
  border-radius:15px;
  box-shadow: 0px 0px 2px 2px rgb(0,0,0);
  `;
  const AbsenteesListButton = styled.button`
  font-size: 20px;
  padding: 10px 20px;
  margin-right: 15px;
  cursor: pointer;
  justify-content: center;
  text-align: center;
  background-color:#0a0a23;
  color: #fff;
  border:none;
  border-radius:15px;
  box-shadow: 0px 0px 2px 2px rgb(0,0,0);
  `;
  const AttendanceByNameButton = styled.button`
  font-size: 20px;
  padding: 10px 20px;
  margin-right: 15px;
  cursor: pointer;
  justify-content: center;
  text-align: center;
  background-color:#0a0a23;
  color: #fff;
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

  const handleAttendanceListClick = () => {
    setShowAttendance(false);
    setShowRegister(false);
    setShowButtons(false);
    setShowAttendanceList(true);
  };
  const handleAbsenteesListClick = () => {
    setShowAttendance(false);
    setShowRegister(false);
    setShowButtons(false);
    setShowAttendanceList(false);
    setShowAbsenteesList(true);
  };
  const handleAttendanceByNameClick = () => {
    setShowAttendance(false);
    setShowRegister(false);
    setShowButtons(false);
    setShowAttendanceList(false);
    setShowAttendanceByName(true);
    setShowAbsenteesList(false);
  };

  return (
    <Fragment>
      <TitleOne>Face Recognition</TitleOne>
      <MainContainer>
        {showAttendance && <VideoFeed />}
        {showRegister && <Register />}
        {showAttendanceList && <AttendanceList />}
        {showAttendanceByName && <AttendanceByName />}
        {showAbsenteesList && <AbsenteesList/> }
      </MainContainer>
      {showButtons && (
        <div className="buttons-container">
          <AttendanceButton onClick={handleAttendanceClick}>Attendance</AttendanceButton>
          <RegisterButton onClick={handleRegisterClick}>Register</RegisterButton>
          <AttendanceListButton onClick={handleAttendanceListClick}>AttendanceList</AttendanceListButton>
          <AttendanceByNameButton onClick={handleAttendanceByNameClick}>AttendanceByName</AttendanceByNameButton>
          <AbsenteesListButton onClick={handleAbsenteesListClick}>AbsenteesList</AbsenteesListButton>
        </div>
      )}
    </Fragment>
  );
}

export default Main;
