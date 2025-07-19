# SRIHARI's Modern 3D Portfolio

A stunning, modern portfolio website built with React, Vite, and SWC for optimal performance. Features a beautiful 3D purple theme with advanced animations and an interactive chatbot.

## Features

- **Modern 3D Design**: Beautiful purple gradient theme with 3D effects and animations
- **Fast Performance**: Built with Vite + SWC for lightning-fast development and build times
- **Responsive Design**: Fully responsive across all devices
- **Interactive Chatbot**: Contact form with email integration
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Professional Layout**: Clean, modern design suitable for professional use

## Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **SWC** - Super fast compiler
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

## Personal Information

**Name**: SRIHARI  
**Education**: B.Tech Computer Science Engineering (AI/ML Specialization)  
**University**: SRM University, Ramapuram Campus, Chennai  
**Year**: 2nd Year  
**LinkedIn**: [https://www.linkedin.com/in/srihari-k-8275852a2/](https://www.linkedin.com/in/srihari-k-8275852a2/)  
**Contact Email**: harikarthikselvam@gmail.com  

### Experience

- **Volunteer Educator** at Agoura Math Circle - Teaching Mobile App Development
- **Technology Team Lead** at Agoura Math Circle - Leading technical initiatives
- **React Developer** - Building modern web applications

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd srihari-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Email Integration Setup

To enable the chatbot email functionality to send messages to **harikarthikselvam@gmail.com**, you have several options:

### Option 1: EmailJS (Recommended for client-side)
1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Install EmailJS: `npm install @emailjs/browser`
3. Create an email template that sends to harikarthikselvam@gmail.com
4. Configure your email service in the EmailService.ts file
5. Update the sendWithEmailJS method with your service ID and template ID

**Template Variables to include:**
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{message}}` - Message content
- `{{to_email}}` - Set to harikarthikselvam@gmail.com

### Option 2: Netlify Forms (If deploying to Netlify)
1. Add `netlify` attribute to your form
2. Configure form handling in Netlify dashboard to forward to harikarthikselvam@gmail.com
3. Set up email notifications in Netlify to forward form submissions

### Option 3: Custom Backend
1. Create a backend API endpoint for email sending
2. Use services like Nodemailer, SendGrid, or Mailgun
3. Configure to send emails to harikarthikselvam@gmail.com
4. Update the apiEndpoint in EmailService.ts

### Quick Setup with EmailJS:

1. **Create EmailJS Account**: Go to [emailjs.com](https://www.emailjs.com/) and sign up
2. **Add Email Service**: Connect your Gmail account or use EmailJS's default service
3. **Create Email Template**: 
   ```
   Subject: New Portfolio Contact from {{from_name}}
   
   From: {{from_name}} ({{from_email}})
   
   Message:
   {{message}}
   ```
4. **Set Recipient**: Set the template to send to harikarthikselvam@gmail.com
5. **Get Credentials**: Copy your Service ID, Template ID, and Public Key
6. **Update Code**: Uncomment and configure the EmailJS code in EmailService.ts
## Customization

### Colors
The color scheme uses purple gradients. To customize:
- Edit the Tailwind classes in components
- Update the gradient colors in the CSS

### Content
- Update personal information in the About section
- Modify experience details in the Experience section
- Add or remove skills in the Skills section

### Animations
- Modify animation classes in index.css
- Adjust transition durations in component styles

## Performance Optimization

- **Vite + SWC**: Ultra-fast builds and hot module replacement
- **Lazy Loading**: Components load only when needed
- **Optimized Images**: Use WebP format for better compression
- **Code Splitting**: Automatic code splitting for better performance

## Deployment

### Netlify (Recommended)
1. Connect your repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

### Other Platforms
- **Vercel**: Similar setup to Netlify
- **GitHub Pages**: Use `gh-pages` package
- **Traditional Hosting**: Upload the `dist` folder

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

- **LinkedIn**: [https://www.linkedin.com/in/srihari-k-8275852a2/](https://www.linkedin.com/in/srihari-k-8275852a2/)
- **Email**: srihari@example.com
- **Email**: harikarthikselvam@gmail.com
- **Website**: [Your Portfolio URL]

---

Built with ❤️ using React, Vite, and modern web technologies.