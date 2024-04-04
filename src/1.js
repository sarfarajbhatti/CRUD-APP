import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Form, Col, Row } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faArrowLeft, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({ email: '', name: '', salary: '', phoneNumber: '', age: '' });
  const [calculatedAge, setCalculatedAge] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginFormData, setLoginFormData] = useState({ username: '', password: '' });
  const [showForm, setShowForm] = useState(false);
  const [isLoggedInError, setIsLoggedInError] = useState(false);
  const [isAddingData, setIsAddingData] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [notificationMessage, setNotificationMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  useEffect(() => {
    const savedData = localStorage.getItem('data');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    const birthDate = new Date(formData.age);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      setCalculatedAge(age - 1);
    } else {
      setCalculatedAge(age);
    }
  }, [formData.age]);

  const saveDataToLocalStorage = (data) => {
    localStorage.setItem('data', JSON.stringify(data));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    setTimeout(() => {
      if (loginFormData.username === 'admin' && loginFormData.password === 'admin') {
        setIsLoggedIn(true);
        setIsLoggedInError(false);
      } else {
        setIsLoggedInError(true);
      }
      setIsLoggingIn(false);
    }, 800);
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
      errors.name = 'Name is required';
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone Number is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    }
    if (!formData.salary.trim()) {
      errors.salary = 'Salary is required';
    }
    if (!formData.age.trim()) {
      errors.age = 'Age is required';
    }
  
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
  
    setIsAddingData(true);
  
    const birthDate = new Date(formData.age);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      setCalculatedAge(age - 1);
    } else {
      setCalculatedAge(age);
    }
  
    setTimeout(() => {
      const newData = [...data];
      if (editIndex !== null) {
        newData[editIndex] = formData;
        setEditIndex(null);
        setNotificationMessage('Data updated successfully!');
      } else {
        const newFormData = { ...formData, calculatedAge };
        newData.push(newFormData);
        setNotificationMessage('Data added successfully!');
      }
      setData(newData);
      setFormData({ email: '', name: '', salary: '', phoneNumber: '', age: '' });
      saveDataToLocalStorage(newData);
  
      setIsAddingData(false);
      setShowForm(false);
    }, 2000);
  
    setTimeout(() => {
      setNotificationMessage('');
    }, 3000);
  };
  

  const handleDelete = (index) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'It will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
        saveDataToLocalStorage(newData);
        Swal.fire('Deleted!', 'Your data has been deleted.', 'success');
      }
    });
  };

  const handleAddEmployee = () => {
    setFormData({ email: '', name: '', salary: '', phoneNumber: '', age: '' });
    setShowForm(true);
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout'
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoggedIn(false);
        setShowForm(false);
        setLoginFormData({ username: '', password: '' });
        Swal.fire('Logged Out', 'You have been logged out.', 'success');
      }
    });
  };

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = sortedData.slice(indexOfFirstEntry, indexOfLastEntry);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="app-container">
        {notificationMessage && (
        <div className="notification">
          {notificationMessage}
        </div>
      )}
      {!isLoggedIn ? (
        <Row>
          <div className="mx-auto col-lg-4 col-md-8 login-box">
            <div className="col-lg-12 login-title">LOG IN</div>
            <div className="col-lg-12 login-form">
              <div className="col-lg-12 login-form">
                <Form onSubmit={handleLoginSubmit}>
                  <div className="form-group">
                    <label className="form-control-label">USERNAME</label>
                    <input
                      type="text"
                      className="form-control"
                      value={loginFormData.username}
                      onChange={(e) => setLoginFormData({ ...loginFormData, username: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-control-label">PASSWORD</label>
                    <input
                      type="password"
                      className="form-control"
                      value={loginFormData.password}
                      onChange={(e) => setLoginFormData({ ...loginFormData, password: e.target.value })}
                    />
                    {isLoggedInError && <div className="text-danger">Invalid username or password</div>}
                  </div>
                  <div className="col-lg-12 login-btm login-button text-end">
                    <button type="submit" className="btn btn-outline-primary" disabled={isLoggingIn}>
                      {isLoggingIn ? 'Logging in...' : 'LOGIN'}
                    </button>
                  </div>
                </Form>
              </div>
            </div>
            <div className="col-lg-3 col-md-2"></div>
          </div>
        </Row>
      ) : (
        <>
          <h2 className='text-center mt-1'>Employee List</h2>
          <Row>
            <div className='px-5 my-3 d-flex justify-content-around'>
              <Button className='mt-3' variant="primary" onClick={handleAddEmployee}>
                Add Employee
              </Button>
              <Button className='mt-3 ml-3' variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
            {showForm && (
              <Col className='px-5 mx-auto' lg={8}>
                <div className="mb-3">
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2 icon" onClick={() => setShowForm(false)} />
                </div>
                <Form onSubmit={handleFormSubmit}>
                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      isInvalid={!!validationErrors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formPhoneNumber">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter phone number"
                      value={formData.phoneNumber}
                      onChange={(e) => {
                        const onlyNums = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                        setFormData({ ...formData, phoneNumber: onlyNums });
                      }}
                      isInvalid={!!validationErrors.phoneNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.phoneNumber}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      isInvalid={!!validationErrors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formSalary">
                    <Form.Label>Salary</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Salary"
                      value={formData.salary}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, ''); // Remove existing commas
                        const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
                        setFormData({ ...formData, salary: formattedValue });
                      }}
                      isInvalid={!!validationErrors.salary}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.salary}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formAge">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Enter Age"
                      value={formData.age}
                      onChange={(e) => {
                        const enteredDate = new Date(e.target.value);
                        const minDate = new Date();
                        minDate.setFullYear(minDate.getFullYear() - 18);
                        if (enteredDate > minDate) {
                          // Show an error message or prevent form submission
                          setFormData({ ...formData, age: '' }); // Clear the value
                          return;
                        }
                        setFormData({ ...formData, age: e.target.value });
                      }}
                      isInvalid={!!validationErrors.age}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.age}
                    </Form.Control.Feedback>
                    {formData.age && (
                      <Form.Text className="text-muted">
                        Must be 18 years or older.
                      </Form.Text>
                    )}
                  </Form.Group>

                  <div className='btn-group'>
                    <Button className='mt-3 loader-btn' variant="success" type="submit" disabled={isAddingData}>
                      {isAddingData ? 'Saving...' : (editIndex !== null ? 'Save' : 'Save')}
                    </Button>
                  </div>
                </Form>
              </Col>
            )}
            {!showForm && (
              <Col className='px-5 mx-auto' lg={12}>
                <Table className='mt-4' striped bordered hover>
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('no')}>
                        No{' '}
                        {sortConfig.key === 'no' && (
                          <FontAwesomeIcon icon={sortConfig.direction === 'ascending' ? faSortUp : faSortDown} />
                        )}
                      </th>
                      <th onClick={() => handleSort('name')}>
                        Name{' '}
                        {sortConfig.key === 'name' && (
                          <FontAwesomeIcon icon={sortConfig.direction === 'ascending' ? faSortUp : faSortDown} />
                        )}
                      </th>
                      <th onClick={() => handleSort('phoneNumber')}>
                        Number{' '}
                        {sortConfig.key === 'phoneNumber' && (
                          <FontAwesomeIcon icon={sortConfig.direction === 'ascending' ? faSortUp : faSortDown} />
                        )}
                      </th>
                      <th onClick={() => handleSort('email')}>
                        Email{' '}
                        {sortConfig.key === 'email' && (
                          <FontAwesomeIcon icon={sortConfig.direction === 'ascending' ? faSortUp : faSortDown} />
                        )}
                      </th>
                      <th onClick={() => handleSort('salary')}>
                        Salary{' '}
                        {sortConfig.key === 'salary' && (
                          <FontAwesomeIcon icon={sortConfig.direction === 'ascending' ? faSortUp : faSortDown} />
                        )}
                      </th>
                      <th onClick={() => handleSort('calculatedAge')}>
                        Age{' '}
                        {sortConfig.key === 'calculatedAge' && (
                          <FontAwesomeIcon icon={sortConfig.direction === 'ascending' ? faSortUp : faSortDown} />
                        )}
                      </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEntries.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.phoneNumber}</td>
                        <td>{item.email}</td>
                        <td>{item.salary}</td>
                        <td>{item.calculatedAge}</td>
                        <td className='d-flex flex-row justify-content-around'>
                          <FontAwesomeIcon className='icon text-info' icon={faEdit} onClick={() => handleEdit(index)} />
                          <FontAwesomeIcon className='icon text-danger' icon={faTrash} onClick={() => handleDelete(index)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="d-flex justify-content-end">
                  <ul className="pagination">
                    {Array.from({ length: Math.ceil(sortedData.length / entriesPerPage) }, (_, i) => (
                      <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            )}
          </Row>
        </>
      )}
    </div>
  );
};

export default App;
