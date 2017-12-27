var knowledges = [], // масив напрямків знань
	programmers = []; // масив користувачів (програмістів)

function getData() {
	// читання даних з JSON-файлу і їх запис у масив
	$.getJSON('http://cevarto.com.ua/data.json', function(data) {
		knowledges = data.langs;
		programmers = data.programmers;
	});
}

function checkIT(name) {
	// встановлюємо видимість полів типу RANGE при зміні чекбоксів
	$("#" + name + ":checked").val() ? $("#" + name + "_range").show() : $("#" + name + "_range").hide();
}

function displayBlocks(block) {
	// формування масиву, елементами якого будуть ID всіх article у блоці mainWrap
	var blocks = [];
	$(".mainWrap article").each(function(index, element) {
		blocks.push('#' + $(element).attr("id"));
	});
	// відображення потрібного нам блоку і ховання інших
	for (var i = 0; i < blocks.length; i++) {
		if (blocks[i] != block) {
			if (!$(blocks[i]).is(':hidden'))
				$(blocks[i]).hide();
		} else {
				if ($(blocks[i]).is(':hidden'))
					$(blocks[i]).show();
		}
	}
}

function validField(fieldName, fieldRe) {
	/* перевірка полів введення даних на валідність */
	if (fieldRe.test($(fieldName).val())) {
		$(fieldName).next().css('color', 'rgba(0, 255, 127, 1)'); // "галочка" зеленого кольору
	} else {
		$(fieldName).next().css('color', 'rgba(255, 0, 0, 1)'); // "галочка" червоного кольору
	}
}

$(document).ready(function() {
	/* завантаження сторінки */
	displayBlocks("#startPage");
	/* зчитуємо дані з JSON */
	getData();

	/* встановлюємо атрибути для полів типу RANGE */
	$(".skills input[type=range]").each(function(index) {
		$(this).attr('min', '1');
		$(this).attr('max', '10');
		$(this).attr('value', '1');
		$(this).attr('title', 'вкажіть свій рівень (від 1 до 10)');
	});
	/* встановлюємо інтерактивну спливаючу підказку для полів типу RANGE */
	$(".skills input[type=range]").change(function() {
		$(".skills input[type=range]").each(function(index) {
			$(this).attr('title', $(this).val() + ' з 10-ти');
		});
	});
	/* встановлюємо видимість полів типу RANGE при зміні чекбоксів */
	$(".it_type").change(function(e) {
		checkIT(e.target.id);
	});

	var miMain = document.getElementById('mi-main');
	if (miMain.addEventListener) {
		miMain.addEventListener("click", function() {
			/* показуємо головну сторінку сайту */
			displayBlocks("#startPage");
		}, false);
	}

	var miAddProgr = document.getElementById('mi-task1');
	if (miAddProgr.addEventListener) {
		miAddProgr.addEventListener("click", function() {
			/* обнуляємо поля після попереднього вводу */
			$("#progName").next().css('color', 'rgba(255, 0, 0, 0)');
			$("#progName").val('');
			$("#progBirth").val('1991-09-01');
			$("#progEmail").next().css('color', 'rgba(255, 0, 0, 0)');
			$("#progEmail").val('');
			$("#progExperience").val('0');
			$(".it_type").each(function(index, element) {
				$(element).prop("checked", false);
				checkIT($(element).attr('id'));
			});
			/* показуємо сторінку введення даних про нового програміста */
			displayBlocks("#newProgrammer");
			$("#skills h3")['0'].innerText = "Виберіть області знань та вкажіть Ваш рівень у них";
			if ($("#skills").is(':hidden')) {
				$("#skills").show();
			}
			/* показуємо/ховаємо потрібні кнопки */
			if ($("#button_save").is(':hidden')) {
				$("#button_save").show();
			}
			if ($("#button_cancel").is(':hidden')) {
				$("#button_cancel").show();
			}
			if (!$("#button_search").is(':hidden')) {
				$("#button_search").hide();
			}
		}, false);
	}

	var miSearchProgr = document.getElementById('mi-task3');
	if (miSearchProgr.addEventListener) {
		miSearchProgr.addEventListener("click", function() {
			/* обнуляємо поля після попереднього вводу */
			$(".it_type").each(function(index, element) {
				$(element).prop("checked", false);
				checkIT($(element).attr('id'));
			});
			/* показуємо сторінку введення даних про нового програміста */
			$("#skills h3")['0'].innerText = "Виберіть області знань та вкажіть мінімальний рівень для пошуку";
			displayBlocks("#skills");
			$("#button_search").hide();
			/* показуємо/ховаємо потрібні кнопки */
			if ($("#button_search").is(':hidden')) {
				$("#button_search").show();
			}
			if (!$("#button_save").is(':hidden')) {
				$("#button_save").hide();
			}
			if (!$("#button_cancel").is(':hidden')) {
				$("#button_cancel").hide();
			}
		}, false);
	}

	var miAbout = document.getElementById('mi-about');
	if (miAbout.addEventListener) {
		miAbout.addEventListener("click", function() {
			displayBlocks("#aboutThis");
		}, false);
	}

	var miContacts = document.getElementById('mi-contacts');
	if (miContacts.addEventListener) {
		miContacts.addEventListener("click", function() {
			displayBlocks("#contacts");
		}, false);
	}

	var progName = document.getElementById('progName');
	if (progName.addEventListener) {	/* перевірка поля ПІБ на валідність */
		// при вводі даних, для наглядності
		progName.addEventListener("keypress", function() {
			validField('#progName', /^[A-ZА-ЯЁІЇ][a-zа-яёії]+\s[A-ZА-ЯЁІЇ][a-zа-яёії]+$/);
		}, false);
		// при покиданні поля, результуюче
		progName.addEventListener("blur", function() {
			validField('#progName', /^[A-ZА-ЯЁІЇ][a-zа-яёії]+\s[A-ZА-ЯЁІЇ][a-zа-яёії]+$/);
		}, false);
	}

	var progEmail = document.getElementById('progEmail');
	if (progEmail.addEventListener) {	/* перевірка поля Email на валідність */
		// при вводі даних, для наглядності
		progEmail.addEventListener("keypress", function() {
			validField('#progEmail', /^[\w]{1}[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i);
		}, false);
		// при покиданні поля, результуюче
		progEmail.addEventListener("blur", function() {
			validField('#progEmail', /^[\w]{1}[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i);
		}, false);
	}

	var buttonSearch = document.getElementById('button_search');
	if (buttonSearch.addEventListener) {
		buttonSearch.addEventListener("click", function() {
			$('#users').find('tr').remove();
			$('#users').append("<tr><th>Ім'я</th><th>Дата народження</th><th>e-mail</th><th>Навички</th></tr>");
			for (var i = 0; i < programmers.length; i++) {
				var tempSkill = "";
				for (var key in programmers[i].skill) {
					if (tempSkill) {
						tempSkill += ", ";
					}
					tempSkill += key + " (" + programmers[i].skill[key] + "/10)";
				}
				$('#users').append('<tr><td>' + programmers[i].name + '</td><td>' + programmers[i].age + '</td><td><a href="mailto:' + programmers[i].email + '">' + programmers[i].email + '</a></td><td>' + tempSkill + '</td></tr>');
				if ($("#searchResult").is(':hidden'))
					$("#searchResult").slideToggle();
			}
		}, false);
	}

	var buttonSave = document.getElementById('button_save');
	if (buttonSave.addEventListener) {
		buttonSave.addEventListener("click", function() {
			var valid = true;
			$('.dataProgrammer i').each(function(index) {
  			if ($(this).css('color') != 'rgb(0, 255, 127)') {
  				valid = false;
  				return valid;
  			}
  			return valid;
			});
			if (valid) {
				var nameId = $(".it_type:checked");
				if (nameId[0]) {
					var tempSkill = {};
					$(".it_type:checked").each(function(index, element) {
						nameId = $(element).attr('id');
						var propertyName = $('label[for^="' + nameId + '"]').text();
						tempSkill[propertyName] = $("#" + nameId + "_range").val();
						//$(element).removeAttr("checked");
						$(element).prop("checked", false);
					});
					var newRecord = {};
					newRecord.name = $("#progName").val();
					newRecord.age = $("#progBirth").val();
					newRecord.email = $("#progEmail").val();
					newRecord.experience = $("#progExperience").val();
					newRecord.skill = tempSkill;
					programmers.push(newRecord);
					$(".it_type").each(function(index, element) {
						checkIT($(element).attr('id'));
					});
					$("#newProgrammer").hide();
					$("#skills").hide();
					alert('Дані про нового програміста успішно внесено до системи!\nНа даний час у базі даних є інформація щодо ' + programmers.length + ' програмістів.');
				} else {
					alert('Навичок не вибрано!');
				}
			} else {
				alert('Перевірте правильність введення особистих даних!');
			}
		}, false);
	}
});