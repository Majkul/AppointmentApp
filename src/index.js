const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
app.use(cors());

app.use(express.json());

const dataFilePath = path.join(__dirname, '../data.json');

const readDataFile = () => {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

const writeDataFile = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

app.post('/update-schedule', (req, res) => {
    const { day, index, newValue } = req.body;
    const data = readDataFile();
    const column = data.columns.find(col => col[day]);

    if (column && column[day] && data.rows[index]) {
        column[day][index] = newValue;
        writeDataFile(data);
        res.json({ success: true, data });
    } else {
        res.status(400).json({ success: false, message: "Invalid day or index" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
