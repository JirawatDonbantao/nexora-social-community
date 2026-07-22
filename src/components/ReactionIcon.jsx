import PropTypes from "prop-types";

function ReactionIcon({ reaction, className = "" }) {
  if (!reaction) return null;

  const classes = ["reaction-gif", className].filter(Boolean).join(" ");

  return (
    <img
      className={classes}
      src={reaction.image}
      alt=""
      aria-hidden="true"
    />
  );
}

ReactionIcon.propTypes = {
  reaction: PropTypes.shape({
    image: PropTypes.string.isRequired,
  }),
  className: PropTypes.string,
};

export default ReactionIcon;
