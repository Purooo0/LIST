import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from "react-router-dom";
import { Table, Button, Form, Modal } from 'react-bootstrap';
import "./HabitTrackerList.css";

const HabitTrackerList = () => {
    const { username } = useParams();
    const [userDetail, setUserDetail] = useState(null);
    const [habits, setHabits] = useState([]);
    const [show, setShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [newHabit, setNewHabit] = useState({
        name: '',
        date: '',
        days: {
            Mon: false,
            Tue: false,
            Wed: false,
            Thu: false,
            Fri: false,
            Sat: false,
            Sun: false,
        }
    });

    useEffect(() => {
        fetchHabits();
    }, []);

    const fetchHabits = async () => {
        try {
            const response = await axios.get('http://localhost:5000/tracks');
            setHabits(response.data.data);
        } catch (error) {
            console.error('Error fetching habits:', error);
        }
    };

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setIsEdit(false);
        setNewHabit({
            name: '',
            date: '',
            days: {
                Mon: false,
                Tue: false,
                Wed: false,
                Thu: false,
                Fri: false,
                Sat: false,
                Sun: false,
            }
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewHabit((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newHabit.name || !newHabit.date) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            if (isEdit) {
                await axios.put(`http://localhost:5000/tracks/${editId}`, newHabit);
            } else {
                await axios.post('http://localhost:5000/tracks', newHabit);
            }
            fetchHabits();
            handleClose();
        } catch (error) {
            console.error('Error submitting habit:', error);
            alert('There was an error submitting the habit. Please try again.');
        }
    };

    const handleEdit = (habit) => {
        setIsEdit(true);
        setEditId(habit._id);
        setNewHabit({
            name: habit.name,
            date: habit.date,
            days: habit.days,
        });
        handleShow();
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/tracks/${id}`);
            fetchHabits();
        } catch (error) {
            console.error('Error deleting habit:', error);
        }
    };

    const handleCheckboxChange = (day) => {
        setNewHabit((prev) => ({
            ...prev,
            days: {
                ...prev.days,
                [day]: !prev.days[day]
            }
        }));
    };

    useEffect(() => {
        const getDetails = async () => {
          try {
            const response = await fetch(`http://localhost:5000/users/getAccount/${encodeURIComponent(username)}`);  
            if (response.status === 200) {
              const data = await response.json();
              const finalData = JSON.stringify(data.account[0]);
              
              setUserDetail(data.account);
            

            } else if (response.status === 404) { 
              alert("Account not found");
            } else {
              alert("Failed to get user details");
            }
          } catch (error) {
            console.error(error);
            alert("Failed to get user details");
          }
        };
    
        getDetails();
      }, [username]);

    return (
        <div className="container mt-5">
            <div className='bgsc'>
                
                <h1 className='profiletext'>{userDetail ? userDetail.username : ""}</h1>
                <h1 className='profiletextpass'>{userDetail ? userDetail.email : ""}</h1>
                <Link to={`/habit/${username}`} className='active'>Habit Tracker List</Link>
                <Link to={`/todo/${username}`} className='notactive'>To Do List</Link>
                <Link to={`/reading/${username}`} className='notactive'>Reading List</Link>
      
            </div>
            <h1 className="mb-4">📋 Habit Tracker</h1>
            <Button variant="warning" onClick={handleShow}>📋 Add Habit</Button>
            <Table striped bordered hover className="mt-3 custom-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Mon</th>
                        <th>Tue</th>
                        <th>Wed</th>
                        <th>Thu</th>
                        <th>Fri</th>
                        <th>Sat</th>
                        <th>Sun</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {habits.map((habit) => (
                        <tr key={habit._id}>
                            <td>{habit.name}</td>
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <td key={day} className="text-center">{habit.days[day] ? '✓' : ''}</td>
                            ))}
                            <td>{new Date(habit.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleEdit(habit)} className="me-2">✏️</Button>
                                <Button variant="secondary" onClick={() => handleDelete(habit._id)}>🗑️</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? 'Edit Habit' : 'Add New Habit'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newHabit.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDate">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={newHabit.date}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <div className="mb-3">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <Form.Check
                                    key={day}
                                    type="checkbox"
                                    label={day}
                                    checked={newHabit.days[day]}
                                    onChange={() => handleCheckboxChange(day)}
                                />
                            ))}
                        </div>
                        <Button variant="primary" type="submit">
                            {isEdit ? 'Update Habit' : 'Add Habit'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default HabitTrackerList;