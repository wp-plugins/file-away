jQuery(document).ready(function($)
{
	// FLASH BODY WIDTH FOR WEB FONTS
    setTimeout(function(){
        $('body').width($('body').width()+1).width('auto');
    }, 500);	
	// TABS
	$('a[id^="fileaway-tab-"]').on('click', function(ev)
	{
		ev.preventDefault();
		var slug = $(this).attr('data-tab');
		var panel = $('div#fileaway-panel-'+slug);
		if(panel.is(':visible')){}
		else
		{
			$('li.'+slug).addClass('state-active').siblings('li').removeClass('state-active');
			$('div[id^="fileaway-panel-"]').fadeOut(500);
			panel.delay(500).fadeIn(500);
			if(slug == 'customcss' && CodeMirror)
			{
				setTimeout(function()
				{
					CodeMirror.refresh();
				}, 500);
			}
		}		
	});
	// CHOSEN
	$('select#baseurl, select#manager-role-access, select#manager-user-access').chozed({width: '450px'});
	$('select.chozed-select').chozed({
		allow_single_deselect:true, 
		width: '200px', 
		inherit_select_classes:true,
		no_results_text: "Say what?",
		search_contains: true, 
	});
	// MANAGER MODE STUFF
	$('select#manager-role-access').on('change', function()
	{
		var roleaccess_selected = []; 
		$(this).each(function(i, selected)
		{ 
			roleaccess_selected[i] = $(selected).val(); 
		});
		$('input#manager_role_access').val(roleaccess_selected);
	});
	$('select#manager-user-access').on('change', function()
	{
		var useraccess_selected = []; 
		$(this).each(function(i, selected)
		{ 
			useraccess_selected[i] = $(selected).val(); 
		});
		$('input#manager_user_access').val(useraccess_selected);
	});
	// BASE DIRECTORY STUFF
	$('input[id^=base]').each(function() 
	{
    	var idSuffix = this.id,
	       	i = $(this),
	        s = $('#fileaway-abspath-' + idSuffix),
	        w = $('#fileaway-wrap-' + idSuffix),		
	        e = $('#fileaway-error-' + idSuffix),
	        rx = /^(wp-admin|\/wp-admin|wp-includes|\/wp-includes)/i;
		i.on('focus', function() 
		{
			w.addClass('fileaway-focus');
		});
		i.on('blur', function() 
		{
			w.removeClass('fileaway-focus');
		});
		s.on('click', function() 
		{
			i.focus();
		});
		w.on('click', function() 
		{
			i.focus();
		});
	    i.on('keyup', function() 
		{
	        var test = rx.test(i.val());
	        w.toggleClass('fileaway-error', test);
	        if(test) e.show(600);
	        else e.hide(600);
	    });
	});	
	// PLACEHOLDER STUFF
	$("input[type=text], textarea").each(function()
	{
		if ($(this).val() === $(this).attr("placeholder") || $(this).val() === "") $(this).css({color:"#BBBBBB"});
	});
	$("input[type=text], textarea").on('focus', function()
	{
		if($(this).val() == $(this).attr("placeholder") || $(this).val() === "")
		{
			$(this).val("");
			$(this).css("color", "#666666");
		}
	}).blur(function()
	{
		if($(this).val() == "" || $(this).val() == $(this).attr("placeholder"))
		{
			$(this).val($(this).attr("placeholder"));
			$(this).css("color", "#BBBBBB");
		}
	});
	// WARNING STYLE
	$("select#reset_options").on('change', function()
	{
		$info = $("span.link-fileaway-help-reset_options");
		if($(this).val() === 'reset') $info.css({color:'orange','font-size':'22px'});
		else $info.css({'color':'#A6A29E','font-size':'15px'});
	});
	// SAVE SETTINGS
	$('span.fileaway-save-settings').on('click', function()
	{
		var settings = {};
		var frm = $("#fileaway-form"),
			svn = $("#fileaway-saving"),
			bck = $("#fileaway-saving-backdrop"),
			img = $("#fileaway-saving-img"),
			svd = $("#fileaway-settings-saved");
		img.css({'bottom' : '-100px'});
		svn.fadeIn('slow');
		bck.fadeIn('fast');
		img.fadeIn('slow').css({'bottom' : '50px', 'transition' : 'all 1s ease-out'});
		if(CodeMirror) CodeMirror.save();
		$('div#fileaway-options-container [placeholder]').each(function()
		{
			var input = $(this);
			if(input.val() == input.attr('placeholder')) input.val('');
		})
		$('input[id^=base]').each(function()
		{
			var i = $(this);
			var rx = /^(wp-admin|\/wp-admin|wp-includes|\/wp-includes)/i;
			var check = rx.test(i.val());
	        if(check) i.val('');
		});
		$("input#custom_list_classes").val(function(i, val)
		{
		  return val.replace(/ssfa-/g,"");
		});
		$("input#custom_table_classes").val(function(i, val)
		{
		  return val.replace(/ssfa-/g, '');
		});
		$("input#custom_color_classes").val(function(i, val)
		{
		  return val.replace(/ssfa-/g, '');
		});
		$("input#custom_accent_classes").val(function(i, val)
		{
		  return val.replace(/accent-/g, '');
		});									
		$("input#manager_user_access").val(function(i, val)
		{
			return val.replace(/\s/g, '');
		});
		$('div#fileaway-options-container [name^="fileaway_options"]').each(function()
		{
			settings[this.id] = $(this).val();
		});
		var data = { action : 'fileaway_save', settings : settings, nonce : fileaway_admin_ajax.nonce };
		$.post(fileaway_admin_ajax.ajaxurl, data, function(response)
		{
			svn.fadeOut('slow');
			img.delay(2000).queue(function(next)
			{
				$(this).css({'bottom' : '2400px', 'transition' : 'all 4.5s ease-in'}); next();
			});
			svd.delay(1000).fadeIn('slow').delay(2500).fadeOut('slow');
			bck.delay(4500).fadeOut('slow'); 
		}); 
	});
	// Tutorials Sections
	$('select#fileaway-tutorials').on('change', function(){
		$selection = $(this).val();
		$allcontent = $('div[id^="fileaway-tutorials-"]');
		if($selection == '') $allcontent.fadeOut(500);
		else 
		{
			$content = $('div#fileaway-tutorials-'+$selection);	
			if(false == $content.is(':visible'))
			{
				$allcontent.fadeOut(500);	
				$content.delay(500).fadeIn(500);
			}
		}
	});
	// ACCORDION STUFF
	$(".fileaway-accordion > dt").on('click', function()
	{
    	$('.fileaway-accordion-active').removeClass('fileaway-accordion-active');
	    if(false == $(this).next().is(':visible')) 
		{
	        $(this).addClass('fileaway-accordion-active');
	        $('.fileaway-accordion > dd').slideUp(600);
	    }
	    $(this).next().slideToggle(600);
	});
	// Info Links
	var	con = $('.fileaway-help-content');
	$('div[id^=fileaway-help-]').each(function() {
		var sfx = this.id,
			mdl = $(this),
			cls = $('.fileaway-help-close'),			
			lnk = $('.link-' + sfx);
		lnk.click(function(){
			mdl.fadeIn('fast');
		});
		mdl.click(function() {
			mdl.fadeOut('fast');
		});
		cls.click(function(){
			mdl.fadeOut('fast');
		});
	});
	con.click(function() {
		return false;
	});
	// Remove Update Notice after 10 Seconds
	setTimeout(function() {	$("div.updated, div.update-nag").fadeOut(600);	}, 10000);	
});