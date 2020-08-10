import React, { Component } from 'react';
import DeleteComment from './DeleteComment';

class CommentPost extends Component {

    render() {
        const { content, commentOwnerUsername, createdAt, id, commentOwnerId } = this.props.commentData
        const { loggedInUser } = this.props
        return(
            <div className="comment">
                <span style={{ fontStyle: "italic", color: "#0ca5e297"}}>
                    {"Comment by: "} { commentOwnerUsername }
                    {" on "}
                    <time style={{ fontStyle: "italic" }}>
                        { " " }
                        { new Date(createdAt).toLocaleString() }
                    </time>
                    {commentOwnerId === loggedInUser &&
                    <DeleteComment commentId={id} />
                }
                </span>
                <span>
                <p>{ content }</p>
                </span>
            </div>
        )
    }
}

export default CommentPost;