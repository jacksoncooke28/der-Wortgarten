"""
Created on 7/31/25

@author: jacksoncooke
"""
from sqlmodel import create_engine, Session

DATABASE_URL = "sqlite:///./vocab.db"
engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session
