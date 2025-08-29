const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/bfhl', (req, res) => {
    try {
        const data = req.body.data;

        if (!Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                user_id: "john_doe_17091999",
                error: "Invalid input: 'data' must be an array."
            });
        }

        // Static user information given
        const user_id = "john_doe_17091999";
        const email = "john@xyz.com";
        const roll_number = "ABCD123";

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
            if (i % 2 === 0) {
                final_concat_string += reversed_alphabet_string[i].toUpperCase();
            } else {
                final_concat_string += reversed_alphabet_string[i].toLowerCase();
            }
        }

        const response = {
            is_success: true,
            user_id: user_id,
            email: email,
            roll_number: roll_number,
            odd_numbers: odd_numbers,
            even_numbers: even_numbers,
            alphabets: alphabets,
            special_characters: special_characters,
            sum: String(sum),
            concat_string: final_concat_string
        };

        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({
            is_success: false,
            user_id: "john_doe_17091999",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
