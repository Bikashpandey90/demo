require('dotenv').config();
const mongoose = require('mongoose');
const populateAdmin = require('../seeder/admin.seeder');


const dbConnect = async () => {
    try {
        console.log("Connecting to the database........");
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: process.env.MONGODB_DB,
            autoCreate: true,
            autoIndex: true
        })

        console.log("Admin Table seeding started........");
        await populateAdmin()
        console.log("Admin Table seeding completed........");

        console.log("Database connected successfully........");

    } catch (exception) {
        console.log("Database connection failed");
        console.log(exception);
        process.exit();
    }
}
dbConnect();