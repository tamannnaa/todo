let tasks=[];
let id=1;

let task=document.querySelector("#task");
let tasklist=document.querySelector("#tasklist")


document.addEventListener("DOMContentLoaded",function() {
    loadTasks();
});



task.addEventListener("keypress",function(e){
    // console.log(e)
    if(e.key=="Enter"){
        // console.log("called");
        // let taskname=task.value;
        // tasks.push(taskname)
        // addtoDom(taskname);
        // console.log(tasks);

        let timestamp=new Date();
        let obj={};
        obj.title=task.value;
        obj.status="pending";
        obj.timestamp=timestamp.toISOString()
        obj.taskid=id;
        id++;

        tasks.push(obj);

        task.value="";

        addtoDom(obj);
        saveTasks();
        console.log(tasks);
    }
})

function addtoDom(task){

    let taskdiv=document.createElement("div");
    taskdiv.setAttribute("id",task.taskid);

    let span=document.createElement("span");
    span.innerText=task.title;


    let chk=document.createElement("input");
    chk.setAttribute("type","checkbox");

    if (task.status === "completed") {
        span.style.textDecoration = "line-through";
        chk.checked = true;
    }


    let timespan= document.createElement("span");
    timespan.setAttribute("id",`timeoftask${task.taskid}`)
    timespan.innerText = `(${getTime(task.timestamp)})`;
    timespan.style.fontSize = '12px';
    timespan.style.color = '#777';
    timespan.style.marginLeft = '10px';

    taskdiv.append(span);
    taskdiv.append(timespan);
    taskdiv.append(chk);

    
    chk.addEventListener("click",function(){
        console.log(chk.checked);
        let status="pending"
        if(chk.checked==true){
            span.style.textDecoration="line-through";
            status="completed";
        }
        else{
            span.style.textDecoration="none";
            status="pending";
        }
        tasks=tasks.map(function(i){
            if(i.taskid==task.taskid){
                i.status=status;
            }
            return i;
        })
        console.log(tasks);
        saveTasks();

    })

    let edit=document.createElement("button");
    edit.innerText="Edit"
    edit.setAttribute("id",`editbtn-${task.taskid}`);

    
    edit.addEventListener("click",function(){
        let newtext=prompt("Edit task: ",task.title)
        if(newtext!=null||newtext.trim()!==""){
            span.innerText=newtext;
            tasks=tasks.map(function(i){
                if(i.taskid==task.taskid){
                    i.title=newtext;
                }
                return i;
            })
            console.log(tasks);
            saveTasks();
        }
    })

    taskdiv.append(edit);

    let dlt=document.createElement("button");
    dlt.innerText="Delete"
    dlt.setAttribute("id",`dltbtn-${task.taskid}`);

    dlt.addEventListener("click",function(){
        let p=prompt("Are you sure you want to delete this task? (Type `y` to delete and `n` to exit the prompt ")
        if(p=="y"){
            tasks=tasks.filter(function(i){
                return i.taskid!==task.taskid
            })
            taskdiv.remove()
            saveTasks();

        }
    })

    taskdiv.append(dlt);
    tasklist.append(taskdiv);
    // taskdiv.innerText=task.value;
    // tasklist.append(taskdiv);
    // task.value="";
}
function getTime(timestamp){
    const now=new Date();
    const taskDate=new Date(timestamp);
    const diff=now-taskDate;
    const sec=Math.floor(diff/1000);
    const mins=Math.floor(sec/60);
    const hours=Math.floor(mins/60);
    const days=Math.floor(hours/24);

    if(sec<30){
        return "few seconds ago";
    }
    else if(sec>=30&&sec<60){
        return `${sec} seconds ago`;
    }
    else if(mins==1){
        return "a minute ago";
    }
    else if(mins>1&&mins<60){
        return `${mins} minutes ago`;
    }
    else if(hours==1){
        return "an hour ago";
    }
    else if(hours>1&&hours<24){
        return `${hours} hours ago`;
    }
    else if(days==1){
        return "a day ago";
    }
    else{
        return `${days} days ago`;
    }
}


function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks(){
    let saved=localStorage.getItem('tasks');
    if(saved){
        tasks=JSON.parse(saved);
        id=tasks.length?Math.max(...tasks.map(task=>task.taskid))+1:1;
        tasks.forEach(task=>addtoDom(task));
    }
}