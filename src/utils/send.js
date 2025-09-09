const axios = require('axios');
require('dotenv').config();

const {API_KEY, PHONE_NUMBER} = process.env;

async function sendSMS(message) {
    try {
        const response = await axios.post(
            "https://sms.textsms.co.ke/api/services/sendsms/",
            {
                apikey: API_KEY,
                partnerID: "14608",
                message: message,
                shortcode: "TextSMS",
                mobile: PHONE_NUMBER
            },
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        console.log(response.data)

    } catch (e) {
        console.error("Error sending message : ", e.message);
    }
}

module.exports = sendSMS;