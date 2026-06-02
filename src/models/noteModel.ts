import db from "../config/db.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

interface NoteRow extends RowDataPacket {
    id: number;
    title: string;
    content: string;
    category_id: number;
    category_name: string;
    created_at: Date;
    user_id: number;
}

export interface Note {
     id: number;
    title: string;
    content: string;
    categoryId: number;
    categoryName: string;
    createdAt: Date;
    userId: number;
}

class NoteModel {
async readAllByUserId(userId: number) {
    const [rows] = await db.query(
        `SELECT n.id, n.title, n.content, n.category_id AS categoryId, 
         n.created_at AS createdAt,
         c.name as categoryName 
         FROM notes n 
         LEFT JOIN categories c ON n.category_id = c.id 
         WHERE n.user_id = ?`,
        [userId]
    );
    return rows;
}

   async read(id: number, userId: number) {
    const [rows] = await db.query(
      "SELECT * FROM notes WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    return (rows as any[])[0];
  }

   async create(note: Omit<Note, "id" | "createdAt" | "categoryName">) {
    const [result] = await db.query<ResultSetHeader>(
        "INSERT INTO notes (title, content, category_id, user_id) VALUES (?, ?, ?, ?)",
        [note.title, note.content, note.categoryId, note.userId]
    );
    return result;
}

    async edit(id: number, userId: number, note: Partial<Omit<Note, "id" | "createdAt">>) {
        const [result] = await db.query<ResultSetHeader>(
            "UPDATE notes SET title = ?, content = ?, category_id = ? WHERE id = ? AND user_id = ?",
            [note.title, note.content, note.categoryId, id, userId]
        );
        return result;
    }

    async delete(id: number, userId: number) {
    const [result] = await db.query(
      "DELETE FROM notes WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    return result as { affectedRows: number };
  }

    private format(row: NoteRow): Note {
        return {
            id: row.id,
            title: row.title,
            content: row.content,
            categoryId: row.category_id,
            categoryName: row.category_name,
            createdAt: row.created_at,
            userId: row.user_id,
        };
    }
}

export default new NoteModel();