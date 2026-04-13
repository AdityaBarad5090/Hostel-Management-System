const db = require("../config/db");

exports.getDashboard = (req, res) => {
    const data = {};

    // Total Students
    db.query("SELECT COUNT(*) AS totalStudents FROM students", (err, result) => {
        if (err) return res.send(err);

        data.totalStudents = result[0].totalStudents;

        // Total Rooms
        db.query("SELECT COUNT(*) AS totalRooms FROM rooms", (err, result) => {
            if (err) return res.send(err);

            data.totalRooms = result[0].totalRooms;

            // Available Rooms
            const sql = `
                SELECT COUNT(*) AS availableRooms
                FROM rooms
                WHERE id NOT IN (
                    SELECT room_id FROM students
                    GROUP BY room_id
                    HAVING COUNT(*) >= capacity
                )
           `;
            db.query(sql, (err, result) => {
                if (err) return res.send(err);

                data.availableRooms = result[0].availableRooms;

                res.json(data);
            });
        });
    });
};
