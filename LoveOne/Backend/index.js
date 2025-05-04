import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import { Server } from 'socket.io';
import userRouter from './router/userRouter.js';
import connectDB from './conectdb/db.js';
import milestoneRouter from './router/milestoneRouter.js';
import http from 'http'; // Ensure this import is present for HTTP server
import chatRoutes from './router/chat.js';
import setupChatSocket from './router/chatSocket.js';
import uplodRouter from './router/uplodRouter.js';
import productRoutes from './router/productRoutes.js';
import eventplaceRoutes from './router/eventplaceRoutes.js';
import eventRoutes from './router/event.js';
const PORT = process.env.PORT || 5000;
connectDB();

const app = express();
 
// Set up middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/user', userRouter);
app.use('/api/couple-profile', milestoneRouter);
app.use('/chat', chatRoutes);
app.use('/uploads', express.static('uploads')); 
app.use('/uploads', express.static('uploads')); // serve files statically
app.use('/upload', uplodRouter ); // universal upload route
app.use('/api/products', productRoutes);
app.use('/api/eventplaces',eventplaceRoutes);
app.use('/api/events', eventRoutes);
// Create HTTP server and bind Socket.IO to it
const server = http.createServer(app); // Use createServer to attach to Socket.IO

// Initialize Socket.IO with the server
setupChatSocket(server);

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
