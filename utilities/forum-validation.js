const utilities = require(".")
const { body, validationResult } = require("express-validator")
const forumModel = require("../models/forum-model")
const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.commentRules = () => {
    return [
        // firstname is required and must be string
        body("comment_content")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please comment.") // on error this message is sent.
            .isAscii(),

        body("comment_date")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please comment.") // on error this message is sent.
            .isISO8601().toDate(),

        body("account_id")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please comment.") // on error this message is sent.
            .isInt()
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkCommentData = async (req, res, next) => {
    ("here2")
    const { comment_content, comment_date, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const commentData = await forumModel.getAllComments();
        const posts = await utilities.buildForumComments(commentData, res.locals.accountData)
        res.render("forum/home", {
            title: "Car Forum",
            nav,
            errors,
            posts,
            account_id: account_id,
            currentDate: comment_date,
            comment_content
        })
        return
    }
    next()
}

module.exports = validate