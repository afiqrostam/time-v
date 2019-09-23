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
		// side bar clicks
		if ($(e).is('li.content-nav')) { var team = $(e).data('id') }
		else { var team = parent.find('li.content-nav.active').data('id') }
		// pagination clicks
		if ($(e).is('li.content-page')) { var page = parseInt($(e).find('a').html(), 10) }
		else { var page = 1 }
		// search params
		var search = parent.find('input.body-search-input').val();
		// filtering results
		if (team != undefined) { data = data.filter(function (f) { return f.assign == team }) }
		if (search != undefined) {
			data = data.filter(
				function (f) {
					var data_search = f.task_no + ' ' + f.wo_desc + ' ' + f.vams_wo + ' ' + f.veolia_so + ' ' + f.bsc_wo + ' ' + f.bsc_po + ' ' + f.start_date.toJSON().substr(0, 10);
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
		var page_nav = parent.find('li.content-page').parent();
		var page_temp = page_nav.children().first().clone(true);
		page_nav.empty();
		page_nav.addClass('hide');

		// build pagination
		var pages = Math.floor(data.length / 15);
		if (Math.floor(data.length % 15) != 0) { pages = pages + 1 }
		for (i = 1; i <= pages; i++) {
			var paginate_clone = page_temp.clone(true);
			paginate_clone.removeClass('active');
			paginate_clone.find('a').html(i);
			if (i == page) { paginate_clone.addClass('active') }
			page_nav.append(paginate_clone)
		}

		if (page_nav.children().length == 0) { page_nav.append(page_temp) }

		// releasing respose
		if (data.length == 0) {
			// return null result
			parent.find('div.no-result').removeClass('hide');
			parent.find('div.body-result').addClass('hide')
		}
		else {
			page_nav.removeClass('hide');
			parent.find('div.no-result').addClass('hide');
			parent.find('div.body-result').removeClass('hide');
			// trunc response to 15 intervals
			data = data.filter(function (f, i, a) { return i >= (page - 1) * 15 && i < page * 15 });

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
	else if (parent.data('id') == 'daily') {
		var data = $.grep(eval('db.' + parent.data('id')), function (f) { return f });
		// getting filter criterion
		// side bar clicks
		if ($(e).is('li.content-nav')) { var company = $(e).find('a').html() }
		else { var company = parent.find('li.content-nav.active > a').html() }
		// pagination clicks
		if ($(e).is('li.content-page')) { var page = parseInt($(e).find('a').html(), 10) }
		else { var page = 1 }
		// search params
		var search = parent.find('input.body-search-input').val();
		
		
		console.log(data)
		// filtering results
		if (company != undefined) { data = data.filter(function (f) { return f.assign == team }) }
		if (search != undefined) {
			data = data.filter(
				function (f) {
					var data_search = f.task_no + ' ' + f.wo_desc + ' ' + f.vams_wo + ' ' + f.veolia_so + ' ' + f.bsc_wo + ' ' + f.bsc_po + ' ' + f.start_date.toJSON().substr(0, 10);
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
		var page_nav = parent.find('li.content-page').parent();
		var page_temp = page_nav.children().first().clone(true);
		page_nav.empty();
		page_nav.addClass('hide');

		// build pagination
		var pages = Math.floor(data.length / 15);
		if (Math.floor(data.length % 15) != 0) { pages = pages + 1 }
		for (i = 1; i <= pages; i++) {
			var paginate_clone = page_temp.clone(true);
			paginate_clone.removeClass('active');
			paginate_clone.find('a').html(i);
			if (i == page) { paginate_clone.addClass('active') }
			page_nav.append(paginate_clone)
		}

		if (page_nav.children().length == 0) { page_nav.append(page_temp) }

		// releasing respose
		if (data.length == 0) {
			// return null result
			parent.find('div.no-result').removeClass('hide');
			parent.find('div.body-result').addClass('hide')
		}
		else {
			page_nav.removeClass('hide');
			parent.find('div.no-result').addClass('hide');
			parent.find('div.body-result').removeClass('hide');
			// trunc response to 15 intervals
			data = data.filter(function (f, i, a) { return i >= (page - 1) * 15 && i < page * 15 });

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
		form.find('[class*=data]').each(function () { $(this).addClass('hide').html($('<span class="text-danger">').html('/no data/')) });
		form.find('[class*=input]').each(
			function () {
				if ($(this).is('select') && $(this).hasClass("select2-hidden-accessible")) { $(this).select2('destroy') }
				$(this).addClass('hide').val('')
			});

		if ($(e).data('id') != undefined) {
			var data = $.grep(db.work, function (f) { return f.vams_wo === $(e).data('id') })[0];
			form.find('[class*=data]').each(function () { $(this).removeClass('hide') });
			Object.getOwnPropertyNames(data).forEach(function (f) {
				if (data[f] != '') {
					var search = f.replace('_', '-');
					if (search.indexOf('date') == -1) { form.find('[class*=data-' + search + ']').each(function () { $(this).html(data[f]) }) }
					else { form.find('.data-start-date').html(data.start_date.toJSON().substr(0, 10)) }
				}
			})
		}
		else {
			form.find('[class*=input]').each(function () {
				if ($(this).is('select')) { $(this).select2({ data: db.task.filter(function (e) { return e.status == 'Validated' }).map(function (e) { return { id: e.el_code, text: e.el_desc } }) }) }
				$(this).removeClass('hide')
			});
		}
	}
	parent.find('div.body-form').removeClass('hide').addClass('show')
	parent.find('div.body-search').removeClass('show').addClass('hide')
}

function get_unique(a) {
	var b = [];
	a.forEach(function (c, d, e) {
		if (d == 0) { b.push(c) }
		if (b.filter(function (f) {
			return RegExp(JSON.stringify(f), 'gi').test(JSON.stringify(c))
		}).length == 0) { b.push(c) }
	});
	return b
}

var db = {
	hour: [],
	daily: []
};

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
				});

				db.company = get_unique(e.map(function (f) { return f.company }));
				db.employee = $.grep(e, function (f) { return RegExp('-VEO-', 'gi').test(f.employee) }, true);
				db.team = $.grep(e, function (f) { return RegExp('-VEO-', 'gi').test(f.employee) }, false);
				// set teams selections
				var work_nav = $('.tab-pane[data-id="work"]').find('li.content-nav');
				db.team.forEach(function (f) {
					f.employee_description = f.employee_description.replace(' Team', '');
					var clone = work_nav.clone(true);
					clone.removeClass('active').data('id', f.employee);
					clone.find('a').html(f.employee_description);
					work_nav.parent().append(clone)
				});
				//set company selection
				var daily_nav = $('.tab-pane[data-id="daily"]').find('li.content-nav');
				db.company.forEach(function (f) {
					var clone = daily_nav.clone(true);
					daily_nav.removeClass('active');
					clone.find('a').html(f);
					daily_nav.parent().append(clone)
				});
			},
			error: function (error) { console.log(error) }
		}
	)
}

function load_task() {
	return $.ajax({
		dataType: "json",
		url: "https://afiqrostam.github.io/time-v/json/task.json",
		success: function (e) { db.task = e },
		error: function (error) { console.log(error) }
	})
}

function load_work() {
	return $.ajax({
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
