import db from "../config/db.js";
import type { ResultSetHeader } from "mysql2";
import type { CategoryWithStats } from "../interfaces/types.js";

class StatModel {
    async createOrUpdate(categoryId: number, score: number, userId: number): Promise<ResultSetHeader> {
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO category_stats 
            (category_id, score, recorded_at, user_id) 
            VALUES (?, ?, CURDATE(), ?) 
            ON DUPLICATE KEY UPDATE score = ?`,
            [categoryId, score, userId, score]
        );
        return result;
    }

 async getDailyOverview(userId: number): Promise<CategoryWithStats[]> {
    const [rows] = await db.query(
        `SELECT 
         c.id, 
         c.name,
         c.target_score, 
         s.score AS currentScore 
         FROM categories c 
         LEFT JOIN category_stats s ON c.id = s.category_id 
         AND s.recorded_at = CURDATE() AND s.user_id = ?
         WHERE c.user_id = ? OR c.user_id IS NULL`,
        [userId, userId]
        );
        return rows as CategoryWithStats[];
    }

    async getStatsHistory(userId: number, days = 7) {
        const [rows] = await db.query(
            `SELECT
            DATE_FORMAT(recorded_at, '%d/%m') as DATE,
            c.name as category,
            s.score
            FROM category_stats s
            JOIN categories c ON s.category_id = c.id
            WHERE s.user_id = ? AND s.recorded_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            ORDER BY s.recorded_at ASC`, [userId, days]
        );
        return rows;
    }

    async updateTarget(categoryId: number, newTarget: number, userId: number) {
        const [result] = await db.query(
            `UPDATE categories SET target_score = ? WHERE id = ? AND user_id = ?`,
            [newTarget, categoryId, userId]
        );
        return result;
    }
}
export default new StatModel();