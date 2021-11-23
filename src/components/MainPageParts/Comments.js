import React, { useEffect, useState } from "react";
import { Comment } from "../MainPageParts/Comment";
import { InputForNewComment } from "./InputForNewComment";
export const Comments = props => {
    let commArray = [];
    for(let el of props.comments){
        commArray.push({...el, editMode: false, key: Math.round(Math.random()*100000)})
    }
    const [stateOfPage, setStateOfPage] = useState({inputValue: '', editMode: false, comments: commArray});
    useEffect(()=>{
        setStateOfPage({
            inputValue: '', editMode: false, comments: commArray
        })
    }, [])
    return(
        <form style={{ display: `${props.display}`, width: "100%", textAlign: "center" }}>
            {stateOfPage.comments.map(newComment=>
            <Comment commentInfo={newComment}
            key={newComment.key}
            editMode={newComment.editMode}
            postId={props.postId}/>)}
            <InputForNewComment postId={props.postId}/>
        </form>
    )
}