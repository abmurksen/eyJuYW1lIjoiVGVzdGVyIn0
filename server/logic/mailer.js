var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");


var smtpTransport = nodemailer.createTransport(smtpTransport({
    host : 'smtp.gmail.com',
    secureConnection : false,
    port: 465,
    auth : {
        user : 'grachstk@gmail.com',
        pass : 'kpacubo2016!'
    },
    tls: {
        rejectUnauthorized: false
    }
}));

var mailOptions={
        from : 'grachstk@gmail.com',
        to : 'egri4stk@gmail.com',
        subject : 'Your Subject',
        text : 'Your Text',
        html : 'HTML GENERATED'
    };
function sendMail(options){
     smtpTransport.sendMail(options, function(error, response){
            if(error){
                console.log(error);
                
            }else{
                console.log("Message sent: " + response.message);
               
            }
        });
}

function sendMails(people,options){
     people.forEach(function(element){
        options.to = element;
             smtpTransport.sendMail(options, function(error, response){
                if(error){
                     console.log(error);
                
                }else{
                    console.log("Message sent: " + response.message);
               
                }
             });
     });
    
}

module.exports.sendMail = sendMail;
module.exports.sendMails = sendMails;
       
   

