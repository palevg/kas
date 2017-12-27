function checkIT() {
	$("#it_C:checked").val() ? $("#it_C_range").show() : $("#it_C_range").hide();
	$("#it_CPlus:checked").val() ? $("#it_CPlus_range").show() : $("#it_CPlus_range").hide();
	$("#it_CSh:checked").val() ? $("#it_CSh_range").show() : $("#it_CSh_range").hide();
	$("#it_JS:checked").val() ? $("#it_JS_range").show() : $("#it_JS_range").hide();
	$("#it_Java:checked").val() ? $("#it_Java_range").show() : $("#it_Java_range").hide();
	$("#it_Python:checked").val() ? $("#it_Python_range").show() : $("#it_Python_range").hide();
	$("#it_Ruby:checked").val() ? $("#it_Ruby_range").show() : $("#it_Ruby_range").hide();
	$("#it_Perl:checked").val() ? $("#it_Perl_range").show() : $("#it_Perl_range").hide();
	$("#it_PHP:checked").val() ? $("#it_PHP_range").show() : $("#it_PHP_range").hide();
	$("#it_ObjC:checked").val() ? $("#it_ObjC_range").show() : $("#it_ObjC_range").hide();
	$("#it_Scala:checked").val() ? $("#it_Scala_range").show() : $("#it_Scala_range").hide();
	$("#it_Swift:checked").val() ? $("#it_Swift_range").show() : $("#it_Swift_range").hide();
	$("#it_TS:checked").val() ? $("#it_TS_range").show() : $("#it_TS_range").hide();
}

var programmers = [];

function getData() {
	$.getJSON('http://cevarto.com.ua/data.json', function(data) {
		for (var i = 0; i < data.users.length; i++) {
			programmers[i] = data.users[i];
		}
	});
}

$(document).ready(function() {
	getData();
	checkIT();
	$(".it_type").change(function() {
		checkIT();
	});

	var button = document.getElementById('button');

	if (button.addEventListener) {
		button.addEventListener("click", function() {
			$('#users').find('tr').remove();
			$('#users').append("<tr><th>Ім'я</th><th>Вік</th><th>e-mail</th><th>Навички</th></tr>");
			for (var i = 0; i < programmers.length; i++) {
				var tempSkill = "";
				for (var key in programmers[i].skill) {
					if (tempSkill) {
						tempSkill += ", ";
					}
					tempSkill += key + " (" + programmers[i].skill[key] + "/10)";
				}
				$('#users').append('<tr><td>' + programmers[i].name + '</td><td>' + programmers[i].age + '</td><td><a href="mailto:' + programmers[i].email + '">' + programmers[i].email + '</a></td><td>' + tempSkill + '</td></tr>');
			}
		}, false);
	}

	var buttonErase = document.getElementById('button_erase');

	if (buttonErase.addEventListener) {
		buttonErase.addEventListener("click", function() {
			var nameId = $(".it_type:checked");
			if (nameId[0]) {
				var tempSkill = {};
				$(".it_type:checked").each(function(index, element) {
					nameId = $(element).attr('id');
					var propertyName = $('label[for^="' + nameId + '"]').text();
					tempSkill[propertyName] = $("#" + nameId + "_range").val();
					$(element).removeAttr("checked");
				});
				programmers.push({name: 111, age: 222, email: 333, skill: tempSkill});
				checkIT();
			} else {
				alert('Навичок не вибрано!');
			}
		}, false);
	}
});