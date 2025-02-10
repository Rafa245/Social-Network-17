import { Router } from 'express';
const router = Router();
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend
} from '../../controllers/userController.js';

// Route to get all users and create a new user
router.route('/')
  .get(getAllUsers)  // Get all users
  .post(createUser); // Create a new user

// Route for individual user operations (get, update, delete)
router.route('/:id')
  .get(getUserById)   // Get user by ID
  .put(updateUser)    // Update user by ID
  .delete(deleteUser); // Delete user by ID

// Route for adding and deleting friends
router.route('/:id/friend/:friendId')
  .post(addFriend)    // Add friend to user
  .delete(deleteFriend); // Delete friend from user

export { router as usersRoutes };
