import db from "../config/db.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export interface UserRow extends RowDataPacket {
    id: number;
    username: string;
    email: string;
    password?: string;
}

export interface UserAccount {
    username: string;
    email: string;
    password?: string;
}

class UserModel {
    async create(user: UserAccount): Promise<ResultSetHeader> {
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO users (username, email, password) 
            VALUES (?, ?, ?)`,
            [user.username, user.email, user.password]
        );
        return result;
    }

    async findByEmail(email: string):Promise<UserRow | null> {
        const [rows] =await db.query<UserRow[]>(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async findById(id: number): Promise<UserRow | null> {
        const [rows] = await db.query<UserRow[]>(
            `SELECT id, username, email FROM users WHERE id = ?`,
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async initUserCategories(userId: number): Promise<ResultSetHeader> {
    const [result] = await db.query<ResultSetHeader>(
        `INSERT INTO categories (name, target_score, user_id) 
         SELECT name, target_score, ? 
         FROM categories 
         WHERE user_id IS NULL`,
        [userId]
    );
    return result;
}
}

export default new UserModel();