// Account Controller (deliver login view)

const utilities = require("../utilities")
const forumModel = require("../models/forum-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ***************************
 *  Deliver login view
 *  Unit 4, deliver login view
 * ************************** */
async function buildForum(req, res, next) {
  let nav = await utilities.getNav()
  console.log("here")
  const commentData = await forumModel.getAllComments();
  // const accountData = await forumModel.getAccountById(commentData.account_id)
  console.log(commentData)
  // console.log(accountData)
  const posts = await utilities.buildForumComments(commentData)
  res.render("forum/home", {
    title: "Car Forum",
    nav,
    errors: null,
    posts
  })
}

/* ****************************************
*  Process a new Comment
* *************************************** */
async function postComment (req, res, next) {
  const { comment_content, comment_date, account_id } = req.body

  const postResult = await forumModel.addComment(comment_content, comment_date, account_id)

  let nav = await utilities.getNav() //consider moving this after the regResult

  const commentData = await forumModel.getCommentById(data.account_id)
  const accountData = await forumModel.getAccountById(data.account_id)
  console.log(commentData, accountData)
  const posts = await utilities.commentData(commentData, accountData)
  // ! MAKE IT SO THAT THE COMMENT FORM IS STICKY WHEN THERE IS AN ERROR

  if (postResult) {
    req.flash(
      "notice",
      `You've successfully posted!`
    )
    res.status(201).render("forum/home", {
      title: "Car Forum",
      nav,
      errors: null,
      posts
    })
  } else {
    req.flash("notice", "Sorry, the comment post failed.")
    res.status(501).render("forum/home", {
      title: "Car Forum",
      nav,
      errors: null,
      posts
    })
  }
}

module.exports = { buildForum, postComment }