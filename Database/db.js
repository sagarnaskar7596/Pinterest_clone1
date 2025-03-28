import mongoose from "mongoose";

const connectDb = async()=>{

    try{
        await mongoose.connect(process.env.MONGO_URL,{
            dbNAme: 'pinterest',
        });
        console.log('DB connected');
    } catch (error){
        console.log(error);
    }
};

export default connectDb;

//JavaScript is single-threaded, meaning it can only execute one task at a time. However, many operations (like connecting to a database, making API calls, or reading files) are asynchronous because they take time to complete. If JavaScript waited for these operations to finish, it would block the entire program, leading to a poor user experience.

// To handle asynchronous operations without blocking the main thread, JavaScript uses mechanisms like callbacks, Promises, and more recently, async/await.

//try-catch is specifically designed to catch runtime errors or exceptions. It ensures that if an error occurs anywhere inside the try block, the program doesn’t crash, and the error is gracefully handled in the catch block.

//Without try-catch, if an error occurs in an asynchronous operation (like mongoose.connect()), it would result in an unhandled Promise rejection, which can crash your Node.js application. try-catch ensures that all errors are caught and handled properly