import { Request, Response } from 'express';
import { User, Thought } from "../models/index";

// Get all users
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find();
        res.json({ users });  // Response is sent here, no return needed
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get a user by ID with populated thoughts and friends
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate('thoughts').populate('friends');

        if (!user) {
            res.status(404).json({ message: 'User not found' });  // Send response here
            return;  // No need to return the response object
        }

        res.json({ user });  // Send response here, no return needed
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ user });  // Send response here, no return needed
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const updateData = req.body;
        const user = await User.findOneAndUpdate({ _id: userId }, updateData, { new: true });

        if (!user) {
            res.status(404).json({ message: "User not found" });  // Send response here
            return;  // No need to return the response object
        }
        res.json({ user });  // Send response here, no return needed
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Delete user and associated thoughts
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id; // Fix here to use `_id`

        await Thought.deleteMany({ userId });

        const user = await User.findOneAndDelete({ _id: userId }); // Fix here to use `_id`

        if (!user) {
            res.status(404).json({ message: 'User not found' });  // Send response here
            return;  // No need to return the response object
        }
        res.json({ message: 'User successfully deleted' });  // Send response here
    } catch (err: any) {
        console.log(err);
        res.status(500).json({ message: err.message });  // Send error response
    }
};

// Add a friend
export const addFriend = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const friendId = req.params.friendId;

        if (!friendId || userId === friendId) {
            res.status(400).json({ message: 'Invalid friend ID' });  // Send response here
            return;  // No need to return the response object
        }

        const user = await User.findOneAndUpdate({ _id: userId }, { $addToSet: { friends: friendId } }, { new: true });

        if (!user) {
            res.status(404).json({ message: 'User not found' });  // Send response here
            return;  // No need to return the response object
        }
        res.json({ user });  // Send response here, no return needed
    } catch (err: any) {
        res.status(500).json({ message: err.message });  // Send error response
    }
};

// Delete a friend
export const deleteFriend = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const friendId = req.params.friendId;

        if (!friendId || userId === friendId) {
            res.status(400).json({ message: 'Invalid friend ID' });  // Send response here
            return;  // No need to return the response object
        }

        const user = await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } }, { new: true });

        if (!user) {
            res.status(404).json({ message: 'User not found' });  // Send response here
            return;  // No need to return the response object
        }
        res.json({ user });  // Send response here, no return needed
    } catch (err: any) {
        res.status(500).json({ message: err.message });  // Send error response
    }
};
