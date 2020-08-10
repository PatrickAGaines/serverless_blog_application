import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { deleteComment } from '../graphql/mutations';

class DeleteComment extends Component {
    
    handleDeleteComment = async commentId => {
        console.log(commentId)
        const input = {
            id: commentId
        }

        await API.graphql(graphqlOperation(deleteComment, {input}))
    }

    render() {
        const commentId = this.props.commentId
        return(
            <button className="delete-comment" onClick={ () => this.handleDeleteComment(commentId) }>X</button>
        )
    }
}

export default DeleteComment;