// Email service for handling chatbot messages
// This is a frontend structure - you'll need to integrate with your preferred email service

import emailjs from '@emailjs/browser';

interface EmailMessage {
  name: string;
  email: string;
  message: string;
  timestamp: Date;
}

export class EmailService {
  private static instance: EmailService;
  private apiEndpoint: string;
  private targetEmail: string;

  private constructor() {
    // Replace with your actual email service endpoint
    this.apiEndpoint = '/api/send-email';
    this.targetEmail = 'harikarthikselvam@gmail.com';
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendMessage(data: Omit<EmailMessage, 'timestamp'>): Promise<boolean> {
    try {
      const message: EmailMessage = {
        ...data,
        timestamp: new Date(),
      };

      // For production, you would replace this with actual email service integration
      // Options include:
      // 1. EmailJS (client-side email service)
      // 2. Netlify Forms (if deploying to Netlify)
      // 3. Custom backend with Nodemailer
      // 4. Third-party services like SendGrid, Mailgun, etc.

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...message,
          to_email: this.targetEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // EmailJS integration (client-side) - Recommended for easy setup
  async sendWithEmailJS(data: Omit<EmailMessage, 'timestamp'>): Promise<boolean> {
    try {
      // Initialize EmailJS with your public key
      // You'll need to replace these with your actual EmailJS credentials
      emailjs.init("YOUR_PUBLIC_KEY");
      
      // Send email to harikarthikselvam@gmail.com
      const result = await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        {
          from_name: data.name,
          from_email: data.email,
          message: data.message,
          to_email: 'harikarthikselvam@gmail.com',
          reply_to: data.email,
        }
      );
      
      console.log('Email sent successfully to harikarthikselvam@gmail.com:', result);
      return true;
    } catch (error) {
      console.error('Error sending email with EmailJS:', error);
      return false;
    }
  }

  // Netlify Forms integration (if deploying to Netlify)
  async sendWithNetlifyForms(data: Omit<EmailMessage, 'timestamp'>): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append('form-name', 'contact');
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('message', data.message);
      formData.append('to_email', this.targetEmail);

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(),
      });

      if (!response.ok) {
        throw new Error('Failed to send email via Netlify Forms');
      }

      console.log('Email sent successfully to harikarthikselvam@gmail.com via Netlify Forms');
      return true;
    } catch (error) {
      console.error('Error sending email with Netlify Forms:', error);
      return false;
    }
  }

  // Get target email for display purposes
  getTargetEmail(): string {
    return this.targetEmail;
  }
}

export default EmailService;