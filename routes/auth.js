var express = require('express');
var router = express.Router();
let userController = require('../controllers/users')
let { RegisterValidator, changePasswordValidator, handleResultValidator } = require('../utils/validatorHandler')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let fs = require('fs')
let {checkLogin} = require('../utils/authHandler')
/* GET home page. */
router.post('/register', RegisterValidator, handleResultValidator, async function (req, res, next) {
    let newUser = userController.CreateAnUser(
        req.body.username,
        req.body.password,
        req.body.email,
        "69aa8360450df994c1ce6c4c"
    );
    await newUser.save()
    res.send({
        message: "dang ki thanh cong"
    })
});
router.post('/login', async function (req, res, next) {
    let { username, password } = req.body;
    let getUser = await userController.FindByUsername(username);
    if (!getUser) {
        res.status(403).send("tai khoan khong ton tai")
    } else {
        if (getUser.lockTime && getUser.lockTime > Date.now()) {
            res.status(403).send("tai khoan dang bi ban");
            return;
        }
        if (bcrypt.compareSync(password, getUser.password)) {
            await userController.SuccessLogin(getUser);
            const privateKey = fs.readFileSync('private.pem', 'utf8');
            let token = jwt.sign({
                id: getUser._id
            }, privateKey, {
                algorithm: 'RS256',
                expiresIn: '30d'
            })
            res.send(token)
        } else {
            await userController.FailLogin(getUser);
            res.status(403).send("thong tin dang nhap khong dung")
        }
    }

});
router.get('/me',checkLogin,function(req,res,next){
    res.send(req.user)
})
router.put('/changepassword', checkLogin, changePasswordValidator, handleResultValidator, async function (req, res, next) {
    try {
        let user = req.user;
        let { oldPassword, newPassword } = req.body;

        // Check if old password is correct
        if (!bcrypt.compareSync(oldPassword, user.password)) {
            return res.status(400).send({ message: "Old password is incorrect" });
        }

        // Hash new password
        let hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update user password
        await user.updateOne({ password: hashedNewPassword });

        res.send({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
});


module.exports = router;
