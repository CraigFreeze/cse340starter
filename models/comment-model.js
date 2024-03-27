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
async function editComment(
    inv_id,
    comment_content
) {
    try { //! Change everything under this point to match the parameters
        const sql =
            "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
        const data = await pool.query(sql, [
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id,
            inv_id
        ])
        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error)
    }
}