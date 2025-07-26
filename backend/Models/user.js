const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
    },
    email: {
        type: String,
        required: function() {
            return this.role === 'faculty' || this.role === 'librarian';
        }
    },
    password: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true
    },
    department: {
        type: String,
        required: function() {
            return this.role === 'student';
        }
    },
    studentID: { 
        type: Number, 
        required: function() {
            return this.role === 'student';
        },
        unique: function() {
            return this.role === 'student';
        }
    },
    employeeId: {
        type: String,
        required: function() {
            return this.role === 'faculty' || this.role === 'librarian';
        },
        unique: function() {
            return this.role === 'faculty' || this.role === 'librarian';
        }
    },
    role: {
        type: String,
        enum: ['student', 'faculty', 'librarian', 'superadmin'], // Added superadmin to the role
        default: 'default'
    }
});

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;