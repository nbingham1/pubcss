// https://stackoverflow.com/questions/30008114/how-do-i-promisify-native-xhr
function request(opts) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(opts.method, opts.url, true);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve({
					obj: xhr.response,
					text: xhr.responseText,
					pass: opts.pass
				});
      } else {
        reject({
          status: this.status,
          text: xhr.statusText,
					pass: opts.pass
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        text: xhr.statusText,
				pass: opts.pass
      });
    };
    if (opts.headers) {
      Object.keys(opts.headers).forEach(function (key) {
        xhr.setRequestHeader(key, opts.headers[key]);
      });
    }
    var params = opts.params;
    // We'll need to stringify if we've been given an object
    // If we have a string, this is skipped.
    if (params && typeof params === 'object') {
      params = Object.keys(params).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      }).join('&');
    }
    xhr.send(params);
  });
}

includeHTML = function() {
	return new Promise(function(resolve, reject) {
		console.log("includeHTML");
		var promises = [];
		var includes = document.getElementsByTagName("div");
		for (var i = 0; i < includes.length; i++) {
			var file = includes[i].getAttribute("src");
			if (file) {
				promises.push(request({
					method: "GET",
					url: file,
					pass: includes[i]
				}).then(function (response) {
					return new Promise(function(resolve, reject) {
						response.pass.innerHTML = response.text;
						content = response.pass.childNodes;
						for (var j = 0; j < content.length; j++) {
							response.pass.parentNode.insertBefore(content[j], response.pass);
						}
						response.pass.parentNode.removeChild(response.pass);
						resolve();
					});
				}));
			}
		}

		if (promises.length > 0) {
			Promise.all(promises)
				.then(includeHTML)
				.then(resolve);
		} else {
			resolve();
		}
	});
//window.scrollTo(0, 0);
};

formatSection = function(section, id, type) {
	console.log("formatSection");
	console.log(section);
	console.log(id);
	console.log(type);
	elems = section.getElementsByTagName(type);
	for (var i = 0; i < elems.length; i++) {
		elems[i].setAttribute("ref-num", id + "." + (i+1));
		formatSection(elems[i], id + "." + (i+1), "sub" + type);
	}
}

formatAnchors = function() {
	return new Promise(function(resolve, reject) {
		console.log("formatAnchors");
		var elems = document.getElementsByTagName("cite");
		for (var i = 0; i < elems.length; i++) {
			elems[i].innerHTML = "<div class=\"cite-ref\">[" + (i+1) + "]</div><div class=\"cite-txt\">" + elems[i].innerHTML + "</div>";
			elems[i].setAttribute("ref-num", i+1);
		}

		elems = document.getElementsByClassName("equation");
		for (var i = 0; i < elems.length; i++) {	
			elems[i].setAttribute("ref-num", i+1);
		}

		elems = document.getElementsByTagName("figure");
		for (var i = 0; i < elems.length; i++) {
			elems[i].setAttribute("ref-num", i+1);
		}

		elems = document.getElementsByTagName("table");
		for (var i = 0; i < elems.length; i++) {
			elems[i].setAttribute("ref-num", i+1);
		}

		elems = document.getElementsByTagName("section");
		for (var i = 0; i < elems.length; i++) {
			elems[i].setAttribute("ref-num", i+1);
			formatSection(elems[i], (i+1), "subsection");
		}

		resolve();
	});
};

formatLinks = function() {
	return new Promise(function(resolve, reject) {
		console.log("formatLinks");
		var links = document.getElementsByTagName("a");
		for (i = 0; i < links.length; i++) {
			url = links[i].getAttribute("href");
			if (url && url.charAt(0) == '#') {
				var ref = document.querySelector(url);
				if (ref) {
					var tag = ref.tagName.toLowerCase();
					var cls = ref.className.toLowerCase();
					var id = ref.getAttribute('ref-num');
					if (tag == "cite") {
						links[i].innerHTML += "["+id+"]";
					}
					else if (cls == "equation") {
						links[i].innerHTML += "("+id+")";
					}
					else if (tag == "figure") {
						links[i].innerHTML += "Fig. "+id;
					}
					else if (tag == "table") {
						links[i].innerHTML += "Table "+id;
					}
					else {
						links[i].innerHTML += id;
					}
				}
			}
		}

		resolve();
	});
};

window.onload = function() {
	includeHTML().then(formatAnchors).then(formatLinks);
}
