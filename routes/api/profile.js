const express = require("express")
const router = express.Router()
const auth = require("../../middleware/auth")
const { check, validationResult } = require("express-validator")
const Profile = require("../../models/Profile")
const User = require("../../models/User")


// GET api/profile/me
// get current user's profile
// private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate("user", ["name", "avatar"])

    if (!profile) return res.status(400).json({ msg: "There's no profile for this user"})

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// POST api/profile
// create or update user profile
// private

router.post("/", [auth, [
  check("status", "Status is required").not().isEmpty(),
  check("skills", "Please provide your skills").not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const {
    company,
    location,
    website,
    bio,
    skills,
    status,
    githubusername,
    youtube,
    twitter,
    instagram,
    linkedin,
    facebook
  } = req.body;
  
  // build profile object
  const profileFields = {}
  profileFields.user = req.user.id
  if (company) profileFields.company = company
  if (website) profileFields.website = website
  if (location) profileFields.location = location
  if (bio) profileFields.bio = bio
  if (status) profileFields.status = status
  if (githubusername) profileFields.githubusername = githubusername
  if (skills) {
    profileFields.skills = skills.split(",").map(skill => skill.trim())
  }

  // build social object 
  profileFields.social = {}
  if (youtube) profileFields.social.youtube = youtube
  if (twitter) profileFields.social.twitter = twitter
  if (facebook) profileFields.social.facebook = facebook
  if (linkedin) profileFields.social.linkedin = linkedin
  if (instagram) profileFields.social.instagram = instagram

  try {
    let profile = await Profile.findOne({ user: req.user.id })

    // update if profile exists
    if (profile) {
      profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields },{ new: true })
      return res.json(profile)
    }
    // create if profile doesn't exist
    profile = new Profile(profileFields)
    await profile.save()
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// GET api/profile
// get all profiles
// public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"])
    res.json(profiles)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// GET api/profile/user/:user_id
// get profile by user _id
// public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate("user", ["name", "avatar"])

    if(!profile) return res.status(400).json({ msg: "Profile not found" })

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectID") return res.status(400).json({ msg: "Profile not found" })
    res.status(500).send("Server error")
  }
})

// DELETE api/profile
// delete profile, user & posts
// private

router.delete("/", auth, async (req, res) => {
  try {
    // @todo - remove user's posts

    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User deleted" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router