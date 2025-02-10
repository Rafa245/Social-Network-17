import { Request, Response } from 'express';
import { User, Thought } from "../models/index";

// Get all thoughts
export const getAllThoughts = async (_req: Request, res: Response): Promise<void> => {
    try {
        const thoughts = await Thought.find();
        res.json({ thoughts });  // Send the response, no return value needed.
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Get a single thought by ID
export const getThoughtById = async (req: Request, res: Response): Promise<void> => {
    try {
        const thoughtId = req.params.thoughtId;
        const thought = await Thought.findById(thoughtId);

        if (!thought) {
            res.status(404).json({ message: 'Thought not found' });  // Send response here
            return; // Ensure function ends after sending the response
        }

        res.json({ thought });  // Send response here, no return value needed
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Create a new thought
export const createThought = async (req: Request, res: Response): Promise<void> => {
    try {
        const newThought = await Thought.create(req.body);
        const userId = req.body.id;
        const user = await User.findOneAndUpdate(
            { _id: userId }, 
            { $push: { thoughts: newThought._id } }, 
            { new: true }
        );

        if (!user) {
            res.status(404).json({ message: "User not found" });  // Send response here
            return;
        }

        res.status(201).json({ newThought, user });  // Send response here, no return value needed
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

// Update a thought
export const updateThought = async (req: Request, res: Response): Promise<void> => {
    try {
        const thoughtId = req.params.thoughtId;
        const updateData = req.body;
        const thought = await Thought.findByIdAndUpdate(thoughtId, updateData, { new: true });

        if (!thought) {
            res.status(404).json({ message: "Thought not found" });  // Send response here
            return;
        }

        res.json({ thought });  // Send response here, no return value needed
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

// Delete a thought
export const deleteThought = async (req: Request, res: Response): Promise<void> => {
    try {
        const thoughtId = req.params.thoughtId;
        const thought = await Thought.findOneAndDelete({ _id: thoughtId });

        if (!thought) {
            res.status(404).json({ message: 'Thought does not exist' });  // Send response here
            return;
        }

        res.json({ message: 'Thought successfully deleted' });  // Send response here, no return value needed
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

// Add a reaction to a thought
export const addReaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const thoughtId = req.params.thoughtId;
        const thought = await Thought.findOneAndUpdate(
            { _id: thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        );

        if (!thought) {
            res.status(404).json({ message: 'No thought with this ID exists' });  // Send response here
            return;
        }

        res.json({ thought });  // Send response here, no return value needed
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

// Remove a reaction from a thought
export const removeReaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const thoughtId = req.params.thoughtId;
        const reactionId = req.params.reactionId;
        const thought = await Thought.findOneAndUpdate(
            { _id: thoughtId },
            { $pull: { reactions: { reactionId } } },
            { runValidators: true, new: true }
        );

        if (!thought) {
            res.status(404).json({ message: 'No thought with this id exists' });  // Send response here
            return;
        }

        res.json({ message: 'Reaction successfully deleted' });  // Send response here, no return value needed
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}
