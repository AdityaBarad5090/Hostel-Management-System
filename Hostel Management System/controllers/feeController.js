const db = require("../config/db");

// Add Fee
exports.addFee = (req, res) => {
    const { student_id, status } = req.body;

    // Step 1: Get student's room
    const getRoom = `
        SELECT rooms.fee 
        FROM students
        JOIN rooms ON students.room_id = rooms.id
        WHERE students.id = ?
    `;
    db.query(getRoom, [student_id], (err, result) => {
        if (err) return res.send(err);

        if (result.length === 0) {
            return res.send("Student not found ❌");
        }

        const amount = result[0].fee;

        // Step 2: Insert fee
        const sql = "INSERT INTO fees (student_id, amount, status) VALUES (?, ?, ?)";

        db.query(sql, [student_id, amount, status], (err) => {
            if (err) return res.send(err);

            res.send("Fee Added Automatically ✅");
        });
    });
};

// Get Fees (with student name)
exports.getFees = (req, res) => {
    const sql = `
        SELECT fees.*, students.name 
        FROM fees
        JOIN students ON fees.student_id = students.id
    `;

    db.query(sql, (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
};

// Update Fee
exports.updateFee = (req, res) => {
    const id = req.params.id;
    const { student_id, status } = req.body;

    const sql = `
        UPDATE fees 
        SET student_id=?, status=? 
        WHERE id=?
    `;

    db.query(sql, [student_id, status, id], (err) => {
        if (err) return res.send("Update Failed");
        res.send("Fee Updated ✅");
    });
};

// Delete Fee
exports.deleteFee = (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM fees WHERE id=?", [id], (err) => {
        if (err) return res.send(err);
        res.send("Fee Deleted");
    });
};


// Get Fee by Student
// Get Student Name + Fee
exports.getFeeByStudent = (req, res) => {
    const student_id = req.params.id;

    const sql = `
        SELECT students.name, rooms.fee, fees.status
        FROM students
        JOIN rooms ON students.room_id = rooms.id
        JOIN fees ON fees.student_id = students.id
        WHERE students.id = ?
    `;

    db.query(sql, [student_id], (err, result) => {
        if (err) return res.send(err);

        if (result.length === 0) {
            return res.json({ name: "", fee: 0, status: "Pending" });
        }

        res.json({
            name: result[0].name,
            fee: result[0].fee,
            status: result[0].status  // ✅ now returns status
        });
    });
};