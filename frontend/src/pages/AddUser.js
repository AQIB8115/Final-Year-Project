import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
    console.log('AddUser component loaded');
    const [newUser, setNewUser] = useState({
        username: '',
        department: '',
        password: '',
        phone: '',
        studentID: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://final-year-project-api-ten.vercel.app/user/add', newUser);
            setMessage(response.data.message);
            setNewUser({
                username: '',
                department: '',
                password: '',
                phone: '',
                studentID: '',
            });
            navigate('/admin/user');
        } catch (error) {
            console.error('Error adding user', error);
            setMessage('Error adding user');
        }
    };

    return (
        <div>
            <h1>Add New User</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input 
                        type="text" 
                        name="username" 
                        value={newUser.username} 
                        onChange={handleChange} 
                        required 
                    />
                </label><br/>
                <label>
                    Department:
                    <input 
                        type="text" 
                        name="department" 
                        value={newUser.department} 
                        onChange={handleChange} 
                        required 
                    />
                </label><br/>
                <label>
                    Password:
                    <input 
                        type="password" 
                        name="password" 
                        value={newUser.password} 
                        onChange={handleChange} 
                        required 
                    />
                </label><br/>
                <label>
                    Phone:
                    <input 
                        type="text" 
                        name="phone" 
                        value={newUser.phone} 
                        onChange={handleChange} 
                        required 
                    />
                </label><br/>
                <label>
                    Student ID:
                    <input 
                        type="number" 
                        name="studentID" 
                        value={newUser.studentID} 
                        onChange={handleChange} 
                        required 
                    />
                </label><br/>
                <button type="submit">Add User</button>
            </form>
        </div>
    );
};

export default AddUser;
