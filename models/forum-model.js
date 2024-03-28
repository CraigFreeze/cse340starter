const pool = require("../database")

/* *****************************
*   Add Comment
* *************************** */
async function addComment(comment_content, comment_date, account_id) {
    try {
        const sql = "INSERT INTO public.comment (comment_content, comment_date, account_id) VALUES ($1, $2, $3) RETURNING *"
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
            "DELETE FROM public.comment WHERE comment_id = $1"
        const data = await pool.query(sql, [comment_id])
        return data
    } catch (error) {
        console.error("model error: " + error)
    }
}

/* ***************************
 *  Edit Comment
 * ************************** */
async function editComment(
    comment_id,
    comment_content
) {
    try {
        const sql =
            "UPDATE public.comment SET comment_content = $1 WHERE comment_id = $2 RETURNING *"
        const data = await pool.query(sql, [
            comment_content,
            comment_id
        ])
        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error)
    }
}

/* *****************************
* Return comment data using account_id
* ***************************** */
async function getCommentById(comment_id) {
    try {
        const result = await pool.query(
            'SELECT comment_content, comment_date, account_id FROM comment WHERE comment_id = $1',
            [comment_id])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching comment was found")
    }
}

/* *****************************
* Return comment data using account_id
* ***************************** */
async function getAllComments() {
    try {
        const data = await pool.query(
            `SELECT * FROM public.comment AS c 
            JOIN public.account AS a 
            ON c.account_id = a.account_id`,
            []
        )
        return data.rows
    } catch (error) {
        return new Error("No comments were found")
    }
}

module.exports = { addComment, deleteComment, editComment, getCommentById, getAllComments }
