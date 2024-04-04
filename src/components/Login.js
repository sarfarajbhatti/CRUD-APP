import React, { useRef } from "react";
import { Form } from "react-bootstrap";
import { FaSignInAlt } from "react-icons/fa";

const Login = ({
  onLogin,
  onChange,
  onSubmit,
  loginFormData,
  isLoggedInError,
  isLoggingIn,
  handleLoginSubmit,
  setLoginFormData,
}) => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleKeyDown = (e, ref) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      const nextInput = form.elements[index + 1];
      if (nextInput) {
        nextInput.focus();
      } else {
        handleLoginSubmit(e);
      }
    }
  };

  return (
    <div className="main-login">
      <div className="mx-auto col-lg-4 col-md-8 login-box">
        <div className="col-lg-12 title">LOG IN</div>
        <div className="col-lg-12 login-form">
          <Form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-control-label">USERNAME</label>
              <input
                type="text"
                className="form-control"
                value={loginFormData.username}
                onChange={(e) =>
                  setLoginFormData({
                    ...loginFormData,
                    username: e.target.value,
                  })
                }
                onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                ref={usernameRef}
              />
            </div>
            <div className="form-group">
              <label className="form-control-label">PASSWORD</label>
              <input
                type="password"
                className="form-control"
                value={loginFormData.password}
                onChange={(e) =>
                  setLoginFormData({
                    ...loginFormData,
                    password: e.target.value,
                  })
                }
                onKeyDown={(e) => handleKeyDown(e, null)}
                ref={passwordRef}
              />
            </div>
            <div className="col-lg-12 login-btm login-button text-end">
              <button
                type="submit"
                className="btn btn-outline-info"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Logging in..." : "LOGIN"}
                <FaSignInAlt className="ms-1 mb-1" />
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
