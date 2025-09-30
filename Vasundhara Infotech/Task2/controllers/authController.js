const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existing.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const [roleData] = await db.query('SELECT * FROM roles WHERE name = ?', [role]);

        if (roleData.length === 0) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const role_id = roleData[0].id;

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query('INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role_id]);

        res.status(201).json({
            msg: "User registered successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msgs: `Internal Server Error ${error.message}`
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const [users] = await db.query(
            "SELECT u.id, u.name, u.email, u.password, r.name AS role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?", [email]);

        if (users.length === 0) {
            return res.status(404).json({ msg: "Email is not valid" });
        }

        const isMatch = await bcrypt.compare(password, users[0].password);

        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }


        const token = jwt.sign(
            { id: users[0].id, role: users[0].role.toLowerCase() },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        
        res.status(200).json({
            msg: "Login successful",
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Internal Server Error"
        });
    }

} 