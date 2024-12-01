import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from "react-router-dom";
import { Table, Button, Form, Modal } from 'react-bootstrap';
import "./TodoList.css";

function ToDoList() {
    const { username } = useParams();
    const [userDetail, setUserDetail] = useState(null);
    const [lists, setLists] = useState([]);
    const [show, setShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [newList, setNewList] = useState({
        title: '',
        description: '',
        status: '',
        due: '',
    });
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    useEffect(() => {
        fetchLists();
    }, []);

    const fetchLists = async () => {
        try {
            const response = await axios.get('http://localhost:5000/todos');
            const sortedLists = response.data.data.sort((a, b) => new Date(a.due) - new Date(b.due));
            setLists(sortedLists);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEdit) {
            try {
                await axios.put(`http://localhost:5000/todos/${editId}`, newList);
                fetchLists();
                handleClose();
            } catch (error) {
                console.error('Error updating todo:', error);
            }
        } else {
            try {
                await axios.post('http://localhost:5000/todos', newList);
                fetchLists();
                handleClose();
            } catch (error) {
                console.error('Error adding todo:', error);
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/todos/${id}`);
            fetchLists();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const handleDone = async (id) => {
        try {
            await axios.put(`http://localhost:5000/todos/${id}`, { status: 'Done' });
            fetchLists();
        } catch (error) {
            console.error('Error marking todo as done:', error);
        }
    };

    const handleUndone = async (id) => {
        try {
            await axios.put(`http://localhost:5000/todos/${id}`, { status: 'Pending' });
            fetchLists();
        } catch (error) {
            console.error('Error marking todo as undone:', error);
        }
    };

    const handleShow = () => setShow(true);

    const handleClose = () => {
        setShow(false);
        setIsEdit(false);
        setNewList({
            title: '',
            description: '',
            status: '',
            due: '',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewList((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = (list) => {
        setIsEdit(true);
        setEditId(list._id);
        setNewList({
            title: list.title,
            description: list.description,
            status: list.status,
            due: formatDateForInput(list.due)
        });
        handleShow();
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
              <div className='bgsctd'>
                
                <h1 className='profiletexttd'>{userDetail ? userDetail.username : ""}</h1>
                <h1 className='profiletextpasstd'>{userDetail ? userDetail.email : ""}</h1>
                <Link to={`/habit/${username}`} className='notactivetd'>Habit Tracker List</Link>
                <Link to={`/todo/${username}`} className='activetd'>To Do List</Link>
                <Link to={`/reading/${username}`} className='notactivetd'>Reading List</Link>
      
            </div>
            <h1 className="mb-4">📝 Todo List</h1>
            <Button variant="warning" onClick={handleShow}>📋 Add Todo</Button>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Due</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {lists.map((list) => (
                        <tr key={list._id}>
                            <td className='col-1'>{list.title}</td>
                            <td className='col-2'>{list.description}</td>
                            <td className='col-1'>{list.status}</td>
                            <td className='col-1'>{formatDate(list.due)}</td>
                            <td className='col-1'>
                                <Button variant="danger" onClick={() => handleEdit(list)} className="me-2">✏️</Button>
                                <Button variant="secondary" onClick={() => handleDelete(list._id)} className="me-2">🗑️</Button>
                                {list.status === 'Pending' ?
                                    <Button variant='success' onClick={() => handleDone(list._id)}>✅</Button> : 
                                    <Button variant='danger' onClick={() => handleUndone(list._id)}>❌</Button>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? 'Edit Todo' : 'Add New Todo'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={newList.title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={newList.description}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="status"
                                value={newList.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Done">Done</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formDue">
                            <Form.Label>Due</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="due"
                                value={newList.due}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="light" type="submit" className="mt-3">
                            {isEdit ? 'Update Todo' : 'Add Todo'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default ToDoList;
