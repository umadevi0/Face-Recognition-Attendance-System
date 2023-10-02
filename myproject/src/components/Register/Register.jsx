import React, { useState } from 'react';
import axios from 'axios';
import { Camera } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import  './Register.css';
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [images, setImages] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [captureOption, setCaptureOption] = useState('manual');
  const webcamRef = React.useRef(null); // Webcam reference

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  
  const handleCapture = (dataUri) => {
    // Check if dataUri is valid
    if (!dataUri || typeof dataUri !== 'string' || !dataUri.startsWith('data:image/')) {
      console.error('Invalid dataUri:', dataUri);
      return;
    }

    setCapturedImage(dataUri);

    try {
      const blob = dataURLtoBlob(dataUri);
      if (blob) {
        const imageFile = new File([blob], 'realtime_capture.jpeg', { type: 'image/jpeg' });
        setImages([imageFile]);
      } else {
        console.error('Invalid image format.');
      }
    } catch (error) {
      console.error('Error converting image:', error);
    }
  };

  const dataURLtoBlob = (dataURL) => {
    console.log('dataURL:', dataURL);
  
    // Check if dataURL is valid
    if (typeof dataURL !== 'string' || !dataURL.startsWith('data:image/')) {
      console.error('Invalid dataURL:', dataURL);
      return null;
    }
  
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const uInt8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  };
    

  const handleCaptureOptionChange = (option) => {
    setCaptureOption(option);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!name || !email || !phoneNumber || !department) {
      alert('Please fill in all the fields.');
      return;
    }

    if ((captureOption === 'manual' && images.length === 0) || (captureOption === 'realtime' && !capturedImage)) {
      alert('Please provide an image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('department', department);

    if (images.length > 0) {
      formData.append('image', images[0]); // Append the first image
    }

    try {
      await axios.post('http://localhost:5001/add_employee', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Image uploaded successfully!');
      setName('');
      setEmail('');
      setPhoneNumber('');
      setDepartment('');
      setImages([]);
      setCaptureOption('manual'); // Reset capture option to manual after successful upload

      // Redirect to home page after successful upload
      window.location.href = '/home';
    } catch (error) {
      console.error(error);
      alert('Error uploading image. Please try again.');
    }
  };

  return (
    <div id="totalcontent1">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={handleNameChange} />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={handleEmailChange} />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input type="tel" id="phoneNumber" value={phoneNumber} onChange={handlePhoneNumberChange} />
        </div>
        <div>
          <label htmlFor="department">Department:</label>
          <input type="text" id="department" value={department} onChange={handleDepartmentChange} />
        </div>
        <div>
          <label>Choose Image Capture Option:</label>
          <div>
            <input
              type="checkbox"
              id="manual"
              value="manual"
              checked={captureOption === 'manual'}
              onChange={() => handleCaptureOptionChange('manual')}
            />
            <label htmlFor="manual">Manual Upload</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="realtime"
              value="realtime"
              checked={captureOption === 'realtime'}
              onChange={() => handleCaptureOptionChange('realtime')}
            />
            <label htmlFor="realtime">Real-time Capture</label>
          </div>
        </div>
        {captureOption === 'manual' ? (
          <div>
            <label htmlFor="images">Images:</label>
            <input type="file" id="images" onChange={handleImageChange} />
          </div>
        ) : (
          <div>
            <Camera
              onTakePhoto={(dataUri) => handleCapture(dataUri)} // Pass dataUri to handleCapture
              isFullscreen={false}
              isImageMirror={false}
              idealFacingMode="environment"
              imageType="jpeg"
              imageCompression={0.97}
              isMaxResolution={false}
              sizeFactor={1}
              style={{ width: '100%', height: 'auto' }}
            />
            {capturedImage && <img src={capturedImage} alt="Real-time Capture" />}
          </div>
        )}
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default Register;
