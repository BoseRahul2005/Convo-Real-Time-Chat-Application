const { BrevoClient } = require("@getbrevo/brevo");
//testing..
const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

module.exports = brevo;
