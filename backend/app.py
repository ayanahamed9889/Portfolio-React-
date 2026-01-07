"""
AYAN Portfolio - Contact Form API Only
Simple Flask API for contact form submissions
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow all origins for simplicity

# Database setup
def setup_database():
    """Create database and table if not exists"""
    conn = sqlite3.connect('contacts.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            ip_address TEXT
        )
    ''')
    
    conn.commit()
    conn.close()
    print("✅ Database setup completed")

# Initialize database
setup_database()

def get_db():
    """Get database connection"""
    conn = sqlite3.connect('contacts.db')
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    return conn

# ========== API ENDPOINTS ==========

@app.route('/')
def home():
    """Homepage - API documentation"""
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Contact Form API</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            code { background: #e0e0e0; padding: 2px 5px; border-radius: 3px; }
        </style>
    </head>
    <body>
        <h1>📞 Contact Form API</h1>
        <p>Simple API for handling contact form submissions.</p>
        
        <div class="endpoint">
            <h3>POST /api/contact</h3>
            <p>Submit a contact form message</p>
            <p><strong>Request Body (JSON):</strong></p>
            <code>
            {
                "name": "John Doe",
                "email": "john@example.com",
                "subject": "Hello",
                "message": "Your portfolio is amazing!"
            }
            </code>
        </div>
        
        <div class="endpoint">
            <h3>GET /api/contacts</h3>
            <p>Get all contact messages (for admin)</p>
            <p><strong>Query Parameter:</strong> ?password=YOUR_PASSWORD</p>
        </div>
        
        <div class="endpoint">
            <h3>GET /api/health</h3>
            <p>Check API health status</p>
        </div>
        
        <p><strong>Status:</strong> <span style="color: green;">✅ Running</span></p>
        <p><strong>Database:</strong> contacts.db (SQLite)</p>
    </body>
    </html>
    '''

@app.route('/api/health', methods=['GET'])
def health_check():
    """Check if API is running"""
    return jsonify({
        "status": "healthy",
        "service": "contact-form-api",
        "timestamp": datetime.now().isoformat(),
        "message": "API is running successfully"
    })

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    """
    Handle contact form submission
    Expected JSON:
    {
        "name": "string",
        "email": "string", 
        "subject": "string",
        "message": "string"
    }
    """
    try:
        # Get JSON data from request
        data = request.json
        
        # Check if JSON exists
        if not data:
            return jsonify({
                "error": "No data provided",
                "message": "Please send JSON data"
            }), 400
        
        # Validate required fields
        required_fields = ['name', 'email', 'subject', 'message']
        missing_fields = []
        
        for field in required_fields:
            if field not in data or not str(data[field]).strip():
                missing_fields.append(field)
        
        if missing_fields:
            return jsonify({
                "error": "Missing required fields",
                "missing": missing_fields,
                "message": f"Please provide: {', '.join(missing_fields)}"
            }), 400
        
        # Basic email validation
        email = str(data['email']).strip()
        if '@' not in email or '.' not in email:
            return jsonify({
                "error": "Invalid email",
                "message": "Please provide a valid email address"
            }), 400
        
        # Get client IP address
        ip_address = request.remote_addr
        
        # Save to database
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO contacts (name, email, subject, message, ip_address)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            str(data['name']).strip(),
            email,
            str(data['subject']).strip(),
            str(data['message']).strip(),
            ip_address
        ))
        
        conn.commit()
        contact_id = cursor.lastrowid
        conn.close()
        
        # Print to console for debugging
        print(f"📧 New contact received:")
        print(f"   ID: {contact_id}")
        print(f"   Name: {data['name']}")
        print(f"   Email: {data['email']}")
        print(f"   Subject: {data['subject']}")
        print(f"   IP: {ip_address}")
        print(f"   Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Success response
        return jsonify({
            "success": True,
            "message": "Thank you for your message! I will get back to you soon.",
            "data": {
                "id": contact_id,
                "name": data['name'],
                "email": data['email'],
                "subject": data['subject']
            },
            "timestamp": datetime.now().isoformat()
        }), 201
        
    except Exception as e:
        print(f"❌ Error processing contact: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "message": "Something went wrong. Please try again later."
        }), 500

@app.route('/api/contacts', methods=['GET'])
def get_contacts():
    """
    Get all contact messages (protected with simple password)
    Usage: /api/contacts?password=YOUR_PASSWORD
    """
    try:
        # Simple password protection
        password = request.args.get('password', '')
        correct_password = os.getenv('ADMIN_PASSWORD', 'admin123')
        
        if password != correct_password:
            return jsonify({
                "error": "Unauthorized",
                "message": "Invalid password"
            }), 401
        
        # Get all contacts from database
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, name, email, subject, message, timestamp, ip_address
            FROM contacts 
            ORDER BY timestamp DESC
        ''')
        
        contacts = []
        for row in cursor.fetchall():
            contacts.append(dict(row))
        
        conn.close()
        
        return jsonify({
            "success": True,
            "count": len(contacts),
            "contacts": contacts
        })
        
    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "Failed to fetch contacts"
        }), 500

@app.route('/api/contacts/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    """Delete a specific contact message"""
    try:
        password = request.args.get('password', '')
        correct_password = os.getenv('ADMIN_PASSWORD', 'admin123')
        
        if password != correct_password:
            return jsonify({
                "error": "Unauthorized",
                "message": "Invalid password"
            }), 401
        
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM contacts WHERE id = ?', (contact_id,))
        deleted = cursor.rowcount > 0
        
        conn.commit()
        conn.close()
        
        if deleted:
            return jsonify({
                "success": True,
                "message": f"Contact {contact_id} deleted successfully"
            })
        else:
            return jsonify({
                "error": "Not found",
                "message": f"Contact {contact_id} not found"
            }), 404
            
    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "Failed to delete contact"
        }), 500

# ========== RUN APPLICATION ==========

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    
    print("\n" + "="*50)
    print("📞 CONTACT FORM API STARTED")
    print("="*50)
    print(f"🌐 Local URL: http://localhost:{port}")
    print(f"📧 Submit form: http://localhost:{port}/api/contact")
    print(f"🔧 Health check: http://localhost:{port}/api/health")
    print(f"🔐 View messages: http://localhost:{port}/api/contacts?password=admin123")
    print("="*50)
    print("💡 To change password, set ADMIN_PASSWORD in .env file")
    print("="*50 + "\n")
    
    # Run the app
    app.run(host='0.0.0.0', port=port, debug=True)