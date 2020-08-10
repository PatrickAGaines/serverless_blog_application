import React, { Component } from 'react';
import { API, graphqlOperation} from 'aws-amplify';
import { createLike } from '../graphql/mutations';
import UsersWhoLikedPost from './UsersWhoLikedPost';
import { FaThumbsUp, FaSadTear } from 'react-icons/fa';


class LikeButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isHovering: false,
            postLikedBy: [],
            errorMessage: "",
            posts: this.props.posts
        }
    }

    likedPost = (postId) => {
        for (let post of this.state.posts) {
            console.log(post.id);
            if (post.id === postId) {
                if (post.postOwnerId === this.props.ownerId) return true;
                for (let like of post.likes.items) {
                    if (like.likeOwnerId === this.props.ownerId) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    handleLike = async postId => {
        if (this.likedPost(postId)) {return this.setState({errorMessage: "Can't like your own post"})} {
            const input = {
                numberLikes: 1,
                likeOwnerId: this.props.ownerId,
                likeOwnerUsername: this.props.ownerUsername,
                likePostId: postId
            }
            console.log(input);
            try {
                const result = await API.graphql(graphqlOperation(createLike, {input}))
                console.log("Liked: ", result.data);
            } catch(error) {
                console.log(error)
            } 
        }
    }

    handleMouseHover = async postId => {
        this.setState({ isHovering: !this.state.isHovering })
        let innerLikes = this.state.postLikedBy
        for (let post of this.state.posts) {
            if (post.id === postId) {
                for (let like of post.likes.items) {
                    innerLikes.push(like.likeOwnerUsername)
                }
            }
            this.setState({postLikedBy: innerLikes})
        }
        console.log("Post liked by: ", this.state.postLikedBy);
    }

    handleMouseHoverLeave = async () => {
        this.setState({ isHovering: !this.state.isHovering })
        this.setState({ postLikedBy: [] })
    }

    render() {
        const { post, loggedInUser } = this.props

        return(
            <span>
                <p className="alert">{post.postOwnerId === loggedInUser && this.state.errorMessage}</p>
                <p 
                    className="like-button"
                    style={{ color: (post.likes.items.length > 0) ? "blue" : "grey" }}
                    onMouseEnter={ () => this.handleMouseHover(post.id) }
                    onMouseLeave={ () => this.handleMouseHoverLeave() }
                    onClick={ () => this.handleLike(post.id) }
                    >
                    <FaThumbsUp />
                    {post.likes.items.length}
                </p>
                {
                    this.state.isHovering &&
                    <div className="users-liked">
                        {this.state.postLikedBy.length === 0 ? "Liked by no one " : "Liked by: "}
                        {this.state.postLikedBy.length === 0 ? <FaSadTear /> : <UsersWhoLikedPost data={this.state.postLikedBy}/>}
                    </div>
                }
            </span>
        )
    }
}

export default LikeButton;