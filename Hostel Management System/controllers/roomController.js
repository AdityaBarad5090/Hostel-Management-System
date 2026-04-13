const db = require("../config/db");

// Add Room
exports.addRoom = (req, res) => {
    const { room_number, capacity, fee } = req.body;
    const sql = "INSERT INTO rooms (room_number, capacity, fee) VALUES (?, ?, ?)";

    db.query(sql, [room_number, capacity, fee], (err) => {
        if (err) return res.json({ success: false, message: err.message });
        res.json({ success: true, message: "Room Added ✅" });
    });
};


// Get Rooms
exports.getRooms = (req, res) => {
    const sql = `
        SELECT rooms.*, 
        COUNT(students.id) AS occupied
        FROM rooms
        LEFT JOIN students ON rooms.id = students.room_id
        GROUP BY rooms.id
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Error");
        }
        res.json(result);
    });
};


// Update Room
// ✅ Make sure this is what your updateRoom looks like
exports.updateRoom = (req, res) => {
    const id = req.params.id;
    const { room_number, capacity, fee } = req.body;

    const sql = "UPDATE rooms SET room_number=?, capacity=?, fee=? WHERE id=?";
    db.query(sql, [room_number, capacity, fee, id], (err, result) => {
        if (err) {
            return res.json({ success: false, message: "Update Failed ❌" });
        }
        if (result.affectedRows === 0) {
            return res.json({ success: false, message: "Room Not Found ❌" });
        }
        return res.json({ success: true, message: "Room Updated ✅" });
    });
};

// Delete Room
exports.deleteRoom = (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM rooms WHERE id=?", [id], (err, result) => {
        if (err) return res.send(err);
        res.send("Room Deleted");
    });
};

exports.getStudentRoom = (req, res) => {
    const student_id = req.params.id;

    // Get room details of this student
    const roomSql = `
        SELECT rooms.* 
        FROM students
        JOIN rooms ON students.room_id = rooms.id
        WHERE students.id = ?
    `;

    db.query(roomSql, [student_id], (err, roomResult) => {
        if (err) return res.send(err);

        if (roomResult.length === 0) {
            return res.json({ room: {}, roommates: [] });
        }

        const room = roomResult[0];

        // Get roommates (other students in same room)
        const roommatesSql = `
            SELECT id, name , phone
            FROM students
            WHERE room_id = ? AND id != ?
        `;

        db.query(roommatesSql, [room.id, student_id], (err, roommatesResult) => {
            if (err) return res.send(err);

            res.json({
                room: room,
                roommates: roommatesResult
            });
        });
    });
};