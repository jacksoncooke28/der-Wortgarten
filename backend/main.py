"""
Created on 7/31/25

@author: jacksoncooke
"""
from typing import List, Optional
from datetime import date

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, select

from database import engine, get_session
from models import Vocab


# Payload for partial updates (PUT)
class VocabUpdate(SQLModel):
    german: Optional[str] = None
    english: Optional[str] = None
    review_score: Optional[int] = None
    last_reviewed: Optional[date] = None  # parsed from "YYYY-MM-DD"


app = FastAPI()

# CORS must be set on the running app instance before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# runs automatically on startup; ensures that all database tables defined in SQLModel metadata are created on the
# SQLite database.
@app.on_event("startup")
def on_startup() -> None:
    SQLModel.metadata.create_all(engine)

# health check endpoint; confirms the server is running and responsive
@app.get("/ping")
def ping():
    return {"ok": True}

# Checks connectivity to backend
@app.get("/")
def root():
    return {"message": "Willkommen im Wortgarten!"}

# Fetches all vocab from the database; returns a list of vocab objects
@app.get("/api/vocab", response_model=List[Vocab])
def get_vocab(session: Session = Depends(get_session)):
    return session.exec(select(Vocab)).all()

# Adds a word into the database. It takes a Vocab object from the request body, inserts it into the session, commits the
# transaction, and refreshes the object before returning it.
@app.post("/api/vocab", response_model=Vocab)
def add_vocab(word: Vocab, session: Session = Depends(get_session)):
    session.add(word)
    session.commit()
    session.refresh(word)
    return word


# Updates an existing word by ID. It finds the record by ID; if not found, raises a 404 error. For each key-value in the
# update payload, it dynamically sets the corresponding attribute on the Vocab object. Finally, it commits and refreshes
# the object to return the updated state.
@app.put("/api/vocab/{id}", response_model=Vocab)
def update_vocab(id: int, updated: VocabUpdate, session: Session = Depends(get_session)):
    word = session.get(Vocab, id)
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")

    # Only apply fields the client actually sent
    data = updated.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(word, k, v)

    session.add(word)
    session.commit()
    session.refresh(word)
    return word

# Deletes a vocabulary word from the database. It queries by ID; if missing, raises 404. Otherwise, deletes the record
# and commits. Returns {"ok": True} to confirm success.
@app.delete("/api/vocab/{id}")
def delete_vocab(id: int, session: Session = Depends(get_session)):
    word = session.get(Vocab, id)
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    session.delete(word)
    session.commit()
    return {"ok": True}
