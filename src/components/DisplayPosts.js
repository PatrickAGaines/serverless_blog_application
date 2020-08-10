import React, { Component } from 'react';
import { listPosts } from '../graphql/queries';
import { API, graphqlOperation, Auth } from 'aws-amplify';

import DeletePost from './DeletePost';
import EditPost from './EditPost';
import CreateCommentPost from './CreateCommentPost';
import CommentPost from './CommentPost';
import LikeButton from './LikeButton';
import { onCreatePost, onDeletePost, onUpdatePost, onCreateComment, onCreateLike, onDeleteComment } from '../graphql/subscriptions';


class DisplayPosts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ownerId: "",
            ownerUsername: "",
            posts: []
        }
    }
    
    componentDidMount = async () => {
        this.getPosts();

        await Auth.currentUserInfo()
        .then(user => {
            this.setState({
                ownerId: user.attributes.sub,
                ownerUsername: user.username
            })
        })

        this.createPostListener = API.graphql(graphqlOperation(onCreatePost))
        .subscribe({
            next: postData => {
                const newPost = postData.value.data.onCreatePost
                const prevPosts = this.state.posts.filter( post => post.id !== newPost.id )
                const updatedPosts = [newPost, ...prevPosts]
                this.setState({ posts: updatedPosts })
            }
        })

        this.DeletePostListener = API.graphql(graphqlOperation(onDeletePost))
        .subscribe({
            next: postData => {
                const deletedPost = postData.value.data.onDeletePost
                const updatedPosts = this.state.posts.filter( post => post.id !== deletedPost.id )
                this.setState({ posts: updatedPosts })
            }
        })

        this.updatePostListener = API.graphql(graphqlOperation(onUpdatePost))
        .subscribe({
            next: postData => {
                const { posts } = this.state
                const updatedPost = postData.value.data.onUpdatePost
                const index = posts.findIndex(post => post.id === updatedPost.id)
                const updatedPosts = [
                    ...posts.slice(0, index),
                     updatedPost,
                    ...posts.slice(index + 1)
                    ]

                    this.setState({ posts: updatedPosts })
            }
        })

        this.createPostCommentListener = API.graphql(graphqlOperation(onCreateComment))
        .subscribe({
            next: commentData => {
                const createdComment = commentData.value.data.onCreateComment
                let posts = [...this.state.posts]
                for(let post of posts) {
                    if (createdComment.post.id === post.id) {
                        post.comments.items.push(createdComment)
                    }
                }
                this.setState({ posts })
            }
        })

        this.deletePostCommentListener = API.graphql(graphqlOperation(onDeleteComment))
        .subscribe({
            next: commentData => {
                const deletedComment = commentData.value.data.onDeleteComment
                const posts = [...this.state.posts]
                for(let post of posts) {
                    if(post.id === deletedComment.post.id) {
                        post.comments.items = post.comments.items.filter(item => item.id !== deletedComment.id)
                    }
                }
                this.setState({ posts })
            }
        })

        this.createPostLikeListener = API.graphql(graphqlOperation(onCreateLike))
        .subscribe({
            next: postData => {
                const createdLike = postData.value.data.onCreateLike
                let posts = [...this.state.posts]
                for (let post of posts) {
                    if (createdLike.post.id === post.id) {
                        post.likes.items.push(createdLike)
                    }
                }
                this.setState({ posts })
            }
        })

    }

    componentWillUnmount() {
        this.createPostListener.unsubscribe();
        this.DeletePostListener.unsubscribe();
        this.updatePostListener.unsubscribe();
        this.createPostCommentListener.unsubscribe();
        this.deletePostCommentListener.unsubscribe();
        this.createPostLikeListener.unsubscribe();
    }
    
    getPosts = async () => {
        const result = await API.graphql(graphqlOperation(listPosts))
        this.setState({ posts: result.data.listPosts.items })
    }

    render() {
        const { posts } = this.state
        posts.sort((a,b) => (b.createdAt > a.createdAt) ? 1 : ((a.createdAt > b.createdAt) ? -1 : 0));
        const { ownerId } = this.state
        const { ownerUsername } = this.state
        let loggedInUser = this.state.ownerId
        return posts.map(( post ) => {
            return(
                <div className="posts" style={rowStyle} key={ post.id }>
                    <h1>{ post.postTitle }</h1>
                    <span style={{ fontStyle: "italic", color: "#0ca5e297" }}>
                        { "Wrote by: " } { post.postOwnerUsername }

                        {" on "}
                        <time style={{ fontStyle: "italic" }}>
                            {" "}
                            { new Date (post.createdAt).toLocaleString() }

                        </time>
                    </span>
                    <p>{ post.postBody }</p>
                    <br />
                    <span>
                        {post.postOwnerId === loggedInUser &&
                            <DeletePost data={post}/>
                        }
                        {post.postOwnerId === loggedInUser &&
                            <EditPost {...post}/>
                        }
                        <span>
                            <LikeButton post={post} posts={posts} loggedInUser={loggedInUser} ownerId={ownerId} ownerUsername={ownerUsername} />
                        </span>
                    </span>
                    <span>
                        <CreateCommentPost postId={post.id}/>
                        { post.comments.items.length > 0 && <span style={{ fontSize: "19px", color: "grey" }}>Comments: </span> }
                        {
                            post.comments.items.sort((a,b) => (a.createdAt > b.createdAt) ? 1 : ((b.createdAt > a.createdAt) ? -1 : 0))
                            .map((comment, index) => <CommentPost key={index}  commentData={comment} loggedInUser={loggedInUser}/>)
                        }
                    </span>
                </div>
            )
        })
    }
}

const rowStyle = {
    background: '#f4f4f4',
    padding: '10px',
    border: '1px #ccc dotted',
    margin: '14px'
}

export default DisplayPosts;