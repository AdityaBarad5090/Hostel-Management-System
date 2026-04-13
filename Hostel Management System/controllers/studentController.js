const db = require("../config/db");

// Add Student
exports.addStudent = (req, res) => {
    const { name, email, phone, room_id , password } = req.body;

    if (!name || !phone || !room_id) {
        return res.send("All fields required");
    }

    // Step 1: Get room capacity
    const roomQuery = "SELECT capacity FROM rooms WHERE id = ?";

    db.query(roomQuery, [room_id], (err, roomResult) => {
        if (err) return res.send(err);

        if (roomResult.length === 0) {
            return res.send("Room not found ❌");
        }

        const capacity = roomResult[0].capacity;

        // Step 2: Count students in that room
        const countQuery = "SELECT COUNT(*) AS total FROM students WHERE room_id = ?";

        db.query(countQuery, [room_id], (err, countResult) => {
            if (err) return res.send(err);

            const total = countResult[0].total;

            // Step 3: Check full condition
            if (total >= capacity) {
                return res.send("Room is FULL ❌");
            }

            // Step 4: Insert student
            const insertQuery = `
                INSERT INTO students (name,email,password, phone, room_id)
                VALUES (?, ?, ?, ?,?)
            `;

            db.query(insertQuery, [name,email,password, phone, room_id], (err) => {
                if (err) return res.send(err);

                res.send("Student Added Successfully ✅");
            });
        });
    });
};


// Get All Students
exports.getStudents = (req, res) => {
    db.query("SELECT * FROM students", (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error fetching data");
        }
        res.json(result);
    });
};

// Delete Student
exports.deleteStudent = (req, res) => {
    const id = req.params.id;

    // Get student room_id
    db.query("SELECT room_id FROM students WHERE id=?", [id], (err, result) => {
        if (err) return res.send(err);

        if (result.length === 0) {
            return res.send("Student not found");
        }

        const room_id = result[0].room_id;

        // Delete student
        db.query("DELETE FROM students WHERE id=?", [id], (err) => {
            if (err) return res.send(err);

            // Decrease occupied
            db.query(
                "UPDATE rooms SET occupied = occupied - 1 WHERE id=?",
                [room_id],
                (err) => {
                    if (err) return res.send(err);

                    res.send("Student Deleted & Room Updated ✅");
                }
            );
        });
    });
};


// Update Student
exports.updateStudent = (req, res) => {
    const id = req.params.id;
    const { name, email, phone, room_id } = req.body;

    const sql = "UPDATE students SET name=?, email=?, phone=?, room_id=? WHERE id=?";

    db.query(sql, [name, email, phone, room_id, id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Update Failed");
        }
        res.send("Student Updated ✅");
    });
};


// Update Profile
exports.updateProfile = (req, res) => {
    const id = req.params.id;
    const { name, email, phone } = req.body;

    const sql = "UPDATE students SET name=?, email=?, phone=? WHERE id=?";

    db.query(sql, [name, email, phone, id], (err) => {
        if (err) return res.send("Update Failed ❌");
        res.send("Profile Updated ✅");
    });
};

// Change Password
exports.changePassword = (req, res) => {
    const id = req.params.id;
    const { password } = req.body;

    const sql = "UPDATE students SET password=? WHERE id=?";

    db.query(sql, [password, id], (err) => {
        if (err) return res.send("Password Update Failed ❌");
        res.send("Password Updated ✅");
    });
};