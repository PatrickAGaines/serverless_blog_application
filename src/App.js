import React, { Fragment, useEffect, useState } from 'react';
import { withAuthenticator, AmplifyGreetings, AmplifyAuthenticator } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import Header from './components/Header';
import DisplayPosts from './components/DisplayPosts';
import CreatePost from './components/CreatePost';

import './App.css';

function App() {
    const [authState, setAuthState] = useState();
    const [user, setUser] = useState();

    useEffect(() => {
        return onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setUser(authData)
        });
    }, []);

    return authState === AuthState.SignedIn && user ? (
        <Fragment>
            <Header />
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
