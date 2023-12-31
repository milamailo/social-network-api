const router = require('express').Router();
const {
    getUsers, getSingleUser, createUser, updateUser, deleteUser, createFriend, deleteFriend
} = require('../../controllers/userController');

router.route('/').get(getUsers).post(createUser);
router.route('/:userId').get(getSingleUser).delete(deleteUser).put(updateUser);
router.route('/:userId/friends').post(createFriend).delete(deleteFriend);

module.exports = router;