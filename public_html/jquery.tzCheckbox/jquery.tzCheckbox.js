(function($){
	$.fn.tzCheckbox = function(options){
		
		// Default On / Off labels:
		
		options = $.extend({
			labels : ['ON','OFF']
		},options);
		
		return this.each(function(){
			var originalCheckBox = $(this),
				labels = [];

			// Checking for the data-on / data-off HTML5 data attributes:
			if(originalCheckBox.data('on')){
				labels[0] = originalCheckBox.data('on');
				labels[1] = originalCheckBox.data('off');
			} else {
				labels = [$(this).attr('id'), $(this).attr('id')];
			}

			// Creating the new checkbox markup:
			var checkBox = $('<span>',{
				"class"	: 'tzCheckBox '+(this.checked?'checked':''),
				html:	'<span class="tzCBContent">'+labels[this.checked?0:1]+
						'</span><span class="tzCBPart"></span>'
			});

			// Inserting the new checkbox, and hiding the original:
			checkBox.insertAfter(originalCheckBox);
			originalCheckBox.hide();

			checkBox.click(function(){
				
				checkBox.toggleClass('checked');
				
				var isChecked = checkBox.hasClass('checked');
				if (isChecked) {
					// it has been deduced that checkBox.text() returns the SQL field. Hooray! 
					$('#debug').append(checkBox.text() + '<br>');
					get_graph(options.labels[0], 'gameId', checkBox.text());
				}
				
				// Synchronizing the original checkbox:
				originalCheckBox.attr('checked',isChecked);
				checkBox.find('.tzCBContent').html(labels[isChecked?0:1]);
			});
			
			// Listening for changes on the original and affecting the new one:
			originalCheckBox.bind('change',function(){
				checkBox.click();
			});
		});
	};
})(jQuery);