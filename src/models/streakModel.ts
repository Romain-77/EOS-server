import db from "../config/db.js";
import type { StreakActivityRow, StreakResponse } from "../interfaces/types.js";

class StreakModel {
    async getStreak(userId: number): Promise<StreakResponse> {

        const [rows] = await db.query<StreakActivityRow[]>(
             //Récupère toutes les dates où l'utilisateur a soit écrit une note, soit coché un score
            `SELECT DISTINCT DATE(date_activity) as activity_date FROM (
            SELECT created_at AS date_activity FROM notes WHERE user_id = ? 
            Union 
            SELECT recorded_at AS date_activity FROM category_stats WHERE user_id = ?
        ) as activities
         ORDER BY activity_date DESC`,
         [userId, userId]
        );

        const dates = (rows as any[]).map(r => {
            const d = new Date(r.activity_date);
            return d.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        });

        if (dates.length === 0) {
            return {currentStreak: 0, activeToday: false};
    }

    const todayStr = new Date().toISOString().split('T')[0];

    //calcul d'hier
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    //Si l'utilisateur n'a rien fait aujourd'hui, ni hier, la série est brisée.
    const hasActivityToday = dates.includes(todayStr);
    const hasActivityYesterday = dates.includes(yesterdayStr);

    if (!hasActivityToday && !hasActivityYesterday) {
        return {currentStreak: 0, activeToday: false};
    }

    //Comptage des jours consécutifs en remontant le temps.

    let currentStreak = 0;
    let checkDate = new Date(); //Commence par aujourd'hui

    //Si pas d'activité aujourd', hui mai présent hier, on commmence le comptage à partir d'hier.
    if (!hasActivityToday && hasActivityYesterday) {
        checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
        const checkDateStr = checkDate.toISOString().split('T')[0];
        if (dates.includes(checkDateStr)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() -1); //recule d'un jour
        } else {
            break; //Si un jour manque, alors la boucle s'arrête.
        }
    }
        return {currentStreak, activeToday: hasActivityToday};  
    }
    }

export default new StreakModel();