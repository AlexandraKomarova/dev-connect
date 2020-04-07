import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Spinner from "../layout/Spinner"
import { connect } from "react-redux"
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profile';

// useEffect because we need to call getProfiles action as soon as the profiLe loads 
const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  useEffect(() => {
    // put the profiles in the state
    getProfiles()
  }, [])

  return (
    // when we get profiles from the state we only wanna show them if we got them, id we didn't get them yet - spinner
    <>
      { loading ? <Spinner /> : 
      <>
        <h1 className="large text-primary">Developers</h1>
        <p className="lead">
          <i className="fab-fa-connectdevelop"></i> Browse and connect with developers
        </p>
        <div className="profiles">
          {profiles.length > 0 ? (
            profiles.map(profile => (
              <ProfileItem key={profile._id} profile={profile} />
            ))
          ) : <h4>No profiles found...</h4>}
        </div>
      </> }
    </>
  )
}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile
})

export default connect(mapStateToProps, { getProfiles })(Profiles)
