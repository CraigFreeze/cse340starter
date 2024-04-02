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
  const posts = await utilities.buildForumComments(commentData, res.locals.accountData)
  const currentDate = new Date().toISOString().substring(0, 10);
  res.render("forum/home", {
    title: "Car Forum",
    nav,
    errors: null,
    posts,
    account_id: res.locals.accountData.account_id,
    currentDate,
    comment_content: ""
  })
}

/* ****************************************
*  Process a new Comment
* *************************************** */
async function postComment (req, res, next) {
  const { comment_content, comment_date, account_id } = req.body

  const postResult = await forumModel.addComment(comment_content, comment_date, account_id)
  if (postResult) {
    req.flash(
      "notice",
      `You've successfully posted!`
    )
    res.status(201).redirect("/forum/comment")
    // res.status(201).render("forum/home", {
    //   title: "Car Forum",
    //   nav,
    //   errors: null,
    //   posts,
    //   account_id: res.locals.accountData.account_id,
    //   currentDate
    // })
  } else {
    req.flash("notice", "Sorry, the comment post failed.")
    res.status(501).redirect("/forum/comment")
    // res.status(501).render("forum/home", {
    //   title: "Car Forum",
    //   nav,
    //   errors: null,
    //   posts,
    //   account_id: res.locals.accountData.account_id,
    //   currentDate
    // })
  }
}

/* ***************************
 *  Delete Forum Content
 * ************************** */
async function deleteComment (req, res, next) {
  let nav = await utilities.getNav()
  let { comment_id } = req.body
  comment_id = parseInt(comment_id);

  const deleteResult = await forumModel.deleteComment(comment_id)

  if (deleteResult) {
    req.flash("notice", `The delete was successful.`)
    res.redirect("/forum/comment")
  } else {
    req.flash("notice", "Sorry, the insert failed.")
    res.redirect(`/forum/comment`)
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

module.exports = { buildForum, postComment, deleteComment, buildForumManagement }