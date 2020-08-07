import React, { Fragment } from 'react';
import { withAuthenticator, AmplifyGreetings, AmplifyAuthenticator } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import DisplayPosts from './components/DisplayPosts';
import CreatePost from './components/CreatePost';

import './App.css';

function App() {
    const [authState, setAuthState] = React.useState();
    const [user, setUser] = React.useState();

    React.useEffect(() => {
        return onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setUser(authData)
        });
    }, []);

    return authState === AuthState.SignedIn && user ? (
        <Fragment>
            <AmplifyGreetings username={user.username}></AmplifyGreetings>
            <div className="App">
                <CreatePost />
                <DisplayPosts />
            </div>
        </Fragment>
    ) : (
      <AmplifyAuthenticator />
    );
}

export default withAuthenticator(App);
