import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Assuming you have some basic styling

const API_URL = 'http://localhost:3004/students'; // Replace with your backend URL

// Modal Component
const Modal = ({ show, student, handleClose, handleChange, handleUpdate, handleDelete }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>View Student</h3>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={student.name}
          onChange={handleChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={student.age}
          onChange={handleChange}
        />
        <input
          type="text"
          name="grade"
          placeholder="Grade"
          value={student.grade}
          onChange={handleChange}
        />
        <button onClick={handleUpdate}>Update Student</button>
        <button onClick={() => handleDelete(student.id)}>Delete Student</button>
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

const Crud = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', age: '', grade: '' });
  const [viewing, setViewing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({ id: null, name: '', age: '', grade: '' });

  // Fetch students from backend
  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        setStudents(response.data);
        console.log(response);
      })
      .catch(error => console.error('There was an error fetching the data!', error));
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  // Handle new student creation
  const handleCreateStudent = () => {
    axios.post(API_URL, newStudent)
      .then(response => {
        console.log(response);
        setStudents([...students, response.data]);
        setNewStudent({ name: '', age: '', grade: '' });
      })
      .catch(error => console.error('There was an error creating the student!', error));
  };

  // Handle view student
  const handleViewStudent = (student) => {
    setViewing(true);
    setCurrentStudent(student);
  };

  // Handle input change in modal
  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent({ ...currentStudent, [name]: value });
  };

  // Handle updating student data
  const handleUpdateStudent = () => {
    axios.put(`${API_URL}/${currentStudent.id}`, currentStudent)
      .then(response => {
        setStudents(students.map(student => 
          student.id === currentStudent.id ? response.data : student
        ));
        setViewing(false);
        setCurrentStudent({ id: null, name: '', age: '', grade: '' });
      })
      .catch(error => console.error('There was an error updating the student!', error));
  };

  // Handle deleting student
  const handleDeleteStudent = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        setStudents(students.filter(student => student.id !== id));
        setViewing(false);
        setCurrentStudent({ id: null, name: '', age: '', grade: '' });
      })
      .catch(error => console.error('There was an error deleting the student!', error));
  };

  return (
    <div className="App">
      <h2>Student Management</h2>

      <div>
        <h3>Add New Student</h3>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newStudent.name}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={newStudent.age}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="grade"
          placeholder="Grade"
          value={newStudent.grade}
          onChange={handleInputChange}
        />
        <button onClick={handleCreateStudent}>Add Student</button>
      </div>

      <h3>Student List</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.age}</td>
              <td>{student.grade}</td>
              <td>
                <button onClick={() => handleViewStudent(student)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        show={viewing}
        student={currentStudent}
        handleClose={() => setViewing(false)}
        handleChange={handleModalInputChange}
        handleUpdate={handleUpdateStudent}
        handleDelete={handleDeleteStudent}
      />
    </div>
  );
};

export default Crud;
