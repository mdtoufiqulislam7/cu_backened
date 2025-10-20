const pool = require("../config/db");
const nodemailer = require('nodemailer');

// Initialize Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send approval email with ticket
const sendApprovalEmail = async (email, userName, paymentId, registrationData) => {
  try {
    console.log('📧 Starting email send process...');
    console.log('Email parameters:', { email, userName, paymentId, registrationData });
    
    // Generate ticket ID using first part of registration ID (UUID) or fallback to timestamp
    let ticketId;
    if (registrationData.id && typeof registrationData.id === 'string' && registrationData.id.includes('-')) {
      const registrationIdFirstPart = registrationData.id.split('-')[0];
      ticketId = `TKT-${registrationIdFirstPart}`;
    } else {
      // Fallback if registrationData.id is null or invalid
      ticketId = `TKT-${Date.now().toString().slice(-8)}`;
    }
    const currentDate = new Date();
    const eventDate = new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days from now
    
    console.log('Generated ticket ID:', ticketId);
    console.log('Event date:', eventDate.toLocaleDateString());
    
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Ticket - Burnerz Adventure Camp</title>
        <style>
          @media print {
            .no-print { display: none !important; }
            .ticket { page-break-inside: avoid; }
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          
          .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .ticket {
            border: 3px solid #28a745;
            border-radius: 15px;
            padding: 30px;
            margin: 20px 0;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            position: relative;
            overflow: hidden;
          }
          
          .ticket::before {
            content: '';
            position: absolute;
            top: -50px;
            right: -50px;
            width: 100px;
            height: 100px;
            background: #28a745;
            border-radius: 50%;
            opacity: 0.1;
          }
          
          .ticket::after {
            content: '';
            position: absolute;
            bottom: -30px;
            left: -30px;
            width: 60px;
            height: 60px;
            background: #28a745;
            border-radius: 50%;
            opacity: 0.1;
          }
          
          .ticket-header {
            text-align: center;
            margin-bottom: 30px;
            position: relative;
            z-index: 1;
          }
          
          .event-title {
            font-size: 32px;
            font-weight: bold;
            color: #28a745;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
          }
          
          .ticket-subtitle {
            font-size: 18px;
            color: #6c757d;
            margin: 10px 0;
          }
          
          .ticket-id {
            background: #28a745;
            color: white;
            padding: 8px 20px;
            border-radius: 25px;
            font-weight: bold;
            display: inline-block;
            margin: 10px 0;
          }
          
          .ticket-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin: 30px 0;
            position: relative;
            z-index: 1;
          }
          
          .ticket-section {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .ticket-section h3 {
            color: #28a745;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 18px;
            border-bottom: 2px solid #28a745;
            padding-bottom: 5px;
          }
          
          .ticket-field {
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .ticket-field-label {
            font-weight: bold;
            color: #495057;
          }
          
          .ticket-field-value {
            color: #28a745;
            font-weight: 600;
          }
          
          .qr-placeholder {
            width: 120px;
            height: 120px;
            background: #f8f9fa;
            border: 2px dashed #28a745;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px auto;
            font-size: 12px;
            color: #6c757d;
            text-align: center;
          }
          
          .download-section {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: #e8f5e8;
            border-radius: 10px;
            border: 2px solid #28a745;
          }
          
          .download-btn {
            background: #28a745;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin: 10px;
            transition: all 0.3s ease;
          }
          
          .download-btn:hover {
            background: #218838;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          }
          
          .ticket-footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #28a745;
            color: #6c757d;
            font-size: 14px;
          }
          
          .contact-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: center;
          }
          
          .contact-info h4 {
            color: #28a745;
            margin-bottom: 15px;
          }
          
          .no-print {
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            color: #856404;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="ticket">
            <div class="ticket-header">
              <h1 class="event-title">🏕️ BURNERZ ADVENTURE CAMP</h1>
              <p class="ticket-subtitle">Official Event Ticket</p>
              <div class="ticket-id">Ticket ID: ${ticketId}</div>
            </div>
            
            <div class="ticket-content">
              <div class="ticket-section">
                <h3>👤 Participant Details</h3>
                <div class="ticket-field">
                  <span class="ticket-field-label">Name:</span>
                  <span class="ticket-field-value">${userName}</span>
                </div>
                <div class="ticket-field">
                  <span class="ticket-field-label">Email:</span>
                  <span class="ticket-field-value">${email}</span>
                </div>
                <div class="ticket-field">
                  <span class="ticket-field-label">Club:</span>
                  <span class="ticket-field-value">${registrationData.bick_club_name || 'N/A'}</span>
                </div>
                <div class="ticket-field">
                  <span class="ticket-field-label">Gender:</span>
                  <span class="ticket-field-value">${registrationData.gender || 'N/A'}</span>
                </div>
              </div>
              
              <div class="ticket-section">
                <h3>🎫 Event Details</h3>
                <div class="ticket-field">
                  <span class="ticket-field-label">Event:</span>
                  <span class="ticket-field-value">Burnerz Adventure Camp</span>
                </div>
                <div class="ticket-field">
                  <span class="ticket-field-label">Date:</span>
                  <span class="ticket-field-value">${eventDate.toLocaleDateString()}</span>
                </div>
                <div class="ticket-field">
                  <span class="ticket-field-label">Amount:</span>
                  <span class="ticket-field-value">৳${registrationData.amount || '1260'}</span>
                </div>
                <div class="ticket-field">
                  <span class="ticket-field-label">Status:</span>
                  <span class="ticket-field-value" style="color: #28a745; font-weight: bold;">✅ CONFIRMED</span>
                </div>
              </div>
            </div>
            
            <div class="ticket-footer">
              <p><strong>Transaction ID:</strong> ${paymentId}</p>
              <p><strong>Issued Date:</strong> ${currentDate.toLocaleDateString()}</p>
              <p><em>This ticket is valid for entry to the event. Please present this ticket at the venue.</em></p>
            </div>
          </div>
          
          <div class="no-print">
            <p><strong>📱 Mobile Users:</strong> You can also take a screenshot of the ticket above for easy access at the event.</p>
          </div>
          
          <div class="contact-info">
            <h4>📞 Contact Information</h4>
            <p><strong>🏕️ Road Burnerz Club</strong></p>
            <p><strong>👤 Ashraful Hasib - Registration committee (RBC)</strong></p>
            <p><strong>📞 01629253127 </strong></p>
            <p><strong>📧 For any queries, contact us at the above number</strong></p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d; font-size: 14px;">
            <p>Thank you for choosing Burnerz Adventure Camp!</p>
            <p>© ${new Date().getFullYear()} Team Phonex. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🎉 Payment Approved - Transaction Complete',
      html: emailTemplate,
    };

    console.log('📤 Sending email with options:', {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🎉 Payment Approved - Transaction Complete'
    });

    console.log('🔧 Email transporter config:', {
      host: transporter.options.host,
      port: transporter.options.port,
      secure: transporter.options.secure,
      auth: {
        user: transporter.options.auth?.user,
        pass: transporter.options.auth?.pass ? '***hidden***' : 'NOT SET'
      }
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    console.log('📧 Email response:', info);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

// Create is_approved entry and send email
const createIsApproved = async (data) => {
  try {
    const { payment_id, approved } = data;
    
    console.log('🔧 Starting createIsApproved with:', { payment_id, approved });
    
    // First, get registration details using payment_id
    const registrationResult = await pool.query(`
      SELECT 
        r.*,
        r.name as name,
        r.email as email,
        r.transaction_id as transaction_id
      FROM registation r
      WHERE r.id = $1
    `, [payment_id]);
    
    if (registrationResult.rows.length === 0) {
      throw new Error('Registration not found');
    }
    
    const registration = registrationResult.rows[0];
    console.log('📊 Found registration:', { id: registration.id, name: registration.name, email: registration.email });
    
    // Create is_approved entry
    const result = await pool.query(
      `INSERT INTO is_approved (payment_id, approved)
       VALUES ($1, $2) RETURNING *`,
      [payment_id, approved]
    );
    
    console.log('✅ Created is_approved entry:', result.rows[0]);
    
    // Initialize emailSent variable
    let emailSent = false;
    
    // If approved is true, update registration payment_status to 'success' and send email
    if (approved) {
      console.log('🔄 Updating payment_status to success...');
      
      // Update registration payment_status to 'success'
      await pool.query(
        `UPDATE registation SET payment_status = 'success', updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1`,
        [payment_id]
      );
      
      console.log('✅ Payment status updated to success');
      
      // Send email if email exists
      if (registration.email) {
        try {
          console.log('📧 Attempting to send email to:', registration.email);
          console.log('📊 Registration data:', {
            name: registration.name,
            transaction_id: registration.transaction_id,
            email: registration.email
          });
          
          const emailResult = await sendApprovalEmail(registration.email, registration.name, registration.transaction_id, registration);
          console.log(`✅ Approval email sent successfully to ${registration.email}`);
          console.log('📧 Email result:', emailResult);
          emailSent = true;
        } catch (emailError) {
          console.error('❌ Email sending failed:', emailError.message);
          console.error('📧 Full email error:', emailError);
          emailSent = false;
          // Don't throw error here, just log it - the approval record should still be created
        }
      } else {
        console.log('⚠️ No email address found for registration');
        emailSent = false;
      }
    }
    
    const finalResult = {
      ...result.rows[0],
      registration_details: registration,
      email_sent: emailSent
    };
    
    console.log('🎉 Returning final result:', finalResult);
    return finalResult;
    
  } catch (error) {
    console.error('💥 Error in createIsApproved service:', error);
    throw error;
  }
};

// Get all is_approved entries
const getAllIsApproved = async () => {
  const result = await pool.query(`
    SELECT 
      ia.*,
      r.id as ticket_id ,
      r.transaction_id,
      r.payment_status,
      r.payment_picture,
      r.t_size,
      r.name as registrant_name,
      r.email as registrant_email,
      r.contact_number as registrant_phone
    FROM is_approved ia
    LEFT JOIN registation r ON ia.payment_id = r.id
    ORDER BY ia.created_at DESC
  `);
  return result.rows;
};

// Get is_approved by ID
const getIsApprovedById = async (id) => {
  const result = await pool.query(`
    SELECT 
      ia.*,
      r.transaction_id,
      r.payment_status,
      r.payment_picture,
      r.name as registrant_name,
      r.email as registrant_email,
      r.contact_number as registrant_phone
    FROM is_approved ia
    LEFT JOIN registation r ON ia.payment_id = r.id
    WHERE ia.id = $1
  `, [id]);
  return result.rows[0];
};

// Update is_approved status
const updateIsApproved = async (id, approved) => {
  const result = await pool.query(
    "UPDATE is_approved SET approved = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
    [approved, id]
  );
  return result.rows[0];
};

// Delete is_approved entry
const deleteIsApproved = async (id) => {
  const result = await pool.query("DELETE FROM is_approved WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};

module.exports = {
  createIsApproved,
  getAllIsApproved,
  getIsApprovedById,
  updateIsApproved,
  deleteIsApproved,
  sendApprovalEmail
};
