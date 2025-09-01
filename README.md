# OralVis Healthcare - Dental Scan Management System

A full-stack web application for managing dental scan images with role-based authentication.

## Features

- **Role-based Authentication**: Technician and Dentist roles
- **Scan Upload**: Technicians can upload patient scans with details
- **Scan Viewing**: Dentists can view all stored scans
- **PDF Reports**: Generate downloadable PDF reports for each scan
- **Cloud Storage**: Images stored in Cloudinary
- **SQLite Database**: Local database for storing scan metadata

## Tech Stack

### Backend
- Node.js + Express.js
- SQLite3 database
- JWT authentication
- Cloudinary for image storage
- Multer for file uploads
- PDFKit for PDF generation

### Frontend
- React.js with Vite
- React Router for navigation
- Axios for API calls
- CSS3 for styling

## Project Structure
oralvis-healthcare/
├── backend/ # Node.js Express server
├── frontend/ # React.js frontend
├── .gitignore # Git ignore rules
└── README.md # Project documentation

text

## Installation & Setup

### Backend Setup
bash
cd backend
npm install
cp .env.example .env  # Add your actual environment variables
npm run dev
Frontend Setup
bash
cd frontend
npm install
npm run dev
Environment Variables
Create a .env file in the backend directory:

.env
PORT = 5000
JWT_SECRET = "hello_oralvis"
CLOUDINARY_CLOUD_NAME = "dh4zrkrxf"
CLOUDINARY_API_KEY = "364198796783161"
CLOUDINARY_API_SECRET = "EnaZfe1tGmiD7GESCtnF8TNAKwE"

API Endpoints
POST /api/auth/register - User registration

POST /api/auth/login - User login

POST /api/scans/upload - Upload scan (Technician only)

GET /api/scans - Get all scans (Dentist only)

GET /api/pdf/:id - Download PDF report (Dentist only)

Usage
Register as a Technician or Dentist

Login with your credentials

Technicians: Upload patient scans with images

Dentists: View scans and download PDF reports


![image alt](https://github.com/Srinivas09199/oralvis-healthcare/blob/81446521fe622c1f9932d5fb9994071c1e509d1d/Screenshot%20(9).png)

![image alt](https://github.com/Srinivas09199/oralvis-healthcare/blob/3fc038183ab028628af866107647c4d87ed2b85a/Screenshot%20(14).png)
