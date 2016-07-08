import React from 'react';
import Lister from  './Lister';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

const todoIndexUrl = "https://afternoon-taiga-98870.herokuapp.com/todos.json";

class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
              <Lister url={todoIndexUrl} />
            </MuiThemeProvider>
        );
    }
}

export default App;
