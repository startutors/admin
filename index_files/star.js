var User = {
	userlist:null,
	current:null,
	save : function(user)
	{
		suser = {};
		suser = user;
		

		userformdata = JSON.stringify(suser);
		console.log(userformdata);
		
		$.ajax(apiurl+"/user/"+suser['id'], {
			data : userformdata,
			contentType : 'application/json',
			type : 'PUT',
		})
		.done(function(data) {
			if(data.error == 1)
				swal({title: "Failure!",text: data.msg.message, type: "warning"});
			else
			{
				swal("Success!", "User data has been updated.", "success");
				$("#editusermodal").modal('hide');
			}
			console.log(data);
		});
		
	},
	list : function()
	{
		$.get( apiurl+"/user", { token: authuser.token }, function(userlist) {
			if(userlist)
				{
					console.log(userlist);
					User.userlist = userlist;
					pucard = $('.userlist .proto');
					$.each(User.userlist, function(user)
					{
						nucard = pucard.clone();
						nuser = User.userlist[user];
						nucard.find(".email").html(nuser.email);
						nname = "";
						if(nuser.firstname)
							nname = nuser.firstname;
						if(nuser.lastname)
							nname += " " + nuser.lastname;	
						if(nname != "")
							nucard.find(".name").html(nname);
							
							
							
						if(nuser.usertype == "admin")
							nucard.find(".type").addClass('bgm-red ');
						if(nuser.usertype == "student")
							nucard.find(".type").addClass('bgm-green ');
						if(nuser.usertype == "tutor")
							nucard.find(".type").addClass('bgm-blue ');		
						nucard.find(".type").html(nuser.usertype);
						nucard.find(".useredit").attr("ulid", user);
						
						//console.log(nuser);
						
						
						
						$('.contacts.userlist').append(nucard);
						nucard.fadeIn();
						console.log(nucard);	
					});
				}
				else
				{
					notify("Empty","inverse")
				}
			})
		.fail(function() {
			notify("Connection Error","inverse")
		});
	}
}

$("body").on("click","#editusermodal button.save", function(event){
	event.preventDefault();
	$.each(User.current,function(key) {
          User.current[key]=$(".edituserform").find("[name='"+key+"']").val();
    });
	//User.current["usertype"] = $(".edituserform #usertype")
	
	User.save(User.current); //should use a promise but whatev

});

$("body").on("click","#editusermodal button.cancel", function(event){
	event.preventDefault();
	alert(3);
});

$("body").on("click","button.useredit", function(event){
	event.preventDefault();
	ulid = $(this).attr("ulid");
	User.current=User.userlist[ulid];
	fslam = "<div class='row' style='padding:15px 0;'>";
	findex = 0;
	$('#editusermodal .modal-body').html("");
	$.each(User.userlist[ulid], function(x)
	{
		//console.log(x);
		if(User.userlist[ulid][x] == null)
			User.userlist[ulid][x] = "";
		if(x == "ccdata")
			User.userlist[ulid][x] = "";
			
		disabled = "";
		if(x == 'id' || x == 'passhash' || x == 'createdAt' || x == 'updatedAt')
			disabled = "disabled";

		if(x == "usertype")
		{
			ssel = (User.userlist[ulid][x] == "student")?'selected':'';
			tsel = (User.userlist[ulid][x] == "tutor")?'selected':'';
			asel = (User.userlist[ulid][x] == "admin")?'selected':'';
			ffieldalt = '<label class="xfg-label small">'+x+'</label>'+
			'<select class="form-control" name="usertype" id="usertype">'+
             '<option '+ssel+'>student</option><option '+tsel+'>tutor</option><option '+asel+'>admin</option>'+
            '</select>';
		}
		else
			ffieldalt = '<label class="xfg-label small">'+x+'</label>'+'<input '+disabled+' type="text" class="form-control" value="'+User.userlist[ulid][x]+'" name="'+x+'">';
		
		ffield = 
			'<div class="col-sm-6">'+
				'<div class="input-group fg-float">'+
					'<span class="input-group-addon"><i class="zmdi"></i></span>'+
					'<div class="fg-line">'+
						ffieldalt+
					'</div>'+
				'</div>'+
			'</div>';
			fslam += ffield;
			if(findex%2)
				fslam += "</div><div class='row' style='padding:15px 0;'>";	
			findex++;
	});
	
	$('#editusermodal .modal-title').html("<h2>Edit User</h2>");
	$('#editusermodal .modal-body').html(fslam);

	
});



function notify(message,type){$.growl({message:message},{type:type,allow_dismiss:!1,label:"Cancel",className:"btn-xs btn-inverse",placement:{from:"bottom",align:"left"},delay:2500,animate:{enter:"animated fadeInUp",exit:"animated fadeOutDown"},offset:{x:30,y:30}})};