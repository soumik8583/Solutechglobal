from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend configuration
resend.api_key = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactFormRequest(BaseModel):
    name: str
    email: EmailStr
    reason: str
    service: str

class ContactFormResponse(BaseModel):
    id: str
    status: str
    message: str

# Routes
@api_router.get("/")
async def root():
    return {"message": "Solutech Global Consultancy API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

@api_router.post("/contact", response_model=ContactFormResponse)
async def submit_contact_form(request: ContactFormRequest):
    """Handle contact form submission - save to DB and send emails"""
    contact_id = str(uuid.uuid4())
    
    # Save to MongoDB
    contact_doc = {
        "id": contact_id,
        "name": request.name,
        "email": request.email,
        "reason": request.reason,
        "service": request.service,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.contact_submissions.insert_one(contact_doc)
    
    # Prepare email content
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h2 style="color: #0f172a; margin-bottom: 20px; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                New Contact Form Submission - Solutech Global Consultancy
            </h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569; width: 30%;">Name:</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #0f172a;">{request.name}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Email:</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #0f172a;">{request.email}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Service:</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #2563eb; font-weight: 500;">{request.service}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; font-weight: bold; color: #475569; vertical-align: top;">Reason:</td>
                    <td style="padding: 12px 0; color: #0f172a;">{request.reason}</td>
                </tr>
            </table>
            <div style="margin-top: 20px; padding: 15px; background-color: #f1f5f9; border-radius: 6px;">
                <p style="margin: 0; color: #64748b; font-size: 14px;">
                    Submitted on: {datetime.now(timezone.utc).strftime('%B %d, %Y at %I:%M %p UTC')}
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Send emails to both recipients
    recipients = ["soumikmondal723@gmail.com", "official.solutechglobal@gmail.com"]
    email_sent = False
    
    try:
        params = {
            "from": SENDER_EMAIL,
            "to": recipients,
            "subject": f"New Inquiry: {request.service} - {request.name}",
            "html": html_content
        }
        
        email_result = await asyncio.to_thread(resend.Emails.send, params)
        email_sent = True
        logger.info(f"Email sent successfully: {email_result}")
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        # Continue even if email fails - we still saved to DB
    
    return ContactFormResponse(
        id=contact_id,
        status="success",
        message="Thank you for contacting us! We will get back to you soon." if email_sent else "Form submitted successfully. Our team will contact you soon."
    )

@api_router.get("/contacts", response_model=List[dict])
async def get_contacts():
    """Get all contact submissions"""
    contacts = await db.contact_submissions.find({}, {"_id": 0}).to_list(1000)
    return contacts

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
