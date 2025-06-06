import sqlite3
import pickle
import numpy as np
from typing import List, Tuple, Optional

class FaceDB:
    def __init__(self, db_path: str = "face_db.sqlite"):
        self.conn = sqlite3.connect(db_path)
        self._create_table()
    
    def _create_table(self):
        cur = self.conn.cursor()
        cur.execute('''
            CREATE TABLE IF NOT EXISTS face_embeddings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                image_path TEXT,
                embedding BLOB NOT NULL
            )
        ''')
        self.conn.commit()

    def add_face(self, name: str, image_path: str, embedding: np.ndarray):
        cur = self.conn.cursor()
        blob = pickle.dumps(embedding.astype(np.float32))
        cur.execute('''
            INSERT INTO face_embeddings (name, image_path, embedding)
            VALUES (?, ?, ?)
        ''', (name, image_path, blob))
        self.conn.commit()
    
    def get_all_faces(self) -> List[Tuple[str, str, np.ndarray]]:
        cur = self.conn.cursor()
        cur.execute('SELECT name, image_path, embedding FROM face_embeddings')
        rows = cur.fetchall()
        return [(name, path, pickle.loads(blob)) for name, path, blob in rows]

    def find_by_name(self, name: str) -> List[Tuple[str, str, np.ndarray]]:
        cur = self.conn.cursor()
        cur.execute('SELECT name, image_path, embedding FROM face_embeddings WHERE name = ?', (name,))
        rows = cur.fetchall()
        return [(name, path, pickle.loads(blob)) for name, path, blob in rows]

    def delete_by_name(self, name: str):
        cur = self.conn.cursor()
        cur.execute('DELETE FROM face_embeddings WHERE name = ?', (name,))
        self.conn.commit()

    def close(self):
        self.conn.close()