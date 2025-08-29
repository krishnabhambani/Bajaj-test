const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const USER_DETAILS = {
    user_id: "john_doe_17091999",
    email: "john@xyz.com",
    roll_number: "ABCD123"
};

const processData = (data) => {
    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;
    let alphabet_string_concat = "";

    for (const item of data) {
        if (!isNaN(parseFloat(item)) && isFinite(item)) {
            const num = Number(item);
            if (num % 2 === 0) {
                even_numbers.push(String(num));
            } else {
                odd_numbers.push(String(num));
            }
            sum += num;
        } else if (typeof item === 'string' && /^[a-zA-Z]+$/.test(item)) {
            alphabets.push(item.toUpperCase());
            alphabet_string_concat += item;
        } else if (typeof item === 'string') {
            special_characters.push(item);
        }
    }

    const reversed_alphabet_string = alphabet_string_concat.split('').reverse().join('');
    let final_concat_string = "";

    for (let i = 0; i < reversed_alphabet_string.length; i++) {
        final_concat_string += (i % 2 === 0) 
            ? reversed_alphabet_string[i].toUpperCase() 
            : reversed_alphabet_string[i].toLowerCase();
    }

    return {
        odd_numbers,
        even_numbers,
        alphabets,
        special_characters,
        sum: String(sum),
        concat_string: final_concat_string
    };
};

app.get('/', (req, res) => {
    res.status(200).json({ status: 'API is running successfully.' });
});

app.post('/bfhl', (req, res, next) => {
    try {
        const { data } = req.body;

        if (!data || !Array.isArray(data)) {
            const error = new Error("The 'data' field is required and must be an array.");
            error.statusCode = 400;
            throw error;
        }

        const processedData = processData(data);

        const response = {
            is_success: true,
            ...USER_DETAILS,
            ...processedData
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

app.use((req, res, next) => {
    const error = new Error('Not Found - The requested route does not exist.');
    error.statusCode = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    
    console.error(error.stack);

    res.status(statusCode).json({
        is_success: false,
        ...USER_DETAILS,
        error: {
            message: error.message || 'An unexpected error occurred.',
            statusCode: statusCode
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});