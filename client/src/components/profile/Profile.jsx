import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import Spinner from "../layout/Spinner"
import { getProfileById } from "../../actions/profile"

// you can get id that is in the url by saying props.match 
const Profile = ({ getProfileById, profile: { profile, loading }, auth, match }) => {
  useEffect(() => {
    // this should match the id in the url
    getProfileById(match.params.id)
  }, [getProfileById]) // run immidiately when profile mounts
  return <>
      {profile === null || loading ? <Spinner /> :
      <>
        <Link to="/profiles" className="btn btn-light">
          Back to Profiles
        </Link>
        {auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id && (
        <Link to="/edit-profile" className="btn btn-dark">
          Edit Profile
        </Link>)}
      </>}
    </>
  
}
Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  // we'll need auth state to see if the user is logged in because if they are and the profile that they are viewing matches we show Edit Profile btn
  auth: state.auth
})

export default connect(
  mapStateToProps,
  { getProfileById }
)(Profile);
