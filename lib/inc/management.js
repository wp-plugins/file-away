(function(jQuery)
{
	jQuery.fn.hasAttr = function(name)
	{
		for(var i = 0, l = this.length; i < l; i++)
		{
			if(!!(this.attr(name) !== undefined)) return true;
		}
		return false;
	};
})(jQuery);
jQuery(document).ready(function($)
{
	// FLASH BODY WIDTH FOR WEB FONTS
    setTimeout(function(){
        $('body').width($('body').width()+1).width('auto');
    }, 500);	
});
FlightBoxes = [];
jQuery(document).ready(function($)
{
	flightbox = function(url, uid, theme, icons, nolinks)
	{
		var in_iframe = (window.location != window.parent.location) ? 'iframe ' : '';
		if(typeof(url) === 'undefined') url = false;
		if(!url) return false;
		var id = uid.split("-");
		if(!$('#ssfa-flightbox-shadow').length)
		{
			var FlightBox = $('<div id="ssfa-flightbox" />');
			var FlightBoxCont = $('<div class="ssfa-flightbox-controls" />');
			var theShadow = $('<div id="ssfa-flightbox-shadow" class="'+theme+'" />');
			$('body', window.top.document).append(theShadow);
			$('body', window.top.document).append(FlightBox);
			theShadow.hide();
			FlightBox.hide();
		}
		else
		{
			var FlightBox = $('div#ssfa-flightbox', window.top.document);
			var FlightBoxCont = $('div.ssfa-flightbox-controls', window.top.document);
			var theShadow = $('div#ssfa-flightbox-shadow', window.top.document);	
		}
		theShadow.on('click', function(e)
		{
			Xflightbox();
		});
		if(!$('div.flightbox-spinner').length)
		{
			var loading = $(
				'<div class="flightbox-spinner">'+
					'<div class="fb-rect1"></div>'+
					'<div class="fb-rect2"></div>'+
					'<div class="fb-rect3"></div>'+
					'<div class="fb-rect4"></div>'+
					'<div class="fb-rect5"></div>'+
				'</div>'
			);
		} 
		else var loading = $('div.flightbox-spinner');
		FlightBoxCont.prepend(loading);
		var total = FlightBoxes[id[0]];
		var next = id[1] >= total ? 1 : (+id[1]+1);
		var prev = id[1] == 1 ? total : (+id[1]-1);
		$next = $('div.ssfa-meta-container[data-uid="'+id[0]+'"] a[data-flightbox="'+(next)+'"]');
		$next = $next.length 
			? $next.get(0).attributes.onclick.value 
			: $('iframe').contents().find('div.ssfa-meta-container[data-uid="'+id[0]+'"] a[data-flightbox="'+(next)+'"]').get(0).attributes.onclick.value;
		$prev = $('div.ssfa-meta-container[data-uid="'+id[0]+'"] a[data-flightbox="'+(prev)+'"]');
		$prev = $prev.length
			? $prev.get(0).attributes.onclick.value 
			: $('iframe').contents().find('div.ssfa-meta-container[data-uid="'+id[0]+'"] a[data-flightbox="'+(prev)+'"]').get(0).attributes.onclick.value;
		$current = $('div.ssfa-meta-container[data-uid="'+id[0]+'"] a[data-flightbox="'+(id[1])+'"]');
		$current = $current.length  
			? $current.get(0).attributes.onclick.value 
			: $('iframe').contents().find('div.ssfa-meta-container[data-uid="'+id[0]+'"] a[data-flightbox="'+(id[1])+'"]').get(0).attributes.onclick.value;
		$nexturl = $('div.ssfa-meta-container[data-uid="'+id[0]+'"] a[data-flightbox="'+(next)+'"]');
		$nexturl = $nexturl.length
			? $nexturl.attr('href')
			: $('iframe').contents().find('div.ssfa-meta-container[data-uid="'+id[0]+'"] a[data-flightbox="'+(next)+'"]').attr('href');
		$prevurl = $('div.ssfa-meta-container[data-uid="'+id[0]+'"] a[data-flightbox="'+(prev)+'"]');
		$prevurl = $prevurl.length
			? $prevurl.attr('href')
			: $('iframe').contents().find('div.ssfa-meta-container[data-uid="'+id[0]+'"] a[data-flightbox="'+(prev)+'"]').attr('href');
		$url = $('div.ssfa-meta-container[data-uid="'+id[0]+'"] a[data-flightbox="'+(id[1])+'"]');
		$url = $url.length
			? $url.attr('href')
			: $('iframe').contents().find('div.ssfa-meta-container[data-uid="'+id[0]+'"] a[data-flightbox="'+(id[1])+'"]').attr('href');
		var wh = $(window.top).height();
		var ww = $(window.top).width();		
		theShadow.fadeIn(500);
		$.post
		(
			fileaway_mgmt.ajaxurl,
			{
				action : 'fileaway-manager',
				dataType : 'html',	
				act : 'flightbox',
				url : url,
				uid : String(uid),
				theme : theme,
				icons : icons,
				wh	: wh,
				ww	: ww,
				next : $next,
				prev : $prev,
				nexturl : $nexturl,
				prevurl : $prevurl,
				currenturl : $url,
				current : $current,
				nolinks : nolinks,
				nonce : fileaway_mgmt.nonce						
			},
			function(response)
			{
				$('div#ssfa-flightbox-inner', window.top.document).animate({opacity:'0'}, 500);
				$('div.ssfa-flightbox-controls a', window.top.document).animate({opacity:'0'}, 0);
				loading.remove();
				FlightBox.delay(500).animate({
					left: response.offset,
					height: response.height, 
					width: response.width, 
					top: response.top
				}, 500, function(){
					$(this).replaceWith(response.html);
					$('div#ssfa-flightbox-inner', window.top.document).animate({opacity:'1'}, 500);
					$('div.ssfa-flightbox-controls span', window.top.document).css({opacity:'0.8'});
					if(response.iframe == 'true', window.top.document)
					{
						$('div#ssfa-flightbox-inner iframe', window.top.document).width(response.iwidth);
						$('div#ssfa-flightbox-inner iframe', window.top.document).height(response.iheight);	
					}
				});
			}
		)
		return false;
	}
	// close the flightbox
	Xflightbox = function()
	{
		$('div#ssfa-flightbox', window.parent.document).fadeOut(500).queue(function(){$(this).remove();});
		$('div#ssfa-flightbox-shadow', window.parent.document).fadeOut(500).queue(function(){$(this).remove();});
	}
});
jQuery(document).ready(function($)
{
	// Bulk Download Check
	if($('span[id^=ssfa-bulk-download-engage]').length)
	{
		// Cache the Data on DOM Ready
		$('table.bd-table tr[id^=ssfa-file-]').each(function()
		{
			$sfx = this.id;
			$type = $('td#filetype-'+$sfx).data('ext');
			$path = $('td#filename-'+$sfx).data('path');
			$name = $('td#filename-'+$sfx).data('name');
		});
		// Bulk Download Select All Function
		$checkall = $('input[id^="ssfa-bulk-download-select-all-"]');
		$checkall.on('change', function()
		{
			$uid = this.id;
			$uid = $uid.replace('ssfa-bulk-download-select-all-', '');
			$selectalltext = $(this).data('selectall');
			$clearalltext = $(this).data('clearall');
			$selectall = $('label#ssfa-bulkdownload-select-all-'+$uid);
			if(this.checked)
			{
				$selectall.text($clearalltext);
				$('table.bd-table tr[id^=ssfa-file-'+$uid+']').addClass('ssfabd-selected');
				$('table.bd-table tr[id^=ssfa-file-'+$uid+'].fileaway-dynamic').removeClass('ssfabd-selected');
			}
			else
			{
				$selectall.text($selectalltext);
				$('table.bd-table tr[id^=ssfa-file-'+$uid+']').removeClass('ssfabd-selected');							
			}
		});
		// Bulk Download Toggle Selected Files
		$('table.bd-table tr[id^=ssfa-file-]').each(function()
		{
			$('a', this).on('click', function(e)
			{
				e.stopPropagation();
			});
			$(this).on('click', function()
			{
				if($(this).hasClass('ssfabd-selected')) $(this).removeClass('ssfabd-selected');	
				else if(!$(this).hasClass('fileaway-dynamic')) $(this).addClass('ssfabd-selected');						
			}); 
		}); 	
		// Bulk Download Engage Function
		$('span[id^="ssfa-bulk-download-engage-"]').on('click', function()
		{
			$uid = this.id;
			$uid = $uid.replace('ssfa-bulk-download-engage-', '');
			$loading = $('img#ssfa-engage-ajax-loading-'+$uid);
			var selectedFilesFrom = {};
			var selectedCount = 0;
			var messages = '';
			var jackoff = false;
			$('table.bd-table tr[id^=ssfa-file-'+$uid+']').each(function(index)
			{
				if($(this).hasClass('ssfabd-selected'))
				{
					var sfx = this.id;
					var filepath = String($('td#filename-'+sfx).data('path'));
					var oldname = String($('td#filename-'+sfx).data('name'));
					var	ext = String($('td#filetype-'+sfx).data('ext'));
					if(oldname.indexOf('..') >= 0 || filepath.indexOf('..') >= 0 || filepath === '/') jackoff = true;
					else
					{
						selectedFilesFrom[index] = filepath+'/'+oldname+'.'+ext;
						selectedCount++;
					}
				}
			});
			if(jackoff)
			{
				filertify.set({labels:{ok : fileaway_mgmt.ok_label}});
				filertify.alert(fileaway_mgmt.tamper1);
			} 
			else 
			{			
				if(selectedCount == 0) 
					messages += fileaway_mgmt.no_files_selected+'<br>';
				if(messages !== '')
				{ 
					filertify.set({labels:{ok : fileaway_mgmt.ok_label }}); 
					filertify.alert(messages) 
				}
				else 
				{
					// Ajax Bulk Action Download Function
					$loading.show();
					$.post(
						fileaway_mgmt.ajaxurl,
						{
							action : 'fileaway-manager',
							dataType : 'html',	
							act : 'bulkdownload',
							files : selectedFilesFrom,
							nonce : fileaway_mgmt.nonce						
						},
						function(response)
						{
							$loading.hide();		
							if(response == 'Error')
							{ 
								filertify.set({labels:{ok : fileaway_mgmt.ok_label }}); 
								filertify.alert(response); 
							}
							else 
							{
								$('<iframe src="'+response+'" id="fa-bulkdownload" style="visibility:hidden;" name="fa-bulkdownload">').appendTo('body');	
							}
						}
					) // End Ajax Bulk Action Download Function
				}
			}
		}); // End Bulk Download Engage Function
	} // End Bulk Download Check
}); 
jQuery(document).ready(function($)
{
	// Manager Check
	if($('th.ssfa-manager').length)
	{
		// Multi-Manager Check
		$i = 0;
		$('table.dirtree-table').each(function()
		{
			if($(this).data('drawer') == 'drawer') $i++;
		});
		if($i > 1)
		{ 
			filertify.set({labels:{ok : fileaway_mgmt.ok_label }});
			filertify.alert('Notice: You have multiple Directory Tree or Manager Mode tables on the same page with no drawer id number specified. Please add <code>drawerid="1"</code>, <code>drawerid="2"</code>, etc., to each Directory Tree or Manager table shortcode, assigning them each a unique id number.');
		}
		// Cache the Data on DOM Ready
		$('table.mngr-table').each(function()
		{
			$uid = $(this).data('uid');
			$page = $(this).data('pg');
			$drawer = $(this).data('drw');
			$class = $(this).data('cls');
			$basename = $(this).data('basename');
			$start = $(this).data('start');
			$dir = $(this).data('dir');
			$base = $(this).data('base');
			$basedir = $(this).data('basedir');
			$fafl = $(this).data('fafl');
			$faui = $(this).data('faui');
			$faun = $(this).data('faun');
			$faur = $(this).data('faur');
			$faum = $(this).data('faum');
		});
		$('table.mngr-table tr[id^=ssfa-dir-]').each(function()
		{
			$sfx = this.id;
			$path = $('td#folder-'+$sfx+' a').data('path');
			$name = $('td#folder-'+$sfx+' a').data('name');			
		});
		$('table.mngr-table tr[id^=ssfa-file-]').each(function()
		{
			$sfx = this.id;
			$type = $('td#filetype-'+$sfx).data('ext');
			$path = $('td#filename-'+$sfx).data('path');
			$name = $('td#filename-'+$sfx).data('name');
		});
		// Allowed Characters Settings
		$('table[id^="ssfa-table-"] tbody tr[id^="ssfa-file-"] input').alphanum({allow : "~!@#$^&()_+`-={}[]',"});
		$('table[id^="ssfa-table-"] tbody tr[id^="row-ssfa-create-dir-"] input').alphanum({allow : "~!@#$/^&()_+`-={}[]',"});
		$('table[id^="ssfa-table-"] tbody tr[id^="ssfa-dir-"] input').alphanum({allow : "~!@#$^&()_+`-={}[]',"});
		// Initialize Chosen Select
		$('select.ssfa-directories-select, select.ssfa-bulk-action-select').chozed({
			allow_single_deselect:true, 
			width: '150px', 
			inherit_select_classes:true,
			no_results_text: fileaway_mgmt.no_results,
			search_contains: true 
		});
		// Create Dir
		$('body').on('click', 'a[id^="ssfa-create-dir-"]', function(ev)
		{
			ev.preventDefault();
			var sfx = this.id,
				createinput = $('input#input-'+sfx),
				manager = $('td#manager-'+sfx);
			if($(createinput).is(':visible')){}
			else
			{
				createinput.fadeIn(1000).focus();
				manager.html("<a href='javascript:' id='save-"+sfx+"' style='display:none;'>"+fileaway_mgmt.save_link+"</a><br>"+
					"<a href='javascript:' id='cancel-"+sfx+"' style='display:none;'>"+fileaway_mgmt.cancel_link+"</a>")
				var save = $('a#save-'+sfx),
					cancel = $('a#cancel-'+sfx);
				save.delay(500).fadeIn(500);
				cancel.delay(500).fadeIn(500);
			}
		});
		$('body').on('click', 'a[id^="cancel-ssfa-create-dir-"]', function(ev)
		{	
			ev.preventDefault();
			var sfx = this.id.replace('cancel-',''),
				save = $('a#save-'+sfx),
				createinput = $('input#input-'+sfx);
			save.fadeOut(500);
			$(this).fadeOut(500);
			createinput.fadeOut(500).val('');
		});
		$('body').on('click', 'a[id^="save-ssfa-create-dir"]', function(ev)
		{
			ev.preventDefault();
			var sfx = this.id.replace('save-',''),
				cancel = $('a#cancel-'+sfx),
				createinput = $('input#input-'+sfx);
			$newsub = createinput.val();
			if($newsub === '')
			{
				filertify.set({labels:{ok : fileaway_mgmt.ok_label}});
				filertify.alert(fileaway_mgmt.no_subdir_name);
			}
			else
			{
				$(this).fadeOut(500);
				cancel.fadeOut(500);
				createinput.fadeOut(500).val('');					
				var uid = sfx.replace('ssfa-create-dir-','');
				var count = $('table.mngr-table tr[id^=ssfa-dir-]').length;
				var cells = $(this).parents('tr').children('td').length;
				var cls = $(this).parents('table').eq(0).data('cls');
				var page = $(this).parents('table').eq(0).data('pg');
				var drawer = $(this).parents('table').eq(0).data('drw');
				var drawerid = $(this).parents('table').eq(0).data('drawer');
				var dir = String($(this).parents('table').eq(0).data('dir'));
				var base = String($(this).parents('table').eq(0).data('base'));
				$.post
				(
					fileaway_mgmt.ajaxurl,
					{
						action : 'fileaway-manager',
						dataType : 'html',	
						act : 'createdir',
						newsub : $newsub,
						parents : dir,
						base : base,
						uid : uid,
						count : (+count+1),
						cells : (+cells-2),
						cls : cls,
						pg : page,
						drawer : drawer,
						drawerid : drawerid,
						querystring : location.search,
						nonce : fileaway_mgmt.nonce
					},
					function(response)
					{
						if(response.status === 'error')
						{
							filertify.set({labels:{ok : fileaway_mgmt.ok_label}});
							filertify.alert(response.message);	
						}
						else if(response.status === 'success')
						{
							filertify.set({labels:{ok : fileaway_mgmt.ok_label}});
							filertify.alert(response.message);	
						}
						else if(response.status === 'insert')
						{
							$newrow = response.message;
							$row = $('tr#row-'+sfx);	
							$row.after($newrow).hide().fadeIn(500);
						}
					}
				);
				return false;
			}
		}); 
		// Delete Directory Function
		$('body').on('click', 'a[id^="delete-ssfa-dir-"]', function(ev)
		{
			ev.preventDefault();
			var sfx = this.id.replace('delete-',''),
				rename = $('a#rename-'+sfx),
				del = $('a#delete-'+sfx),
				manager = $('td#manager-'+sfx);
			del.fadeOut(500);
			rename.fadeOut(500);				
			if(! $('a#canceldel-'+sfx).length) manager.prepend("<a href='javascript:' id='canceldel-"+sfx+"' style='display:none;'>"+fileaway_mgmt.cancel_link+"</a>")
			if(! $('a#proceed-'+sfx).length) manager.prepend("<a href='javascript:' id='proceed-"+sfx+"' style='display:none;'>"+fileaway_mgmt.proceed_link+"<br></a>")
			if(! $('span#confirm-'+sfx).length) manager.prepend("<span id='confirm-"+sfx+"' style='display:none;'>"+fileaway_mgmt.delete_check+"<br></span>")				
			var proceed = $('a#proceed-'+sfx),
				canceldel = $('a#canceldel-'+sfx),
				confirms = $('span#confirm-'+sfx);
			proceed.delay(500).fadeIn(500);
			canceldel.delay(500).fadeIn(500);						
			confirms.delay(500).fadeIn(500);										
			$subdir = $('td#folder-'+sfx+' a').data('name');
			var dir = String($(this).parents('table').eq(0).data('dir'));
			var base = String($(this).parents('table').eq(0).data('base'));
			$path1 = dir;
			$path2 = String($subdir);
			$(canceldel).on('click', function(ev)
			{
				ev.preventDefault();
				proceed.fadeOut(500);
				canceldel.fadeOut(500);
				confirms.fadeOut(500);					
				rename.delay(0).fadeIn(1000);
				del.delay(0).fadeIn(1000);					
			});
			$(proceed).on('click', function(ev)
			{
				ev.preventDefault();
				proceed.fadeOut(500);
				canceldel.fadeOut(500);
				confirms.fadeOut(500);					
				rename.delay(500).fadeIn(500);
				del.delay(500).fadeIn(500);		
				if($path1.indexOf('..') >= 0 || $path1 === '/' || $path1 === '' || !$path1 || $path1 === 'undefined' || $path1 === undefined)
				{
					filertify.set({labels:{ok : fileaway_mgmt.ok_label }}); 
					filertify.alert(fileaway_mgmt.tamper2);
				}
				else if($path2.indexOf('..') >= 0 || $path2 === '/' || $path2 === '' || !$path2 || $path2 === 'undefined' || $path2 === undefined)
				{
					filertify.set({labels:{ok : fileaway_mgmt.ok_label }}); 
					filertify.alert(fileaway_mgmt.tamper2);
				}
				else
				{
					$.post
					(
						fileaway_mgmt.ajaxurl,
						{
							action : 'fileaway-manager',
							dataType : 'html',	
							act : 'deletedir',
							status : 'life',
							path1 : $path1,
							path2 : $path2,
							nonce : fileaway_mgmt.nonce
						},
						function(response)
						{			
							if(response.status === 'error' || response.status === 'partial')
							{
								filertify.set({labels:{ok : fileaway_mgmt.ok_label }});
								filertify.alert(response.message);	
							}
							else if(response.status === 'success')
							{
								filertify.set({labels:{ok : fileaway_mgmt.ok_label }});
								filertify.alert(response.message);	
								$(del).parents('tr').fadeOut(2000).queue( function(next){ $(this).remove(); next();	});
							}
							else if(response.status === 'success-single')
							{
								$(del).parents('tr').fadeOut(2000).queue( function(next){ $(this).remove(); next();	});
							}
							else if(response.status === 'confirm')
							{
								filertify.set({labels:{ok : fileaway_mgmt.confirm_label, cancel : fileaway_mgmt.cancel_label }});
								filertify.confirm(response.message, function(e)
								{
									if(e)
									{
										$.post(
											fileaway_mgmt.ajaxurl,
											{
												action : 'fileaway-manager',
												dataType : 'html',	
												act : 'deletedir',
												status : 'death',
												path1 : $path1,
												path2 : $path2,
												nonce : fileaway_mgmt.nonce
											},
											function(response)
											{
												if(response.status === 'error' || response.status === 'partial')
												{
													filertify.set({labels:{ok : fileaway_mgmt.ok_label }});
													filertify.alert(response.message);	
												}
												else if(response.status === 'success')
												{
													filertify.set({labels:{ok : fileaway_mgmt.ok_label }});
													filertify.alert(response.message);	
													$(del).parents('tr').fadeOut(2000).queue( function(next){ $(this).remove(); next(); });
												}
											}
										);
										return false;
									}										
								});
							}
						}
					);
					return false;
				}
			}); 
		}); // End Delete Function (Directory Single) 
		// Directory Rename Function
		$('body').on('click', 'a[id^="rename-ssfa-dir-"]', function(ev)
		{
			ev.preventDefault();
			var sfx = this.id.replace('rename-', ''),
				del = $('a#delete-'+sfx),
				manager = $('td#manager-'+sfx),
				dirname = $('td#name-'+sfx+' a'),
				dirinput = $('input#rename-'+sfx);
			$subdir = $('td#folder-'+sfx+' a').data('path');
			$(this).fadeOut(500);
			del.fadeOut(500);
			if(!$('a#cancel-'+sfx).length) manager.prepend("<a href='' id='cancel-"+sfx+"' style='display:none;'>"+fileaway_mgmt.cancel_link+"</a>");
			if(!$('a#save-'+sfx).length) manager.prepend("<a href='' id='save-"+sfx+"' style='display:none;'>"+fileaway_mgmt.save_link+"<br></a>");
			var save = $('a#save-'+sfx),
				cancel = $('a#cancel-'+sfx);
			dirname.fadeOut(500);
			save.delay(500).fadeIn(500);
			cancel.delay(500).fadeIn(500);			
			dirinput.delay(500).fadeIn(500);
		});
		$('body').on('click', 'a[id^="cancel-ssfa-dir-"]', function(ev)
		{
			ev.preventDefault();
			var sfx = this.id.replace('cancel-', '');
			$('a#save-'+sfx).fadeOut(500);
			$(this).fadeOut(500);
			$('a#rename-'+sfx).delay(500).fadeIn(500);
			$('a#delete-'+sfx).delay(500).fadeIn(500);
			$('input#rename-'+sfx).fadeOut(500);
			$('td#name-'+sfx+' a').delay(500).fadeIn(500);
		});
		$('body').on('click', 'a[id^="save-ssfa-dir-"]', function(ev)
		{
			ev.preventDefault();				
			var sfx = this.id.replace('save-', '');
			$dir = String($(this).parents('table').eq(0).data('dir'));
			$base = String($(this).parents('table').eq(0).data('base'));
			$url = $('td#folder-'+sfx+' a');
			$url2 = $('td#name-'+sfx+' a');
			$subdir = $('td#folder-'+sfx+' a').data('path');
			$oldpath = $base+'/'+$subdir;
			$newname = String($('input#rename-'+sfx).val());
			$page = $(this).parents('table').eq(0).data('pg');
			$drawerid = $(this).parents('table').eq(0).data('drawer');
			$('a#save-'+sfx).fadeOut(500);
			$('a#cancel-'+sfx).fadeOut(500);
			$('input#rename-'+sfx).fadeOut(500);
			if($oldpath.indexOf('..') >= 0 || $oldpath === '/' || $newname.indexOf('..') >= 0 || $newname.indexOf('/') >= 0)
			{
				filertify.set({labels:{ok : fileaway_mgmt.ok_label }});
				filertify.alert(fileaway_mgmt.tamper3);
			}
			else if($newname === '' || $newname === 'undefined' || $newname === undefined)
			{
				filertify.set({labels:{ok : fileaway_mgmt.ok_label }});
				filertify.alert(fileaway_mgmt.no_subdir_name);
			}
			else
			{
				$.post
				(
					fileaway_mgmt.ajaxurl,
					{
						action : 'fileaway-manager',
						dataType : 'html',	
						act : 'renamedir',
						datapath : $subdir,
						oldpath : $oldpath,
						newname : $newname,
						parents : $dir,
						pg : $page,
						drawerid : $drawerid,
						querystring : location.search,
						nonce : fileaway_mgmt.nonce
					},
					function(response)
					{ 
						if(response.status === 'error')
						{ 
							filertify.set({labels:{ok : fileaway_mgmt.ok_label }}); 
							filertify.alert(response.message); 
						}
						else
						{
							$newnamerow = 
							$('td#name-'+sfx+' input').val(response.newname).attr('value', response.newname);
							$('tr#'+sfx+' td').each(function()
							{
								$(this).data('value', "# # # # # "+response.newname).attr('data-value', "# # # # # "+response.newname);
							});
							$('td#folder-'+sfx+' a').attr('href', response.url);
							$('td#folder-'+sfx+' a').data('path', response.newdata).attr('data-path', response.newdata);
							$('td#name-'+sfx+' a').attr('href', response.url);
							$('td#folder-'+sfx+' a').data('name', response.newname).attr('data-name', response.newname);
							$('td#name-'+sfx+' a span').text(response.newname);
						}
						$('a#rename-'+sfx).fadeIn(1000);
						$('a#delete-'+sfx).fadeIn(1000);
						$('td#name-'+sfx+' a').fadeIn(1000);
					}
				);					
				return false;
			}
		});	
		// End Directory Rename Function		
		// File Rename Function
		$('body').on('click', 'a[id^="rename-ssfa-file-"]', function(ev)
		{
			ev.preventDefault();
			$id = this.id;
			var sfx = $id.replace('rename-', ''),
				uid = $(this).parents('table:eq(0)').data('uid'),
				rename = $(this),
				del = $('a#delete-'+sfx),
				filename = $('td#filename-'+sfx+' a'),
				rawname = $('input#rawname-'+sfx),
				manager = $('td#manager-'+sfx);
			if(!$('a#cancel-'+sfx).length) manager.prepend("<a href='' id='cancel-"+sfx+"' style='display:none;'>"+fileaway_mgmt.cancel_link+"</a>")
			if(!$('a#save-'+sfx).length) manager.prepend("<a href='' id='save-"+sfx+"' style='display:none;'>"+fileaway_mgmt.save_link+"<br></a>")
			var save = $('a#save-'+sfx);
			var cancel = $('a#cancel-'+sfx);
			rename.fadeOut(500);
			filename.fadeOut(500);
			del.fadeOut(500);				
			save.delay(500).fadeIn(500);
			cancel.delay(500).fadeIn(500);			
			rawname.delay(500).fadeIn(500);
			var customs = $('input[id^="customdata-"][id$="'+sfx+'"]').length;
			customs = customs - 1;
			for(var i=0; i <= customs; i++)
			{
				var cdata = $('input[id^="customdata-'+i+'-'+sfx+'"]');
				cdata.siblings('span').fadeOut('fast');
				cdata.delay(500).fadeIn(500);
			}
		}); 
		$('body').on('click', 'a[id^="cancel-ssfa-file-"]', function(ev)
		{
			ev.preventDefault();
			$id = this.id;
				sfx = $id.replace('cancel-', ''),
				uid = $(this).parents('table:eq(0)').data('uid'),
				rename = $('a#rename-'+sfx),
				del = $('a#delete-'+sfx),
				save = $('a#save-'+sfx),
				cancel = $(this),
				filename = $('td#filename-'+sfx+' a'),
				rawname = $('input#rawname-'+sfx),
				manager = $('td#manager-'+sfx);
			save.fadeOut(500);
			cancel.fadeOut(500);
			rename.delay(500).fadeIn(500);
			del.delay(500).fadeIn(500);
			rawname.fadeOut(500);
			filename.delay(500).fadeIn(500);
			var customs = $('input[id^="customdata-"][id$="'+sfx+'"]').length;
			customs = customs - 1;
			for(var i=0; i <= customs; i++)
			{
				var cdata = $('input[id^="customdata-'+i+'-'+sfx+'"]');
				$(cdata).fadeOut(500);
				$(cdata).siblings('span').delay(500).fadeIn(500);
			}
		});
		$('body').on('click', 'a[id^="save-ssfa-file-"]', function(ev)
		{
			ev.preventDefault();				
			$id = this.id;
			var sfx = $id.replace('save-', '');
				uid = $(this).parents('table:eq(0)').data('uid'),
				rename = $('a#rename-'+sfx),
				del = $('a#delete-'+sfx),
				save = $(this),
				cancel = $('a#cancel-'+sfx),
				filename = $('td#filename-'+sfx+' a'),
				manager = $('td#manager-'+sfx),
				ext = $('td#filetype-'+sfx).data('ext'),
				url = $('td#filename-'+sfx+' a'),
				url2 = $('td#filetype-'+sfx+' a'),					
				rawname = $('input#rawname-'+sfx),
				oldname = String($('td#filename-'+sfx).data('name')),
				filepath = String($('td#filename-'+sfx).data('path')),
				dir = String($('table#ssfa-table-'+$uid).data('dir'));
			var customs = $('input[id^="customdata-"][id$="'+sfx+'"]').length;
			customs = customs - 1;
			customdata = '';
			for(var i=0; i <= customs; i++)
			{
				var cdata = $('input[id^="customdata-'+i+'-'+sfx+'"]');
				customdata += cdata.val()+',';
				cdata.fadeOut(500);
			}
			customdata = customdata.substring(0, customdata.length - 1);
			rawname.fadeOut(500);
			save.fadeOut(500);
			cancel.fadeOut(500);
			$.post
			(
				fileaway_mgmt.ajaxurl,
				{
					action : 'fileaway-manager',
					dataType : 'html',	
					act : 'rename',
					ext : ext,
					url : url.attr('href'),
					rawname : rawname.val(),
					oldname : oldname,								
					pp : dir,
					customdata : customdata,
					nonce : fileaway_mgmt.nonce
				},
				function(response)
				{			
					url.attr("href", response.newurl);
					url.attr("download", response.download);
					url2.attr("href", response.newurl);
					url2.attr("download", response.download);									
					rawname.val(response.rawname);
					$('td#filename-'+sfx).data('name', response.newoldname)
					$('td#filename-'+sfx).attr('data-name', response.newoldname)
					rename.fadeIn(1000);
					del.fadeIn(1000);									
					$('input#rawname-'+sfx).val(response.rawname);
					filename.text(response.rawname);
					filename.fadeIn(1000);
					var newcustomdata = response.customdata;
					newcustomdata = newcustomdata.replace("]", ""); 
					newcustomdata = newcustomdata.replace(" [", "");									
					var newcdata = newcustomdata.split(',');
					for(var i=0; i <= customs; i++)
					{
						var cinput = $('input[id^="customdata-'+i+'-'+sfx+'"]');
						if(newcdata[i] != undefined) cinput.siblings('span').text(newcdata[i]).fadeIn(1000);
						else cinput.siblings('span').text('').fadeIn(1000);
					}
				}
			);					
			return false;
		});	// End Rename Function
		// Delete Function (Single)
		$('body').on('click', 'a[id^="delete-ssfa-file-"]', function(ev)
		{
			ev.preventDefault();				
			$id = this.id;
			var sfx = $id.replace('delete-', ''),
				rename = $('a#rename-'+sfx),
				del = $(this),
				manager = $('td#manager-'+sfx);			
			del.fadeOut(500);
			rename.fadeOut(500);				
			if(!$('a#canceldel-'+sfx).length) manager.prepend("<a href='' id='canceldel-"+sfx+"' style='display:none;'>"+fileaway_mgmt.cancel_link+"</a>")
			if(!$('a#proceed-'+sfx).length) manager.prepend("<a href='' id='proceed-"+sfx+"' style='display:none;'>"+fileaway_mgmt.proceed_link+"<br></a>")
			if(!$('span#confirm-'+sfx).length) manager.prepend("<span id='confirm-"+sfx+"' style='display:none;'>"+fileaway_mgmt.delete_check+"<br></span>")				
			var proceed = $('a#proceed-'+sfx),
				canceldel = $('a#canceldel-'+sfx),
				confirms = $('span#confirm-'+sfx);
			proceed.delay(500).fadeIn(500);
			canceldel.delay(500).fadeIn(500);
			confirms.delay(500).fadeIn(500);
		}); 
		$('body').on('click', 'a[id^="canceldel-ssfa-file-"]', function(ev)
		{
			ev.preventDefault();
			$id = this.id;
			var sfx = $id.replace('canceldel-', ''),
				rename = $('a#rename-'+sfx),
				del = $('a#delete-'+sfx),
				canceldel = $(this),
				proceed = $('a#proceed-'+sfx),
				confirms = $('span#confirm-'+sfx);
			proceed.fadeOut(500);
			canceldel.fadeOut(500);
			confirms.fadeOut(500);					
			rename.delay(500).fadeIn(500);
			del.delay(500).fadeIn(500);					
		});
		$('body').on('click', 'a[id^="proceed-ssfa-file-"]', function(ev)
		{
			ev.preventDefault();
			$id = this.id;
			var sfx = $id.replace('proceed-', ''),
				uid = $(this).parents('table:eq(0)').data('uid');
				rename = $('a#rename-'+sfx),
				del = $('a#delete-'+sfx),
				proceed = $(this),
				canceldel = $('a#canceldel-'+sfx),
				confirms = $('span#confirm-'+sfx),
				ext = $('td#filetype-'+sfx).data('ext'),
				oldname = String($("td#filename-"+sfx).data("name")),
				filepath = String($("td#filename-"+sfx).data("path")),
				dir = String($("table#ssfa-table-"+$uid).data("dir"));
			proceed.fadeOut(500);
			canceldel.fadeOut(500);
			confirms.fadeOut(500);					
			$.post
			(
				fileaway_mgmt.ajaxurl,
				{
					action : 'fileaway-manager',
					dataType : 'html',	
					act : 'delete',
					ext : ext,
					oldname : oldname,								
					pp : dir,
					nonce : fileaway_mgmt.nonce
				},
				function(response)
				{			
					if(response == 'success') 
					{	
						del.parents('tr:eq(0)').fadeOut(2000)
							.queue(function(next){ $(this).remove(); next(); });
					}
					else 
					{ 
						filertify.set({labels:{ok : fileaway_mgmt.ok_label }}); 
						filertify.alert(response);
					}
				}
			);
			return false;
		}); // End Delete Function (Single)
		// Bulk Action Toggle Selected Files
		$('table.mngr-table td[id^=filetype-ssfa-] a, table.mngr-table td[id^=filename-ssfa-] a').on('click', function(e)
		{
			e.stopPropagation();
		});
		$('table.mngr-table tr[id^=ssfa-file-]').on('click', function()
		{
			$uid = $(this).parents('table:eq(0)').data('uid');
			$enabled = $('a#ssfa-bulk-action-toggle-'+$uid).data('enabled');
			if($('a#ssfa-bulk-action-toggle-'+$uid).text() == $enabled && !$(this).hasClass('fileaway-dynamic'))
			{
				if($(this).hasClass('ssfa-selected')) $(this).removeClass('ssfa-selected');	
				else $(this).addClass('ssfa-selected');						
			}
		}); // End Bulk Action Toggle Selected Files		
		// Bulk Action Toggle Function
		$('a[id^="ssfa-bulk-action-toggle-"]').on('click', function(ev)
		{
			ev.preventDefault();
			$id = this.id;
			$uid = $id.replace('ssfa-bulk-action-toggle-', '');
			$enabled = $(this).data('enabled');
			$disabled = $(this).data('disabled');
			$actionarea = $('div#ssfa-bulk-action-select-area-'+$uid);
			$actionselect = $('select#ssfa-bulk-action-select-'+$uid);
			$checkall = $('input#ssfa-bulk-action-select-all-'+$uid);
			$selectalltext = $checkall.data('selectall');
			$selectall = $('label#ssfa-bulkaction-select-all-'+$uid+' span');
			if($(this).text() == $disabled)
			{
				$(this).text($enabled);
				$actionarea.fadeIn(500);	
			}
			else if($(this).text() == $enabled)
			{ 
				$(this).text($disabled);
				$actionarea.fadeOut(500);	
				$checkall.attr('checked', false).trigger('change');
				$selectall.text($selectalltext);
				$actionselect.find('option:first').attr('selected','selected').trigger('chozed:updated').trigger('change');
			}
		}); // End Bulk Action Toggle Function
		// Bulk Action Select All Function
		$('input[id^="ssfa-bulk-action-select-all-"]').on('change', function()
		{
			$id = this.id;
			$uid = $id.replace('ssfa-bulk-action-select-all-', '');
			$selectalltext = $(this).data('selectall');
			$clearalltext = $(this).data('clearall');
			$selectall = $('label#ssfa-bulkaction-select-all-'+$uid+' span');
			if(this.checked)
			{
				$selectall.text($clearalltext);
				$('table.mngr-table tr[id^=ssfa-file-'+$uid+']').addClass('ssfa-selected');
				$('table.mngr-table tr[id^=ssfa-file-'+$uid+'].fileaway-dynamic').removeClass('ssfa-selected');
			}
			else
			{
				$selectall.text($selectalltext);
				$('table.mngr-table tr[id^=ssfa-file-'+$uid+']').removeClass('ssfa-selected');							
			}
		}); // End Bulk Action Select All Function
		// Bulk Action Select Function
		$('select[id^="ssfa-bulk-action-select-"]').on('change', function()
		{
			$id = this.id;
			$uid = $id.replace('ssfa-bulk-action-select-', '');
			$actionselected = this.value;
			$pathcontainer = $('div#ssfa-path-container-'+$uid);
			if($actionselected == '' || $actionselected == 'delete' || $actionselected == 'download') $pathcontainer.fadeOut(500);
			else $pathcontainer.fadeIn(500);
		}); // End Bulk Action Select Function
		// Bulk Action Path Generator Function
		$('select[id^="ssfa-directories-select-"]').on('change', function()
		{
			$id = this.id;
			$uid = $id.replace('ssfa-directories-select-', '');
			$loading = $('img#ssfa-path-ajax-loading-'+$uid);
			if($(this).val() !== '')
			{
				$basename = $('table#ssfa-table-'+$uid).data('basename');
				$start = $('table#ssfa-table-'+$uid).data('start');		
				$send = actionpath(this.value, $basename, $start, $loading);
			}
		});				
		$('body').on('click', 'a[id^=ssfa-action-pathpart-]', function(ev)
		{
			ev.preventDefault();
			$id = $(this).parents('div:eq(0)').attr('id');
			$uid = $id.replace('ssfa-action-path-', '');
			$pathparts = $(this).attr('data-target');
			$basename = $('table#ssfa-table-'+$uid).data('basename');
			$start = $('table#ssfa-table-'+$uid).data('start');		
			$loading = $('img#ssfa-path-ajax-loading-'+$uid);
			$send = actionpath($pathparts, $basename, $start, $loading);	
		});
		function actionpath($pathparts, $basename, $start, $loading)
		{
			$loading.show();
			$.post(
				fileaway_mgmt.ajaxurl,
				{
					action : 'fileaway-manager',
					dataType : 'html',
					act : 'actionpath',
					uploadaction : 'false',
					pathparts : $pathparts,
					basename : $basename,
					start : $start,
					nonce : fileaway_mgmt.nonce
				},
				function(response)
				{
					$container = $('div#ssfa-path-container-'+$uid);
					$actionpath = $('input#ssfa-actionpath-'+$uid);
					$putpath = $('div#ssfa-action-path-'+$uid);
					$dropdown = $('select#ssfa-directories-select-'+$uid);
					$dropdown.empty().append(response.ops).trigger('chozed:updated');
					$actionpath.val(response.pathparts);
					$putpath.html(response.crumbs).append($loading);
					$loading.hide();
				}
			);
			return false;  
		} // End Bulk Action Path Generator Function
		// Bulk Action Engage Function
		$('span[id^="ssfa-bulk-action-engage-"]').on('click', function()
		{
			$id = this.id;
			$uid = $id.replace('ssfa-bulk-action-engage-', '');
			$loading = $('img#ssfa-engage-ajax-loading-'+$uid);
			var selectedAction = $('select#ssfa-bulk-action-select-'+$uid).val();
			var selectedPath = String($('input#ssfa-actionpath-'+$uid).val());
			var dir = String($('table#ssfa-table-'+$uid).data('dir'));
			var selectedRows = {};
			var selectedFilesFrom = {};
			var selectedFilesTo = {};
			var selectedExts = {};
			var selectedCount = 0;
			var messages = '';
			var jackoff = selectedAction == 'delete' || selectedAction == 'download' ? false : fileasec(selectedPath, $uid);
			$('table#ssfa-table-'+$uid+'.mngr-table tr.ssfa-selected').each(function(index)
			{
				var sfx = this.id;
				var filepath = String($("td#filename-"+sfx).data("path"));
				var oldname = String($("td#filename-"+sfx).data("name"));
				var	ext = String($("td#filetype-"+sfx).data("ext"));
				selectedRows[index] = sfx;
				selectedFilesFrom[index] = dir+'/'+oldname+'.'+ext;
				selectedFilesTo[index] = selectedPath+'/'+oldname+'.'+ext;
				selectedExts[index] = ext;
				selectedCount++;
			});
			if(selectedAction == '') messages += fileaway_mgmt.no_action+'<br>';
			if(selectedCount == 0) messages += fileaway_mgmt.no_files_selected+'<br>';
			if((selectedAction == 'move' || selectedAction == 'copy') && selectedPath == '') messages += fileaway_mgmt.no_destination+'<br>';
			if(messages !== '')
			{ 
				filertify.set({labels:{ok : fileaway_mgmt.ok_label }}); 
				filertify.alert(messages); 
			} 
			else 
			{
				if(jackoff)
				{	
					filertify.set({labels:{ok : fileaway_mgmt.ok_label }});
					filertify.alert(fileaway_mgmt.tamper1);
				} 
				else 
				{			
					// Bulk Action Download Function
					if(selectedAction == 'download')
					{
						$loading.show();
						$.post
						(
							fileaway_mgmt.ajaxurl,
							{
								action : 'fileaway-manager',
								dataType : 'html',	
								act : 'bulkdownload',
								files : selectedFilesFrom,
								exts : selectedExts,
								nonce : fileaway_mgmt.nonce						
							},
							function(response)
							{
								$loading.hide();								
								if(response === 'Error')
								{ 
									filertify.set({labels:{ok : fileaway_mgmt.ok_label }});
									filertify.alert(response);
								}
								else
								{
									$('<iframe src="'+response+'" id="fa-bulkdownload" style="visibility:hidden;" name="fa-bulkdownload">').appendTo('body');	
								}
							}
						);
					} // End Bulk Action Download Function
					// Bulk Action Copy Function
					else if(selectedAction == 'copy')
					{
						$loading.show();
						$.post
						(
							fileaway_mgmt.ajaxurl,
							{
								action : 'fileaway-manager',
								dataType : 'html',	
								act : 'bulkcopy',
								from : selectedFilesFrom,
								to : selectedFilesTo,
								exts : selectedExts,
								destination : selectedPath,
								nonce : fileaway_mgmt.nonce						
							},
							function(response)
							{
								$loading.hide();								
								filertify.set({labels:{ok : fileaway_mgmt.ok_label }});
								filertify.alert(response);
							}
						);
					} // End Bulk Action Copy Function
					// Bulk Action Move Function
					else if(selectedAction == 'move')
					{
						$loading.show();
						$.post
						(
							fileaway_mgmt.ajaxurl,
							{
								action : 'fileaway-manager',
								dataType : 'html',	
								act : 'bulkmove',
								from : selectedFilesFrom,
								to : selectedFilesTo,
								exts : selectedExts,
								destination : selectedPath,
								nonce : fileaway_mgmt.nonce						
							},
							function(response)
							{
								$loading.hide();								
								filertify.set({labels:{ok : fileaway_mgmt.ok_label }});
								filertify.alert(response);
								$.each(selectedRows, function(i, val)
								{
									$('tr#'+val).fadeOut(2000).queue(function(next){
										$(this).remove(); next();
									});
								});
							}
						);
					} // End Bulk Action Move Function
					// Bulk Action Delete Function
					else if(selectedAction == 'delete')
					{
						var numfiles = selectedCount > 1 ? fileaway_mgmt.file_plural : fileaway_mgmt.file_singular; 
						var confirmmessage = fileaway_mgmt.delete_confirm.replace('numfiles', +selectedCount+" "+numfiles);
						filertify.set({labels:{ok : fileaway_mgmt.confirm_label, cancel : fileaway_mgmt.cancel_label }});
						filertify.confirm(confirmmessage, function(e)
						{
							if(e)
							{
								$loading.show();
								$.post
								(
									fileaway_mgmt.ajaxurl,
									{
										action : 'fileaway-manager',
										dataType : 'html',	
										act : 'bulkdelete',
										files : selectedFilesFrom,
										nonce : fileaway_mgmt.nonce						
									},
									function(response)
									{
										$loading.hide();								
										filertify.set({labels:{ok : fileaway_mgmt.ok_label }});
										filertify.alert(response);
										$.each(selectedRows, function(i, val)
										{
											$('tr#'+val).fadeOut(2000).queue( function(next){
												$(this).remove(); next();
											});
										});
									}
								);
							}
						});
					} // End Bulk Action Delete Function
				}
			}
		}); // End Bulk Action Engage Function
		function fileasec($path, $uid)
		{
			var jackoff = 0;
			$fafl = String($('table#ssfa-table-'+$uid).data('fafl'));
			$faui = String($('table#ssfa-table-'+$uid).data('faui'));
			$faun = String($('table#ssfa-table-'+$uid).data('faun'));
			$faur = String($('table#ssfa-table-'+$uid).data('faur'));
			$faum = String($('table#ssfa-table-'+$uid).data('faum'));
			$fafl = $fafl == '0' ? false : $fafl;
			$faui = $faui == '0' ? false : $faui;
			$faun = $faun == '0' ? false : $faun;
			$faur = $faur == '0' ? false : $faur;
			$faum = $faum == '0' ? false : $faum;
			var faflcheck = false;
			var fauicheck = false;
			var fauncheck = false;
			var faurcheck = false;
			var faumcheck = false;
			if($fafl) faflcheck = $path.indexOf($fafl) >= 0 ? false : true;
			if($faui) fauicheck = $path.indexOf($faui) >= 0 ? false : true;
			if($faun) fauncheck = $path.indexOf($faun) >= 0 ? false : true;
			if($faur) faurcheck = $path.indexOf($faur) >= 0 ? false : true;
			if($faum)
			{
				faurcheck = false;
				$faum_arr = $faum.split(',');
				for(var i = 0; i < $faum_arr.length; i++)
				{
					if($path.indexOf($faum_arr[i]) < 0) $faumcheck = true;
				}
			}
			if($path.indexOf('..') >= 0 || $path === '/' || faflcheck || fauicheck || fauncheck || faurcheck || faumcheck) jackoff = 1;
			return jackoff ? true : false;
		}
	} // End Manager Check
}); 
FileUpConfig = [];
// File Up
jQuery(document).ready(function($)
{
	if($('div.ssfa_fileup_container').length)
	{
		if(window.File && window.FileReader && window.FileList && window.Blob) 
		{ 
			/* Safari for Windows Does Not Support FileReader API and cannot read file sizes */ 
		} 
		else 
		{ 
			filertify.set({labels:{ok : fileaway_mgmt.ok_label }}); 
			filertify.alert(fileaway_mgmt.no_upload_support); 
			$('div[class^="ssfa_fileup_container"]').remove(); 
		}
		var TheFiles = [];
		var aFile = [];
		$('input[id^="ssfa_fileup_files_"]').on('change', function(){
			var uid = $(this).data('uid');
			var files = document.getElementById(this.id).files;
			if(files) 
			{
				TheFiles[uid] = files;
				fileupDisplay(files, uid);
			} 
			else 
			{
				TheFiles[uid] = [];
				aFile[uid] = [];
				filertify.set({labels:{ok : fileaway_mgmt.ok_label }});
				filertify.alert(fileaway_mgmt.unreadable_file);
			}
		});
		fileid = function(name, uid)
		{
			return uid+'_'+name.replace(/[^a-z0-9\s]/gi, '_').replace(/[_\s]/g, '_').replace("'", '');
		}	
		ext = function(file, lowercase)
		{
			return (/[.]/.exec(file)) ? (lowercase ? /[^.]+$/.exec(file.toLowerCase()) : /[^.]+$/.exec(file)) : '';
		}
		randcolor = function()
		{
			array = ["red","green","blue","brown","black","orange","silver","purple","pink"];
			return array[Math.floor(Math.random() * array.length)];
		}
		nicesize = function(fileSize)
		{
			if(fileSize / 1024 > 1)
			{
				if(((fileSize / 1024) / 1024) > 1)
				{
					fileSize = (Math.round(((fileSize / 1024) / 1024) * 100) / 100);
					var niceSize = fileSize + " GB";
				}
				else
				{
					fileSize = (Math.round((fileSize / 1024) * 100) / 100)
					var niceSize = fileSize + " MB";
				}
			 }
			 else
			 {
				fileSize = (Math.round(fileSize * 100) / 100)
				var niceSize = fileSize  + " KB";
			}
			return niceSize;
		}
		icon = function(icon_ext, color)
		{
			if($.inArray(icon_ext, fileaway_filetype_groups.image) != -1) file_icon = ssfa_filetype_icons.image; 
			else if($.inArray(icon_ext, fileaway_filetype_groups.adobe) != -1) file_icon = ssfa_filetype_icons.adobe; 
			else if($.inArray(icon_ext, fileaway_filetype_groups.audio) != -1) file_icon = ssfa_filetype_icons.audio;
			else if($.inArray(icon_ext, fileaway_filetype_groups.video) != -1) file_icon = ssfa_filetype_icons.video;
			else if($.inArray(icon_ext, fileaway_filetype_groups.msdoc) != -1) file_icon = ssfa_filetype_icons.msdoc;
			else if($.inArray(icon_ext, fileaway_filetype_groups.msexcel) != -1) file_icon = ssfa_filetype_icons.msexcel;
			else if($.inArray(icon_ext, fileaway_filetype_groups.powerpoint) != -1) file_icon = ssfa_filetype_icons.powerpoint;
			else if($.inArray(icon_ext, fileaway_filetype_groups.openoffice) != -1) file_icon = ssfa_filetype_icons.openoffice;
			else if($.inArray(icon_ext, fileaway_filetype_groups.text) != -1) file_icon = ssfa_filetype_icons.text;
			else if($.inArray(icon_ext, fileaway_filetype_groups.compression) != -1) file_icon = ssfa_filetype_icons.compression;
			else if($.inArray(icon_ext, fileaway_filetype_groups.application) != -1) file_icon = ssfa_filetype_icons.application;
			else if($.inArray(icon_ext, fileaway_filetype_groups.script) != -1) file_icon = ssfa_filetype_icons.script;
			else if($.inArray(icon_ext, fileaway_filetype_groups.css) != -1) file_icon = ssfa_filetype_icons.css;
			else if(icon_ext === 'denied') file_icon = '<span class="ssfa-faminicon ssfa-red ssfa-icon-denied"></span>';
			else file_icon = ssfa_filetype_icons.unknown; 
			file_icon = icon_ext === 'denied' 
				? file_icon 
				: '<span data-ssfa-icon="'+file_icon+'" class="ssfa-faminicon ssfa-'+color+'" aria-hidden="true"></span>';
			return file_icon;
		}		
		fileupDisplay = function(files, uid)
		{
			var settings = FileUpConfig[uid];
			aFile[uid] = files;
			if(aFile[uid].length > 0)
			{
				$("div#ssfa_fileup_files_container_"+uid).html(''); 
				$("span#ssfa_rf_"+uid).html(''); 
				FileUpConfig[uid].removed = [];
				var selectedDisplayed = file_id = '<div id="'+settings.container+'" class="ssfa-meta-container">'+
					'<div id="ssfa-table-wrap-'+uid+'" style="margin: 10px 0 0;">'
						+'<table id="ssfa-table-'+uid+'" class="footable ssfa-sortable ssfa-'+settings.table+' ssfa-center"><tbody>';
 				var path = settings.fixed ? settings.fixed : String($('input#ssfa-upload-actionpath-'+uid+'').val());
				var jackoff = path.indexOf('..') >= 0 || path === '/' ? true : false;
				var allowedchars = settings.fixed ? "~!@#$%^&()_+`-={}[]'," : "~!@#$%^&()_+`-={}[]',/";
				for(var i = 0; i<aFile[uid].length; i++)
				{
					var thefilename = aFile[uid][i].name.replace("'", "’");
					file_id = fileid(aFile[uid][i].name, uid);
					var rawname = aFile[uid][i].name.substr(0, aFile[uid][i].name.lastIndexOf('.')) || aFile[uid][i].name,
						icon_ext = ext(aFile[uid][i].name, true),
						extension = ext(aFile[uid][i].name, false),
						color = settings.iconcolor === 'random' ? self.randcolor() : settings.iconcolor,
						permitted = settings.permitted ? ($.inArray(icon_ext.toString(), settings.permitted) != -1 ? false : true) : false,
						prohibited = settings.prohibited ? ($.inArray(icon_ext.toString(), settings.prohibited) != -1 ? true : false) : false,
						fileSize = (aFile[uid][i].size / 1024),
						tooBig = aFile[uid][i].size > settings.maxsize ? true : false,
						warningclass = tooBig || permitted || prohibited ? ' ssfa-fileup-warning' : '',
						pretty_max = nicesize(settings.maxsize  / 1024),
						sizemsg = fileaway_mgmt.exceeds_size.replace('prettymax', pretty_max);
						sizenotice = tooBig ? '<br><span class="'+warningclass+'">'+sizemsg+'</span>' : '',
						pernotice = permitted ? '<br><span class="'+warningclass+'">'+fileaway_mgmt.type_not_permitted+' '+
							'<a href="javascript:" onclick="filertify.alert(\''+settings.permitted.join(', ')+'\');">'+fileaway_mgmt.view_all_permitted+'</a></span>' : '',
						pronotice = prohibited ? '<br><span class="'+warningclass+'">'+fileaway_mgmt.type_not_permitted+' '+
							'<a href="javascript:" onclick="filertify.alert(\''+settings.prohibited.join(', ')+'\');">'+fileaway_mgmt.view_all_prohibited+'</a></span>' : '',
						readonly = tooBig || permitted || prohibited || jackoff ? ' readonly=readonly' : '',
						file_icon = tooBig || permitted || prohibited || jackoff ? icon('denied') : icon(icon_ext.toString(), color),
						cancel_color = tooBig || permitted || prohibited ? 'red' : 'silver',
						not_defined = false;
					if(tooBig || permitted || prohibited || not_defined || jackoff)
					{
						$("span#ssfa_rf_"+uid).append("<input type=\"hidden\" id=\""+file_id+"\" value=\""+file_id+"\">");
						FileUpConfig[uid].removed[i] = file_id;
					}
					if(typeof aFile[uid][i] !== undefined && aFile[uid][i].name !== '')
					{
						selectedDisplayed += 
							'<tr id="ssfa_upfile_id_'+file_id+'" style="display: table-row;">'+
								'<td id="ssfa-upfile_type" class="ssfa-sorttype ssfa-'+settings.table+'-first-column">'+
									file_icon+'<br>'+extension+
								'</td>'+
								'<td id="ssfa-upfile_name" class="ssfa-sortname">'+
									'<div class="ssfa-upload-input-container">'+
										'<div class="ssfa-upload-progress ssfa-up-progress-'+color+'" id="ssfa_upload_progress_id_'+file_id+'"></div>'+	
										"<input type=\"text\" class=\"rename_ssfa_upfile\" id=\"rename_ssfa_upfile_id_"+file_id+"\" value=\""+rawname+"\""+readonly+">"+
									'</div>'+
									sizenotice+pernotice+pronotice+
								'</td>'+
								'<td id="ssfa-upfile_size" class="ssfa-sortsize">'+
									'<span class="ssfa-filesize'+warningclass+'">'+nicesize(fileSize)+'</span>'+
								'</td>'+
								'<td id="ssfa_upfile_status_'+file_id+'" class="ssfa-sortstatus">'+
									'<a id="ssfa_remove_id_'+file_id+'" href="javascript:" '+
										'onclick="fileupRemove(\''+file_id+'\',\''+thefilename+'\',\''+uid+'\',\''+i+'\');">'+
										'<span class="ssfa-faminicon ssfa-'+cancel_color+' ssfa-icon-console-2"></span>'+
									'</a>'+
								'</td>'+
							'</tr>';							
					}
					else not_defined = true; 
				}
				selectedDisplayed += "</tbody></table></div></div>";
				$("div#ssfa_fileup_files_container_"+uid).append(selectedDisplayed);
				$('input[id^="rename_ssfa_upfile_id_"]').alphanum({allow : allowedchars});
				if(jackoff)
				{ 
					filertify.set({labels:{ok : fileaway_mgmt.ok_label}}); 
					filertify.alert(fileaway_mgmt.tamper4); 
					$("div#ssfa_fileup_files_container_"+uid).html(''); 
				}
			}
		}
		fileupRemove = function(id, filename, uid, i)
		{
			if($("span#ssfa_rf_"+uid+" input#"+id).length){}
			else $("span#ssfa_rf_"+uid).append("<input type=\"hidden\" id=\""+id+"\" value=\""+id+"\">");
			FileUpConfig[uid].removed[i] = id;
			$("tr#ssfa_upfile_id_"+id).fadeOut(1000).queue(function()
			{
				$(this).remove();
				$("div#ssfa_fileup_files_container_"+uid+" table#ssfa-table-"+uid+" tbody").change();
				if($("div#ssfa_fileup_files_container_"+uid+" table#ssfa-table-"+uid+" tbody").children('tr').length){} 
				else $("div#ssfa_fileup_files_container_"+uid+" table#ssfa-table-"+uid+"").remove();
			});
		}		
		// Upload Files
		$('span[id^="ssfa_submit_upload_"]').on('click', function(){
			var uid = $(this).data('uid');
			var settings = FileUpConfig[uid];
			if(!settings.fixed && $('input#ssfa-upload-actionpath-'+uid).val() === '')
			{
				filertify.set({labels:{ok : fileaway_mgmt.ok_label }});
				filertify.alert(fileaway_mgmt.build_path);	
			}
			else
			{
				fileupSubmit(uid, 0);
				if(TheFiles[uid] !== undefined && TheFiles[uid].length > 0)
				{
					$(this).parents('span.ssfa_fileup_wrapper').eq(0)
						.fadeTo(500, 0).queue(function(){$(this).css({'visibility':'hidden'});});
				}
			}
		});
		// Initialize Uploads
		fileupSubmit = function(uid, k)
		{
			if(TheFiles[uid] !== undefined && TheFiles[uid].length > 0)
			{
				if(k < TheFiles[uid].length)
				{ 
					fileupAjax(TheFiles[uid][k], k, uid);
				}
				else 
				{
					$('span#ssfa_submit_upload_'+uid).parents('span.ssfa_fileup_wrapper').eq(0)
						.css({'visibility':'visible','opacity':'1'});
					TheFiles[uid] = [];
				}
			}
			else
			{
				filertify.set({labels:{ok : fileaway_mgmt.ok_label }});
				filertify.alert(fileaway_mgmt.no_files_chosen);
			}
		}
		// Ajax Upload
		fileupAjax = function(file, i, uid)
		{
			var initSettings = FileUpConfig[uid];
			if(file !== undefined && file !== '' && file !== "undefined")
			{
				var id = file_id = fileid(file.name, uid),
					rawname = file.name.substr(0, file.name.lastIndexOf('.')) || file.name,
					extension = ext(file.name, false),
					path = initSettings.fixed ? initSettings.fixed : String($('input#ssfa-upload-actionpath-'+uid).val()),
					pathcheck = String(initSettings.pathcheck),
					removed_file = $("#"+id).val(),
					newname = String($("input#rename_ssfa_upfile_id_"+id).val()),
					new_name = newname === '' || newname === 'undefined' || newname === undefined ? file.name : newname+'.'+extension,
					removed = initSettings.removed,
					loading = initSettings.loading,
					fixedchars = initSettings.fixed;
				if(newname === '' || newname === 'undefined' || newname === undefined) $("input#rename_ssfa_upfile_id_"+id).val(rawname)
				if(removed_file !== '' && removed_file !== undefined && removed_file == id) fileupSubmit(uid, i+1); 
				else
				{
					var fileupData = new FormData();
					fileupData.append('upload_file',file);
					fileupData.append('upload_file_id',id);
					fileupData.append('max_file_size',initSettings.maxsize);
					fileupData.append('upload_path',path);	
					fileupData.append('new_name',new_name);
					fileupData.append('extension',extension);
					fileupData.append('uploader',initSettings.uploader);
					fileupData.append('identby',initSettings.identby);
					fileupData.append('act','upload');
					fileupData.append('nonce',fileaway_mgmt.nonce);				
					$.ajax(
					{
						type		: 'POST',
						url			: fileaway_mgmt.ajaxurl+'?action=fileaway-manager',
						data		: fileupData,
						id			: id,
						uid			: uid,
						new_name	: new_name,
						rawname		: rawname,
						extension	: extension,
						path		: path,
						pathcheck	: pathcheck,
						removed		: removed,
						loading		: loading,
						fixedchars	: fixedchars,
						cache		: false,
						contentType	: false,
						processData	: false,
						beforeSend	: function(xhr, settings)
						{
							$("#ssfa_upfile_status_"+settings.id)
								.html('<span class="ssfa-faminicon ssfa-silver ssfa-icon-denied"></span>');
							var newpath = settings.new_name.substring(0, settings.new_name.lastIndexOf("/") + 1),
								jackoff = false,
								message = '';
							if(''+newpath.indexOf('..') >= 0 || settings.path.indexOf('..') >= 0 || settings.path === '/')
							{ 
								jackoff = true; 
								message = '<br>'+fileaway_mgmt.double_dots_override;
							}
							if(!jackoff && $.inArray(settings.id, settings.removed) != -1) jackoff = true; 
							if(!jackoff && settings.fixedchars && settings.new_name.indexOf('/') >= 0)
							{ 
								jackoff = true; 
								message = '<br>'+fileaway_mgmt.creation_disabled;
							}
							if(!jackoff && settings.path.indexOf(settings.pathcheck) < 0)
							{
								jackoff = true; 
								message = '<br>'+fileaway_mgmt.no_override;
							}
							if(!jackoff && settings.new_name.indexOf('..') >= 0)
							{ 
								jackoff = true;
								message = '<br>'+fileaway_mgmt.double_dots;
							}
							if(!jackoff)
							{
								var pop = settings.rawname.substring(settings.rawname.lastIndexOf(".") + 1, settings.rawname.length);	
								if($.inArray(pop, fileaway_filetype_groups.script) != -1)
								{ 
									if($.inArray(settings.extension.toString(), fileaway_filetype_groups.script) == -1 
									&& $.inArray(settings.extension.toString(), fileaway_filetype_groups.css) == -1) 
									{
										jackoff = true; 
										message = '<br>'+fileaway_mgmt.multi_type;
									}
								}
							}
							if(jackoff)
							{
								var upload_failure = fileaway_mgmt.upload_failure.replace('filename', settings.rawname+'.'+settings.extension);
								$('tr#ssfa_upfile_id_'+settings.id+' td#ssfa-upfile_type')
									.html('<span class="ssfa-faminicon ssfa-red ssfa-icon-denied"></span><br>'+settings.extension);
								$('td#ssfa_upfile_status_'+settings.id)
									.html('<a id="ssfa_remove_id_'+settings.id+'" href="javascript:" onclick="fileupRemove(\''
									+settings.id+'\',\''+settings.rawname+'.'+settings.extension
									+'\',\''+settings.uid+'\');"><span class="ssfa-faminicon ssfa-red ssfa-icon-console-2"></span></a>');
								$('tr#ssfa_upfile_id_'+settings.id+' td#ssfa-upfile_name')
									.append('<br><span class="ssfa-fileup-warning">'+upload_failure+message+'</span>');
								fileupSubmit(settings.uid, i+1); 
								xhr.abort();
							}
						},
						xhr: function()
						{
							var xhr = new window.XMLHttpRequest();
							xhr.upload.addEventListener("progress", function(evt)
							{
								if(evt.lengthComputable)
								{
									var percentComplete = evt.loaded / evt.total;
									$('div#ssfa_upload_progress_id_'+id).width((percentComplete * 100) + '%');
								}
							}, false);
							return xhr;
						},
						success	: function(response)
						{
							setTimeout(function()
							{
								if(response.indexOf(id) != -1)
								{
									$("#ssfa_upfile_status_"+id)
										.html('<span class="ssfa-faminicon ssfa-green ssfa-icon-inbox"></span>');
									$("#ssfa_upfile_id_"+id).delay(500).fadeOut(1000).queue(function()
									{
										$(this).remove(); 
										$("div#ssfa_fileup_files_container_"+uid+" table#ssfa-table-"+uid+" tbody").change();
										if($("div#ssfa_fileup_files_container_"+uid+" table#ssfa-table-"+uid+" tbody").children('tr').length){} 
										else $("div#ssfa_fileup_files_container_"+uid+" table#ssfa-table-"+uid).remove();
									});
								}
								else
								{
									var upload_failure = fileaway_mgmt.upload_failure.replace('filename', rawname+'.'+extension);
									$('tr#ssfa_upfile_id_'+id+' td#ssfa-upfile_type')
										.html('<span class="ssfa-faminicon ssfa-red ssfa-icon-denied"></span><br>'+extension);
									$('td#ssfa_upfile_status_'+id)
										.html('<a id="ssfa_remove_id_'+file_id+'" href="javascript:" onclick="fileupRemove(\''+id+'\',\''+rawname+'.'+extension									
										+'\',\''+uid+'\');"><span class="ssfa-faminicon ssfa-red ssfa-icon-console-2"></span></a>');
									$('tr#ssfa_upfile_id_'+id+' td#ssfa-upfile_name')
										.append('<br><span class="ssfa-fileup-warning">'+upload_failure+'</span>');
								}
								fileupSubmit(uid, i+1); 
							},500);
						}
					});
				 }				 
			}
		}	
		// Upload Path Generator Function
		$('select[id^="ssfa-fileup-directories-select-"]').chozed({
			allow_single_deselect:false, 
			width: '200px', 
			inherit_select_classes:true,
			no_results_text: fileaway_mgmt.no_results,
			search_contains: true 
		});
		$('select[id^="ssfa-fileup-directories-select-"]').on('change', function()
		{
			$uid = this.id.replace('ssfa-fileup-directories-select-', '');
			$loading = $('img#ssfa-fileup-action-ajax-loading-'+$uid);
			if($(this).val() !== '')
			{
				$basename = $('input#ssfa-upload-actionpath-'+$uid).data('basename');
				$start = $('input#ssfa-upload-actionpath-'+$uid).data('start');		
				$send = actionpath(this.value, $basename, $start, $loading, $uid);
			}
		});				
		$('body').on('click', 'a[id^=ssfa-fileup-action-pathpart-]', function(ev)
		{
			ev.preventDefault();
			$parent = $(this).parents('div').eq(0).attr('id');
			$uid = $parent.replace('ssfa-fileup-action-path-', '');
			$basename = $('input#ssfa-upload-actionpath-'+$uid).data('basename');
			$start = $('input#ssfa-upload-actionpath-'+$uid).data('start');		
			$loading = $('img#ssfa-fileup-action-ajax-loading-'+$uid);
			$pathparts = $(this).attr('data-target');
			$send = actionpath($pathparts, $basename, $start, $loading, $uid);	
		});
		function actionpath($pathparts, $basename, $start, $loading, $uid)
		{
			$loading.show();
			$.post(
				fileaway_mgmt.ajaxurl,
				{
					action : 'fileaway-manager',
					dataType : 'html',	
					act : 'actionpath',
					uploadaction : 'true', 
					pathparts : $pathparts,
					basename : $basename,					
					start : $start,							
					nonce : fileaway_mgmt.nonce						
				},
				function(response)
				{
					$container = $('div#ssfa-fileup-path-container-'+$uid);
					$actionpath = $('input#ssfa-upload-actionpath-'+$uid);
					$putpath = $('div#ssfa-fileup-action-path-'+$uid);
					$dropdown = $('select#ssfa-fileup-directories-select-'+$uid);
					$dropdown.empty().append(response.ops).trigger('chozed:updated').trigger('liszt:updated');
					$actionpath.val(response.pathparts);
					$putpath.html(response.crumbs).append($loading);
					$loading.hide();
				}
			);
			return false;  
		} // End Upload Path Generator Function			
	}
});
jQuery(document).ready(function($)
{
	// CSV EDITOR FUNCTIONS
	if($('div.ssfa-fileaway-values[data-editor="true"]').length)
	{
		$('table.ssfa-values-table > thead > tr > th').contextMenu('ssfa-values-rename-column-context', { 
			'Rename Column' : { 
				click: function(element) { fa_values_renamecol(element.attr('id')); }, 
				link: '<a href="#"><span class="ssfa-icon-quill"></span> '+fileaway_mgmt.rename_column+'</a>', 
				klass: "menu-item-rename-col-1"
			},
			'Insert New Column Before' : { 
				click: function(element) { fa_values_newcol(element.attr('id'), 'before'); }, 
				link: '<a href="#"><span class="ssfa-icon-chart-alt"></span> '+fileaway_mgmt.insert_col_before+'</a>', 
				klass: "menu-item-2"
			},
			'Insert New Column After' : { 
				click: function(element) { fa_values_newcol(element.attr('id'), 'after'); }, 
				link: '<a href="#"><span class="ssfa-icon-chart-alt"></span> '+fileaway_mgmt.insert_col_after+'</a>', 
				klass: "menu-item-3"
			},
			'Delete Column' : { 
				click: function(element) { fa_values_deletecol(element.attr('id')); }, 
				link: '<a href="#"><span class="ssfa-icon-remove"></span> '+fileaway_mgmt.delete_column+'</a>', 
				klass: "menu-item-4"
			},				
			'Save Backup' : { 
				click: function(element) { fa_values_backup(element.attr('id')); }, 
				link: '<a href="#"><span class="ssfa-icon-disk"></span> '+fileaway_mgmt.save_backup+'</a>', 
				klass: "menu-item-5"
			},						
		});
		fa_values_renamecol = function(id, postype)
		{
			filertify.set({labels:{ok : fileaway_mgmt.ok_label, cancel : fileaway_mgmt.cancel_label }});
			filertify.prompt(fileaway_mgmt.new_column_name, function(e, str) 
			{	
				if(e)
				{
					var shadow = $('<div id="ssfa-values-shadow" style="display:none;" />');		
					$('body').append(shadow);
					shadow.fadeIn(1000);
					$("body").css("cursor", "progress");
					$new = str;
					$old = $('th#'+id).data('col');
					if($new == $old)
					{
						$("body").css("cursor", "auto");
						shadow.fadeOut(500).queue(function(){
							$(this).remove();
						});
						return false;
					}
					$colnum = $('th#'+id).data('colnum');
					$src = $('th#'+id).parents('table').eq(0).data('src');
					$read = $('th#'+id).parents('table').eq(0).data('read');
					$write = $('th#'+id).parents('table').eq(0).data('write');
					$.post
					(
						fileaway_mgmt.ajaxurl,
						{
							action : 'fileaway-manager',
							dataType : 'html',	
							act : 'colrename',
							src : $src,
							oldname : $old,
							newname : $new,
							colnum : $colnum,
							read : $read,
							writ : $write,
							nonce : fileaway_mgmt.nonce						
						},
						function(response)
						{
							if(response.status == 'success')
							{
								location.reload(true);
							}
							else
							{
								$("body").css("cursor", "auto");
								shadow.fadeOut(500).queue(function(){
									$(this).remove();
								});
								filertify.set({labels:{ok : fileaway_mgmt.ok_label}});
								filertify.alert(response.message);	
							}
						}
					)
					return false;
				}
			});			
		}
		fa_values_newcol = function(id, postype)
		{
			filertify.set({labels:{ok : fileaway_mgmt.ok_label, cancel : fileaway_mgmt.cancel_label }});
			filertify.prompt(fileaway_mgmt.new_column_name, function(e, str) 
			{	
				if(e)
				{
					var shadow = $('<div id="ssfa-values-shadow" style="display:none;" />');		
					$('body').append(shadow);
					shadow.fadeIn(1000);
					$("body").css("cursor", "progress");
					$col = str;
					$colnum = $('th#'+id).data('colnum');
					$colnum = postype == 'after' ? $colnum+1 : $colnum;
					$src = $('th#'+id).parents('table').eq(0).data('src');
					$read = $('th#'+id).parents('table').eq(0).data('read');
					$write = $('th#'+id).parents('table').eq(0).data('write');
					$.post
					(
						fileaway_mgmt.ajaxurl,
						{
							action : 'fileaway-manager',
							dataType : 'html',	
							act : 'createcol',
							src : $src,
							col : $col,
							colnum : $colnum,
							read : $read,
							writ: $write,
							nonce : fileaway_mgmt.nonce						
						},
						function(response)
						{
							if(response.status == 'success')
							{
								location.reload(true);
							}
							else
							{
								$("body").css("cursor", "auto");
								shadow.fadeOut(500).queue(function(){
									$(this).remove();
								});
								filertify.set({labels:{ok : fileaway_mgmt.ok_label}});
								filertify.alert(response.message);	
							}
						}
					)
					return false;
				}
			});			
		}
		fa_values_deletecol = function(id)
		{
			$uid = $('th#'+id).parents('table').eq(0).data('uid');
			$numcols = $('table#ssfa-table-'+$uid+' thead tr th').length;
			if($numcols < 2)
			{
				filertify.set({labels:{ok : fileaway_mgmt.ok_label}});
				filertify.alert(fileaway_mgmt.atleast_one_column)
			}
			else
			{
				$col = $('th#'+id).data('col');
				var confirmmessage = fileaway_mgmt.delete_confirm.replace('numfiles', $col);
				filertify.set({labels:{ok : fileaway_mgmt.confirm_label, cancel : fileaway_mgmt.cancel_label }});
				filertify.confirm(confirmmessage, function(e, str) 
				{	
					if(e)
					{
						var shadow = $('<div id="ssfa-values-shadow" style="display:none;" />');		
						$('body').append(shadow);
						shadow.fadeIn(1000);
						$("body").css("cursor", "progress");
						$colnum = $('th#'+id).data('colnum');
						$src = $('th#'+id).parents('table').eq(0).data('src');
						$read = $('th#'+id).parents('table').eq(0).data('read');
						$write = $('th#'+id).parents('table').eq(0).data('write');
						$.post
						(
							fileaway_mgmt.ajaxurl,
							{
								action : 'fileaway-manager',
								dataType : 'html',	
								act : 'coldelete',
								src : $src,
								col : $col,
								colnum : $colnum,
								read : $read,
								writ : $write,
								nonce : fileaway_mgmt.nonce						
							},
							function(response)
							{
								if(response.status == 'success')
								{
									location.reload(true);
								}
								else
								{
									$("body").css("cursor", "auto");
									shadow.fadeOut(500).queue(function(){
										$(this).remove();
									});
									filertify.set({labels:{ok : fileaway_mgmt.ok_label }});
									filertify.alert(response.message);
								}
							}
						)
						return false;
					}
				});	
			}
		}				
		fa_row_context_menu_init = function()
		{
			$('tr.ssfa-values-context td').contextMenu('ssfa-values-context', { 
				'Insert New Row' : {
					click: function(element) { fa_values_insert_row(element.attr('id')); }, 
					link: '<a href="#"><span class="ssfa-icon-chart-alt"></span> '+fileaway_mgmt.insert_row+'</a>', 
					klass: "menu-item-1"
				},
				'Delete Row' : { 
					click: function(element) { fa_values_delete(element.attr('id')); }, 
					link: '<a href="#"><span class="ssfa-icon-remove"></span> '+fileaway_mgmt.delete_row+'</a>', 
					klass: "menu-item-2"
				},
				'Save Backup' : { 
					click: function(element) { fa_values_backup(element.attr('id')); }, 
					link: '<a href="#"><span class="ssfa-icon-disk"></span> '+fileaway_mgmt.save_backup+'</a>', 
					klass: "menu-item-3"
				},						
			});	
		}
		fa_row_context_menu_init();
		fa_values_insert_row = function(id)
		{
			$uid = $('td#'+id).parents('table').eq(0).data('uid');
			var shadow = $('<div id="ssfa-values-shadow" style="display:none;" />');
			$('body').append(shadow);
			shadow.fadeIn(1000);
			$("body").css("cursor", "progress");
			$numrows = $('table#ssfa-table-'+$uid+' tbody tr').length;
			$numcols = $('table#ssfa-table-'+$uid+' tbody tr:first-child td').length;
			$src = $('table#ssfa-table-'+$uid).data('src');
			$theme = $('table#ssfa-table-'+$uid).data('theme');
			$read = $('table#ssfa-table-'+$uid).data('read');
			$write = $('table#ssfa-table-'+$uid).data('write');
			$.post
			(
				fileaway_mgmt.ajaxurl,
				{
					action : 'fileaway-manager',
					dataType : 'html',	
					act : 'newrow',
					src : $src,
					numrows : $numrows,
					numcols : $numcols,
					theme : $theme,
					uid : $uid,
					read : $read,
					writ : $write,
					nonce : fileaway_mgmt.nonce						
				},
				function(response)
				{
					$("body").css("cursor", "auto");
					shadow.fadeOut(500).queue(function(){
						$(this).remove();
					});
					if(response.status == 'success')
					{
						$('td#'+id).parents('tr').eq(0).after(response.html).hide().fadeIn(500);
						fa_row_context_menu_init();
					}
					else
					{
						filertify.set({labels:{ok : fileaway_mgmt.ok_label }});
						filertify.alert(response.message);	
					}
				}
			)
			return false;
		}
		fa_values_delete = function(id)
		{
			$uid = $('td#'+id).parents('table').eq(0).data('uid');
			$numrows = $('table#ssfa-table-'+$uid+' tbody tr').length;
			if($numrows < 2)
			{
				filertify.set({labels:{ok : fileaway_mgmt.ok_label }});
				filertify.alert(fileaway_mgmt.atleast_one_row)
			}
			else
			{
				$values = [];
				id = $('td#'+id).parents('tr').eq(0).attr('id');
				$('tr#'+id+' td span').each(function(i){
					$values[i] = $(this).data('col')+': '+$(this).text();
				});
				$allvalues = ':<br><br>'+$values.join('<br>')+'<br><br>';
				var confirmmessage = fileaway_mgmt.delete_confirm.replace('numfiles.', $allvalues);
				filertify.set({labels:{ok : fileaway_mgmt.confirm_label, cancel : fileaway_mgmt.cancel_label }});
				filertify.confirm(confirmmessage, function(e)
				{
					if(e)
					{
						var shadow = $('<div id="ssfa-values-shadow" style="display:none;" />');
						$('body').append(shadow);
						shadow.fadeIn(1000);
						$("body").css("cursor", "progress");
						$row = $('tr#'+id).data('row');
						$src = $('tr#'+id).parents('table').eq(0).data('src');
						$read = $('tr#'+id).parents('table').eq(0).data('read');
						$write = $('tr#'+id).parents('table').eq(0).data('write');
						$.post
						(
							fileaway_mgmt.ajaxurl,
							{
								action : 'fileaway-manager',
								dataType : 'html',	
								act : 'deleterow',
								src : $src,
								row : $row,
								read : $read,
								writ : $write,
								nonce : fileaway_mgmt.nonce						
							},
							function(response)
							{
								if(response.status == 'success')
								{
									location.reload(true);
								}
								else
								{
									$("body").css("cursor", "auto");
									shadow.fadeOut(500).queue(function(){
										$(this).remove();
									});
									filertify.set({labels:{ok : fileaway_mgmt.ok_label }});
									filertify.alert(response.message);	
								}
							}
						)
						return false;		
					}
				});
			}
		}	
		fa_values_backup = function(id)
		{
			var shadow = $('<div id="ssfa-values-shadow" style="display:none;" />');
			$src = $('#'+id).parents('table').eq(0).data('src');
			$read = $('#'+id).parents('table').eq(0).data('read');
			$write = $('#'+id).parents('table').eq(0).data('write');
			$('body').append(shadow);
			shadow.fadeIn(1000);
			$("body").css("cursor", "progress");
			$.post
			(
				fileaway_mgmt.ajaxurl,
				{
					action : 'fileaway-manager',
					dataType : 'html',	
					act : 'backupcsv',
					src : $src,
					read : $read,
					writ : $write,
					nonce : fileaway_mgmt.nonce						
				},
				function(response)
				{
					$("body").css("cursor", "auto");
					shadow.fadeOut(500).queue(function(){
						$(this).remove();
					});
					if(response.status !== 'success')
					{
						filertify.set({labels:{ok : fileaway_mgmt.ok_label }});
						filertify.alert(response.message);	
					}
				}
			)
			return false;
		}		
		$('body').on('click', 'span[id^="ssfa-delete-csv-"]', function()
		{
			$uid = $(this).data('uid');
			$src = $('table#ssfa-table-'+$uid).data('src');	
			$filename = $('table#ssfa-table-'+$uid).data('filename');	
			var confirmmessage = fileaway_mgmt.delete_confirm.replace('numfiles.', '<strong><code>'+$filename+'</code></strong>');
			filertify.set({labels:{ok : fileaway_mgmt.confirm_label, cancel : fileaway_mgmt.cancel_label }});
			filertify.confirm(confirmmessage, function(e)
			{
				if(e)
				{
					var shadow = $('<div id="ssfa-values-shadow" style="display:none;" />');
					$('body').append(shadow);
					shadow.fadeIn(1000);
					$("body").css("cursor", "progress");
					$.post
					(
						fileaway_mgmt.ajaxurl,
						{
							action : 'fileaway-manager',
							dataType : 'html',	
							act : 'deletecsv',
							src : $src,
							nonce : fileaway_mgmt.nonce						
						},
						function(response)
						{
							$("body").css("cursor", "auto");
							shadow.fadeOut(500).queue(function(){
								$(this).remove();
							});
							if(response.status == 'success')
							{
								$('table#ssfa-table-'+$uid).fadeOut(500);
								$('select#ssfa-fileaway-values-select-'+$uid).find('option:first').attr('selected','selected').trigger('chozed:updated').trigger('change');
							}
							else
							{
								filertify.alert(response.message);	
							}
						}
					)
					return false;					
				}
			});
		});
		$('body').on('click', 'span[id^="ssfa-new-csv-"]', function()
		{
			$uid = $(this).data('uid');
			$path = $(this).data('path');
			$pg = $(this).data('pg');
			$read = $(this).data('read');
			$write = $(this).data('write');
			$recursive = $(this).data('recurse');
			filertify.set({labels:{ok : fileaway_mgmt.next_label, cancel : fileaway_mgmt.cancel_label }});
			filertify.prompt(fileaway_mgmt.new_file_name, function(e, name) 
			{	
				if(e)
				{
					if(name == '')
					{
						filertify.set({labels:{ok : 'OK'}});
						filertify.alert(fileaway_mgmt.specify_file_name);
					}
					else
					{
						filertify.set({labels:{ok : fileaway_mgmt.create_label, cancel : fileaway_mgmt.cancel_label }});
						filertify.prompt(fileaway_mgmt.column_names, function(ev, cols) 
						{	
							if(ev)
							{
								if(cols == '')
								{
									filertify.set({labels:{ok : fileaway_mgmt.ok_label }});
									filertify.alert(fileaway_mgmt.specify_column_name);
								}
								else
								{
									var shadow = $('<div id="ssfa-values-shadow" style="display:none;" />');
									$('body').append(shadow);
									shadow.fadeIn(1000);
									$("body").css("cursor", "progress");
									$.post
									(
										fileaway_mgmt.ajaxurl,
										{
											action : 'fileaway-manager',
											dataType : 'html',	
											act : 'makecsv',
											path : $path,
											pg : $pg,
											querystring : location.search,
											name : name,
											cols : cols,
											recursive : $recursive,
											read : $read,
											writ : $write,
											nonce : fileaway_mgmt.nonce						
										},
										function(response)
										{
											$("body").css("cursor", "auto");
											shadow.fadeOut(500).queue(function(){
												$(this).remove();
											});
											if(response.status == 'success')
											{
												window.location.href = response.redirect;
											}
											else
											{
												filertify.alert(response.message);	
											}
										}
									)
									return false;
								}
							}
						});			
					}
				}
			});			
		});
		$('body').on('dblclick', 'td[id^="cell-ssfa-values-"]', function()
		{
			$sfx = this.id.replace('cell-', '');
			$span = $('span#value-'+$sfx);
			$input = $('input#input-'+$sfx);
			$span.fadeOut(400);
			setTimeout(function(){
				$input.fadeIn(400).focus();
			}, 400);
		});
		$('body').on('blur', 'input[id^="input-ssfa-values-"]', function()
		{
			$sfx = this.id.replace('input-', '');
			$input = $(this);
			$span = $('span#value-'+$sfx);
			$oldvalue = $span.text();
			$input.fadeOut(400);
			$value = $(this).val();
			if($value === $oldvalue)
			{
				setTimeout(function(){
					$span.fadeIn(400);
				}, 400);
			}
			else
			{
				var shadow = $('<div id="ssfa-values-shadow" style="display:none;" />');
				$('body').append(shadow);
				shadow.fadeIn(1000);
				$("body").css("cursor", "progress");				
				$row = $(this).data('row');
				$col = $(this).data('col');
				$colnum = $(this).data('colnum');
				$src = $(this).parents('table').eq(0).data('src');
				$read = $(this).parents('table').eq(0).data('read');
				$write = $(this).parents('table').eq(0).data('write');
				$.post
				(
					fileaway_mgmt.ajaxurl,
					{
						action : 'fileaway-manager',
						dataType : 'html',	
						act : 'values',
						src : $src,
						row : $row,
						col : $col,
						colnum : $colnum,
						oldvalue : $oldvalue,
						newvalue : $value,
						read : $read,
						writ : $write,
						nonce : fileaway_mgmt.nonce						
					},
					function(response)
					{
						$("body").css("cursor", "auto");
						shadow.fadeOut(500).queue(function(){
							$(this).remove();
						});
						if(response.status == 'success')
						{
							$span.text($value);
							$span.fadeIn(400);
						}
						else
						{
							$span.fadeIn(400);
							filertify.alert(response.message);	
						}
					}
				)
				return false;
			}
		});		
	}
});