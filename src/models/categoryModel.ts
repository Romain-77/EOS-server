import db from "../config/db.js";
import type { RowDataPacket } from "mysql2";


interface CategoryRow extends RowDataPacket {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string
}

class CategoryModel  {

    async readAll(userId: number): Promise<Category[]> {
        const [rows] = await db.query<CategoryRow[]>(
            'SELECT id, name FROM categories WHERE user_id = ? ORDER BY name ASC',
            [userId]
        );

        return rows as Category[];
    }

    async read(id: number):Promise<Category | null> {
        const [rows] = await db.query<CategoryRow[]> (
            'SELECT id, name FROM categories WHERE id = ?', [id]
        );
        return rows.length > 0 ? (rows[0] as Category) : null;
    }
};

export default new CategoryModel();
