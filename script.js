$( document ).ready(function() {

	var timetowait = [];
	for(var i=0;i<100;i++){
		timetowait.push(2000+(i*100));
	}

	var smalltimetowait = [];
	for(var i=0;i<100;i++){
		smalltimetowait.push(400+(i*40));
	}

	var current_url = window.location.href;

	function getTimeToWait(){
		var pos = Math.ceil(Math.random() *(timetowait.length-1));
		return timetowait[pos]+Math.ceil(Math.random()*100)+Math.ceil(Math.random()*10)+Math.ceil(Math.random());
	}

	function getSmallTimeToWait(){
		var pos = Math.ceil(Math.random() *(smalltimetowait.length-1));
		return smalltimetowait[pos]+Math.ceil(Math.random()*10)+Math.ceil(Math.random());
	}

	var myregex = {
		firstname : new RegExp('%firstname%', 'g'),
		lastname : new RegExp('%lastname%', 'g'),
		fullname : new RegExp('%fullname%', 'g')
	};

	var maincontainer =
	'<div id="lincodeIn_container" class="lincodeIn_draggable">'+
		'<div class="lincodeIn_logotext">'+
			"<span class='lincodeIn_logo'>LincodeIn</span>"+
			"<span class='lincodeIn_hide'>х</span>"+
			'<div style="clear:both;"></div>'+
			'<div>Send mass invits and custom messages</div>'+
		'</div>'+
		'<div class="lincodeIn_label">'+
			'Number of invit to send'+
		'</div>'+
		'<div class="lincodeIn_input">'+
			'<input name="lincodeIn_nbtoadd" type="number">'+
		'</div>'+
		'<div class="lincodeIn_label">'+
			'Message'+
		'</div>'+
		'<div class="lincodeIn_input">'+
			'<textarea rows="2" name="lincodeIn_message" placeholder="Hello %firstname%, how are you ?"></textarea>'+
		'</div>'+
		'<div class="lincodeIn_button">'+
			'<button class="lincodeIn_validate search-result__actions--primary button-secondary-medium">Launch</button>'+
		'</div>'+
	'</div>';
	var mainmsg = '<div id="lincodeIn_msg"></div>';

	var leads = [];

	$('body').on('click','.lincodeIn_hide',function(){
		$('#lincodeIn_container').hide();
	});

	$('body').on('click','.lincodeIn_show',function(){
		$('#lincodeIn_container').show();
	});

	$('body').on('click','.lincodeIn_validate',function(){
		var max = parseInt($('input[name="lincodeIn_nbtoadd"]').val());
		var message = $('textarea[name="lincodeIn_message"]').val();
		if(message)
			message = message.trim();
			if(message.length==0)
				message = null;


		var search_term = $('textarea[name="lincodeIn_searchword"]').val();
		if(search_term){
			if(search_term.indexOf(',')!=1){
				search_term = search_term.split(',');
			}else{
				var temp = search_term;
				search_term = [];
				search_term.push(temp);
			}
		}else{
			search_term = [];
		}

		var rejected_term = $('textarea[name="lincodeIn_rejectword"]').val();
		if(rejected_term){
			if(rejected_term.indexOf(',')!=1){
				rejected_term = rejected_term.split(',');
			}else{
				var temp = rejected_term;
				rejected_term = [];
				rejected_term.push(temp);
			}
		}else{
			rejected_term = [];
		}

		console.log('Max invitations to send '+max);
		console.log('Search term ok  '+search_term);
		console.log('Rejected term not ok  '+rejected_term);

		if(!max)
			max = 1000;

		$("html, body").animate({
      		scrollTop: $(document).height()+800
    	}, 4000);

    	setTimeout(
	    	function(){
	    		leads = [];
	    		$('ul.results-list li .search-result__actions--primary').each(function(index){
	    			console.log($(this).is(':disabled'));
	    			if(!$(this).is(':disabled')){
						var obj  = {};
						obj.fullname = $(this).closest('ul.results-list li.search-result').find('a[data-control-name="search_srp_result"] .name-and-icon .name').text();
						obj.firstname = obj.fullname.split(' ')[0];
						obj.lastname = "";

						for(i in obj.fullname.split(' ')){
							if(i!=0){
								obj.lastname+=obj.fullname.split(' ')[i]+" ";
							}
						}
						obj.jobtitle = $(this).closest('ul.results-list li.search-result').find('p.subline-level-1').text();
						obj.id = $(this).closest('ul.results-list li.search-result').attr('id');

						console.log(obj.jobtitle);
						console.log(search_term);

						if(search_term.length>0){
							for(i in search_term){
								if(obj.jobtitle.trim().toLowerCase().indexOf(search_term[i].trim().toLowerCase())!=-1  && search_term[i].trim().length>0){
									obj.accept = true;
								}
							}
						}else{
							obj.accept = true;
						}
						if(rejected_term.length>0){
							for(i in rejected_term){
								if(obj.jobtitle.trim().toLowerCase().indexOf(rejected_term[i].trim().toLowerCase())!=-1 && rejected_term[i].trim().length>0){
									obj.accept = false;
								}
							}
						}

						if(message){
							var temp = message;
							temp = temp.replace(myregex.firstname,obj.firstname);
							temp = temp.replace(myregex.lastname,obj.lastname);
							temp = temp.replace(myregex.fullname,obj.fullname);
							obj.message = temp;
						}

						if(obj.accept){
							obj.timetowait = getTimeToWait();
							if(leads.length<max){
								leads.push(obj);
								console.log('************************************************');
								console.log('Accepted');
								console.log(obj);
								console.log('************************************************');
							}
						}else{
							console.log('************************************************');
							console.log('Not accepted');
							console.log(obj);
							console.log('************************************************');
						}
						if(index==$('ul.results-list li .search-result__actions--primary').length-1){
							sendInvit(0);
						}
					}
				});
	    	}, 5000
	    );
	});

	function sendInvit(index){
		var button = '.search-result__actions button.search-result__actions--primary.button-secondary-medium';
		if(index<leads.length){
			$('#'+leads[index].id+' '+button).trigger('click');
			setTimeout(
		    	function(){
		    		if(!leads[index].message) {
		    			$('.send-invite__actions button.button-primary-large').trigger('click');
		    			setTimeout(
    						function(){
    							sendInvit(index+1);
    						},1000
    					);
		    		}else if(leads[index].message.length>0){
		    			$('.send-invite__actions button.button-secondary-large').trigger('click');
		    			setTimeout(
		    				function(){
		    					// $('label #custom-message').focus();
		    					// $('label #custom-message').val(leads[index].message);
		    					// alert('sdfd');

		    					$('label #custom-message').focus(() => { $('label #custom-message').val(leads[index].message); });
		    					setTimeout(
		    						function(){
		    							$('.send-invite__actions button.button-primary-large').trigger('click');
		    							setTimeout(
				    						function(){
				    							sendInvit(index+1);
				    						},600+getSmallTimeToWait()
				    					);
		    						},1000
		    					);
		    				},615+getSmallTimeToWait()
		    			);
		    // 		new Promise(resolve => {
 					// 	setTimeout(() => {
    		// 			$('label #custom-message').focus();
		    // 			$('label #custom-message').val(leads[index].message);
   			// 			resolve();
 					// 	}, 615+getSmallTimeToWait());
						// }).then(() => new Promise(resolve => {
  				// 		setTimeout(() => {
   			// 			$('.send-invite__actions button.button-primary-large').trigger('click');
   			// 			resolve();
  				// 		}, 1000);
						// })).then(() => new Promise(resolve => {
  				// 		setTimeout(() => {
   			// 			sendInvit(index+1);
   			// 			 resolve();
 					// 	 }, 600+getSmallTimeToWait())
						// }));



		    		}else{
		    			$('.send-invite__actions button.button-primary-large').trigger('click');
		    			setTimeout(
    						function(){
    							sendInvit(index+1);
    						},1000
    					);
		    		}
		    	}, 800+getSmallTimeToWait()
		    );
		}else{
			showMsg('Finish ! Refresh page to see changes please !');
		}
	}

	function insertMainContainer(){
		if($('.lincodeIn_draggable').length==0){
			$('body').prepend(maincontainer);
			$( ".lincodeIn_draggable").draggable();
		}
		if($('#lincodeIn_msg').length==0){
			$('body').prepend(mainmsg);
		}
	}

	function insertButton(){
		if($('.lincodeIn_show').length==0){
			var mybutton = '<div style="text-align:right;padding-right:25px;"><button class="lincodeIn_show search-result__actions--primary button-secondary-medium">Launch LincodeIn</button></div>';
			$(mybutton).insertAfter($('.search-results__container header'));
		}
	}

	function initPage(){
		if(window.location.href.indexOf('search')!=-1){
			var cptloading = 0;
			var checkLoading = setInterval(
		    	function(){
		    		if($('ul.results-list li').length>0 && cptloading<50){
		    			clearInterval(checkLoading);
		    			setTimeout(
					    	function(){
					    		insertMainContainer();
								insertButton();
					    	}, 250
					    );
		    		}else if(cptloading>=50){
		    			showMsg('A problem occured');
		    			clearInterval(checkLoading);
		    		}else{
		    			cptloading ++;
		    		}
		    	}, 500
		    );
		}
	}

	initPage();
	$("body").bind("DOMSubtreeModified", function() {
	    if(window.location.href!=current_url){
			current_url = window.location.href;
			setTimeout(
		    	function(){
		    		initPage();
		    	}, 500
		    );
		}
	});

	function showMsg(msg){
		$('#lincodeIn_msg').html(msg);
		$('#lincodeIn_msg').show();
		setTimeout(
	    	function(){
	    		$('#lincodeIn_msg').hide();
	    	}, 2700
	    );
	}
});
