let cl=console.log;


// let baseurl=`https://jsonplaceholder.typicode.com/posts/`

const postcontainer=document.getElementById("postcontainer")
const postform=document.getElementById("postform")
const titlecontrol=document.getElementById("title")
const contentcontrol=document.getElementById("content")
const submit=document.getElementById("submit")
const update=document.getElementById("update")

let baseurl=`https://jsonplaceholder.typicode.com/posts`




let postarray=[]

const onEditbtn=(ele)=>{
   // cl(ele)
    //cl(ele.closest(".card").id)
    let id=ele.closest(".card").id
    localStorage.setItem("update",id)

    let getsingleurl=`${baseurl}/${id}`
   
   let res= makeapi("GET", getsingleurl, null)
    //cl(res)
    update.classList.remove("d-none")
    submit.classList.add("d-none")
   
    
}

const onupdate=(e)=>{
    //cl(update)
    //cl("update")
    let id=localStorage.getItem("update");
    //cl(id)
    let updateurl=`${baseurl}/${id}`;
    //cl(updateurl)
   let obj={
    title:titlecontrol.value,
    body:contentcontrol.value
   }
  
   update.classList.add("d-none")
   submit.classList.remove("d-none")
   makeapi("PATCH", updateurl, JSON.stringify(obj))
   let card=document.getElementById(id)
   cl(card)
   card.innerHTML=`<div class="card-header">${obj.title}</div>
   <div class="card-body">${obj.body}</div>
   <div class="card-footer">
       <button class="btn btn-primary" onClick="onEditbtn(this)">EDIT</button>
       <button class="btn btn-danger"  onClick="onDeletbtn(this)">DELETE</button>
   </div>`
}





const createcard=(post)=>{
    let div=document.createElement("div")
    div.className="card mb-4"
        div.innerHTML=`

    <div class="card-header">${post.title}</div>
    <div class="card-body">${post.body}</div>
    <div class="card-footer">
        <button class="btn btn-primary" onClick="onEditbtn(this)">EDIT</button>
        <button class="btn btn-danger" onClick="onDeletbtn(this)">DELETE</button>
    </div>
    
    
  
    `
postcontainer.append(div)
}



const templating=(arr)=>{
    let result='';
    arr.forEach(std => {
        result+=
        `
        <div class="card mb-4" id="${std.id}">
            <div class="card-header">${std.title}</div>
            <div class="card-body">${std.body}</div>
            <div class="card-footer text-right">
                <button class="btn btn-primary" onClick="onEditbtn(this)">EDIT</button>
                <button class="btn btn-danger" onClick="onDeletbtn(this)">DELETE</button>
            </div>
        </div>
        `
    });
    postcontainer.innerHTML=result;
}
const makeapi=(methodname, apiurl, body) => {
    let xhr=new XMLHttpRequest();
    xhr.open(methodname, apiurl)
   
    xhr.onload= function () {
        if(this.status === 200){
            let postarray=JSON.parse(this.response);
            if(Array.isArray(JSON.parse(this.response))){
                templating(postarray)
            }else if(methodname === "GET"){
               titlecontrol.value=postarray.title;
               contentcontrol.value=postarray.body;
            }else if(this.status === 201){
                createcard(body)
            }
        }
    }
    xhr.send(JSON.stringify(body))

}
makeapi("GET", baseurl, null)


const onpostsubmit=(eve)=>{
    eve.preventDefault()
    cl(eve)
    let obj={
        title:titlecontrol.value,
        body:contentcontrol.value,
        userid:Math.floor(Math.random()*11)

    }
    let xhr=new XMLHttpRequest()
    xhr.open("POST" ,baseurl)
   
    xhr.onload=function(){
        if(this.status===200||this.status===201){
            obj.id=JSON.parse(this.response).id
            cl(obj)
            let=postarray.push(obj)
            createcard(obj)
            
            

        }
       

    }


    xhr.send(JSON.stringify(obj))


 }
 const onDeletbtn=(ele)=>{
    cl("delete")
    let id=ele.closest(".card").id
    let updateurl=`${baseurl}/${id}`
    
    makeapi("DELETE", updateurl)
ele.closest(".card").remove()

 }





postform.addEventListener("submit", onpostsubmit)
update.addEventListener("click", onupdate)