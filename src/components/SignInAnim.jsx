// import React from 'react';
import Lottie from 'react-lottie';
import signInAnimData from '../assets/jsonFiles/signInAnim3.json';

function SignInAnimation() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: signInAnimData,
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

export default SignInAnimation;







