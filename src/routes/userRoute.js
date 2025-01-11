const express = require('express');
const {loginUser, registerUser, getAllUsers, updateUser, deleteUser, verifyEmail } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/login', loginUser);
router.post('/register', registerUser);
router.get("/verify-email", verifyEmail);

router.get('/',authMiddleware, getAllUsers);
router.put('/:id',authMiddleware, updateUser);
router.delete('/:id',authMiddleware, deleteUser);

module.exports = router;
