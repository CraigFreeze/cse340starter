const pool = require("../database/")

/* *****************************
*   Add Comment
* *************************** */
async function addComment(comment_content, comment_date, account_id,) {
    try {
        const sql = "INSERT INTO comment (comment_content, comment_date, account_id) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [comment_content, comment_date, account_id])
    } catch (error) {
        return error.message
    }
}

/* ***************************
 *  Delete Comment
 * ************************** */
async function deleteComment(comment_id) {
    try {
        const sql =
            "DELETE FROM comment WHERE comment_id = $1"
        const data = await pool.query(sql, [comment_id])
        return data
    } catch (error) {
        console.error("model error: " + error)
    }
}

/* ***************************
 *  Edit Comment
 * ************************** */