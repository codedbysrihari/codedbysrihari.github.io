//@ts-nocheck
import emailjs from '@emailjs/browser';

class EmailService {
  static instance = null;
  targetEmail = 'harikarthikselvam@gmail.com';

  static getInstance() {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendWithEmailJS(data) {
    try {
      // Initialize EmailJS (only needed once, usually in your app entry point)
      emailjs.init('YOUR_PUBLIC_KEY'); // Optional if using send method

      const result = await emailjs.send(
        'service_702otvf',    // Replace with your EmailJS Service ID
        'template_dhvcydm',   // Replace with your EmailJS Template ID
        {
          from_name: data.name,
          from_email: data.email,
          message: data.message,
          to_email: this.targetEmail,
          reply_to: data.email,
        },
        'hecqoteKksVndXBXs'     // Replace with your EmailJS Public Key
      );

      console.log('Email sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Error sending email with EmailJS:', error);
      return false;
    }
  }

  getTargetEmail() {
    return this.targetEmail;
  }
}

export default EmailService;