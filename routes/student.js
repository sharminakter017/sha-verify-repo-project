const express = require('express');
const path = require('path');
const { getAllStudent, createStudent, getSingleStudent, editStudent, createStudentStore , deleteStudent , updateStudent , getAllUnverifyedStudent , verifyAccount , verifyAccountByPhone , verifyAccountByPhoneOtpId} = require('../controllers/studentControllers');
const multer = require('multer')


//router init
const router = express.Router();

//multer config
const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,path.join(__dirname,'../public/images'))
    },
    filename : (req,file,cb) => {
        cb(null, file.originalname )
    }
});

const studentMulter = multer({

    storage : storage

}).single('photo')






//routing
router.get('/', getAllStudent)
router.get('/unverifyed', getAllUnverifyedStudent)
router.get('/create', createStudent)
router.post('/create', studentMulter,  createStudentStore)
router.get('/edit/:id', editStudent)
router.get('/verify/:token', verifyAccount)
router.get('/verifyByPhone/:id', verifyAccountByPhone)
router.post('/verifyByPhone', verifyAccountByPhoneOtpId)
// router.get('/verifyByPhoneotp/:otp', verifyAccountByPhoneOtp)
router.post('/update/:id', updateStudent)
router.get('/delete/:id', deleteStudent);
router.get('/:id', getSingleStudent)












//export router
module.exports = router;