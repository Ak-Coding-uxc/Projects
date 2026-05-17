import re
import spacy
import pdfplumber
from docx import Document
from pathlib import Path

nlp = spacy.load("en_core_web_sm")

SKILLS_DB = {
    "python", "java", "c", "c++", "html", "css", "javascript",
    "sql", "machine learning", "deep learning", "nlp", "pandas",
    "numpy", "scikit-learn", "tensorflow", "pytorch", "spacy",
    "git", "excel", "power bi"
}

DEGREE_WORDS = [
    "b.tech", "btech", "b.e", "be", "b.sc", "bsc", "m.tech", "mtech",
    "m.sc", "msc", "mba", "bca", "mca", "phd", "diploma"
]

def read_docx(file_path: str) -> str:
    doc = Document(file_path)
    return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])

def read_pdf(file_path: str) -> str:
    text = []
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text.append(page_text)
    return "\n".join(text)

def extract_email(text: str):
    match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    return match.group(0) if match else None

def extract_phone(text: str):
    match = re.search(r'(\+91[\-\s]?)?[6-9]\d{9}', text)
    return match.group(0) if match else None

def extract_name(text: str):
    doc = nlp(text[:1000])
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return lines[0] if lines else None

def extract_skills(text: str):
    text_lower = text.lower()
    found = sorted({skill for skill in SKILLS_DB if skill in text_lower})
    return found

def extract_degree(text: str):
    text_lower = text.lower()
    found = [deg for deg in DEGREE_WORDS if deg in text_lower]
    return found

def extract_pages(file_path: str):
    if file_path.lower().endswith(".pdf"):
        with pdfplumber.open(file_path) as pdf:
            return len(pdf.pages)
    return 1

def parse_resume(file_path: str):
    ext = Path(file_path).suffix.lower()

    if ext == ".pdf":
        text = read_pdf(file_path)
    elif ext == ".docx":
        text = read_docx(file_path)
    else:
        raise ValueError("Only PDF and DOCX files are supported.")

    data = {
        "name": extract_name(text),
        "email": extract_email(text),
        "mobile_number": extract_phone(text),
        "skills": extract_skills(text),
        "degree": extract_degree(text),
        "no_of_pages": extract_pages(file_path),
    }
    return data

if __name__ == "__main__":
    file_path = "resume.docx"   # change to resume.pdf if needed
    data = parse_resume(file_path)

    print("Name:", data.get("name"))
    print("Email:", data.get("email"))
    print("Mobile Number:", data.get("mobile_number"))
    print("Skills:", data.get("skills"))
    print("Degree:", data.get("degree"))
    print("No Of Pages:", data.get("no_of_pages"))