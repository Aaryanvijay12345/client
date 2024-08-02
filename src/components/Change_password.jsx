import React, { useState } from 'react';
import '../styles/Change_password.css';

function Change_password() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setPasswordError('');

    
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password don't match.");
      return;
    }
   
    console.log('Form submitted successfully.');
  };

  return (
    <div>
      <div className='cp_main'>
        <img src='/image/BackgroundImage.png' alt='' />
        <div className='cp_box'>
          <img src='/image/cp.png' alt='' />
          <h2>Change Password</h2>
          <form className='cp_form' onSubmit={handleSubmit}>
            <div className='cp_form-group'>
              <label className='cp_label' htmlFor='oldPassword'>
                Old Password
              </label>
              <input
                type='password'
                id='oldPassword'
                name='oldPassword'
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            <div className='cp_form-group'>
              <label className='cp_label' htmlFor='newPassword'>
                New Password
              </label>
              <input
                type='password'
                id='newPassword'
                name='newPassword'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className='cp_form-group'>
              <label className='cp_label' htmlFor='confirmPassword'>
                Confirm New Password
              </label>
              <input
                type='password'
                id='confirmPassword'
                name='confirmPassword'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {passwordError && <p className="cp_errorMessage">{passwordError}</p>}

            <div className='cp_buttonWrapper'>
              <button type='submit' id='cp_submitButton' className='cp_submitButton pure-button pure-button-primary'>
                <span>Update Password</span>
                <span id='cp_loader'></span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Change_password;
