require("dotenv").config();

const app = require("./app");
const DB = require("./database").connectDB;

DB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});
