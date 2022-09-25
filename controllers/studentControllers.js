const path = require('path');
const { readFileSync , writeFileSync } = require('fs');
const verifyAccountMail = require('../utility/sendMail')
const sendSms = require('../utility/sendSms');



//controllers
const getAllStudent = (req,res) => {

    const students = JSON.parse(readFileSync(path.join(__dirname,'../db/student.json')))

    const verifyed = students.filter(data => data.isverifyed == true && data.otp == true)
  res.render('student/index' , {
        students : verifyed
       

    });

}

//unverifyed student data
const getAllUnverifyedStudent = (req,res) => {

    const students = JSON.parse(readFileSync(path.join(__dirname,'../db/student.json')))

    const unverifyed = students.filter(data => data.isverifyed == false || data.otp == false)

    res.render('student/unverifyed' , {
        students : unverifyed
    
    });

}

const createStudent = (req,res) => {
    res.render('student/create')
}

const getSingleStudent = (req,res) => {
    const students = JSON.parse(readFileSync(path.join(__dirname,'../db/student.json')))
    const { id } = req.params;
    const student = students.find(data => data.id == id)
    

    res.render('student/show',{ student})
}

const editStudent = (req,res) => {
 const students = JSON.parse(readFileSync(path.join(__dirname,'../db/student.json')))

  const { id } = req.params;
  const edit_student = students.find(data => data.id == id)
    res.render('student/edit',{
        student : edit_student
    })
}

const createStudentStore = async (req,res) => {

    const students = JSON.parse(readFileSync(path.join(__dirname,'../db/student.json')))

    //last id create
    let last_id = 1;
    if(students.length > 0){
        last_id = students[students.length - 1].id + 1
    }

    const {name,email,cell,location} = req.body;

    const token  = Date.now() + '_' + Math.floor(Math.random() * 1000000)
    

     //sendMail
     await verifyAccountMail(email,'Verify Account', {
        name, email,token , cell
    });

    

//    student data get
    students.push({
        id       : last_id,
        name     : name,
        email    : email,
        cell     : cell,
        location : location,
        photo    : req.file ? req.file.filename : '../public/images/avatar.png',
        isverifyed : false,
        token  : token,
        otp    : false

    })

   //writefile
   writeFileSync(path.join(__dirname,'../db/student.json'), JSON.stringify(students))
  
   //redirect file data
   res.redirect('/student/unverifyed');

}



const deleteStudent = (req,res) => {
    const students = JSON.parse(readFileSync(path.join(__dirname,'../db/student.json')))
    const { id } = req.params

    const newStudent = students.filter(data => data.id != id)

    writeFileSync(path.join(__dirname,'../db/student.json'), JSON.stringify(newStudent))


    res.redirect('/student')
   
}

const updateStudent = (req,res) => {
    //get update id
    const { id } = req.params;

    //get all update student
    const students = JSON.parse(readFileSync(path.join(__dirname,'../db/student.json')));

   students[students.findIndex(data => data.id == id)] = {
     ...students[students.findIndex(data => data.id == id)],

     name     : req.body.name,
     email    : req.body.email,
     cell     : req.body.cell,
     location : req.body.location
   }

    //writefile
    writeFileSync(path.join(__dirname,'../db/student.json'), JSON.stringify(students))
    

    res.redirect('/student')


} 

//verify email account
const verifyAccount = (req,res) => {

    //student data
    const students = JSON.parse(readFileSync(path.join(__dirname,'../db/student.json')));
   

   //token email
    const token  = req.params.token

    students[students.findIndex(data => data.token == token)] = {
        ...students[students.findIndex(data => data.token == token)],
   
       isverifyed : true,
       token   : ''
      }

      //writefile
    writeFileSync(path.join(__dirname,'../db/student.json'), JSON.stringify(students))

      res.redirect('/student/unverifyed')


    
}



//verify by phone setting otp
const verifyAccountByPhone = async(req,res) => {

    const students = JSON.parse(readFileSync(path.join(__dirname,'../db/student.json')));

    const verifyStu = students.find(data => data.id == req.params.id)
   

    const otp  = Math.floor(Math.random() * 10000)


    await sendSms(verifyStu.cell, `Hii ${verifyStu.name} your OTP code is ${otp}`)

    students[students.findIndex(data => data.id == req.params.id)] = {
        ...students[students.findIndex(data => data.id == req.params.id)],
   
      otp   : otp
      }
      writeFileSync(path.join(__dirname,'../db/student.json'), JSON.stringify(students))

   res.render('student/verifybyphone')

}

const verifyAccountByPhoneOtpId = (req,res) => {
    const { otp } = req.body
    const students = JSON.parse(readFileSync(path.join(__dirname,'../db/student.json')));

    students[students.findIndex(data => data.otp == otp)] = {
        ...students[students.findIndex(data => data.otp == otp)],
   
      otp   : true
      }
      writeFileSync(path.join(__dirname,'../db/student.json'), JSON.stringify(students))

      res.redirect('/student/unverifyed')

}






//exporting
module.exports = {
    getAllStudent,
    createStudent,
    getSingleStudent,
    editStudent,
    createStudentStore,
    deleteStudent,
    updateStudent,
    getAllUnverifyedStudent,
    verifyAccount,
    verifyAccountByPhone,
    // verifyAccountByPhoneOtp,
    verifyAccountByPhoneOtpId
   
}