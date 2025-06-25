const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());


let todos = [
    {
        "id": "1",
        "title": "Belajar Cloud Computing",
        "description": "Mengerjakan tugas besar komputasi awan",
        "completed": false,
        "dueDate": "2025-06-25",
        "createdAt": "2025-06-16T13:00:00Z"
    }

];

const sendSuccessResponse = (res, message, data = null) => {
    return res.status(200).json({
        status: "success",
        message: message,
        data: data
    });
};

const sendErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({
        status: "error",
        message: message
    });
};


app.get('/api/todos', (req, res) => {
    sendSuccessResponse(res, "Data retrieved successfully", todos);
});

app.post('/api/todos', (req, res) => {
    const { title, description, dueDate } = req.body;

    // Validasi dasar
    if (!title || !description || !dueDate) {
        return sendErrorResponse(res, 400, "Title, description, and dueDate are required.");
    }

    const newTodo = {
        id: uuidv4(),
        title,
        description,
        completed: false,
        dueDate,
        createdAt: new Date().toISOString()
    };

    todos.push(newTodo);
    sendSuccessResponse(res, "To-do added successfully", newTodo);
});

app.get('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const todo = todos.find(t => t.id === id);

    if (!todo) {
        return sendErrorResponse(res, 404, "To-do with the given ID not found");
    }
    sendSuccessResponse(res, "Data retrieved successfully", todo);
});

app.put('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, completed, dueDate } = req.body;

    const todoIndex = todos.findIndex(t => t.id === id);

    if (todoIndex === -1) {
        return sendErrorResponse(res, 404, "To-do with the given ID not found");
    }

    if (title !== undefined) todos[todoIndex].title = title;
    if (description !== undefined) todos[todoIndex].description = description;
    if (completed !== undefined) todos[todoIndex].completed = completed;
    if (dueDate !== undefined) todos[todoIndex].dueDate = dueDate;

    sendSuccessResponse(res, "To-do updated successfully", todos[todoIndex]);
});

app.delete('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = todos.length;
    todos = todos.filter(t => t.id !== id);

    if (todos.length === initialLength) {
        return sendErrorResponse(res, 404, "To-do with the given ID not found");
    }
    sendSuccessResponse(res, "To-do deleted successfully");
});

app.use((req, res, next) => {
    sendErrorResponse(res, 404, "Endpoint not found");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access your API at http://localhost:${PORT}/api/todos`);
});