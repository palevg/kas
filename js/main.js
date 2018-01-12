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

function updateSkills() {
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

function confirmCancel(nextBlock) {
	// перевірка, чи користувач знаходиться на сторінці вводу даних про нового програміста
	if ($("#newProgrammer").is(':hidden') && $("#newSkill").is(':hidden')) {
		displayBlocks(nextBlock);
		return true;
	} else {
		// і якщо так, то запит на підтвердження переходу із незбереженням даних
		if (confirm("Ви впевнені? Усі внесені дані не буде збережено.")) {
			displayBlocks(nextBlock);
			return true;
		} else {
			return false;
		}
	}
}

function initialize() {
	// ініціалізація Google-карти за координатами, виставлення маркера
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
	// центрування маркера при зміні розмірів карти
	$(window).resize(function() {
		map.panTo(new google.maps.LatLng(50.428663, 30.476223));
	});
}
google.maps.event.addDomListener(window, 'load', initialize);

$(document).ready(function() {
	// головне меню
	var menu = $('.menu');

	menu.on('click', function() {
		if ($(window).width() <= 760 && !menu.is(':hidden')) {
			menu.hide();
		}
	});

	$('#touch-menu').on('click', function(e) {
		//e.preventDefault();
		menu.slideToggle();
	});
	
	$(window).resize(function() {
		var w = $(window).width();
		if (w > 760 && menu.is(':hidden')) {
			menu.removeAttr('style');
		}
	});
	// END головне меню

	/* завантаження сторінки */
	displayBlocks("#startPage");

	/* анімація для слайдера */
	var sliderPaused = false;
	var sliderInputs = $('.slider input');

	setInterval(function(){
		if (!sliderPaused) {
			sliderNext = sliderInputs.filter(":checked").next('input');
			if (sliderNext.length) {
				sliderNext.prop('checked', true)
			} else {
				sliderInputs.first().prop('checked', true);
			}
		}
	}, 5000);

	var slider = document.getElementsByClassName('slider');
	if (slider[0].addEventListener) {
		slider[0].addEventListener("mouseenter", function() {
			sliderPaused = true;
		}, false);
		slider[0].addEventListener("mouseleave", function() {
			sliderPaused = false;
		}, false);
	}

	/* зчитуємо дані з JSON */
	getData();

	updateSkills();

	var joinReg = document.getElementsByClassName('joinReg');
	if (joinReg[0].addEventListener) {
		joinReg[0].addEventListener("click", function() {
			alert('Згодом тут буде реєстрація користувачів.');
		}, false);
	}

	// EventListener натискання пунктів головного меню
	var mainMenu = document.getElementsByClassName('menu');
	if (mainMenu[0].addEventListener) {
		mainMenu[0].addEventListener("click", function(e) {
			var place = e.target.parentNode.getAttribute('id');
			if (place == 'mi-main') {
				// показуємо головну сторінку сайту
				confirmCancel("#startPage");
			}
			if (place == 'mi-addProgr') {
				// завдання "додавання нового програміста"
				if (confirmCancel("#newProgrammer")) {
					// обнуляємо поля після попереднього вводу
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
					// показуємо сторінку введення даних про нового програміста
					$("#skills h3")['0'].innerText = "Виберіть області знань та вкажіть Ваш рівень у них";
					if ($("#skills").is(':hidden')) {
						$("#skills").show();
					}
					// показуємо/ховаємо потрібні кнопки
					if ($("#button_save").is(':hidden')) {
						$("#button_save").show();
					}
					if ($("#button_cancel").is(':hidden')) {
						$("#button_cancel").show();
					}
					if (!$("#button_search").is(':hidden')) {
						$("#button_search").hide();
					}
					if (!$("#button_del").is(':hidden')) {
						$("#button_del").hide();
					}
				}
			}
			if (place == 'mi-search') {
				// завдання "пошук програмістів"
				if (confirmCancel("#skills")) {
					// обнуляємо поля після попереднього вводу
					$(".it_type").each(function(index, element) {
						$(element).prop("checked", false);
						checkIT($(element).attr('id'));
					});
					// показуємо сторінку введення даних про нового програміста
					$("#skills h3")['0'].innerText = "Виберіть області знань та вкажіть потрібний їх рівень";
					// показуємо/ховаємо потрібні кнопки
					if ($("#button_search").is(':hidden')) {
						$("#button_search").show();
					}
					if (!$("#button_save").is(':hidden')) {
						$("#button_save").hide();
					}
					if (!$("#button_cancel").is(':hidden')) {
						$("#button_cancel").hide();
					}
					if (!$("#button_del").is(':hidden')) {
						$("#button_del").hide();
					}
				}
			}
			if (place == 'mi-addSkill') {
				// завдання "додавання нової області знань"
				if (confirmCancel("#newSkill")) {
					// обнуляємо поля після попереднього вводу
					$("#knowledgeName").next().css('color', 'rgba(255, 0, 0, 0)');
					$("#knowledgeName").val('');
					$("#knowledgeID").next().css('color', 'rgba(255, 0, 0, 0)');
					$("#knowledgeID").val('');
					$(".it_type").each(function(index, element) {
						$(element).prop("checked", false);
						checkIT($(element).attr('id'));
					});
					// показуємо сторінку введення даних про нову область знань
					$("#skills h3")['0'].innerText = "Наявні області знань:";
					if ($("#skills").is(':hidden')) {
						$("#skills").show();
					}
					// показуємо/ховаємо потрібні кнопки
					if ($("#button_save").is(':hidden')) {
						$("#button_save").show();
					}
					if ($("#button_cancel").is(':hidden')) {
						$("#button_cancel").show();
					}
					if (!$("#button_search").is(':hidden')) {
						$("#button_search").hide();
					}
					if (!$("#button_del").is(':hidden')) {
						$("#button_del").hide();
					}
				}
			}
			if (place == 'mi-delSkill') {
				// завдання "видалення вибраних областей знань"
				if (confirmCancel("#skills")) {
					// обнуляємо поля після попереднього вводу
					$(".it_type").each(function(index, element) {
						$(element).prop("checked", false);
						checkIT($(element).attr('id'));
					});
					// показуємо сторінку введення даних про нового програміста
					$("#skills h3")['0'].innerText = "Виберіть ті області знань, які необхідно видалити";
					// показуємо/ховаємо потрібні кнопки
					if ($("#button_del").is(':hidden')) {
						$("#button_del").show();
					}
					if ($("#button_cancel").is(':hidden')) {
						$("#button_cancel").show();
					}
					if (!$("#button_search").is(':hidden')) {
						$("#button_search").hide();
					}
					if (!$("#button_save").is(':hidden')) {
						$("#button_save").hide();
					}
				}
			}
			if (place == 'mi-about') {
				confirmCancel("#aboutThis");
			}
			if (place == 'mi-contacts') {
				if (confirmCancel("#contacts")) {
					/* Оскільки при завантаженні сторінки блок із картою схований, Google Maps API не мав розмірів блока з картою,
					а тому і не відобразив карту правильно. Зараз "заставляємо" API перемалювати карту. */
					google.maps.event.trigger(map, 'resize');
				}
			}
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

	var knowledgeID = document.getElementById('knowledgeID');
	if (knowledgeID.addEventListener) {	/* перевірка поля ID на валідність */
		// при вводі даних, для наглядності
		knowledgeID.addEventListener("keypress", function() {
			validField('#knowledgeID', /^[\w-\.]+$/i);
		}, false);
		// при покиданні поля, результуюче
		knowledgeID.addEventListener("blur", function() {
			validField('#knowledgeID', /^[\w-\.]+$/i);
		}, false);
	}

	var knowledgeName = document.getElementById('knowledgeName');
	if (knowledgeName.addEventListener) {	/* перевірка поля NAME на валідність */
		// при вводі даних, для наглядності
		knowledgeName.addEventListener("keypress", function() {
			validField('#knowledgeName', /^[А-ЯЁІЇа-яёії\w-\.]+$/i);
		}, false);
		// при покиданні поля, результуюче
		knowledgeName.addEventListener("blur", function() {
			validField('#knowledgeName', /^[А-ЯЁІЇа-яёії\w-\.]+$/i);
		}, false);
	}

	// EventListener натискання кнопок "Зберегти", "Відмінити", "Шукати", "Видалити"
	var buttonClick = document.getElementById('skills');
	if (buttonClick.addEventListener) {
		buttonClick.addEventListener("click", function(e) {
			var place = e.target.getAttribute('id');
			if (place == 'button_search') {
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
							if (!programmers[i].skill[skillName] || parseInt(programmers[i].skill[skillName]) < parseInt($("#" + nameId + "_range").val())) {
								flag = false;
							}
						});
						if (flag) {
							selected.push(programmers[i]);
						}
					}
					if (selected.length) {
						// видалення рядків таблиці з попереднього пошуку
						$('#selected').find('tr').remove();
						// вставка нової таблиці
						$('#selected').append("<thead><th>Ім'я</th><th>Дата народ&shy;ження</th><th>e-mail</th><th>Навички</th></thead>");
						for (var i = 0; i < selected.length; i++) {
							var tempSkill = "";
							for (var key in selected[i].skill) {
								if (tempSkill) {
									tempSkill += ", ";
								}
								tempSkill += key + " (" + selected[i].skill[key] + "/10)";
							}
							$('#selected').append('<tr><td>' + selected[i].name + '</td><td>' + selected[i].birth +
								'</td><td><a href="mailto:' + selected[i].email + '">' + selected[i].email +
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
			}
			if (place == 'button_cancel') {
				confirmCancel("#startPage");
			}
			if (place == 'button_save') {
				var valid = true; // флажок валідності заповнених полів
				if (!$("#newProgrammer").is(':hidden')) {
					// зберігання інформації про нового програміста
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
							displayBlocks("#startPage");
							alert('Дані про нового програміста успішно внесено до системи!\nНа даний час у базі даних є інформація щодо ' + programmers.length + ' програмістів.');
						} else {
							alert('Не вибрано жодної навички для нового програміста!');
						}
					} else {
						alert('Перевірте правильність введення особистих даних!');
					}
				} else {
					// зберігання інформації про нову область знань
					$('.newSkill i').each(function(index) {
		  			if ($(this).css('color') != 'rgb(0, 255, 127)') {
		  				valid = false;	// якщо хоча б одна "галочка" не зелена - валідність не пройдена
		  				return valid;
		  			}
		  			return valid;
					});
					if (valid) {
						var knowledgeID = $("#knowledgeID").val();
						var nameId = $("#it_" + knowledgeID);
						if (nameId[0]) {
							alert('Область знань з таким ідентифікатором вже існує.\nДля збереження необхідно змінити ідентифікатор.');
						} else {
							nameId = $('.one_skill label');
							var flag = true;
							var knowledgeName = $("#knowledgeName").val();
							for (var key in nameId) {
								if (nameId[key].textContent == knowledgeName) {
									flag = false;
									alert('Область знань з такою назвою вже існує.\nДля збереження необхідно змінити назву.');
									break;
								}
							}
							if (flag) {
								nameId = $('.skill_group');
								for (var i = 0; i < nameId.length; i++) {
									var tagLegend = nameId[i].getElementsByTagName('legend');
									if (tagLegend[0].innerText == $('.skillGroups :selected').text()) {
										$(nameId[i]).append('<div class="one_skill"><label for="it_' + knowledgeID + '"><input type="checkbox" id="it_' + knowledgeID + '" class="it_type">' + knowledgeName + '</label><input type="range" class="skill_range" id="it_' + knowledgeID + '_range"></div>');
										updateSkills();
										displayBlocks("#startPage");
										alert('Дані про нову область знань успішно внесено до системи!');
										break;
									}
								}
							}
						}
					} else {
						alert('Перевірте правильність введення даних про нову область знань!');
					}
				}
			}
			if (place == 'button_del') {
				// видалення областей знань
				var nameId = $(".it_type:checked");
				if (nameId[0]) {
					if (confirm("Усі відмічені області знань буде видалено із системи.\nВи впевнені?")) {
						$(".it_type:checked").each(function(index, element) {
							$(element).parent().parent().remove();
						});
					}
				} else {
					alert('Не вибрано жодної області знань для видалення!');
				}
			}
		}, false);
	}
});