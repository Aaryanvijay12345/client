import React from 'react';
import Lottie from 'react-lottie';
import signUpAnimData from '../assets/jsonFiles/signUpAnim.json';

const signUpAnim = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: signUpAnimData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div>
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
};

export default signUpAnim;
