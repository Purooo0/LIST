import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { Link, useParams, useNavigate } from "react-router-dom";
import "./ReadingList.css";

const ReadingList = () => {
    const { username } = useParams();
    const [userDetail, setUserDetail] = useState(null);
    const [reads, setReads] = useState([]);
    const [show, setShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [newRead, setNewRead] = useState({
        title: '',
        author: '',
        publisher: '',
        status: '',
        score: '',
    });

    useEffect(() => {
        fetchReads();
    }, []);

    const fetchReads = async () => {
        try {
            const response = await axios.get('http://localhost:5000/reads');
            setReads(response.data.data);
        } catch (error) {
            console.error('Error fetching reads:', error);
        }
    };

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setIsEdit(false);
        setNewRead({
            title: '',
            author: '',
            publisher: '',
            status: '',
            score: '',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewRead((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEdit) {
            try {
                await axios.put(`http://localhost:5000/reads/${editId}`, newRead);
                fetchReads();
                handleClose();
            } catch (error) {
                console.error('Error updating read:', error);
            }
        } else {
            try {
                await axios.post('http://localhost:5000/reads', newRead);
                fetchReads();
                handleClose();
            } catch (error) {
                console.error('Error adding read:', error);
            }
        }
    };

    const handleEdit = (read) => {
        setIsEdit(true);
        setEditId(read._id);
        setNewRead({
            title: read.title,
            author: read.author,
            publisher: read.publisher,
            status: read.status,
            score: read.score,
        });
        handleShow();
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/reads/${id}`);
            fetchReads();
        } catch (error) {
            console.error('Error deleting read:', error);
        }
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
             <div className='bgscrl'>
                
                <h1 className='profiletextrl'>{userDetail ? userDetail.username : ""}</h1>
                <h1 className='profiletextpassrl'>{userDetail ? userDetail.email : ""}</h1>
                <Link to={`/habit/${username}`} className='notactiverl'>Habit Tracker List</Link>
                <Link to={`/todo/${username}`} className='notactiverl'>To Do List</Link>
                <Link to={`/reading/${username}`} className='activerl'>Reading List</Link>
      
            </div>
            <h1 className="mb-4">📚 Reading List</h1>
            <Button variant="warning" onClick={handleShow}>📋</Button>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Score</th>
                        <th>Author</th>
                        <th>Publisher</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reads.map((read) => (
                        <tr key={read._id}>
                            <td>{read.title}</td>
                            <td>{read.status}</td>
                            <td>{read.score}</td>
                            <td>{read.author}</td>
                            <td>{read.publisher}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleEdit(read)} className="me-2">✏️</Button>
                                <Button variant="secondary" onClick={() => handleDelete(read._id)}>🗑️</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? 'Edit Read' : 'Add New Read'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={newRead.title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formAuthor">
                            <Form.Label>Author</Form.Label>
                            <Form.Control
                                type="text"
                                name="author"
                                value={newRead.author}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPublisher">
                            <Form.Label>Publisher</Form.Label>
                            <Form.Control
                                type="text"
                                name="publisher"
                                value={newRead.publisher}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="status"
                                value={newRead.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="Ready to Start">Ready to Start</option>
                                <option value="Reading">Reading</option>
                                <option value="Finished">Finished</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formScore">
                            <Form.Label>Score</Form.Label>
                            <Form.Control
                                type="number"
                                name="score"
                                value={newRead.score}
                                onChange={handleChange}
                                min="1"
                                max="5"
                                required
                            />
                        </Form.Group>
                        <Button variant="light" type="submit" className="mt-3">
                            {isEdit ? 'Update Read' : 'Add Read'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ReadingList;
