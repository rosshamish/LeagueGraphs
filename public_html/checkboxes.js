(function($){
	$.fn.tzCheckbox = function(summ_name){
		
		return this.each(function(){
			var checkBox = $(this);

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
				if (isChecked) {
					// it has been deduced that checkBox.text() returns the SQL field. Hooray! 
					get_graph(summ_name, 'gameId', checkBox.attr('id'));
				}
			});
		});
	};
})(jQuery);

