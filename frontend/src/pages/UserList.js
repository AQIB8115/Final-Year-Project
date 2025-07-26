
import React, { useEffect, useState } from 'react';

// Main UserList component
function UserList() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        department: '',
        role: '',
        studentID: '',
        employeeId: '',
    });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://final-year-project-api-ten.vercel.app/api/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            try {
                const response = await fetch(`https://final-year-project-api-ten.vercel.app/api/users/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setUsers(users.filter(user => user._id !== id));
                    alert('User deleted successfully');
                } else {
                    alert('Failed to delete user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://final-year-project-api-ten.vercel.app/api/newuser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add user');
            }

            setUsers([...users, data]);
            setNewUser({
                username: '',
                email: '',
                password: '',
                phone: '',
                department: '',
                role: '',
                studentID: '',
                employeeId: '',
            });
            setShowForm(false);
            alert('User added successfully');
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Failed to add user');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setNewUser((prev) => {
            const updatedUser = { ...prev, [name]: value };

            if (name === 'role') {
                if (value === 'student') {
                    updatedUser.email = '';
                    updatedUser.employeeId = '';
                } else if (value === 'faculty' || value === 'librarian') {
                    updatedUser.studentID = '';
                    updatedUser.department = '';
                }
            }

            return updatedUser;
        });
    };

    return (
        <div style={styles.container}>
            <button
                onClick={() => setShowForm(!showForm)}
                style={styles.button}
                onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
            >
                {showForm ? 'Cancel' : 'Add New User'}
            </button>

            {showForm && (
                <div style={styles.formContainer}>
                    <h3>Add New User</h3>
                    <form onSubmit={handleAddUser}>
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={newUser.username}
                            onChange={handleInputChange}
                            required
                            style={styles.input}
                        />

                        {newUser.role === 'student' && (
                            <>
                                <label>Student ID:</label>
                                <input
                                    type="number"
                                    name="studentID"
                                    value={newUser.studentID}
                                    onChange={handleInputChange}
                                    required
                                    style={styles.input}
                                />

                                <label>Department:</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={newUser.department}
                                    onChange={handleInputChange}
                                    required
                                    style={styles.input}
                                />
                            </>
                        )}

                        {(newUser.role === 'faculty' || newUser.role === 'librarian') && (
                            <>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={newUser.email}
                                    onChange={handleInputChange}
                                    required
                                    style={styles.input}
                                />

                                <label>Employee ID:</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    value={newUser.employeeId}
                                    onChange={handleInputChange}
                                    required
                                    style={styles.input}
                                />
                            </>
                        )}

                        <label>Phone:</label>
                        <input
                            type="text"
                            name="phone"
                            value={newUser.phone}
                            onChange={handleInputChange}
                            required
                            style={styles.input}
                        />

                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={newUser.password}
                            onChange={handleInputChange}
                            required
                            style={styles.input}
                        />

                        <label>Role:</label>
                        <select
                            name="role"
                            value={newUser.role}
                            onChange={handleInputChange}
                            required
                            style={styles.input}
                        >
                            <option value="">Select Role</option>
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                            <option value="librarian">Librarian</option>
                            <option value="superadmin">Superadmin</option>
                        </select>

                        <button type="submit" style={styles.button}>
                            Add User
                        </button>
                    </form>
                </div>
            )}

            {error && <p style={styles.error}>{error}</p>}

            {users.length > 0 ? (
                <div>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>User ID</th>
                                <th style={styles.th}>Username</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Department</th>
                                <th style={styles.th}>Phone</th>
                                <th style={styles.th}>Role</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} style={styles.trHover}>
                                    <td style={styles.td}>
                                        {user.role === 'student' ? user.studentID : user.employeeId}
                                    </td>
                                    <td style={styles.td}>{user.username}</td>
                                    <td style={styles.td}>{user.email || 'N/A'}</td>
                                    <td style={styles.td}>{user.department || 'N/A'}</td>
                                    <td style={styles.td}>{user.phone}</td>
                                    <td style={styles.td}>{user.role}</td>
                                    <td style={styles.td}>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            style={{
                                                backgroundColor: 'red',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                padding: '5px 10px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
}
const styles = {
    container: {
        padding: '20px', // 400px bohot zyada tha
        fontFamily: 'Arial, sans-serif',
        // backgroundColor: 'green',
        backgroundImage: 'url("/images/home1.13.jpg")', // Replace with your image URL
        backgroundSize: 'cover',  // Ensures the image covers the entire container
        backgroundPosition: 'center',  // Centers the image
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh', // 10vh bohot chhota tha
        margin: '0', // "mergin" ko "margin" theek kiya
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: 'green',
        color: 'white',
        border: 'none',
        padding: '12px 20px', // 100px 0px ki jagah zyada balanced padding
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem',
        marginBottom: '10px',
        // width: '60%', // 50% se thoda zyada diya taake zyada compact lage
        display: 'block',
        textAlign: 'right',
    },
    buttonHover: {
        backgroundColor: '#45a049',
    },
    formContainer: {
        width: '50vw', // width define ki taake form centered lage
        padding: '30px',
        // background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    input: {
        width: '100%',
        padding: '10px', // 5px ki jagah thoda bada diya taake readability achi ho
        marginBottom: '15px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '1rem',
    },
    table: {
        width: '80%', // 100vh width ki jagah percentage use ki taake responsiveness aaye
        borderCollapse: 'collapse',
        marginTop: '20px',
    },
    th: {
        backgroundColor: '#4CAF50',
        color: 'black',
        padding: '12px',
        textAlign: 'left',
    },
    td: {
        padding: '12px',
        // background: 'none',
        textAlign: 'left',
        borderBottom: '1px solid #ddd',
    },
    trHover: {
        backgroundColor: '#f9f9f9', // Thoda halka color diya hover ke liye
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
        textAlign: 'center',
    },
};

export default UserList;

