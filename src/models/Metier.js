import db from "../config/db.js";
import logger from "../utils/logger.js";

const Metier = {
    getAll: async () => {
        try {
            const result = await db.query(
                "SELECT * FROM metier ORDER BY nom ASC"
            );
            return result.rows;
        } catch (err) {
            logger.logDatabase(err, "SELECT * FROM metier");
            throw err;
        }
    },

    getById: async (id) => {
        try {
            const result = await db.query(
                "SELECT * FROM metier WHERE id_metier = $1",
                [id]
            );
            return result.rows[0];
        } catch (err) {
            logger.logDatabase(err, `SELECT * FROM metier WHERE id_metier = ${id}`);
            throw err;
        }
    }
};

export default Metier;