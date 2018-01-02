var map,						// карта Google
	//knowledges = [], // масив напрямків знань
	programmers = []; // масив користувачів (програмістів)

function getData() {
	// читання даних з JSON-файлу і їх запис у масиви
	$.getJSON('http://cevarto.com.ua/data.json', function(data) {
		//knowledges = data.knowledges;
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

function initialize() {
	var myLatLng = new google.maps.LatLng(50.428663, 30.476223);
	var myOptions = {
		zoom: 17,
		center: new google.maps.LatLng(50.430538, 30.469974),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	var marker = new google.maps.Marker({
		position: myLatLng,
		title: "Державний університет телекомунікацій",
		map: map
	});
	$(window).resize(function() {
		map.panTo(new google.maps.LatLng(50.428663, 30.476223));
	});
}
google.maps.event.addDomListener(window, 'load', initialize);

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
			$("#skills h3")['0'].innerText = "Виберіть області знань та вкажіть потрібний їх рівень";
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
			/* Оскільки при завантаженні сторінки блок із картою схований, Google Maps API не мав розмірів блока з картою,
			а тому і не відобразив карту правильно. Зараз "заставляємо" API перемалювати карту. */
			google.maps.event.trigger(map, 'resize');
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
			// вибірка всіх відмічених чекбоксів
			var nameId = $(".it_type:checked");
			if (nameId[0]) {
				var selected = []; // масив результатів пошуку
				var flag;
				for (var i = 0; i < programmers.length; i++) {
					flag = true;
					$(".it_type:checked").each(function(index, element) {
						nameId = $(element).attr('id');
						var skillName = $('label[for="' + nameId + '"]').text();
						if (!programmers[i].skill[skillName] || programmers[i].skill[skillName] < $("#" + nameId + "_range").val()) {
							flag = false;
						}
					});
					if (flag) {
						selected.push(programmers[i]);
					}
				}
				if (selected.length) {
					// видалення рядків таблиці з попереднього пошуку
					$('#users').find('tr').remove();
					// вставка нової таблиці
					$('#users').append("<tr><th>Ім'я</th><th>Дата народження</th><th>e-mail</th><th>Навички</th></tr>");
					for (var i = 0; i < selected.length; i++) {
						var tempSkill = "";
						for (var key in selected[i].skill) {
							if (tempSkill) {
								tempSkill += ", ";
							}
							tempSkill += key + " (" + selected[i].skill[key] + "/10)";
						}
						$('#users').append('<tr><td>' + selected[i].name + '</td><td>' + selected[i].birth +
							'</td><td><a href="mailto:' + programmers[i].email + '">' + programmers[i].email +
							'</a></td><td>' + tempSkill + '</td></tr>');
						if ($("#searchResult").is(':hidden')) {
							$("#searchResult").slideToggle();
						}
					}
				} else {
					if (!$("#searchResult").is(':hidden')) {
						$("#searchResult").hide();
					}
					alert('Не знайдено жодного програміста, що відповідав би вказаним критеріям!');
				}
			} else {
				alert('Не вибрано жодного критерію для пошуку кандидата!');
			}
		}, false);
	}

	var buttonCancel = document.getElementById('button_cancel');
	if (buttonCancel.addEventListener) {
		buttonCancel.addEventListener("click", function() {
			if (confirm("Ви впевнені? Усі внесені дані не буде збережено.")) {
				displayBlocks("#startPage");
			}
		}, false);
	}

	var buttonSave = document.getElementById('button_save');
	if (buttonSave.addEventListener) {
		buttonSave.addEventListener("click", function() {
			var valid = true; // флажок валідності заповнених полів про нового програміста
			$('.dataProgrammer i').each(function(index) {
  			if ($(this).css('color') != 'rgb(0, 255, 127)') {
  				valid = false;	// якщо хоча б одна "галочка" не зелена - валідність не пройдена
  				return valid;
  			}
  			return valid;
			});
			if (valid) {
				var nameId = $(".it_type:checked");	// вибірка всіх всіх відмічених чекбоксів
				if (nameId[0]) {
					var tempSkill = {};
					$(".it_type:checked").each(function(index, element) {
						nameId = $(element).attr('id');
						tempSkill[$('label[for="' + nameId + '"]').text()] = $("#" + nameId + "_range").val();
					});
					var newRecord = {};
					newRecord.name = $("#progName").val();
					newRecord.birth = $("#progBirth").val();
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