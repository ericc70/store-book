const express = require("express");
const router = express.Router();
const {
  ensureAuth,
  ensureGuest
} = require("../middleware/auth");
const Story = require("../models/Story");

// const Story = require('../models/Story')

// @desc    Show add page
// @route   GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});


// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate('User').lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.User._id != req.user.id && story.status == 'private') {
     
      res.render('error/404')
    } 

    res.render('stories/show', {
      story,
    })

  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})


// @desc    process add form
// @route   GET /stories/
router.post("/", ensureAuth, async (req, res) => {

  try {
    req.body.User = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.render("error/500");
  }
});

// @desc    Show all stories
// @route   GET /stories
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
        status: "public"
      })
      .populate("User")
      .sort({
        createdAt: "desc"
      })
      .lean();

    res.render("stories/index", {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc    Show edit page
// @route   GET /stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  const story = await Story.findOne({
    _id: req.params.id,
  }).lean();

  if (!story) {
    return res.render("error/404");
  }

  if (story.User != req.user.id) {
    res.redirect('/stories')
  } else {

    res.render('./stories/edit', {
      story,
    })
  }
});


// @desc    Update story
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {

  try {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.User != req.user.id) {

      res.redirect('/stories')
    } else {

      story = await Story.findOneAndUpdate({
        _id: req.params.id
      }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
});

//@desc delete story
//@route DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    await Story.deleteOne({
      _id: req.params.id
    })
    res.redirect('/dashboard')

  } catch (error) {
    console.error(err)
    return res.render('error/500')

  }
})


// @desc    User styories
// @route   GET /stories/user/:userId
router.get("/user/:userId", ensureAuth, async (req, res) => {
 
try {
  const stories = await Story.find({
    user: req.params.userId,
    status: 'public'
  })
  .populate('User')
  .lean()

  res.render('stories/index', { stories})

} catch (error) {
  console.error(err)
  return res.render('error/500')

}


});



module.exports = router;