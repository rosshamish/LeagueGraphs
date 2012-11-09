(function($){
	$.fn.tzCheckbox = function(summ_name){
		
		return this.each(function(){
			var checkBox = $(this);
	
			checkBox.unbind('change');
			checkBox.change(function(){
				
				checkBox.toggleClass('checked');
				
				var isChecked = checkBox.hasClass('checked');
				if (checkBox.attr('id') == 'championsKilled') {
					if (isChecked) {
						isChecked = false;
					} else {
						isChecked = true;
					}
				}
				var old_cookies = $.parseJSON($.cookie('filters'));
				if (isChecked) {
					// it has been deduced that checkBox.text() returns the SQL field. Hooray!
					old_cookies.push(checkBox.attr('id'));
				} else {
					var idx = old_cookies.indexOf(checkbox.attr('id'));
					old_cookies.splice(idx, 1);
				}
				get_graph(summ_name, 'gameId', old_cookies);
			});
		});
	};
})(jQuery);

