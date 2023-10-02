import React, { Fragment, useState } from 'react';
import './App.css';
import styled from 'styled-components'
import AdminLoginForm from './login';
import Employee from './Employee';
import img from './image3.jpg';
function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showEmployee, setShowEmployee] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  const MainContainer = styled.main`
    display: flex;
    flex-wrap: wrap;
    background-image: url(${img});
    justify-content: center;
    height: 1000px;
    p{
      color:white;
      margin-top:350px;
    }
  `;
  const ContentContainer = styled.div`
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.3);
    text-align: center;
    color:White;
  `;

  const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  `;
  const AdminButton = styled.button`
  font-size: 20px;
  padding: 10px 20px;
  margin-right: 20px;
  margin-bottom: 500px;
  cursor: pointer;
  justify-content: center;
  text-align: center;
  background-color:white;
  color: black;
  border:none;
  border-radius:15px;
  box-shadow: 0px 0px 2px 2px rgb(0,0,0);
  `;
  const EmployeeButton = styled.button`
  font-size: 20px;
  padding: 10px 20px;
  margin-right: 40px;
  cursor: pointer;
  justify-content: center;
  text-align: center;
  background-color:white;
  color: black;
  border:none;
  border-radius:15px;
  box-shadow: 0px 0px 2px 2px rgb(0,0,0);
  `;
  const handleAdminClick = () => {
    setShowAdmin(true);
    setShowEmployee(false);
    setShowButtons(false);
  };

  const handleEmployeeClick = () => {
    setShowAdmin(false);
    setShowEmployee(true);
    setShowButtons(false);
  };

  return (
    <Fragment>
      <MainContainer>
        {showAdmin && <AdminLoginForm />}
        {showEmployee && <Employee />}
        {showButtons && (
        <ContentContainer>
          <h2>Welcome to Our Face Recognition Attendance System</h2>
          <p>
            Are you ready to revolutionize attendance tracking? We certainly are! Here, we're introducing an
            innovative Face Recognition Attendance System that streamlines the attendance recording process like never
            before. Say goodbye to tedious manual attendance tracking and embrace the future of workforce management.
          </p>
          <AdminButton onClick={handleAdminClick}>Admin</AdminButton>
          <EmployeeButton onClick={handleEmployeeClick}>Employee</EmployeeButton>
        </ContentContainer>
      )}
      </MainContainer>
    </Fragment>
  );
}

export default App;
