if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
        var ieversion=new Number(RegExp.$1) // capture x.x portion and store as a number

        $("#search_form").attr("disabled", true);
        $("#check_ie").html("Looks like you're using Internet Explorer. This site will not work properly (if at all) on Internet Explorer, sadly :(<br>" +
               "If I get more time/resources in the future I'll add support for Internet Explorer, but for now I " +
               "strongly suggest switching to " +
               "<strong><a href=\"http://support.google.com/chrome/bin/answer.py?hl=en&answer=95346\" target=\"_blank\" title=\"Google Chrome Download\">Google Chrome, here." +
               "</a></strong>");
}