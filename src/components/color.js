import React from "react";
import {Box, Card, Paper} from "@mui/material";
import {ColorLens} from "@material-ui/icons";

const Color = (props) => {
    return (
        <Paper elevation={3} sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <ColorLens color={props.hex} htmlColor={props.hex}/>
            <span>{props.hex}</span>
            <hr/>
        </Paper>
    )

}

export default Color