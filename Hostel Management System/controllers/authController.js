const db = require("../config/db");

exports.login = (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM admin WHERE username=? AND password=?";

    db.query(sql, [username, password], (err, result) => {
        if (err) return res.send(err);

        if (result.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    });
};

// controllers/authController.js
exports.studentLogin = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields required" });
    }

    const sql = "SELECT * FROM students WHERE email = ?";

    db.query(sql, [email], (err, result) => {
        if (err) return res.send(err);

        if (result.length === 0) {
            return res.status(401).json({ success: false, message: "Student not found ❌" });
        }

        const student = result[0];

        if (student.password !== password) {
            return res.status(401).json({ success: false, message: "Wrong password ❌" });
        }

        res.json({
            success: true,
            message: "Login success ✅",
            student
        });
    });
};

