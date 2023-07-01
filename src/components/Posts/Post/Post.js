import React, { useState } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import useStyles from './styles';
import { useHistory } from 'react-router-dom';
import { deletePost, likePost } from '../../../actions/posts';

const Post = ({ post, setCurrentId }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('profile'));
    const [likes,setLikes] = useState(post?.likes);
    const hasLikedPost = post.likes.find((like) => like === (user?.result?.googleId || user?.result?._id));

    const handleLike = async () => {
        dispatch(likePost(post._id));

        if(hasLikedPost){
            setLikes(post.likes.filter((id) => id !== (user?.result?.googleId || user?.result?._id)))
        }
        else{
            setLikes([...post.likes, (user?.result?.googleId || user?.result?._id)]);
        }
    };

    const Likes = () => {
        if (likes.length > 0) {
            return likes.find((like) => like === (user?.result?.googleId || user?.result?._id))
                ? (
                    <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${post.likes.length} like${post.likes.length > 1 ? 's' : ''}`}</>
                ) : (
                    <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
                );

        }
        return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>
    }

    const openPost = () => history.push(`/posts/${post._id}`);

    return (
        <Card className={classes.card} raised elevation={6}>
            <ButtonBase className={classes.cardAction} onClick={openPost}>
                <CardMedia className={classes.media} image={post.selectedFile} title={post.title} />
                <div className={classes.overlay}>
                    <Typography variant="h6"> {post.name} </Typography>
                    <Typography variant="body2"> {moment(post.createdAt).fromNow()} </Typography>
                </div>
                <div className={classes.details}>
                    <Typography variant="body2" color="textSecondary"> {post.tags.map((tag) => `${tag} `)} </Typography>
                </div>

                <Typography className={classes.title} variant="h5"> {post.title} </Typography>
                <CardContent>
                    <Typography variant="body2" color="textPrimary" component="p"> {post.message.split(' ').splice(0, 20).join(' ')}... </Typography>
                </CardContent>
            </ButtonBase>
            <CardActions className={classes.cardActions}>
                {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator)
                    && (
                        <div className={classes.overlay2} name="edit">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentId(post._id);
                                }}
                                style={{ color: 'white' }}
                                size="small"
                            >
                                <MoreHorizIcon fontSize="default" />
                            </Button>
                        </div>
                    )}
                <Button color="primary" disabled={!user?.result} size="small" onClick={handleLike}>
                    <Likes />
                </Button>

                {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator)
                    && (
                        <Button color="secondary" size="small" onClick={() => dispatch(deletePost(post._id))}>
                            <DeleteIcon fontSize="small" />
                            &nbsp;Delete
                        </Button>
                    )}
            </CardActions>
        </Card>

    );
}

export default Post;