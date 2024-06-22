import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "./i18n.js";
import {MantineProvider} from '@mantine/core';
import {ModalsProvider} from '@mantine/modals';
import {ThemeProvider as MuiThemeProvider} from "@mui/material/styles";
import mantineTheme from "./theme/mantineTheme.js";
import muiTheme from "./theme/muiTheme.js";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'

dayjs.extend(utc)
dayjs.extend(relativeTime)
dayjs.extend(duration)

import './assets/css/global.css'
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/tiptap/styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <MantineProvider theme={mantineTheme}>
            <ModalsProvider>
                <MuiThemeProvider theme={muiTheme}>
                    <App/>
                </MuiThemeProvider>
            </ModalsProvider>
        </MantineProvider>
    </React.StrictMode>,
)
