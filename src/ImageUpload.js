import React, { useState } from "react";
import { Button, Modal, makeStyles } from "@material-ui/core";
import { db, storage } from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: "absolute",
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function ImageUpload({ username }) {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const [open, setOpen] = useState(false);

    const [caption, setCaption] = useState("");
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // Error function ...
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function ...
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then((url) => {
                        // post image inside db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username,
                        });

                        setCaption("");
                        setImage(null);
                        setProgress(0);
                    });
                setOpen(false);
            }
        );
    };

    return (
        <div className="imageUpload">
            <Modal open={open} onClose={() => setOpen(false)}>
                <div style={modalStyle} className={classes.paper}>
                    <div className="imageUpload__form">
                        {/* Progress Bar */}
                        <progress
                            className="imageUpload__progress"
                            value={progress}
                            max="100"
                        />

                        {/* Caption input */}
                        <input
                            type="text"
                            placeholder="Enter caption"
                            onChange={(event) => setCaption(event.target.value)}
                            value={caption}
                        />

                        {/* File picker */}
                        <input type="file" onChange={handleChange} />

                        {/* Post button */}
                        <Button onClick={handleUpload}>Upload</Button>
                    </div>
                </div>
            </Modal>
            <Button onClick={() => setOpen(true)}>Upload</Button>
        </div>
    );
}

export default ImageUpload;
