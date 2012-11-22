(function($){
	$.fn.tzCheckbox = function(summ_name){
		
		return this.each(function(){
			var checkbox = $(this);
	
			checkbox.unbind('change');
			checkbox.change(function(){
				checkbox.toggleClass('checked');
				var isChecked = checkbox.hasClass('checked');
							
				if ($.cookie('filters')) {
				  var filters = $.parseJSON($.cookie('filters')); // get the filters cookie's current state
				} else {
				  var filters = []; // initialize the filters arr so that it can be made a cookie mm
				}
				if (isChecked) {
					// it has been deduced that checkbox.text() returns the SQL field. Hooray!
					filters.push(checkbox.attr('id'));
				} else {
					var idx = filters.indexOf(checkbox.attr('id'));
					filters.splice(idx, 1);
				}
				$.cookie('filters', JSON.stringify(filters)); // update the filters cookie
				get_graph('', '', '', '');
			});
		});
	};
})(jQuery);

