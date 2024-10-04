const express = require('express');
const catalystSDK = require('zcatalyst-sdk-node');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const upload = multer({ dest: 'uploads/' });

app.use((req, res, next) => {
	const catalyst = catalystSDK.initialize(req);
	res.locals.catalyst = catalyst;
	next();
});

app.get('/all', async (req, res) => {
	try {
		const { catalyst } = res.locals;
		const zcql = catalyst.zcql();
		
		const values = await zcql.executeZCQLQuery(
			`SELECT * FROM CandidateDetails`
			)
			.then((rows) =>
			rows.map((row) => ({
			candidateId: row.CandidateDetails.ROWID,
			firstName: row.CandidateDetails.FirstName,
			lastName: row.CandidateDetails.LastName,
			email: row.CandidateDetails.Email,
			dob: row.CandidateDetails.DOB,
			panNo: row.CandidateDetails.PanNo,
			phone: row.CandidateDetails.Phone,
			address: row.CandidateDetails.Address,
			status: row.CandidateDetails.IsApproved,
			resumeId: row.CandidateDetails.ResumeId
			}))
			);

		res.status(200).send({
			status: 'success',
			data: {
				values
			}
		});
	}
	catch (err) {
		//console.log(err);
		res.status(500).send({
			status: 'failure',
			message: "We're unable to process the request."
		});
	}
});

app.post('/submitCandidate', upload.single('Resume'), async (req, res) => {

	const { FirstName, LastName, Email, DOB, PanNo, Phone, Address, IsApproved } = req.body;
	//console.log(req.body)
	const candidateDoc = req.file; 
	//console.log(req.file)
	 const { catalyst } = res.locals;
	// var app = catalystSDK.initialize(req);
	// const table = app.datastore().table('CandidateDetails');
	 const table = catalyst.datastore().table('CandidateDetails');
  
	try {
	  const filestore = catalyst.filestore();
	  const filePath = path.join(__dirname, candidateDoc.path); 
	  const fileName = candidateDoc.originalname;
	  const folderId = '9618000000007969'; 

	  const fileStream = fs.createReadStream(filePath);
	  const uploadResponse = await filestore.folder(folderId).uploadFile({
		code: fileStream,
		name: fileName
	  });

	  // Clean up the temporary file after upload
	  fs.unlinkSync(filePath);

	  const ResumeId = uploadResponse.id
	  console.log(ResumeId)
	  const employeeData = {
		FirstName,
		LastName,
		Email,
		DOB,
		PanNo,
		Phone,
		Address,
		IsApproved,
		ResumeId
	  };
	  const insertedRow = await table.insertRow(employeeData);
	  
	  res.status(200).json({
		status: 'success',
		message: 'Employee details and document stored successfully!',
		data: {
		  employeeData: insertedRow,
		  fileUpload: uploadResponse
		}
	  });
	} 
	catch (error) {
	  console.error('Error storing employee details or uploading file:', error);
	  res.status(500).json({
		status: 'error',
		message: error.includes('DUPLICATE_VALUE')? 'PAN number already exists!!!' : 'Error Occurred'
	  });
	}
  });

  app.post('/UpdateStatus', async (req, res) => {
    try {
        const { candidateId, status, email,firstName } = req.body;
		
        if (!candidateId || status === undefined) {
            return res.status(400).json({
                status: 'error',
                message: 'Employee ID and status are required.'
            });
        }

        const { catalyst } = res.locals;
		//var app = catalystSDK.initialize(req);
		const table = catalyst.datastore().table('CandidateDetails');

        const rowData = {
			ROWID: candidateId,
            IsApproved: status // true or false
        };

        const t = await table.updateRow(rowData);

		if (status === true) {
            const mailService = catalyst.email();
			//console.log("Inside mail")
            const mailData = {
                from_email: 'hr.careers.abc.ltd@gmail.com',
                to_email: email,
                subject: 'Approval Notification',
                content: `Dear ${firstName},\n\nCongrats!! We are pleased to inform you that your application has been approved.\n\nBest regards,\nABC Inc.`
            };

            await mailService.sendMail(mailData);

            //console.log(`Email sent to ${email}`);
        }

        return res.status(200).json({
            status: 'success',
            message: 'Employee status updated successfully.'
        });
    }
	catch (error) {
        //console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to update employee status.'
        });
    }
});


  app.get('/download/:fileId', async (req, res) => {
	var app = catalystSDK.initialize(req); 
	const { fileId } = req.params;
  
	try {
		const filestore = app.filestore();
		//console.log(fileId);
		let folder = filestore.folder('9618000000007969'); 
		const fileName = `Resume_${fileId}.pdf`;

		let downloadFileStream = await folder.downloadFile(fileId); 
		
		res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
		res.setHeader('Content-Type', 'application/pdf');
		res.send(downloadFileStream);
		
	  } catch (error) {
		console.error('Error downloading file:', error);
		return res.status(500).json({ error: 'Error downloading the resume' });
	  }
  });

module.exports = app;