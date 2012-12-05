(function($){
	$.fn.tzCheckbox = function(summ_name){
		
		return this.each(function(){
			var checkbox = $(this);
	
			checkbox.unbind('change');
			/** update_graph is a bool of whether or not to update the graph */
			checkbox.change(function(update_graph){
				checkbox.toggleClass('checked');
				var isChecked = checkbox.hasClass('checked');
							
				if (sessionStorage.filters) {
				  var filters = $.parseJSON(sessionStorage.filters); // get the filters sessionStorage's current state
				} else {
				  var filters = []; // initialize the filters arr so that it can be made a sessionStorage var mm
				}
				if (isChecked) {
					// it has been deduced that checkbox.text() returns the SQL field. Hooray!
					filters.push(checkbox.attr('id'));
				} else {
					var idx = filters.indexOf(checkbox.attr('id'));
					filters.splice(idx, 1);
				}
				sessionStorage.filters = JSON.stringify(filters); // update the filters sessionStorage
				if (update_graph == null || update_graph == true) {
				    get_graph('', '', '', '');
				}
			});
		});
	};
})(jQuery);

