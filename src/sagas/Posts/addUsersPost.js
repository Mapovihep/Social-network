import {put} from 'redux-saga/effects' 

export default function* addUsersPost (post) {
    console.log(post)
    const response = yield fetch( `https://test-api-post.herokuapp.com/posts/add`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8','Authorization': localStorage.getItem('token')},
        body:   JSON.stringify({title: post.title,
            description: post.description})
        })
        const addResponse = yield response.json();
 }
