
function Monoid(props) {
  return {
    concat: props.concat,
    empty: props.empty,
  };
}

module.exports = Monoid;
