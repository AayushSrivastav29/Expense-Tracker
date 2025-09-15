# Expense Tracker Pro

![Expense Tracker Screenshot](/public/images/logo.webp)

A full-stack expense tracking application with premium features, built with Node.js, Express, MySQL, and vanilla JavaScript.

## ✨ Features

### Core Functionality
- 📝 Add, edit, and delete expenses
- 🔐 User authentication (JWT)
- 📊 Expense categorization
- 📅 Date-based filtering
- 🔢 Pagination

### Premium Features (💰 Subscription Required)
- 💳 Payment integration (Cashfree)
- 📥 Excel export functionality
- 📈 Advanced analytics
- 🗓 Monthly/yearly reports

### Technical Highlights
- 🚀 AWS-hosted (EC2 + RDS + S3)
- 📦 Sequelize ORM
- 📝 Winston logging
- 🔄 Real-time updates
- 📱 Responsive design

## 🛠 Tech Stack

**Frontend:**  
- HTML5, CSS3, JavaScript (ES6+)  
- Bootstrap 5  
- Axios for HTTP requests  

**Backend:**  
- Node.js  
- Express.js  
- JSON Web Tokens (JWT)  
- Sequelize (MySQL)  
- Winston (logging)  

**Infrastructure:**  
- AWS EC2 (Hosting)  
- Amazon RDS (MySQL Database)  
- S3 (File Storage)  
- CloudFront (CDN)  

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)  
- MySQL (v5.7+)  
- AWS account (for deployment)  

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AayushSrivastav29/Expense-Tracker.git
   cd expense-tracker-pro
   ```

2. Install dependencies:
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your credentials.

4. Database setup:
   ```bash
   npx sequelize db:create
   npx sequelize db:migrate
   ```

### Running Locally
```bash
# Start backend
npm start

# Start frontend (in another terminal)
cd client && npm run dev
```

Visit `http://localhost:3000` in your browser.

## 🌐 Deployment

### AWS Setup
1. Launch EC2 instance (Ubuntu 20.04 LTS)
2. Configure RDS MySQL database
3. Set up S3 bucket for file storage
4. Configure environment variables in AWS Systems Manager

### Deployment Commands
```bash
# Build production assets
npm run build

# Deploy using PM2
pm2 start index.js --name expense-tracker
```

## 🛡 Security Features

- JWT authentication
- Password hashing (bcrypt)
- CSRF protection
- Rate limiting
- Input sanitization
- Secure HTTP headers
- Daily log rotation

## 📈 Future Roadmap

- [ ] Mobile app (React Native)
- [ ] Email/SMS notifications
- [ ] Multi-currency support
- [ ] Budget tracking
- [ ] Receipt scanning (OCR)

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 LINK

Website link: https://expense-tracker-qcaa.onrender.com
