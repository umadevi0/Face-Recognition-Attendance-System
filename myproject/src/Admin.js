import React, { Fragment, useState } from 'react';
import styled from 'styled-components'
import AttendanceList from './components/AttendanceList/AttendanceList';
import AbsenteesList from './components/AbsenteesList/AbsenteesList';
import AttendanceByName from './components/AttendanceByName/AttendanceByName';
function Main() {
  const [showButtons, setShowButtons] = useState(true);
  const [showAttendanceList, setShowAttendanceList]= useState(false);
  const [showAbsenteesList, setShowAbsenteesList]= useState(false);
  const [showAttendanceByName, setShowAttendanceByName]= useState(false);

  const MainContainer = styled.main`
    display: flex;
    flex-wrap: wrap;
    background-color:
    justify-content: center;
    margin-top:300px;
    margin-bottom:400px;
  `;
  const AttendanceListButton = styled.button`
  font-size: 20px;
  padding: 10px 20px;
  margin-right: 15px;
  margin-left:150px;
  cursor: pointer;
  justify-content: center;
  text-align: center;
  background-color:white;
  color: black;
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
  background-color:white;
  color: black;
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
  
  const handleAttendanceListClick = () => {
    setShowButtons(false);
    setShowAttendanceList(true);
  };
  const handleAbsenteesListClick = () => {
    setShowButtons(false);
    setShowAttendanceList(false);
    setShowAbsenteesList(true);
  };
  const handleAttendanceByNameClick = () => {
    setShowButtons(false);
    setShowAttendanceList(false);
    setShowAttendanceByName(true);
    setShowAbsenteesList(false);
  };

  return (
    <Fragment>
      <MainContainer>
        {showAttendanceList && <AttendanceList />}
        {showAttendanceByName && <AttendanceByName />}
        {showAbsenteesList && <AbsenteesList/> }
        {showButtons && (
        <div className="buttons-container">
          <AttendanceListButton onClick={handleAttendanceListClick}>AttendanceList</AttendanceListButton>
          <AttendanceByNameButton onClick={handleAttendanceByNameClick}>AttendanceByName</AttendanceByNameButton>
          <AbsenteesListButton onClick={handleAbsenteesListClick}>AbsenteesList</AbsenteesListButton>
        </div>
      )}
      </MainContainer>
    </Fragment>
  );
}

export default Main;
