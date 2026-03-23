import db from "../config/db.js";

const Metier = {
    getAll: async () => {
        const result = await db.query(
            "SELECT * FROM metier ORDER BY nom ASC"
        );
        return result.rows;
    },

    getById: async (id) => {
        const result = await db.query(
            "SELECT * FROM metier WHERE id_metier = $1",
            [id]
        );
        return result.rows[0];
    }
};

export default Metier;