"""
Created on 7/31/25

@author: jacksoncooke
"""
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date


class Vocab(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    german: str
    english: str
    review_score: int = 0
    last_reviewed: Optional[date] = None
