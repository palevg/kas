var map,						// карта Google
	sorting = 0,			// мітка сортування масиву
	//knowledges = [],	// масив напрямків знань
	users = [],				// масив зареєстрованих користувачів
	currentUser = "",	// користувач, що залогінився
	userLevel = "",		// рівень доступу користувача, що залогінився
	programmers = [],	// масив користувачів (програмістів)
	selected = [];		// масив результатів пошуку

function getData() {
	// читання даних з JSON-файлу і їх запис у масиви
	$.getJSON('http://cevarto.com.ua/data.json', function(data) {
		//knowledges = data.knowledges;
		users = data.users;
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
		$(this).attr('title', '1 з 10-ти');
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

function confirmCancel(nextBlock) {
	// перевірка, чи користувач знаходиться на сторінці вводу нових даних
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

function loginStatus(active) {
	if (active) {
		$('#mi-signIn').hide();
		$('#mi-registration').hide();
		$('#mi-userInfo').show();
		$('#mi-signOut').show();
	} else {
		$('#mi-signIn').show();
		$('#mi-registration').show();
		$('#mi-userInfo').hide();
		$('#mi-signOut').hide();
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

	loginStatus(false);
	// END головне меню

	/* перше завантаження сторінки */
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

	/* ------------ще в роботі----------- */
	var joinReg = document.getElementsByClassName('joinReg');
	if (joinReg[0].addEventListener) {
		joinReg[0].addEventListener("click", function() {
			alert('Згодом тут буде реєстрація користувачів.');
		}, false);
	}

	// EventListener натискання пунктів головного меню
	var mainMenu = document.getElementsByTagName('nav');
	if (mainMenu[0].addEventListener) {
		mainMenu[0].addEventListener("click", function(e) {
			var place;
			if (e.target.tagName == 'SPAN') {
				place = e.target.parentNode.getAttribute('id');
			}
			if (e.target.tagName == 'I') {
				place = e.target.parentNode.parentNode.getAttribute('id');
			}
			if (place == 'mi-main') {
				// показуємо головну сторінку сайту
				confirmCancel("#startPage");
			}
			if (place == 'mi-addProgr') {
				// завдання "додавання нового програміста"
				if (confirmCancel("#newProgrammer")) {
					// обнуляємо поля після попереднього вводу
					$("#progName").val('');
					$("#progBirth").val('');
					//$("#progBirth").val('1991-09-01');
					$("#progEmail").val('');
					$("#progExperience").val('0');
					$(".it_type").each(function(index, element) {
						$(element).prop("disabled", false);
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
						$(element).prop("disabled", false);
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
					$("#knowledgeName").val('');
					$("#knowledgeID").val('');
					$(".it_type").each(function(index, element) {
						$(element).prop("disabled", true);
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
						$(element).prop("disabled", false);
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
			if (place == 'mi-signIn') {
				$(".mainHeader").css('display', 'none');
				$("#userSignin").css('display', 'block');
			}
			if (place == 'mi-signOut') {
				if (confirm('Ви дійсно бажаєте вийти із системи?')) {
					currentUser = "";
					userLevel = "";
					$(".user-block span")[0].innerText = "Гість";
					loginStatus(false);
					displayBlocks("#startPage");
				}
			}
		}, false);
	}

	// формування списку навичок програміста
	function setSkills(pos) {
		var list = "";
		for (var key in selected[pos].skill) {
			if (list) {
				list += ", ";
			}
			list += key + " (" + selected[pos].skill[key] + "/10)";
		}
		return list;
	}

	// вставка таблиці в DOM
	function insertTable() {
		// видалення рядків таблиці з попереднього пошуку
		$('#selected').find('tbody').remove();
		// вставка нової таблиці
		$('#selected').append('<tbody>');
		for (var i = 0; i < selected.length; i++) {
			$('#selected').append('<tr><td>' + i + '</td><td>' + selected[i].name + '</td><td>' + setSkills(i) + '</td></tr>');
			if ($("#searchResult").is(':hidden')) {
				$("#searchResult").slideToggle();
			}
		}
		$('#selected').append("</tbody>");
	}

	// EventListener натискання кнопки миші на таблиці результатів пошуку програмістів
	var tableProgr = document.getElementById('selected');
	if (tableProgr.addEventListener) {
		tableProgr.addEventListener("click", function(e) {
			if (e.target.tagName == "TD") {
				// модальне вікно з детальною інформацією про програміста
				var i = parseInt(e.target.parentNode.getElementsByTagName('td')[0].innerText);
				$('#detailProgr').find('tr').remove();
				$("#detailProgr table").append("<tr><td>Прізвище та ім'я:</td><td>" + selected[i].name +
					'</td></tr><tr><td>Дата народження:</td><td>' + selected[i].birth +
					'</td></tr><tr><td>e-mail:</td><td><a href="mailto:' + selected[i].email + '">' +
					selected[i].email + '</a></td></tr><tr><td>Досвід роботи (років):</td><td>' +
					selected[i].experience + '</td></tr><tr><td>Навички:</td><td>' + setSkills(i) + '</td></tr>');
				$(".mainHeader").css('display', 'none');
				$("#detailProgr").css('display', 'block');
			}
			if (e.target.innerText == "Прізвище та ім'я") {
				(sorting == 0 || sorting == -1) ? sorting = 1 : sorting = -1;
				selected.sort(function compareName(a, b) {
					if (a.name < b.name) return -1 * sorting;
					if (a.name > b.name) return 1 * sorting;
					return 0;
				});
				insertTable();
			}
		}, false);
	}

	// EventListener модального вікна
	var modalBlocks = document.getElementById('modalBlocks');
	if (modalBlocks.addEventListener) {
		modalBlocks.addEventListener("click", function(e) {
			if (e.target.tagName == "A") {
				$(e.target.parentNode.parentNode).css('display', 'none');
				$(".mainHeader").css('display', 'block');
			}
			if (e.target.getAttribute('id') == "btnSignin") {
				if ($("#userSignin .modal-dialog__field:not(:valid)").length == 0) {
					var ln = $("#userSignin .modal-dialog__field")[0].value;
					var match = false;
					for (var i = 0; i < users.length; i++) {
						if (users[i].login == ln) {
							match = true;
							ln = $("#userSignin .modal-dialog__field")[1].value;
							if (users[i].password == ln) {
								currentUser = users[i].name;
								userLevel = users[i].level;
								$(".user-block span")[0].innerText = currentUser;
								loginStatus(true);
								$(e.target.parentNode.parentNode).css('display', 'none');
								$(".mainHeader").css('display', 'block');
							} else {
								match = false;
								break;
							}
						}
					}
					if (!match) {
						alert('Користувача з такими login та паролем у системі немає.');
					}
				} else {
					alert('Поля login та пароль не можуть бути пустими!');
				}
			}
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
					selected = [];
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
						insertTable();
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
				if (!$("#newProgrammer").is(':hidden')) {
					// зберігання інформації про нового програміста
					if ($('.dataProgrammer input:valid').length == 4) {
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
					if ($('.newSkill input:valid').length == 2) {
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

	// EventListener натискання кнопок соцмереж
	var social = document.getElementsByClassName('mainFooter');
	if (social[0].addEventListener) {
		social[0].addEventListener("click", function(e) {
			e.preventDefault();
			var share = "";
			if (e.target.tagName == "A") {
				share = e.target.getAttribute('class');
			}
			if (e.target.tagName == "I") {
				share = e.target.parentNode.getAttribute('class');
			}
			if (share) {
				var shareWindow;
				if (share.indexOf("facebook") != -1) {
					shareWindow = window.open('https://www.facebook.com/sharer/sharer.php?url=' + document.URL);
				}
				if (share.indexOf("twitter") != -1) {
					shareWindow = window.open('https://twitter.com/share?url=' + document.URL);
				}
				if (share.indexOf("google") != -1) {
					shareWindow = window.open('https://plus.google.com/share?url=' + document.URL);
				}
				if (share.indexOf("vkontakte") != -1) {
					shareWindow = window.open('https://vk.com/share.php?url=' + document.URL);
				}
				if (share.indexOf("odnoklassniki") != -1) {
					shareWindow = window.open('http://www.ok.ru/dk?st.cmd=addShare&st.s=1&st._surl=' + document.URL);
				}
			}
		}, false);
	}
});