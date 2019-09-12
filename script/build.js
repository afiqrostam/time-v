// main form functions
function close_main_form(e) {
	var parent = $(e).parents('.tab-pane.active');
	parent.find('div.body-search').removeClass('hide').addClass('show')
	parent.find('div.body-form').removeClass('show').addClass('hide')
}

function get_db(e) {
	var parent = $(e).parents('.tab-pane.active');
	parent.find('div.body-start').addClass('hide');

	if (parent.data('id') == 'work') {
		var data = $.grep(eval('db.' + parent.data('id')), function (f) { return f });
		// getting filter criterion
		if ($(e).is('li')) { var team = $(e).data('id') }
		else { var team = parent.find('li.content-nav.active').data('id') }
		var search = parent.find('input.body-search-input').val();
		// filtering results
		if (team != undefined) { data = data.filter(function (f) { return f.assign == team }) }
		if (search != undefined) {
			data = data.filter(
				function (f) {
					var data_search = f.task_no + ' ' + f.wo_desc + ' ' + f.vams_wo + ' ' + f.veolia_so + ' ' + f.bsc_wo + ' ' + f.bsc_po;
					return RegExp(search, 'gi').test(data_search)
				})
		}
		// release data count
		parent.find('span.body-count').html(data.length);
		// build response body
		var result = $('<a class="list-group-item text-uppercase">').html(
			$('<div class="d-flex justify-content-between">').html(
				$('<p>').html(
					$('<span class="mr-1 item-wo-desc">').html(' ')).append(
						$('<span class="mr-1 item-task-no badge primary">').html(' ')).append(
							$('<span class="mr-1 item-assign badge primary">').html(' '))).append(
								$('<span class="item-date ">').html(' '))).append(
									$('<div class="d-flex justify-content-between">').html(
										$('<span class="badge ">').html(' HRS').prepend(
											$('<span class="item-hours">').html(0))).append(
												$('<span class="item-status badge ">').html(' ')));
		// formatting response body action				
		result.on('click',
			function (e) {
				e.preventDefault();
				var parent = $(this).parents('.tab-pane.active');
				var aside = parent.find('div.aside');
				open_main_form(this);
				if (aside.hasClass('show')) { aside.modal('toggle') }
			});
		// clearing response container
		parent.find('div.body-result').empty();
		// releasing respose
		if (data.length == 0) {
			// return null result
			parent.find('div.no-result').removeClass('hide');
			parent.find('div.body-result').addClass('hide')
		}
		else {
			parent.find('div.no-result').addClass('hide');
			parent.find('div.body-result').removeClass('hide');
			// trunc response to 10 intervals
			data = data.filter(function (f, i, a) { return i < 10 });
			// populate response with filtered data
			data.forEach(function (f) {
				var clone = result.clone(true);
				clone.data('id', f.vams_wo)
				clone.find('.item-wo-desc').html(f.wo_desc);
				clone.find('.item-task-no').html(f.task_no);
				clone.find('.item-assign').html(f.team);
				clone.find('.item-date').html(f.start_date.toJSON().substr(0, 10));
				parent.find('div.body-result').append(clone)
			});
		}
	}
}

function open_main_form(e) {
	var parent = $(e).parents('.tab-pane.active');
	if (parent.data('id') == 'work') {
		var form = parent.find('div.body-form');
		form.find('.data-wo-desc').html('{{no data}}');
		form.find('.data-task-no').html('{{no data}}');
		form.find('.data-task-desc').html('{{no data}}');
		form.find('.data-veolia-so').html('{{no data}}');
		form.find('.data-bsc-wo').html('{{no data}}');
		form.find('.data-bsc-po').html('{{no data}}');

		if ($(e).data('id') != undefined) {
			var data = $.extend({},$.grep(db.work, function (f) { return f.vams_wo === $(e).data('id') })[0])
			Object.getOwnPropertyNames(data).forEach(function(f){ if(data[f]==''){data[f]='&nbsp;'}});
			

			form.find('.data-wo-desc').html(data.wo_desc);
			form.find('.data-task-no').html(data.task_no);
			form.find('.data-task-desc').html(data.task_desc.replace(data.task_no, '').replace('()', ''));
			form.find('.data-veolia-so').html(data.veolia_so);
			form.find('.data-bsc-wo').html(data.bsc_wo);
			form.find('.data-bsc-po').html(data.bsc_po);
		}
	}
	parent.find('div.body-form').removeClass('hide').addClass('show')
	parent.find('div.body-search').removeClass('show').addClass('hide')
}

var db = {};

function load_employee() {
	return $.ajax(
		{
			dataType: "json",
			url: "https://afiqrostam.github.io/time-v/json/employee.json",
			success: function (e) {
				e.sort(function (a, b) {
					if (a.employee_description < b.employee_description) { return -1 }
					if (a.employee_description > b.employee_description) { return 1 }
					return 0
				})

				db.employee = $.grep(e, function (f) { return RegExp('-VEO-', 'gi').test(f.employee) }, true);
				db.team = $.grep(e, function (f) { return RegExp('-VEO-', 'gi').test(f.employee) }, false);

				var nav = $('.tab-pane[data-id="work"]').find('li.content-nav');
				db.team.forEach(function (f) {
					f.employee_description = f.employee_description.replace(' Team', '');
					var clone = nav.clone(true);
					clone.removeClass('active').data('id', f.employee);
					clone.find('span').html(f.employee_description);
					nav.parent().append(clone)
				});
			},
			error: function (error) { console.log(error) }
		}
	)
}

function load_task() {
	return $.ajax(
		{
			dataType: "json",
			url: "https://afiqrostam.github.io/time-v/json/task.json",
			success: function (e) {
				db.task = e;
			},
			error: function (error) { console.log(error) }
		}
	)
}

function load_work() {
	return $.ajax(
		{
			dataType: "json",
			url: "https://afiqrostam.github.io/time-v/json/work.json",
			success: function (e) {
				db.work = e;
				db.work.forEach(function (f) {
					f.start_date = date_reformat(f.start_date);
					f.task_no = db.task.filter(function (g) { return g.el_code == f.el_code })[0].el_task;
					f.task_desc = db.task.filter(function (g) { return g.el_code == f.el_code })[0].el_desc;
					f.team = db.team.filter(function (g) { return g.employee == f.assign })[0].employee_description;
				});
				db.work.sort(function (a, b) { return b.start_date - a.start_date });
			},
			error: function (error) { console.log(error) }
		}
	)
}


function date_reformat(e) {
	var input = e.split('/');
	return response = new Date('20' + input[2], parseInt(input[1], 10) - 1, input[0])
}


load_employee().then(load_task).then(load_work).then(init);
