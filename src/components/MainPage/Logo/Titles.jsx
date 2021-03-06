import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

const styles = {

  tickets:{}

};


const Titles = ({ classes } ) =>(
    <React.Fragment>
        <h5 className = {classes.title_container__title}>SmartT!</h5>
        <h5 className = {classes.title_container__subtitle}>A fully decentralized, incentivised,
        fast and secure smart ticketing dApp solution on top of Neo Operating System (nOS) and NEO blockchain</h5>

    </React.Fragment>
);

Titles.propTypes = {
  classes: PropTypes.object.isRequired
};

export default injectSheet(styles)(Titles);
