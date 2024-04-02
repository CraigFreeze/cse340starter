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
            .isAscii()
            .withMessage("Please provide content for your comment that is also valid ascii characters.") // on error this message is sent.
        ,

        body("comment_date")
            .trim()
            .isLength({ min: 1 })
            .isISO8601().toDate()
            .withMessage("Pleas use a valid date format.") // on error this message is sent.
        ,

        body("account_id")
            .trim()
            .isLength({ min: 1 })
            .isInt()
            .withMessage("Please provide a valid account number.") // on error this message is sent.

    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkCommentData = async (req, res, next) => {
    ("here2")
    const { comment_content, account_id } = req.body
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
            currentDate: new Date().toISOString().substring(0, 10),
            comment_content
        })
        return
    }
    next()
}

module.exports = validate