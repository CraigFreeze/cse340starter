const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + 'details"><img src="' + vehicle.inv_thumbnail
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildVehicleDetails = async function (data) {
  let details
  details =
    '<img id="vehicle-image" src="' +
    data.inv_image +
    '" alt="Image of ' +
    data.inv_make +
    ' ' +
    data.inv_model +
    ' on CSE Motors"><section id="vehicle-details"><h3>' +
    data.inv_make +
    ' ' +
    data.inv_model +
    ' Details</h3><ul><li><h4>Price: $' +
    (Number(data.inv_price)).toLocaleString(undefined) +
    '</h4></li><li><span>Description: </span>' +
    data.inv_description +
    '</li><li><span>Color: </span>' +
    data.inv_color +
    '</li><li><span>Miles: </span>' +
    (data.inv_miles).toLocaleString(undefined) +
    '</li></ul></section>'
  return details
}

/* ************************
 * Constructs the classification select list
 ************************** */
Util.selectClassification = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let list = `<select name="classification_id" id="classification_id" value="<%= locals.classification_id %>">`
  list += "<option disabled selected value> -- Choose a Classification -- </option>";
  data.rows.forEach((row) => {
    list += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      list += " selected ";
    }
    list += ">" + row.classification_name + "</option>";
  })
  list += "</select>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildForumComments = async function (data, accountData) {
  let posts = '';
  if (data.length > 0) {
    data.forEach((comment) => { //! the account data and the comment data can't be looped through with a forEach
      posts += '<div class="comments-display">'
      posts += '<div class="comments-header">'
      posts += '<div>'
      posts += '<h2>'
      posts += `${comment.account_firstname} ${comment.account_lastname}`
      posts += '</h2>'
      posts += '</div>'
      posts += '<div>'
      posts += '<h3>'
      posts += `${comment.comment_date.toLocaleDateString()}`
      posts += '</h3>'
      posts += '</div>'
      posts += '</div>'

      posts += '<p>'
      posts += comment.comment_content
      posts += '</p>'

      if (accountData.account_type === "Admin" || (accountData.account_id === comment.account_id)) {
        posts += '<form action="/forum/delete" method="post">'
        posts += '<input type="hidden" name="comment_id" value=' + comment.comment_id + '">'
        posts += '<button type="submit" class="delete-btn">Delete</button>'
        posts += '</form>'
      }

      posts += '</div>'
    })
  } else {
    posts += '<p class="notice">Be the first to start a discussion!</p>'
  }
  // ! ADD HIDDEN FIELDS THAT INCLUDE DATE AND ACCOUNT ID

  return posts
}

// Build inventory items into HTML table components and inject into DOM 
Util.postManagementGrid = async function (comments, accountData) {
  // let inventoryDisplay = document.getElementById("inventoryDisplay");
  // Set up the table labels 
  let dataTable = '<thead>';
  dataTable += '<tr><th>Person</th><td>Comment</td><td>Date</td><td>&nbsp;</td><td>&nbsp;</td></tr>';
  dataTable += '</thead>';
  // Set up the table body 
  dataTable += '<tbody>';

  // Iterate over all vehicles in the array and put each in a row 
  comments.forEach(function (comment) {
    if (accountData.account_type === "Admin") {
      dataTable += `<tr><td>${comment.account_firstname} ${comment.account_lastname}</td>`;
      dataTable += `<td>${comment.comment_content}</td>`;
      dataTable += `<td>${comment.comment_date.toLocaleDateString()}</td>`;
      dataTable += `<td><a href='/forum/edit/${comment.comment_id}' title='Click to update'>Modify</a></td>`;
      dataTable += `<td><a href='/forum/delete/${comment.comment_id}' title='Click to delete'>Delete</a></td></tr>`;
    } else if (!(comment.account_id === accountData.account_id)) {
      return
    } else {
      dataTable += `<tr><td>${comment.account_firstname} ${comment.account_lastname}</td>`;
      dataTable += `<td>${comment.comment_content}</td>`;
      dataTable += `<td>${comment.comment_date.toLocaleDateString()}</td>`;
      dataTable += `<td><a href='/forum/edit/${comment.comment_id}' title='Click to update'>Modify</a></td>`;
      dataTable += `<td><a href='/forum/delete/${comment.comment_id}' title='Click to delete'>Delete</a></td></tr>`;
    }
  })
  dataTable += '</tbody>';
  return dataTable;
  // Display the contents in the Inventory Management view 
  // inventoryDisplay.innerHTML = dataTable;
}

/* ****************************************
* Middleware For Handling Errors
* Wrap other function in this for 
* General Error Handling
**************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          console.log("Please Log in ------------------------")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check Admin Login
 * ************************************ */
Util.checkAdminLogin = (req, res, next) => {
  if (res.locals.loggedin && (res.locals.accountData.account_type === "Employee" || res.locals.accountData.account_type === "Admin")) {
    next()
  } else {
    req.flash("notice", "Please log in with correct credentials.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.logout = (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 1 })
  res.redirect("/")
}


module.exports = Util