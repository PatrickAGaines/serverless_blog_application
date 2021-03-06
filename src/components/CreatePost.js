import React, { Component } from 'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { createPost } from '../graphql/mutations';

class CreatePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postOwnerId: "",
            postOwnerUsername: "",
            postTitle: "",
            postBody: ""
        }
    }

    componentDidMount = async () => {
        await Auth.currentUserInfo()
            .then(user => {
                this.setState({
                    postOwnerId: user.attributes.sub,
                    postOwnerUsername: user.username
                })
            })
    }

    handleChangePost = event => this.setState({ [event.target.name]: event.target.value })

    handleAddPost = async event => {
        event.preventDefault();

        const input = {
            postOwnerId: this.state.postOwnerId,
            postOwnerUsername: this.state.postOwnerUsername,
            postTitle: this.state.postTitle,
            postBody: this.state.postBody,
            createdAt: new Date().toISOString()
        }

        await API.graphql(graphqlOperation(createPost, { input }))

        this.setState({ postTitle: "", postBody: "" })
    }

    render() {
        return(
            <form className="add-post"
            onSubmit={this.handleAddPost}>
                <input 
                style={{ font: "19px" }}
                type="text"
                placeholder="Title"
                name="postTitle"
                required
                value={this.state.postTitle}
                onChange={this.handleChangePost}
                />
                <textarea
                    className="post-box" 
                    type="text"
                    name="postBody"
                    rows="3"
                    cols="40"
                    required
                    placeholder="New Blog Post"
                    value={this.state.postBody}
                    onChange={this.handleChangePost}
                />
                <input
                style={{ fontSize: "19px" }}
                type="submit"
                className="btn"
                />
            </form>
        )
    }
}

export default CreatePost;