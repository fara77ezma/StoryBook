const nodemailer = require('nodemailer');
module.exports=async(email,subject,text,stauts)=>{

  try {
    const transporter=nodemailer.createTransport({
      host:process.env.HOST,
      service:process.env.SERVICE,
      port:Number(process.env.EMAIL_PORT),
      secure:Boolean(process.env.SECURE),
      auth:{
        user:process.env.USER,
        pass:process.env.PASS
      }

    });
    await transporter.sendMail({
      from:process.env.USER,
      to:email,
      subject:subject,
      text:`Hi there,
Thank you for signing up for StoryBook. Click on the link below to ${stauts}:
${text}
If you did not sign up for a StoryBook account,
you can safely ignore this email.

Best,

Farah`
    });
console.log("Email send sucessfully");

  } catch (e) {
    console.log("Email Not send");
    console.log(e);

  }
}
