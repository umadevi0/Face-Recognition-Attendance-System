import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import  image from './checkmark.jpg';
const VideoFeed = () => {
  const VideoFeedSection = styled.section`
    display: flex;
    flex-direction: column;
    margin: 10px 10px;
    padding: 10px;
    width: 48vw;
    h2 {
      margin-top: 0;
      font-size: 45px;
      line-height: 1;
      font-weight: normal;
      color: white;
      text-align: center;
    }
  `;

  const Popup = styled.div`
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(119, 119, 119, 0.8);
    backdrop-filter: saturate(180%) blur(10px);
    color:black;
    font-family: "Times New Roman", Times, serif;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 3px 3px 3px 3px grey;
    text-align: center;
    z-index: 9999;
    display: ${props => (props.visible ? 'block' : 'none')};
    p{
      margin-top:20px;
    }
    button {
      border-radius: 8px;
      width: 70px;
      height: 40px;
      text-align: center;
      font-family: "Times New Roman", Times, serif;
    }
    button:hover {
      background-color:black;
      transition: 0.7s;
      color:white;
    }
    
    button:active {
      background-color:black;
      color:white;
    }
    img {
      width: 90px; /* Adjust the size as needed */
      height: 90px; /* Adjust the size as needed */
    }
  `;

  const [cameraPaused, setCameraPaused] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState({});

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get('http://localhost:5001/check_recognition');
        const { name, hour, recognized, attendance_taken, recognition_running } = response.data;
        console.log('Recognition status:', response.data);

        if (recognized && attendance_taken && !popupVisible && recognition_running) {
          setPopupContent({ name, hour });
          setPopupVisible(true);
          setCameraPaused(true);

          // Play a sound when attendance is taken
          // Close the popup automatically after 5 seconds (5000 milliseconds)
          setTimeout(() => {
            setPopupVisible(false);
            setCameraPaused(false);
          }, 5000);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }, 8000); // Poll recognition status every 1 second

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [popupVisible]);

  const handleAcknowledge = () => {
    setPopupVisible(false);
    setCameraPaused(false);
  };
  const handleBackClick = () => {
    window.location.reload(); // Reload the page to show the buttons again
  };
  return (
    <VideoFeedSection className="some-space">
      {!popupVisible && <h2>Real Time Attendance</h2>}
      <Popup visible={popupVisible}>
        <img src={image} alt="Checkmark" />
        <p>{`Attendance taken for ${popupContent.name} at ${popupContent.hour}`}</p>
      </Popup>
      {!popupVisible && (
        <iframe
          allowFullScreen
          title="camera feed"
          src="http://127.0.0.1:5001/video_feed"
          width="100%"
          height="476"
          style={{ pointerEvents: cameraPaused ? 'none' : 'auto' }}
        />
      )}
    </VideoFeedSection>
    );
};

export default VideoFeed;
