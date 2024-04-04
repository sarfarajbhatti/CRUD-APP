import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import EmployeeList from "./components/EmployeeList";
import EmployeeForm from "./components/EmployeeForm";
import Login from "./components/Login";

const App = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    salary: "",
    phoneNumber: "",
    age: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  ); // Initialize isLoggedIn from localStorage
  const [loginFormData, setLoginFormData] = useState({
    username: "",
    password: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [isLoggedInError, setIsLoggedInError] = useState(false);
  const [isAddingData, setIsAddingData] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/db.json");
        const json = await response.json();
        setData(json.employees);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    Swal.fire({
      title: "Logging In...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(() => {
      if (
        loginFormData.username.trim() === "" ||
        loginFormData.password.trim() === ""
      ) {
        setIsLoggedInError(true);
        setIsLoggingIn(false);
        Swal.fire({
          title: "Login Failed",
          text: "Please enter username and password",
          icon: "error",
          customClass: {
            popup: "red-bg",
          },
          showConfirmButton: false,
          timer: 2000,
        });
      } else if (
        loginFormData.username !== "admin" &&
        loginFormData.password !== "admin"
      ) {
        setIsLoggedInError(true);
        setIsLoggingIn(false);
        Swal.fire({
          title: "Login Failed",
          text: "Incorrect username and password",
          icon: "error",
          customClass: {
            popup: "red-bg",
          },
          showConfirmButton: false,
          timer: 2000,
        });
      } else if (loginFormData.username !== "admin") {
        setIsLoggedInError(true);
        setIsLoggingIn(false);
        Swal.fire({
          title: "Login Failed",
          text: "Incorrect username",
          icon: "error",
          customClass: {
            popup: "red-bg",
          },
          showConfirmButton: false,
          timer: 2000,
        });
      } else if (loginFormData.password !== "admin") {
        setIsLoggedInError(true);
        setIsLoggingIn(false);
        Swal.fire({
          title: "Login Failed",
          text: "Incorrect password",
          icon: "error",
          customClass: {
            popup: "red-bg",
          },
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        setIsLoggedIn(true);
        setIsLoggedInError(false);
        setIsLoggingIn(false);
        Swal.fire({
          title: "Login Successful",
          text: "Welcome, admin!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
        localStorage.setItem("isLoggedIn", "true");
      }
    }, 2000);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(data[index]);
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone Number is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    }
    if (!formData.salary) {
      formData.salary = "";
    }
    formData.salary = formData.salary.toString().trim();

    if (!formData.age.trim()) {
      errors.age = "Age is required";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsAddingData(true);

    setTimeout(() => {
      const newData = [...data];
      if (editIndex !== null) {
        newData[editIndex] = { ...formData };
        setEditIndex(null);
      } else {
        const id = data.length > 0 ? data[data.length - 1].id + 1 : 1;
        newData.push({ ...formData, id });
      }

      setData(newData);
      setFormData({
        id: "",
        name: "",
        salary: "",
        phoneNumber: "",
        age: "",
        email: "",
      });
      saveDataToLocalStorage(newData);

      setIsAddingData(false);
      setShowForm(false);

      const title =
        editIndex !== null
          ? "Data updated successfully!"
          : "Data added successfully!";
      Swal.fire({
        title,
        customClass: {
          popup: "green-bg",
        },
        position: "top",
        showConfirmButton: false,
        timer: 2000,
      });
    }, 800);
  };

  const saveDataToLocalStorage = (data) => {
    localStorage.setItem("data", JSON.stringify(data));
  };

  useEffect(() => {
    const savedData = localStorage.getItem("data");
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []); 
  

  const handleDelete = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "It will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
        saveDataToLocalStorage(newData);
        Swal.fire("Deleted!", "Your data has been deleted.", "success");
      }
    });
  };

  const handleAddEmployee = () => {
    setFormData({ email: "", name: "", salary: "", phoneNumber: "", age: "" });
    setShowForm(true);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoggedIn(false);
        setShowForm(false);
        setLoginFormData({ username: "", password: "" });
        localStorage.removeItem("isLoggedIn");
        Swal.fire("Logged Out", "You have been logged out.", "success");
      }
    });
  };

  useEffect(() => {
    const savedData = localStorage.getItem("data");
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  const handleLogin = () => {};
  const handleSubmit = (e) => {};

  return (
    <div className="app-container">
      {!isLoggedIn ? (
        <Login
          onLogin={handleLogin}
          onSubmit={handleSubmit}
          loginFormData={loginFormData}
          isLoggedInError={isLoggedInError}
          isLoggingIn={isLoggingIn}
          handleLoginSubmit={handleLoginSubmit}
          setLoginFormData={setLoginFormData}
        />
      ) : (
        <>
          {showForm ? (
            <EmployeeForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
              validationErrors={validationErrors}
              isAddingData={isAddingData}
            />
          ) : (
            <EmployeeList
              data={data}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              currentEntries={data}
              handleAddEmployee={handleAddEmployee}
              handleLogout={handleLogout}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
