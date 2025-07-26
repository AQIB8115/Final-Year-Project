import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTeacher = () => {
    const [teacher, setTeacher] = useState({
        username: '',
        email: '',
        password: '',
        phone: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setTeacher({
            ...teacher,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://final-year-project-api-ten.vercel.app/teacher/add', teacher);
            setMessage(response.data.message);
            navigate('/admin/teacher');
        } catch (error) {
            console.error('Error adding teacher', error);
            setMessage('Error adding teacher');
        }
    };

    return (
        <div>
            <h1>Add New Teacher</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        value={teacher.username}
                        onChange={handleChange}
                        required
                    />
                </label><br />
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={teacher.email}
                        onChange={handleChange}
                        required
                    />
                </label><br />
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={teacher.password}
                        onChange={handleChange}
                        required
                    />
                </label><br />
                <label>
                    Phone:
                    <input
                        type="text"
                        name="phone"
                        value={teacher.phone}
                        onChange={handleChange}
                        required
                    />
                </label><br />
                <button type="submit">Add Teacher</button>
            </form>
        </div>
    );
};

export default AddTeacher;
