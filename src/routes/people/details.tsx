import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchPeopleDetails,
  resetState,
} from "../../store/slices/peopleDetailsSlice";
import { ArrowLeftIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import CastingMoviesSlider from "../../components/CastingMoviesSlider";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
const SOCIAL_LINKS = {
  facebook: "https://facebook.com",
  twitter: "https://x.com",
  instagram: "https://instagram.com",
  homepage: "",
};

const PeopleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { details, loading, error } = useAppSelector(
    (state) => state.peopleDetails
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchPeopleDetails(id));
    }

    return () => {
      dispatch(resetState());
    };
  }, [id, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!details) {
    return null;
  }

  const { name, biography, profile_path, homepage, social_links } = details;

  return (
    <div className="people-details">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeftIcon className="icon" />
        Back
      </button>
      <div className="profile">
        <img
          src={`${IMAGE_BASE_URL}${profile_path}`}
          alt={name}
          className="profile-image"
        />
        <div className="profile-info">
          <h1>{name}</h1>
          <p>{biography}</p>
          <div className="social-links">
            {social_links.facebook && (
              <a
                href={`${SOCIAL_LINKS.facebook}/${social_links.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            )}
            {social_links.twitter && (
              <a
                href={`${SOCIAL_LINKS.twitter}/${social_links.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            )}
            {social_links.instagram && (
              <a
                href={`${SOCIAL_LINKS.instagram}/${social_links.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            )}
            {homepage && (
              <a href={homepage} target="_blank" rel="noopener noreferrer">
                <GlobeAltIcon className="icon" />
                Homepage
              </a>
            )}
          </div>
        </div>
      </div>
      <CastingMoviesSlider personId={id} />
    </div>
  );
};

export default PeopleDetails;
