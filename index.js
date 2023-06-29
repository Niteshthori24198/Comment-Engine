
const socket = io("http://localhost:3000" , {transports:["websocket"]})

socket.on("getallblogs" , (blogs)=>{

    DisplayBlogs(blogs)

})


const createblog = document.getElementById("createbtn")

createblog.addEventListener("click", ()=>{

    CreateNewBlog()

})





function DisplayBlogs(blogs){

    const blogcont = document.querySelector(".showblogs")

    const Blogs = blogs.map((blog)=>{

        return `<div class="blogBox">
        
                    <h3>Title : ${blog.title}</h3>

                    <p>Description : ${blog.desc}</p>

                    <input type="text" placeholder="Write Comment" id="${blog.id}">

                    <button onclick ="addNewComment('${blog.id}')" >Add Comment</button>

                    <button onclick ="DeleteBlog('${blog.id}')" >Delete Blog</button>


                    <div class="commentBox">Comments : - ${

                            blog.Comments.map((c)=>{

                                return `
                                
                                    <div>
                                    
                                        <p>${c.comment}</p>

                                        <input type="text" id="${c.id}" placeholder="Reply">

                                        <button onclick="addReply('${c.id}', '${blog.id}')">Add Reply</button>

                                        <button onclick="deleteComment('${c.id}', '${blog.id}')">Delete Comment</button> 



                                        <div class="replyBox">Reply : ${

                                                c.replies.map((r)=>{

                                                    return `
                                                    
                                                        <div class="replyBox">

                                                            <p>${r.reply}</p>

                                                            <button onclick="deleteReply('${r.id}', '${c.id}', '${blog.id}')">Delete Reply</button>   
                                                    
                                                        </div>

                                                    `

                                                }).join('')

                                            }

                                        </div>


                                    </div>
                                
                                `

                              
                            }).join('')

                        }

                    </div>


                </div>`

    }).join('')

    

    blogcont.innerHTML = Blogs;


}





function CreateNewBlog(){

    const title = document.getElementById("blogtitle").value 

    const desc = document.getElementById("blogdesc").value

    if(!title || !desc){

        alert("kindly enters all details to create new blog")

        return

    }

    const blog = {title , desc}

    socket.emit("createnewblog" , blog)

    alert("Blog Created Successfully !")


}




function addNewComment(bid){

    const comment = document.getElementById(bid).value

    if(!comment){
        alert("Write some comment")

        return
    }

    const commentObj = {comment , blogID:bid}

    socket.emit("writeComment" , commentObj)

    alert("Comment Added")

}





function addReply(cid , bid){

    const reply = document.getElementById(cid).value

    if(!reply){
        alert("Write some reply")

        return
    }

    const replyObj = {reply , cid , bid}

    socket.emit("writeReply" , replyObj)

    alert("Reply Added")

}




function DeleteBlog(bid){

    let Obj = {bid}

    socket.emit("removeblog" , Obj)
    
    alert("Blog Deleted !! ")

}




function deleteComment(cid,bid){

    let Obj = {cid , bid}

    socket.emit("removecomment" , Obj)
    
    alert("Comment Deleted !! ")

}




function deleteReply(rid,cid,bid){

    let Obj = {rid,cid,bid}

    socket.emit("removereply" , Obj)
    
    alert("Reply Deleted !! ")

}