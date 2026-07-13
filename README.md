#git init and Ranking System (React + Django)

Automate recruitment processes 80% faster with this AI-powered resume screening system using Natural Language Processing (NLP) and Machine Learning (ML). Built with a decoupled architecture utilizing a **Django REST Framework (DRF)** backend API and a **Vite + React** single-page application (SPA).

Ideal final year project for CSE/IT students, showcasing full-stack capabilities, API design, NLP text extraction, and modern UI engineering.

---

## ⚡ Key Features
* **Decoupled Architecture**: Modern client-server separation (React SPA frontend + Django API backend).
* **Intelligent Resume Parsing**: Batch upload `.pdf` and `.docx` format resumes.
* **NLP Entity Extraction**: Automatically extracts candidate **Name**, **Email**, **Phone number**, **Technical Skills**, **Experience paragraphs**, and **Education records** using `spaCy` Named Entity Recognition (NER) and regex.
* **Multi-Dimensional Matching Algorithm**:
  1. **Skills Match Score (40%)**: Jaccard similarity indexing candidate skills against job description requirements.
  2. **Experience Match Score (30%)**: Logical heuristic verification of experience duration (years).
  3. **Education Match Score (30%)**: Verification of degree level achievements (Bachelor, Master, PhD).
  4. **TF-IDF Cosine Similarity**: Semantic vector space modeling using `scikit-learn` to measure context alignment.
* **Premium Glassmorphic Dashboard**: Sleek dark mode visual analytics built using Tailwind/Bootstrap 5 and responsive flex columns.
* **Branded Django Admin Panel**: Rebranded administrative dashboard to manage job data directly.

---

## 🔧 Technology Stack
* **Frontend**: React 19 | Vite | Bootstrap 5 | react-router-dom | Axios | FontAwesome
* **Backend API**: Python 3.8+ | Django 4.2 | Django REST Framework (DRF) | django-cors-headers
* **NLP Parsing**: spaCy (`en_core_web_sm`)
* **ML Analytics**: scikit-learn (`TfidfVectorizer`, Cosine Similarity)
* **Text Parsers**: PyPDF2 | python-docx

---

## 📂 Project Structure
```text
ai_resume_screener/
│
├── docs/                   # Academic Documentation
│   ├── installation_guide.md
│   ├── project_report.md   # 50+ page equivalent comprehensive report
│   └── presentation_defense.md # PowerPoint outline & notes
│
├── frontend/               # React Single Page Application (SPA)
│   ├── src/
│   │   ├── pages/          # Pages (Dashboard, Details, Form, Analytics)
│   │   ├── App.jsx         # React routing & layouts
│   │   ├── main.jsx        # App entry point & imports
│   │   └── index.css       # Custom glassmorphic styling system
│   ├── package.json        # Node dependency manifest
│   └── index.html          # Web page entry template
│
├── screener_project/       # Django Project Core Configurations
│   ├── settings.py         # CORS, Media paths & INSTALLED_APPS setup
│   ├── urls.py             # Redirection rules & API namespaces
│   └── wsgi.py
│
├── screener_app/           # Backend Django Application Logic
│   ├── models.py           # JobDescription and Resume DB tables
│   ├── serializers.py      # DRF serializers (JSON formatting)
│   ├── views.py            # API request controller views
│   ├── urls.py             # Route definitions (/api/)
│   └── utils/
│       ├── parser.py       # PDF/Word text parsing logic
│       └── matcher.py      # Matching and scoring engine
│
├── mock_resumes/           # Mock resumes generated for test verification
├── generate_mock_resumes.py # Helper script to create test resumes
├── test_screener.py        # Seeding and database populate script
└── manage.py               # Django entry script
```

---

🚀 Local Installation & Execution

### Part 1: Backend Django Setup
1. **Initialize Virtual Environment & Install Packages**:
   ```bash
   # Create virtual environment
   python -m venv venv

   # Activate virtual environment
   # Windows (CMD/Powershell):
   .\venv\Scripts\activate
   # Linux/macOS:
   source venv/bin/activate

   # Install required python packages
   pip install django==4.2 djangorestframework django-cors-headers spacy scikit-learn PyPDF2 python-docx click
   ```

2. **Download spaCy Core Model**:
   ```bash
   python -m spacy download en_core_web_sm
   ```

3. **SeedTest Database & Load Mock Data**:
   This applies DB migrations, creates the default superuser, generates candidate resumes, and populates the database:
   ```bash
   python test_screener.py
   ```

4. **Start the API Server**:
   ```bash
   python manage.py runserver 8000
   ```
   * **Django API Endpoint**: [http://127.0.0.1:8000/api/dashboard/](http://127.0.0.1:8000/api/dashboard/)
   * **Branded Admin Panel**: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) (Credentials: Username: `admin` | Password: `admin123`)

---

### Part 2: Frontend React Setup
1. **Navigate to Frontend Directory**:
   ```bash
   cd frontend
   ```

2. **Install Node Packages**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start React Dev Server**:
   ```bash
   npm run dev
   ```
   * Open your browser and navigate to: **[http://localhost:5173/](http://localhost:5173/)**
   * *Note: The Django backend has a built-in root URL redirect. Visiting `http://127.0.0.1:8000/` will automatically redirect you to the React development server.*


### 📄 Academic Resources Included
For academic submissions, look under the `docs/` directory:
* **Project Report**: Refer to [docs/project_report.md](docs/project_report.md) for a structured chapter format including system UMLs, database tables (ERD), methodology formulations, and test logs.
* **Defense Slides**: Refer to [docs/presentation_defense.md](docs/presentation_defense.md) for a slide-by-slide project review slide deck and speaker scripts.
* **Setup Guide**: Refer to [docs/installation_guide.md](docs/installation_guide.md) for detailed developer environmental setup guidelines.
