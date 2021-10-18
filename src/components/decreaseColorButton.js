import React from "react";
import {Popover, TextField, Button, Card} from "@mui/material";

const DecreaseColorButton = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [colorNum, setColorNum] = React.useState(10)
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleApply = () => {
        props.func(colorNum)
        handleClose()
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    return(
        <div>
            <Button variant="contained" onClick={handleClick}>
                減色
            </Button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Card sx={{width: '200px'}}>
                    <p>
                        <TextField size="small"
                                   variant="filled"
                                   label={'Number ob Color'}
                                   defaultValue={colorNum}
                                   onChange={(e)=>{
                                       setColorNum(Number(e.target.value))
                                   }}
                                   inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}/>
                    </p>
                    <Button onClick={handleApply}>Apply</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </Card>
            </Popover>
        </div>
    )
}

export default DecreaseColorButton