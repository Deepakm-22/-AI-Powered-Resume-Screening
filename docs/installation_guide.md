# Installation and Setup Guide

This guide details the step-by-step instructions required to set up and run the AI Resume Screener project locally.

## System Prerequisites
* **Python**: Python 3.8 to 3.11 installed. Verify using:
  ```bash
  python --version
  ```
* **Pip**: Python package manager. Verify using:
  ```bash
  pip --version
  ```

---

## Step 1: Clone or Set Up Project Directory
Create a project folder (or clone from your repository) and navigate into it:
```bash
mkdir ai_resume_screener
cd ai_resume_screener
```

---

## Step 2: Create a Virtual Environment
It is highly recommended to use a virtual environment to isolate the project dependencies.

* **On Windows (Command Prompt / Powershell)**:
  ```powershell
  python -m venv venv
  .\venv\Scripts\activate
  ```
* **On macOS / Linux**:
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

---

## Step 3: Install Required Packages
Install Django, spaCy, scikit-learn, PyPDF2, and python-docx:
```bash
pip install django==4.2 spacy scikit-learn PyPDF2 python-docx
```

---

## Step 4: Download spaCy Language Model
The resume screener uses spaCy's English core model (`en_core_web_sm`) for Named Entity Recognition (NER) to extract candidate names, organizations, and headers:
```bash
python -m spacy download en_core_web_sm
```

---

## Step 5: Database Setup & Migrations
Initialize the SQLite database and create the schema tables:
```bash
python manage.py makemigrations screener_app
python manage.py migrate
```

---

## Step 6: Create Superuser (Admin Dashboard)
Create an administrative user to manage job profiles and parsed candidate entries directly through the Django Admin interface:
```bash
python manage.py createsuperuser
```
Follow the prompts to set your username, email, and password.

---

## Step 7: Run the Application Server
Start the local development server:
```bash
python manage.py runserver
```
Open your browser and navigate to:
* **Recruiter Web App**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
* **Django Admin Panel**: [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)

---

## Troubleshooting Setup Issues

### Issue 1: PyPDF2 Deprecation warnings or import failures
If you run into issues parsing complex PDFs, ensure you are using the correct library import version. Our codebase uses standard PyPDF2 interface. Alternatively, `pypdf` can be installed.

### Issue 2: C++ Build Tools error during spaCy installation
On Windows, installing spaCy might occasionally require Microsoft Visual C++ Build Tools. If this occurs, install them via the [Visual Studio Build Tools Installer](https://visualstudio.microsoft.com/visual-cpp-build-tools/) or install the pre-compiled binary wheel.
