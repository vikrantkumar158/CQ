var userName = document.getElementById('button1');
var passWord = document.getElementById('button2');
var loginBtn = document.getElementById('login_button');

function validateForm(){
	console.log(1);
	event.preventDefault();
    if(userName.value == ""|| passWord.value == ""){
        alert("All Fields are required");
    } else {
        var userdata = new Object();
        userdata.userName = userName.value;
        userdata.passWord = passWord.value;
        console.log(userdata);
        var request = new XMLHttpRequest();
        request.open("POST",'/login');
        request.setRequestHeader("Content-Type","application/json");
        request.send(JSON.stringify(userdata));
        request.onload = function(){
            var dataReturned = JSON.parse(request.responseText);
            if(dataReturned.length==0)
			{
                userName.value="";
                passWord.value="";
				document.getElementById("alert1Center").innerHTML="Username or Password not recognized";
				document.getElementById("alert1").style.height="60px";
				document.getElementById("alert1").style.padding="20px";
				setTimeout(function(){
				document.getElementById("alert1").style.height="0px";
				document.getElementById("alert1").style.padding="0px";
				},4000);
            } 
			else 
			{
                console.log(dataReturned);
				if(dataReturned[0].delob=='1')
				{
					userName.value="";
					passWord.value="";
					document.getElementById("alert1Center").innerHTML="User was deleted";
					document.getElementById("alert1").style.height="60px";
					document.getElementById("alert1").style.padding="20px";
					setTimeout(function(){
					document.getElementById("alert1").style.height="0px";
					document.getElementById("alert1").style.padding="0px";
					},4000);
				}
				else if(dataReturned[0].delob=='-1')
					location.href='/editInformation';	
				else if(dataReturned[0].role=='Admin'||dataReturned[0].role=='Superadmin')
					location.href='/admin/profile';
				else
					location.href='/community/communitypanel';
            }
        }
    }
}