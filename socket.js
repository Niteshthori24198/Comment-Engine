
const express = require('express')

const app = express()

const http = require('http')

const server = http.createServer(app)

app.get("/", (req,res)=>{
    res.send("Home Page")
})

server.listen(3000, ()=>{
    console.log("server is running !!")
})



const BlogsDB = []


const { v4: uuidv4 } = require('uuid');

const { Server } = require('socket.io')

const io = new Server(server)


io.on("connection" , (socket)=>{

    // sent all blogs to client

    io.emit("getallblogs" , BlogsDB)

    // add new blog

    socket.on("createnewblog" , (blog)=>{

        blog.id = uuidv4();

        blog.Comments = []

        BlogsDB.push(blog)

        io.emit("getallblogs" , BlogsDB)

    })


    // add comment

    socket.on("writeComment", (commentObj)=>{


        commentObj.id = uuidv4();

        commentObj.replies = []

        BlogsDB.forEach((blog) => {

            if(blog.id === commentObj.blogID){

                blog.Comments.push(commentObj)
            }
        })


        io.emit('getallblogs', BlogsDB);

    })


    // add reply 


    socket.on("writeReply", (replyObj)=>{


        replyObj.id = uuidv4();

        BlogsDB.forEach((blog) => {

            if(blog.id === replyObj.bid){

                blog.Comments.forEach((c)=>{

                    if(c.id === replyObj.cid){

                        c.replies.push(replyObj)

                    }

                })

                
            }
        })


        io.emit('getallblogs', BlogsDB);

    })


    // delete blog


    socket.on("removeblog", (blog)=>{

        BlogsDB.forEach((b,i)=>{

            if(b.id === blog.bid){

                BlogsDB.splice(i,1)

            }


        })

        io.emit('getallblogs', BlogsDB);

    })




    // delete comment


    socket.on("removecomment", (Obj)=>{

        BlogsDB.forEach((blog)=>{

            if(blog.id === Obj.bid){

                blog.Comments.forEach((c,i)=>{

                    if(c.id === Obj.cid){

                        blog.Comments.splice(i,1)

                    }

                })

            }


        })

        io.emit('getallblogs', BlogsDB);


    })



    // delete reply


    socket.on("removereply", (Obj)=>{


        BlogsDB.forEach((blog)=>{

            if(blog.id === Obj.bid){

                blog.Comments.forEach((c)=>{

                    if(c.id === Obj.cid){

                        c.replies.forEach((r,i)=>{

                            if(r.id === Obj.rid){

                                c.replies.splice(i,1)
                            }

                        })

                        

                    }

                })

            }


        })

        io.emit('getallblogs', BlogsDB);

    })



})