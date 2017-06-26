includeHTML = function(cb) {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          elmnt.innerHTML = this.responseText;
          elmnt.removeAttribute("include-html");
          includeHTML(cb);
					window.scrollTo(0, 0);
        }
      }      
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
  if (cb) cb();
};

updateRefs = function() {
	var z, i, elmnt, url, w, c;
	z = document.getElementsByTagName("cite");
	for (i = 0; i < z.length; i++) {
		z[i].innerHTML = "<div class=\"cite-ref\">[" + (i+1) + "]</div><div class=\"cite-txt\">" + z[i].innerHTML + "</div>";
		z[i].setAttribute("ref-num", i+1);
	}

  z = document.getElementsByTagName("a");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    url = elmnt.getAttribute("href");
		if (url && url.charAt(0) == '#') {
			url = "cite" + url;
			w = document.querySelectorAll(url);
			if (w.length > 0) {
				elmnt.innerHTML += " [" + w[0].getAttribute('ref-num') + "]";
			}
		}
  }
};

window.onload = function() {
	includeHTML(updateRefs);
}
