import  './styles.css'
import { Button, 
        Card, 
        CardActions, 
        CardContent, 
        IconButton, 
        ListItem,
        Input, 
        Typography,
        Dialog,
        DialogTitle,
        DialogActions} from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React,{ useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Comments } from "../CommentForm";
import Moment from "react-moment";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";
import { CHANGING_POST_FETCH, DELETE_POST_FETCH } from "../../../actions/SagaActions";
import { routesSaver } from '../../../actions/RoutesForComponents';

export const Post = props => {
    const [state, setPostState] = useState({...props.postInfo, 
        likeCount: 5, 
        editMode: false, 
        editStyle: 'none', 
        actionCount: 0,
        deleteFlag: false})  
    const [commFormState, setCommFormState] = useState({
        formCommStyle: "none", 
    })
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const userId = useSelector(state => (state.saga.userProfile.id))
    useEffect(()=>{
        setPostState({...props.postInfo, 
            likeCount: 5, 
            editMode: false, 
            editStyle: 'none', 
            actionCount: 0});
        props.fromRouter!==undefined&&setPostState(state => ({...state, editStyle: 'block'}))
        props.fromRouter!==undefined&&routesSaver(pathname)
        state.editCommentMode ?
        setCommFormState({formCommStyle: 'block'}) :
        (props.fromRouter!==undefined ? 
        setCommFormState({formCommStyle: 'block'})
        : setCommFormState({formCommStyle: "none"}))
    },[props])
    const editIsOver = () => {
        (state.title!==props.postInfo.title||state.description!==props.postInfo.description)&&
            dispatch({type: CHANGING_POST_FETCH, payload: {comments: state.comments,
            createdAt: state.createdAt,
            description: state.description,
            id: state.id,
            title: state.title,
            updatedAt: state.updatedAt,
            user_id: state.user_id}})
    };
    const editMode = () => {
        state.actionCount%2===0 ? 
        setPostState(state => ({...state, editMode: true, actionCount: state.actionCount+1}))
        : setPostState(state => ({...state, editMode: false, actionCount: state.actionCount+1}));
        editIsOver();
    }
    const deletePost = () => {
        setPostState(state => ({...state, deleteFlag: !state.deleteFlag}))
    }
    deletePost.yes = () => {
        dispatch({type: DELETE_POST_FETCH, payload: state.id})
    }
    const handleClickLike = () => {
        setPostState(state => ({...state, likeCount: state.likeCount+1}))
    }
    const showComments = () => {
        commFormState.formCommStyle !== 'block' ? 
        setCommFormState(state => ({...state, formCommStyle: 'block'}))
        : setCommFormState(state => ({...state, formCommStyle: 'none'}));
    }
    const handlerRoute = () => {
        !state.editMode&&dispatch({type: 'CHANGE_ROUTE', payload: `/posts/${state.id}`})
        pathname!==`/posts/${state.id}`&&
        navigate(`/posts/${state.id}`);
        routesSaver(`/posts/${state.id}`, 'post')
    }
    const handlerChangePost = e =>{
        e.target.type!=='textarea' ?
        setPostState(state => ({...state, title: e.target.value}))
        : setPostState(state => ({...state, description: e.target.value}))
    }
    return(
        <ListItem>    
            <Card className="post_card">      
                    <CardContent onClick={handlerRoute} className="post_card_hovered_part">
                        {state.editMode ? <Input 
                        className="post_title_input"
                        onChange={handlerChangePost} 
                        value={state.title}/>
                        : <div className="post_info">
                            <Typography className="post_title" variant="h6">
                                {state.title}
                            </Typography>
                            <Typography className="post_author" variant="h6">
                                {(' user: '+ state.user_id||' your_post')}
                            </Typography>
                        </div>}
                        {state.editMode ? 
                        <textarea 
                        className="post_description_input"
                        onChange={handlerChangePost} 
                        value={state.description}/> 
                        : <Typography 
                        className="post_description"
                        color="text.secondary" 
                        gutterBottom>
                            {state.description}
                        </Typography>}
                        <Typography className="post_date">
                            {"created: "}
                            <Moment  calendar={true}>
                                {state.createdAt} 
                            </Moment>
                        </Typography>
                    </CardContent>
                    <CardActions >
                       {props.fromRouter===undefined&&<Button onClick={showComments}>Show comments ({state.comments.length})</Button>}
                        {userId===state.user_id&&<IconButton aria-label="delete" onClick={deletePost}>
                            <DeleteIcon />
                            <Dialog
                            open={state.deleteFlag}
                            aria-labelledby="alert-dialog-title">
                            <DialogTitle id="alert-dialog-title">
                              {"Do you want to delete your post?"}
                            </DialogTitle>
                            <DialogActions>
                              <Button onClick={deletePost.yes}>Yes</Button>
                              <Button>No</Button>
                            </DialogActions>
                          </Dialog>
                        </IconButton>}
                        <IconButton aria-label="delete" onClick={handleClickLike} >
                            <FavoriteIcon  />
                        </IconButton>
                        <Typography className="like_count" color="text.secondary">
                            {state.likeCount}
                        </Typography>
                        {userId===state.user_id&&<Button onClick={editMode} 
                        style={{display:`${state.editStyle}`}}>
                            {!state.editMode ? 'Edit' : 'Save'}
                        </Button>}
                    </CardActions>
                    <Comments 
                    display= {commFormState.formCommStyle} 
                    comments={state.comments} 
                    postId={state.id}/>
            </Card>
        </ListItem>
    )
}