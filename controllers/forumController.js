// Account Controller (deliver login view)

const utilities = require("../utilities")
const forumModel = require("../models/forum-model")
require("dotenv").config()


/* ***************************
 *  Deliver login view
 *  Unit 4, deliver login view
 * ************************** */
async function buildForum(req, res, next) {
  let nav = await utilities.getNav()
  const commentData = await forumModel.getAllComments();
  const posts = await utilities.buildForumComments(commentData, res.locals.accountData.account_id)
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

  const commentData = await forumModel.getAllComments();

  const posts = await utilities.buildForumComments(commentData, res.locals.accountData.account_id)
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

/* ***************************
 *  Deliver View
 *  Forum Managment
 * ************************** */
async function buildForumManagement(req, res, next) {
  let nav = await utilities.getNav()
  const commentData = await forumModel.getAllComments();
  const posts = await utilities.postManagementGrid(commentData, res.locals.accountData)
  res.render("forum/manage", {
    title: "Car Forum",
    nav,
    errors: null,
    posts
  })
}

module.exports = { buildForum, postComment, buildForumManagement }