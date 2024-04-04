import React, { useState, useRef } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FaSave } from "react-icons/fa";
import moment from "moment";

const formatNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const EmployeeForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  validationErrors,
  isAddingData,
}) => {
  const [calculatedAge, setCalculatedAge] = useState("");
  const phoneNumberRef = useRef(null);
  const emailRef = useRef(null);
  const salaryRef = useRef(null);
  const ageRef = useRef(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    let formattedValue = value;

    if (id === "salary") {
      formattedValue = formattedValue.toString().replace(/,/g, "");
      formattedValue = Number(formattedValue).toLocaleString();
    } else if (id === "age") {
      const dob = moment(value);
      const today = moment();
      const age = today.diff(dob, "years");

      if (!dob.isValid() || age < 18) {
        return;
      }

      setCalculatedAge(age);
      formattedValue = dob.format("YYYY-MM-DD");
    }

    setFormData({ ...formData, [id]: formattedValue });
  };

  const formatSalary = (salary) => {
    return salary ? formatNumberWithCommas(salary) : "";
  };

  const handleKeyDown = (e, ref) => {
    if (e.key === "Enter") {
      e.preventDefault();
      ref.current.focus();
    }
  };

  return (
    <div className="main-container">
      <div className="form-container mx-auto">
        <Col className="" lg={12}>
          <div className="mb-2">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="mr-2 icon text-dark"
              onClick={() => onCancel()}
            />
          </div>
          <Form onSubmit={(e) => onSubmit(e)}>
            <Form.Group controlId="name">
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!validationErrors.name}
                onKeyDown={(e) => handleKeyDown(e, phoneNumberRef)}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="phoneNumber">
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                pattern="[0-9]*"
                isInvalid={!!validationErrors.phoneNumber}
                ref={phoneNumberRef}
                onKeyDown={(e) => handleKeyDown(e, emailRef)}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.phoneNumber}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!validationErrors.email}
                ref={emailRef}
                onKeyDown={(e) => handleKeyDown(e, salaryRef)}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="salary">
              <Form.Control
                type="text"
                placeholder="Enter Salary"
                value={formatSalary(formData.salary)}
                onChange={handleChange}
                isInvalid={!!validationErrors.salary}
                ref={salaryRef}
                onKeyDown={(e) => handleKeyDown(e, ageRef)}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.salary}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="age">
              <Form.Control
                type="date"
                placeholder="Enter Age"
                value={formData.age}
                onChange={handleChange}
                isInvalid={!!validationErrors.age}
                ref={ageRef}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.age}
              </Form.Control.Feedback>
              {formData.age && (
                <Form.Text className="text-danger">
                  Must be 18 years or older. Calculated age: {calculatedAge}
                </Form.Text>
              )}
            </Form.Group>
            <div className="btn-group">
              <Button
                className="loader-btn"
                variant="outline-info"
                type="submit"
                disabled={isAddingData}
              >
                {isAddingData ? "Saving..." : "Save"}
                <FaSave className="ms-2 " />
              </Button>
            </div>
          </Form>
        </Col>
      </div>
    </div>
  );
};

export default EmployeeForm;
