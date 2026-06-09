import type { RowDataPacket } from "mysql2";

export interface Category {
    id: number;
    name: string;
}

export interface Note {
    id: number;
    title: string;
    content: string;
    categoryId: number;
    categoryName: string;
    createdAt: string;
    userId: string;
}

export interface CategoryStat {
    id: number;
    categoryId: number;
    score: number;
    recordedAt: Date;
}

export interface CategoryWithStats extends Category {
    targetScore: number;
    currentScore?: number;
}

export interface StreakActivityRow extends RowDataPacket {
    activity_date: string | Date; 
}

export interface StreakResponse {
    currentStreak: number;
    activeToday: boolean;   
}