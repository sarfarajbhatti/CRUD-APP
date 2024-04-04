import React, { useState, useMemo } from "react";
import { Button, Col, Table, Container } from "react-bootstrap";
import moment from "moment";
import {
  FaEdit,
  FaTrashAlt,
  FaChevronLeft,
  FaChevronRight,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";

const formatNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const calculateAge = (dob) => {
  const today = moment();
  const birthDate = moment(dob, "YYYY-MM-DD");
  return today.diff(birthDate, "years");
};

const EmployeeList = ({
  data,
  handleEdit,
  handleDelete,
  handleAddEmployee,
  handleLogout,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const entriesPerPage = 10;

  const sortedData = useMemo(() => {
    if (!sortBy) {
      return data;
    }

    return data.slice().sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });
  }, [data, sortBy, sortOrder]);

  const filteredData = useMemo(() => {
    return sortedData.filter((item) => {
      return (
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phoneNumber.includes(searchQuery) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.salary.toString().includes(searchQuery) ||
        item.age.toString().includes(searchQuery)
      );
    });
  }, [sortedData, searchQuery]);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / entriesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Container>
      <h2 className="text-center mt-4 title">Employee List</h2>
      <div className="row mt-4">
        <div className="col-lg-6 col-md-12">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="form-control"
            style={{ width: "400px" }}
          />
        </div>
        <div className="col-lg-6 col-md-12 text-lg-end">
          <Button variant="outline-dark" onClick={handleAddEmployee}>
            <FaUserPlus className="me-2 mb-1" />
            Add Employee
          </Button>
          <Button
            className="ms-3"
            variant="outline-danger"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-2 mb-1" />
            Logout
          </Button>
        </div>
      </div>
      <Col className=" mx-auto" lg={12}>
        <div className="table-responsive">
          <Table className="mt-4 table-light" striped bordered hover>
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("index")}
                  style={{ cursor: "pointer" }}
                >
                  No
                </th>
                <th
                  onClick={() => handleSort("name")}
                  style={{ cursor: "pointer" }}
                >
                  Name
                </th>
                <th
                  onClick={() => handleSort("phoneNumber")}
                  style={{ cursor: "pointer" }}
                >
                  Number
                </th>
                <th
                  onClick={() => handleSort("email")}
                  style={{ cursor: "pointer" }}
                >
                  Email
                </th>
                <th
                  onClick={() => handleSort("salary")}
                  style={{ cursor: "pointer" }}
                >
                  Salary
                </th>
                <th
                  onClick={() => handleSort("age")}
                  style={{ cursor: "pointer" }}
                >
                  Age
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.map((item, index) => (
                <tr key={index}>
                  <td>{indexOfFirstEntry + index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.phoneNumber}</td>
                  <td>{item.email}</td>
                  <td>{formatNumberWithCommas(item.salary)}</td>
                  <td>{calculateAge(item.age)}</td>
                  <td className="d-flex flex-row justify-content-around">
                    <FaEdit
                      className="icon text-warning"
                      onClick={() => handleEdit(indexOfFirstEntry + index)}
                    />
                    <FaTrashAlt
                      className="icon text-danger"
                      onClick={() => handleDelete(index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="pagination justify-content-end">
          <Button
            onClick={prevPage}
            disabled={currentPage === 1}
            variant="outline-secondary"
          >
            <FaChevronLeft />
          </Button>
          {[
            ...Array(Math.ceil(filteredData.length / entriesPerPage)).keys(),
          ].map((pageNumber) => (
            <Button
              key={pageNumber}
              onClick={() => paginate(pageNumber + 1)}
              variant="outline-secondary"
              className={`${currentPage === pageNumber + 1 ? "active" : ""}`}
            >
              {pageNumber + 1}
            </Button>
          ))}
          <Button
            onClick={nextPage}
            disabled={
              currentPage === Math.ceil(filteredData.length / entriesPerPage)
            }
            variant="outline-secondary"
          >
            <FaChevronRight />
          </Button>
        </div>
      </Col>
    </Container>
  );
};

export default EmployeeList;
