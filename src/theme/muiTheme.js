import {createTheme} from "@mui/material/styles";
import colors from "./colors.js";


export default createTheme({
    palette: {primary: colors.primary},
    typography: {
        fontFamily: 'Inter, Helvetica, Arial, sans-serif'
    },
})