
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        role: 'student', // Default role
        username: '',
        email: '',
        password: '',
        phone: '',
        department: '',
        studentID: '',
        employeeId: '',
    });

    const navigate = useNavigate(); // Hook to navigate after successful signup

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://final-year-project-api-ten.vercel.app/api/signup', formData, {
                withCredentials: true, // Allow cookies to be sent
            });
            alert(response.data.message); // Display success message

            // Redirect to login page after successful signup
            navigate('/api/login');
        } catch (error) {
            alert(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit} className="signup-form">
                <h2>Signup</h2>

                <label>
                    Role:
                    <select name="role" value={formData.role} onChange={handleChange} className="role-select">
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        {/* <option value="librarian">Librarian</option> */}
                    </select>
                </label>

                {/* Conditionally render fields based on the role */}
                {formData.role === 'student' && (
                    <>
                        <label>
                            Student ID:
                            <input
                                type="text"
                                name="studentID"
                                placeholder="Student ID"
                                value={formData.studentID}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Department:
                            <input
                                type="text"
                                name="department"
                                placeholder="Department"
                                value={formData.department}
                                onChange={handleChange}
                            />
                        </label>
                    </>
                )}

                {(formData.role === 'faculty' || formData.role === 'librarian') && (
                    <>
                        <label>
                            Employee ID:
                            <input
                                type="text"
                                name="employeeId"
                                placeholder="Employee ID"
                                value={formData.employeeId}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </>
                )}

                {/* Common fields */}
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Phone:
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit" className="signup-button">Signup</button>

                <p className="login-link">
                    Already have an account? <Link to="/api/login">Login</Link>
                </p>
            </form>

            <style jsx>{`
            html, body {
  width:100vw;
  height: 100vh;
  mergin : 0;
  padding : 0;
  overflow: hidden;
  

  font-family: 'Arial', sans-serif;
}
                .signup-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    width:250vh;
                    {/* background-color:rgb(3, 51, 7); */}
                    padding: 20px;
                    background: linear-gradient(to right, #f0f8ff, #d9eaf7); /* Smooth background gradient */
                    background-image: url('/images/home1.13.jpg');  /* Path relative to the public folder */

                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                }

                .signup-form {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(197, 191, 191, 0.81);
                    padding: 20px;
                    width: 100%;
                    max-width: 400px;
                }

                h2 {
                    text-align: center;
                    margin-bottom: 20px;
                }

                input, select {
                    width: 100%;
                    padding: 10px;
                    margin: 10px 0;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-weight: bold;
                    color: black;
                }

                .role-select {
                    padding: 10px;
                }

                .signup-button {
                    background-color: seagreen;
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    width: 100%;
                }

                .signup-button:hover {
                    opacity: 0.8;
                }

                .login-link {
                    text-align: center;
                    margin-top: 10px;
                }

                .login-link a {
                    color: blue;
                    text-decoration: underline;
                }

                @media (max-width: 600px) {
                    .signup-form {
                        padding: 15px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Signup;
