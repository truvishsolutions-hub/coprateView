import React, { useEffect, useState } from "react";
import "./Login.css";

import logo from "../assets/images/TV-BG.png";

import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import {
  FiEye,
  FiEyeOff,
  FiShield,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";

// const API_URL = "https://truvish-backend-production.up.railway.app/api/corporate/login";

const API_URL = "http://api.truvish.com/api/corporate/login";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // =========================================================
  // LOAD REMEMBERED EMAIL
  // =========================================================

  useEffect(() => {
    const savedEmail =
      localStorage.getItem("rememberedEmail");

    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  // =========================================================
  // EMAIL VALIDATION
  // =========================================================

  const validateEmail = () => {
    if (!email.trim()) {
      return "Email is required";
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      return "Please enter a valid email";
    }

    return "";
  };

  // =========================================================
  // PASSWORD VALIDATION
  // =========================================================

  const validatePassword = () => {
    if (!password) {
      return "Password is required";
    }

    return "";
  };

  // =========================================================
  // EMAIL CHANGE
  // =========================================================

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    setEmailError("");
  };

  // =========================================================
  // PASSWORD CHANGE
  // =========================================================

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    setPasswordError("");
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = async () => {
    // Clear previous errors
    setEmailError("");
    setPasswordError("");

    // Validate
    const emailValidation = validateEmail();
    const passwordValidation = validatePassword();

    if (emailValidation || passwordValidation) {
      setEmailError(emailValidation);
      setPasswordError(passwordValidation);

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      // =====================================================
      // LOGIN FAILED
      // =====================================================

      if (!response.ok || !data.success) {
        /*
         * Both fields become red.
         *
         * No error message appears at the top.
         */

        const message =
          data.message ||
          "Incorrect email or password";

        setEmailError(message);
        setPasswordError(message);

        return;
      }

      // =====================================================
      // SAVE LOGIN DATA
      // =====================================================

      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      if (data.clientId) {
        localStorage.setItem(
          "clientId",
          data.clientId
        );
      }

      if (data.email) {
        localStorage.setItem(
          "email",
          data.email
        );
      }

      // =====================================================
      // REMEMBER EMAIL
      // =====================================================

      if (remember) {
        localStorage.setItem(
          "rememberedEmail",
          email.trim()
        );
      } else {
        localStorage.removeItem(
          "rememberedEmail"
        );
      }

      // =====================================================
      // SUCCESS STATE
      // =====================================================

      setLoginSuccess(true);

      /*
       * Green Sign In button stays visible briefly,
       * then dashboard opens.
       */

      setTimeout(() => {
        onLogin();
      }, 650);

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      /*
       * No top error message.
       * Keep errors below the fields.
       */

      setEmailError(
        "Unable to connect to server"
      );

      setPasswordError(
        "Please try again"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // ENTER KEY
  // =========================================================

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !loading &&
      !loginSuccess
    ) {
      handleLogin();
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="login-logo">
          <img
            src={logo}
            alt="Truvish"
          />
        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <h1>TRUVISH</h1>

        <p className="login-subtitle">
          Sign in to your Corporate Rewards Dashboard
        </p>

        {/* =================================================
            EMAIL
        ================================================= */}

        <div className="input-group">

          <label>Email</label>

          <div
            className={`input-box ${
              emailError
                ? "input-error"
                : ""
            }`}
          >

            <MdEmail
              className="input-icon"
            />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={
                handleEmailChange
              }
              onKeyDown={
                handleKeyDown
              }
              autoComplete="username"
              disabled={
                loading ||
                loginSuccess
              }
            />

          </div>

          {emailError && (
            <div className="field-error">
              <FiAlertCircle />

              <span>
                {emailError}
              </span>
            </div>
          )}

        </div>

        {/* =================================================
            PASSWORD
        ================================================= */}

        <div className="input-group">

          <label>Password</label>

          <div
            className={`input-box ${
              passwordError
                ? "input-error"
                : ""
            }`}
          >

            <RiLockPasswordLine
              className="input-icon"
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter your password"
              value={password}
              onChange={
                handlePasswordChange
              }
              onKeyDown={
                handleKeyDown
              }
              autoComplete="current-password"
              disabled={
                loading ||
                loginSuccess
              }
            />

            <button
              className="eye-btn"
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              disabled={
                loading ||
                loginSuccess
              }
            >

              {showPassword ? (
                <FiEyeOff />
              ) : (
                <FiEye />
              )}

            </button>

          </div>

          {passwordError && (
            <div className="field-error">
              <FiAlertCircle />

              <span>
                {passwordError}
              </span>
            </div>
          )}

        </div>

        {/* =================================================
            REMEMBER
        ================================================= */}

        <div className="remember-row">

          <label className="remember-checkbox">

            <input
              type="checkbox"
              checked={remember}
              onChange={() =>
                setRemember(
                  !remember
                )
              }
              disabled={
                loading ||
                loginSuccess
              }
            />

            <span>
              Remember me
            </span>

          </label>

        </div>

        {/* =================================================
            SIGN IN BUTTON
        ================================================= */}

        <button
          className={`login-btn ${
            loginSuccess
              ? "login-success"
              : ""
          }`}
          onClick={handleLogin}
          disabled={
            loading ||
            loginSuccess
          }
        >

          {loginSuccess ? (
            <>
              <FiCheck />

              <span>
                Signed In
              </span>
            </>
          ) : loading ? (
            <>
              <span className="login-spinner"></span>

              <span>
                Signing In...
              </span>
            </>
          ) : (
            "Sign In"
          )}

        </button>

        {/* =================================================
            SECURITY
        ================================================= */}

        <div className="security-box">

          <FiShield
            className="shield-icon"
          />

          <span>
            Your data is secure with
            enterprise-grade encryption
          </span>

        </div>

      </div>

    </div>
  );
};

export default Login;